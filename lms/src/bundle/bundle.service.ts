import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bundle } from './entities/bundle.entity.js';
import { BundleItem } from './entities/bundle-item.entity.js';
import { Course } from '../course/course.entity.js';
import { Enrollment } from '../enrollment/enrollment.entity.js';
import { Wallet } from '../commerce/entities/wallet.entity.js';
import { WalletLedger } from '../commerce/entities/wallet-ledger.entity.js';
import { Order } from '../commerce/entities/order.entity.js';

export const INITIAL_BUNDLES: any[] = [
  {
    bundle_id: 1,
    title: 'Combo Chinh Phục Fullstack Web Developer: React 19 + NestJS + MySQL',
    slug: 'combo-fullstack-web-developer-react-nestjs-mysql',
    description: 'Lộ trình trọn vẹn từ nền tảng giao diện React 19 chuyên sâu, xây dựng RESTful API chuẩn Clean Architecture với NestJS và thiết kế tối ưu cơ sở dữ liệu quan hệ MySQL.',
    thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    bundle_price: 1890000,
    is_active: true,
    items: [
      { id: 1, bundle_id: 1, course_id: 1 },
      { id: 2, bundle_id: 1, course_id: 2 },
      { id: 3, bundle_id: 1, course_id: 3 },
    ],
  },
  {
    bundle_id: 2,
    title: 'Combo Đột Phá Đa Nền Tảng: Frontend React + Mobile Flutter & Dart',
    slug: 'combo-frontend-web-mobile-flutter',
    description: 'Trang bị trọn bộ kỹ năng phát triển giao diện người dùng đỉnh cao trên cả trình duyệt Web và ứng dụng di động iOS/Android mượt mà.',
    thumbnail_url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80',
    bundle_price: 1350000,
    is_active: true,
    items: [
      { id: 4, bundle_id: 2, course_id: 1 },
      { id: 5, bundle_id: 2, course_id: 6 },
    ],
  },
  {
    bundle_id: 3,
    title: 'Combo Backend Engineering & Trí Tuệ Nhân Tạo: Python AI + DevOps Docker',
    slug: 'combo-backend-python-ai-devops-docker',
    description: 'Thành thạo phân tích dữ liệu và AI với Python, làm chủ kỹ thuật Container hóa ứng dụng với Docker và quy trình tự động hóa CI/CD chuyên nghiệp.',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    bundle_price: 1150000,
    is_active: true,
    items: [
      { id: 6, bundle_id: 3, course_id: 4 },
      { id: 7, bundle_id: 3, course_id: 5 },
    ],
  },
];

@Injectable()
export class BundleService {
  constructor(
    @Inject('BUNDLE_REPOSITORY') private readonly bundleRepo: Repository<Bundle>,
    @Inject('COURSE_REPOSITORY') private readonly courseRepo: Repository<Course>,
    @Inject('ENROLLMENT_REPOSITORY') private readonly enrollmentRepo: Repository<Enrollment>,
    @Inject('WALLET_REPOSITORY') private readonly walletRepo: Repository<Wallet>,
    @Inject('WALLET_LEDGER_REPOSITORY') private readonly ledgerRepo: Repository<WalletLedger>,
    @Inject('ORDER_REPOSITORY') private readonly orderRepo: Repository<Order>,
  ) {}

  async findAll() {
    let bundles: any[] = [];
    if (typeof this.bundleRepo.find === 'function') {
      try {
        bundles = await this.bundleRepo.find({
          where: { is_active: true },
          relations: { items: { course: true } },
        });
      } catch {
        bundles = INITIAL_BUNDLES;
      }
    }
    if (!bundles || bundles.length === 0) {
      bundles = INITIAL_BUNDLES;
    }

    // Nạp chi tiết khóa học nếu mock repository chưa nạp eager
    const courses = await this.courseRepo.find();
    return bundles.map((b) => {
      const populatedItems = (b.items || []).map((item: any) => {
        const c = courses.find((crs) => crs.course_id === item.course_id) || item.course || {};
        return { ...item, course: c };
      });

      const retail_total = populatedItems.reduce(
        (sum: number, it: any) => sum + Number(it.course?.price || 0),
        0,
      );
      const savings_amount = Math.max(0, retail_total - Number(b.bundle_price));
      const savings_percent = retail_total > 0 ? Math.round((savings_amount / retail_total) * 100) : 0;

      return {
        ...b,
        items: populatedItems,
        retail_total,
        savings_amount,
        savings_percent,
      };
    });
  }

  async findOne(slugOrId: string | number) {
    const all = await this.findAll();
    const found = all.find(
      (b) => String(b.bundle_id) === String(slugOrId) || b.slug === String(slugOrId),
    );
    if (!found) {
      throw new NotFoundException('Không tìm thấy gói combo ưu đãi');
    }
    return found;
  }

