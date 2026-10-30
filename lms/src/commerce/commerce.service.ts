import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity.js';
import { Voucher, VoucherDiscountType } from './entities/voucher.entity.js';
import { Wallet } from './entities/wallet.entity.js';
import { LedgerType, WalletLedger } from './entities/wallet-ledger.entity.js';
import { TopupRequest, TopupStatus } from './entities/topup-request.entity.js';
import { Order, OrderStatus } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { RefundRequest, RefundStatus } from './entities/refund-request.entity.js';
import { Course, CourseStatus } from '../course/course.entity.js';
import { Enrollment, EnrollmentStatus } from '../enrollment/enrollment.entity.js';
import { AddToCartDto } from './dto/cart.dto.js';
import { ConfirmTopupDto, CreateTopupDto } from './dto/topup.dto.js';
import { CheckoutDto } from './dto/checkout.dto.js';
import { CreateRefundDto, ReviewRefundDto } from './dto/refund.dto.js';
import type { JwtPayload } from '../auth/jwt.util.js';

@Injectable()
export class CommerceService {
  constructor(
    @Inject('CART_ITEM_REPOSITORY')
    private readonly cartRepo: Repository<CartItem>,
    @Inject('VOUCHER_REPOSITORY')
    private readonly voucherRepo: Repository<Voucher>,
    @Inject('WALLET_REPOSITORY')
    private readonly walletRepo: Repository<Wallet>,
    @Inject('WALLET_LEDGER_REPOSITORY')
    private readonly ledgerRepo: Repository<WalletLedger>,
    @Inject('TOPUP_REQUEST_REPOSITORY')
    private readonly topupRepo: Repository<TopupRequest>,
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepo: Repository<Order>,
    @Inject('ORDER_ITEM_REPOSITORY')
    private readonly orderItemRepo: Repository<OrderItem>,
    @Inject('REFUND_REQUEST_REPOSITORY')
    private readonly refundRepo: Repository<RefundRequest>,
    @Inject('COURSE_REPOSITORY')
    private readonly courseRepo: Repository<Course>,
    @Inject('ENROLLMENT_REPOSITORY')
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  // ================= US08: GIỎ HÀNG (CART) =================

  async getCart(userId: number) {
    const items = await this.cartRepo.find({
      where: { user_id: userId },
      relations: { course: true },
    });
    return items;
  }

  async addToCart(userId: number, dto: AddToCartDto) {
    const course = await this.courseRepo.findOne({
      where: { course_id: dto.course_id },
    });
    if (!course || course.status !== CourseStatus.PUBLISHED) {
      throw new NotFoundException('Khóa học không tồn tại hoặc chưa được mở bán');
    }

    // Kiểm tra học viên đã sở hữu khóa học chưa
    const enrolled = await this.enrollmentRepo.findOne({
      where: { student_id: userId, course_id: dto.course_id, status: EnrollmentStatus.ACTIVE },
    });
    if (enrolled) {
      throw new ConflictException('Bạn đã sở hữu khóa học này');
    }

    // Kiểm tra đã có trong giỏ hàng chưa
    const existing = await this.cartRepo.findOne({
      where: { user_id: userId, course_id: dto.course_id },
    });
    if (existing) {
      throw new ConflictException('Khóa học đã có trong giỏ hàng');
    }

    const item = this.cartRepo.create({
      user_id: userId,
      course_id: dto.course_id,
    });
    await this.cartRepo.save(item);
    return this.getCart(userId);
  }

  async removeFromCart(userId: number, courseId: number) {
    const item = await this.cartRepo.findOne({
      where: { user_id: userId, course_id: courseId },
    });
    if (!item) {
      throw new NotFoundException('Khóa học không có trong giỏ hàng');
    }
    await this.cartRepo.delete(item.id);
    return { success: true, message: 'Đã xóa khóa học khỏi giỏ hàng' };
  }

  async clearCart(userId: number) {
    const items = await this.cartRepo.find({ where: { user_id: userId } });
    for (const item of items) {
      await this.cartRepo.delete(item.id);
    }
    return { success: true, message: 'Giỏ hàng đã được làm trống' };
  }

  // ================= US09: VOUCHER & BÁO GIÁ (QUOTE ENGINE) =================

  async calculateQuote(userId: number, voucherCode?: string) {
    const cartItems = await this.getCart(userId);
    if (!cartItems || cartItems.length === 0) {
      return {
        items: [],
        total_amount: 0,
        discount_amount: 0,
        final_amount: 0,
        voucher: null,
      };
    }

    // Server tính tổng tiền từ DB (không tin client)
    let totalAmount = 0;
    for (const item of cartItems) {
      // Đọc giá chính thức từ bảng courses
      const course = await this.courseRepo.findOne({ where: { course_id: item.course_id } });
      const price = Number(course?.price ?? 0);
      totalAmount += price;
    }

    let discountAmount = 0;
    let appliedVoucher: Voucher | null = null;

    if (voucherCode && voucherCode.trim() !== '') {
      const codeUpper = voucherCode.trim().toUpperCase();
      const voucher = await this.voucherRepo.findOne({
        where: { code: codeUpper, is_active: true },
      });

      if (!voucher) {
        throw new BadRequestException('Mã ưu đãi không tồn tại hoặc đã hết hạn');
      }

      const now = new Date();
      if (voucher.valid_from && new Date(voucher.valid_from) > now) {
        throw new BadRequestException('Mã ưu đãi chưa đến thời gian áp dụng');
      }
      if (voucher.valid_until && new Date(voucher.valid_until) < now) {
        throw new BadRequestException('Mã ưu đãi đã hết hạn sử dụng');
      }
      if (voucher.usage_limit > 0 && voucher.used_count >= voucher.usage_limit) {
        throw new BadRequestException('Mã ưu đãi đã hết lượt sử dụng');
      }
      if (voucher.min_order_value > 0 && totalAmount < Number(voucher.min_order_value)) {
        throw new BadRequestException(
          `Đơn hàng cần tối thiểu ${Number(voucher.min_order_value).toLocaleString('vi-VN')} VNĐ để áp dụng mã`,
        );
      }

      if (voucher.discount_type === VoucherDiscountType.PERCENT) {
        discountAmount = Math.round((totalAmount * Number(voucher.discount_value)) / 100);
      } else {
        discountAmount = Math.round(Number(voucher.discount_value));
      }

      if (voucher.max_discount_amount && discountAmount > Number(voucher.max_discount_amount)) {
        discountAmount = Math.round(Number(voucher.max_discount_amount));
      }

      if (discountAmount > totalAmount) {
        discountAmount = totalAmount;
      }

      appliedVoucher = voucher;
    }

    const finalAmount = totalAmount - discountAmount;

    return {
      items: cartItems,
      total_amount: totalAmount,
      discount_amount: discountAmount,
      final_amount: finalAmount,
      voucher: appliedVoucher,
    };
  }

  // ================= US10: VÍ & LEDGER BẤT BIẾN (WALLET & TOPUP) =================

  async getOrCreateWallet(userId: number): Promise<Wallet> {
    let wallet = await this.walletRepo.findOne({ where: { user_id: userId } });
    if (!wallet) {
      wallet = this.walletRepo.create({
        user_id: userId,
        balance: 0,
      });
      wallet = await this.walletRepo.save(wallet);
    }
    return wallet;
  }

  async getWalletLedger(userId: number) {
    const ledgers = await this.ledgerRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
    return ledgers;
  }

  async createTopupRequest(userId: number, dto: CreateTopupDto) {
    const transactionRef = `TOPUP_${userId}_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const req = this.topupRepo.create({
      user_id: userId,
      amount: dto.amount,
      status: TopupStatus.PENDING,
      payment_method: dto.payment_method ?? 'DEMO_BANK',
      transaction_ref: transactionRef,
      admin_note: 'Mô phỏng nạp tiền học tập — EduViet Sandbox',
    });

    const saved = await this.topupRepo.save(req);

    return {
      request_id: saved.request_id,
      transaction_ref: saved.transaction_ref,
      amount: saved.amount,
      status: saved.status,
      bank_name: 'MB Bank (Ngân hàng Quân Đội)',
      account_number: '0987654321',
      account_holder: 'CONG TY CP CONG NGHE EDUVIET',
      transfer_syntax: saved.transaction_ref,
      notice: 'Hệ thống hỗ trợ nạp tiền thử nghiệm phục vụ học tập và đánh giá.',
    };
  }

  // Quản trị viên đối soát & duyệt nạp tiền (US33)
  async confirmTopup(requestId: number, dto: ConfirmTopupDto, adminUser: JwtPayload) {
    if (!adminUser.roles.includes('Admin')) {
      throw new ForbiddenException('Chỉ quản trị viên mới có quyền đối soát nạp tiền');
    }

    const req = await this.topupRepo.findOne({ where: { request_id: requestId } });
    if (!req) {
      throw new NotFoundException('Không tìm thấy yêu cầu nạp tiền');
    }

    if (req.status !== TopupStatus.PENDING) {
      throw new BadRequestException('Yêu cầu nạp tiền này đã được xử lý trước đó');
    }

    if (dto.status === TopupStatus.CONFIRMED) {
      const wallet = await this.getOrCreateWallet(req.user_id);
      const balanceBefore = Number(wallet.balance);
      const amount = Number(req.amount);
      const balanceAfter = balanceBefore + amount;

      wallet.balance = balanceAfter;
      await this.walletRepo.save(wallet);

      // Ghi sổ cái bất biến (Immutable Ledger)
      const ledger = this.ledgerRepo.create({
        wallet_id: wallet.wallet_id,
        user_id: req.user_id,
        type: LedgerType.DEPOSIT,
        amount,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        reference_type: 'TOPUP',
        reference_id: req.transaction_ref,
        description: `Nạp tiền ví thành công qua ${req.payment_method} (Ref: ${req.transaction_ref})`,
      });
      await this.ledgerRepo.save(ledger);

      req.status = TopupStatus.CONFIRMED;
      req.confirmed_at = new Date();
      req.admin_note = dto.admin_note ?? 'Đã đối soát và cộng tiền thành công';
      await this.topupRepo.save(req);

      return { success: true, message: 'Đã nạp tiền thành công', wallet, ledger };
    } else {
      req.status = TopupStatus.REJECTED;
      req.admin_note = dto.admin_note ?? 'Yêu cầu nạp tiền bị từ chối';
      await this.topupRepo.save(req);
      return { success: false, message: 'Đã từ chối yêu cầu nạp tiền', request: req };
    }
  }

  // ================= US11: THANH TOÁN BẰNG VÍ (CHECKOUT) =================

  async checkoutWithWallet(userId: number, dto: CheckoutDto) {
    const quote = await this.calculateQuote(userId, dto.voucher_code);
    if (!quote.items || quote.items.length === 0) {
      throw new BadRequestException('Giỏ hàng trống, không thể thanh toán');
    }

    // Kiểm tra xem có khóa học nào đã được sở hữu chưa
    for (const item of quote.items) {
      const existing = await this.enrollmentRepo.findOne({
        where: { student_id: userId, course_id: item.course_id, status: EnrollmentStatus.ACTIVE },
      });
      if (existing) {
        throw new ConflictException(`Bạn đã sở hữu khóa học (ID: ${item.course_id}), vui lòng loại khỏi giỏ hàng`);
      }
    }

    const wallet = await this.getOrCreateWallet(userId);
    const balanceBefore = Number(wallet.balance);
    const finalAmount = quote.final_amount;

    if (balanceBefore < finalAmount) {
      throw new BadRequestException(
        `Số dư ví (${balanceBefore.toLocaleString('vi-VN')} đ) không đủ để thanh toán đơn hàng (${finalAmount.toLocaleString('vi-VN')} đ). Vui lòng nạp thêm tiền.`,
      );
    }

    // Trừ tiền ví
    const balanceAfter = balanceBefore - finalAmount;
    wallet.balance = balanceAfter;
    await this.walletRepo.save(wallet);

    // Tạo đơn hàng
    const orderCode = `ORD_${userId}_${Date.now()}`;
    const order = this.orderRepo.create({
      user_id: userId,
      order_code: orderCode,
      total_amount: quote.total_amount,
      discount_amount: quote.discount_amount,
      final_amount: finalAmount,
      voucher_id: quote.voucher ? quote.voucher.voucher_id : null,
      status: OrderStatus.PAID,
      payment_method: 'WALLET',
      paid_at: new Date(),
    });
    const savedOrder = await this.orderRepo.save(order);

    // Ghi sổ cái bất biến (PURCHASE)
    const ledger = this.ledgerRepo.create({
      wallet_id: wallet.wallet_id,
      user_id: userId,
      type: LedgerType.PURCHASE,
      amount: finalAmount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      reference_type: 'ORDER',
      reference_id: orderCode,
      description: `Thanh toán đơn hàng ${orderCode} (${quote.items.length} khóa học)`,
    });
    await this.ledgerRepo.save(ledger);

    // Cập nhật lượt dùng voucher
    if (quote.voucher) {
      quote.voucher.used_count += 1;
      await this.voucherRepo.save(quote.voucher);
    }

    // Tạo các OrderItem và cấp Enrollment
    const createdEnrollments: Enrollment[] = [];
    for (const item of quote.items) {
      const course = await this.courseRepo.findOne({ where: { course_id: item.course_id } });
      const price = Number(course?.price ?? 0);

      const orderItem = this.orderItemRepo.create({
        order_id: savedOrder.order_id,
        course_id: item.course_id,
        price,
      });
      await this.orderItemRepo.save(orderItem);

      const enrollment = this.enrollmentRepo.create({
        student_id: userId,
        course_id: item.course_id,
        progress_percent: 0,
        status: EnrollmentStatus.ACTIVE,
      });
      const savedEnrollment = await this.enrollmentRepo.save(enrollment);
      createdEnrollments.push(savedEnrollment);
    }

    // Làm sạch giỏ hàng sau thanh toán thành công
    await this.clearCart(userId);

    return {
      success: true,
      order_id: savedOrder.order_id,
      order_code: savedOrder.order_code,
      final_amount: finalAmount,
      balance_remaining: balanceAfter,
      enrollments: createdEnrollments,
    };
  }

  // ================= US12 & US33: HOÀN TIỀN & ĐỐI SOÁT (REFUND & RECONCILIATION) =================

  async getMyOrders(userId: number) {
    return this.orderRepo.find({
      where: { user_id: userId },
      relations: { items: true },
      order: { created_at: 'DESC' },
    });
  }

  async requestRefund(userId: number, dto: CreateRefundDto) {
    const order = await this.orderRepo.findOne({
      where: { order_id: dto.order_id, user_id: userId },
      relations: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    if (order.status !== OrderStatus.PAID) {
      throw new BadRequestException('Chỉ có thể yêu cầu hoàn tiền cho đơn hàng đã thanh toán thành công');
    }

    const existingRefund = await this.refundRepo.findOne({
      where: { order_id: dto.order_id, user_id: userId },
    });
    if (existingRefund && existingRefund.status === RefundStatus.PENDING) {
      throw new ConflictException('Đơn hàng đã có yêu cầu hoàn tiền đang chờ xem xét');
    }

    const refund = this.refundRepo.create({
      order_id: order.order_id,
      user_id: userId,
      reason: dto.reason,
      amount: order.final_amount,
      status: RefundStatus.PENDING,
    });

    return this.refundRepo.save(refund);
  }

  async reviewRefund(refundId: number, dto: ReviewRefundDto, adminUser: JwtPayload) {
    if (!adminUser.roles.includes('Admin')) {
      throw new ForbiddenException('Chỉ quản trị viên mới có quyền duyệt hoàn tiền');
    }

    const refund = await this.refundRepo.findOne({ where: { refund_id: refundId } });
    if (!refund) {
      throw new NotFoundException('Không tìm thấy yêu cầu hoàn tiền');
    }

    if (refund.status !== RefundStatus.PENDING) {
      throw new BadRequestException('Yêu cầu hoàn tiền này đã được giải quyết trước đó');
    }

    const order = await this.orderRepo.findOne({
      where: { order_id: refund.order_id },
      relations: { items: true },
    });
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng liên quan');
    }

    if (dto.status === RefundStatus.APPROVED) {
      // Hoàn tiền vào ví người dùng
      const wallet = await this.getOrCreateWallet(refund.user_id);
      const balanceBefore = Number(wallet.balance);
      const amount = Number(refund.amount);
      const balanceAfter = balanceBefore + amount;

      wallet.balance = balanceAfter;
      await this.walletRepo.save(wallet);

      // Ghi sổ cái bất biến (REFUND)
      const ledger = this.ledgerRepo.create({
        wallet_id: wallet.wallet_id,
        user_id: refund.user_id,
        type: LedgerType.REFUND,
        amount,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        reference_type: 'REFUND_REQUEST',
        reference_id: String(refund.refund_id),
        description: `Hoàn tiền đơn hàng ${order.order_code}: ${refund.reason}`,
      });
      await this.ledgerRepo.save(ledger);

      // Cập nhật trạng thái đơn hàng
      order.status = OrderStatus.REFUNDED;
      await this.orderRepo.save(order);

      // Thu hồi quyền học (Revoke Enrollment)
      if (order.items) {
        for (const item of order.items) {
          const enrollment = await this.enrollmentRepo.findOne({
            where: { student_id: refund.user_id, course_id: item.course_id },
          });
          if (enrollment) {
            enrollment.status = EnrollmentStatus.REFUNDED;
            await this.enrollmentRepo.save(enrollment);
          }
        }
      }

      refund.status = RefundStatus.APPROVED;
      refund.processed_at = new Date();
      refund.admin_comment = dto.admin_comment ?? 'Chấp thuận hoàn tiền vào ví theo chính sách';
      await this.refundRepo.save(refund);

      return { success: true, message: 'Đã hoàn tiền thành công vào ví học viên', refund, ledger };
    } else {
      refund.status = RefundStatus.REJECTED;
      refund.processed_at = new Date();
      refund.admin_comment = dto.admin_comment ?? 'Từ chối yêu cầu hoàn tiền';
      await this.refundRepo.save(refund);

      return { success: false, message: 'Đã từ chối yêu cầu hoàn tiền', refund };
    }
  }

  // ================= ADMIN AUDIT & REPORTING =================

  async adminListOrders() {
    return this.orderRepo.find({ relations: { items: true }, order: { created_at: 'DESC' } });
  }

  async adminListTopups() {
    return this.topupRepo.find({ order: { created_at: 'DESC' } });
  }

  async adminListRefunds() {
    return this.refundRepo.find({ order: { created_at: 'DESC' } });
  }

  async adminListLedgers() {
    return this.ledgerRepo.find({ order: { created_at: 'DESC' } });
  }
}