  // Thuật toán Smart Quote: Phân bổ giá gói và khấu trừ các khóa học viên đã sở hữu
  async calculateQuote(bundleId: number, userId?: number) {
    const bundle = await this.findOne(bundleId);
    let ownedCourseIds: number[] = [];

    if (userId) {
      const enrollments = await this.enrollmentRepo.find({
        where: { student_id: userId, status: 'ACTIVE' as any },
      });
      ownedCourseIds = enrollments.map((e) => Number(e.course_id));
    }

    const items = bundle.items || [];
    const retailTotal = bundle.retail_total;
    const bundlePrice = Number(bundle.bundle_price);

    let allocatedSum = 0;
    const allocationBreakdown = items.map((item: any, idx: number) => {
      const price = Number(item.course?.price || 0);
      const isOwned = ownedCourseIds.includes(item.course_id);

      // Phân bổ tỷ lệ giá lẻ trên tổng giá lẻ
      let allocated = retailTotal > 0 ? Math.round((price / retailTotal) * bundlePrice) : 0;
      if (idx === items.length - 1) {
        // Cân đối phần dư làm tròn
        allocated = Math.max(0, bundlePrice - allocatedSum);
      } else {
        allocatedSum += allocated;
      }

      const payable = isOwned ? 0 : allocated;

      return {
        course_id: item.course_id,
        course_title: item.course?.title,
        retail_price: price,
        allocated_price: allocated,
        is_owned: isOwned,
        payable_amount: payable,
      };
    });

    const finalAmount = allocationBreakdown.reduce((sum: number, it: any) => sum + it.payable_amount, 0);
    const unownedCount = allocationBreakdown.filter((it: any) => !it.is_owned).length;
    const alreadyOwnedAll = items.length > 0 && unownedCount === 0;

    return {
      bundle_id: bundle.bundle_id,
      bundle_title: bundle.title,
      bundle_price: bundlePrice,
      retail_total: retailTotal,
      final_amount: finalAmount,
      total_courses: items.length,
      unowned_courses_count: unownedCount,
      already_owned_all: alreadyOwnedAll,
      allocation_breakdown: allocationBreakdown,
    };
  }

  // Thanh toán gói combo bằng số dư ví và kích hoạt toàn bộ khóa học chưa sở hữu
  async checkout(bundleId: number, userId: number) {
    const quote = await this.calculateQuote(bundleId, userId);

    if (quote.already_owned_all) {
      throw new BadRequestException('Bạn đã sở hữu toàn bộ khóa học trong combo này');
    }

    // Kiểm tra số dư ví
    let wallet = await this.walletRepo.findOneBy({ user_id: userId });
    if (!wallet) {
      wallet = await this.walletRepo.save(
        this.walletRepo.create({
          user_id: userId,
          balance: 1000000, // Khởi tạo ví 1 triệu VND nếu chưa có
        }),
      );
    }

    const currentBalance = Number(wallet.balance);
    if (currentBalance < quote.final_amount) {
      throw new BadRequestException(
        `Số dư ví (${currentBalance.toLocaleString('vi-VN')}đ) không đủ để thanh toán combo (${quote.final_amount.toLocaleString('vi-VN')}đ). Vui lòng nạp thêm tiền.`,
      );
    }

    // 1. Trừ tiền ví
    const balanceAfter = currentBalance - quote.final_amount;
    await this.walletRepo.update(wallet.wallet_id, { balance: balanceAfter });

    // 2. Ghi sổ cái WalletLedger
    await this.ledgerRepo.save(
      this.ledgerRepo.create({
        wallet_id: wallet.wallet_id,
        user_id: userId,
        type: 'PURCHASE' as any,
        amount: quote.final_amount,
        balance_before: currentBalance,
        balance_after: balanceAfter,
        reference_type: 'BUNDLE',
        reference_id: `BUNDLE_${bundleId}_${Date.now()}`,
        description: `Mua gói combo: ${quote.bundle_title}`,
      }),
    );

    // 3. Tạo Order
    const order = await this.orderRepo.save(
      this.orderRepo.create({
        user_id: userId,
        order_code: `ORD_BUNDLE_${bundleId}_${Date.now()}`,
        total_amount: quote.retail_total,
        discount_amount: quote.retail_total - quote.final_amount,
        final_amount: quote.final_amount,
        status: 'PAID' as any,
        payment_method: 'WALLET',
        paid_at: new Date(),
      }),
    );

    // 4. Kích hoạt Enrollment cho các khóa chưa sở hữu
    const grantedCourses: number[] = [];
    for (const item of quote.allocation_breakdown) {
      if (!item.is_owned) {
        await this.enrollmentRepo.save(
          this.enrollmentRepo.create({
            student_id: userId,
            course_id: item.course_id,
            progress_percent: 0,
            status: 'ACTIVE' as any,
          }),
        );
        grantedCourses.push(item.course_id);
      }
    }

    return {
      success: true,
      order_id: order.order_id,
      order_code: order.order_code,
      bundle_id: bundleId,
      final_amount: quote.final_amount,
      balance_after: balanceAfter,
      granted_courses_count: grantedCourses.length,
      granted_courses: grantedCourses,
      message: `Thanh toán thành công combo "${quote.bundle_title}"! Bạn đã được kích hoạt ${grantedCourses.length} khóa học mới.`,
    };
  }
}
