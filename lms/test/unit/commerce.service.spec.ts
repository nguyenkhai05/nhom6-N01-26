import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CommerceService } from '../../src/commerce/commerce.service.js';
import { CourseStatus } from '../../src/course/course.entity.js';
import { EnrollmentStatus } from '../../src/enrollment/enrollment.entity.js';
import { VoucherDiscountType } from '../../src/commerce/entities/voucher.entity.js';
import { TopupStatus } from '../../src/commerce/entities/topup-request.entity.js';
import { OrderStatus } from '../../src/commerce/entities/order.entity.js';
import { RefundStatus } from '../../src/commerce/entities/refund-request.entity.js';
import { LedgerType } from '../../src/commerce/entities/wallet-ledger.entity.js';
import type { JwtPayload } from '../../src/auth/jwt.util.js';

describe('CommerceService Unit Tests (UT08, UT09, UT10, UT11, UT12, UT33)', () => {
  let service: CommerceService;

  // Stores
  let cartStore: any[];
  let voucherStore: any[];
  let walletStore: any[];
  let ledgerStore: any[];
  let topupStore: any[];
  let orderStore: any[];
  let orderItemStore: any[];
  let refundStore: any[];
  let courseStore: any[];
  let enrollmentStore: any[];

  // Repos
  let cartRepo: any;
  let voucherRepo: any;
  let walletRepo: any;
  let ledgerRepo: any;
  let topupRepo: any;
  let orderRepo: any;
  let orderItemRepo: any;
  let refundRepo: any;
  let courseRepo: any;
  let enrollmentRepo: any;

  const studentUser: JwtPayload = {
    sub: 3,
    email: 'student@eduviet.vn',
    roles: ['Student'],
    iat: 1,
    exp: 9999999999,
  };

  const adminUser: JwtPayload = {
    sub: 1,
    email: 'admin@eduviet.vn',
    roles: ['Admin'],
    iat: 1,
    exp: 9999999999,
  };

  beforeEach(() => {
    courseStore = [
      {
        course_id: 1,
        title: 'React 19 Masterclass',
        price: 500000,
        status: CourseStatus.PUBLISHED,
      },
      {
        course_id: 2,
        title: 'NestJS Backend',
        price: 800000,
        status: CourseStatus.PUBLISHED,
      },
    ];

    voucherStore = [
      {
        voucher_id: 1,
        code: 'GIAM20',
        discount_type: VoucherDiscountType.PERCENT,
        discount_value: 20,
        min_order_value: 200000,
        max_discount_amount: 300000,
        valid_from: new Date('2026-01-01'),
        valid_until: new Date('2027-01-01'),
        usage_limit: 100,
        used_count: 0,
        is_active: true,
      },
      {
        voucher_id: 2,
        code: 'VIP500',
        discount_type: VoucherDiscountType.FIXED,
        discount_value: 500000,
        min_order_value: 1000000,
        max_discount_amount: 500000,
        valid_from: new Date('2026-01-01'),
        valid_until: new Date('2027-01-01'),
        usage_limit: 10,
        used_count: 0,
        is_active: true,
      },
    ];

    cartStore = [];
    walletStore = [{ wallet_id: 1, user_id: 3, balance: 1000000 }];
    ledgerStore = [];
    topupStore = [];
    orderStore = [];
    orderItemStore = [];
    refundStore = [];
    enrollmentStore = [];

    cartRepo = {
      find: vi.fn(async (opts: any) =>
        cartStore
          .filter((i) => i.user_id === opts?.where?.user_id)
          .map((i) => ({ ...i, course: courseStore.find((c) => c.course_id === i.course_id) })),
      ),
      findOne: vi.fn(async (opts: any) =>
        cartStore.find(
          (i) => i.user_id === opts?.where?.user_id && i.course_id === opts?.where?.course_id,
        ) || null,
      ),
      create: vi.fn((data) => data),
      save: vi.fn(async (data) => {
        const id = data.id || cartStore.length + 1;
        const saved = { ...data, id };
        cartStore.push(saved);
        return saved;
      }),
      delete: vi.fn(async (id: number) => {
        const idx = cartStore.findIndex((i) => i.id === id);
        if (idx !== -1) cartStore.splice(idx, 1);
        return { affected: 1 };
      }),
    };

    voucherRepo = {
      findOne: vi.fn(async (opts: any) =>
        voucherStore.find((v) => v.code === opts?.where?.code && v.is_active === opts?.where?.is_active) || null,
      ),
      save: vi.fn(async (v) => v),
    };

    walletRepo = {
      findOne: vi.fn(async (opts: any) => walletStore.find((w) => w.user_id === opts?.where?.user_id) || null),
      create: vi.fn((data) => data),
      save: vi.fn(async (w) => {
        const idx = walletStore.findIndex((item) => item.user_id === w.user_id);
        if (idx !== -1) walletStore[idx] = w;
        else walletStore.push(w);
        return w;
      }),
    };

    ledgerRepo = {
      find: vi.fn(async (opts: any) => ledgerStore.filter((l) => l.user_id === opts?.where?.user_id)),
      create: vi.fn((data) => data),
      save: vi.fn(async (l) => {
        const id = l.ledger_id || ledgerStore.length + 1;
        const saved = { ...l, ledger_id: id };
        ledgerStore.push(saved);
        return saved;
      }),
    };

    topupRepo = {
      findOne: vi.fn(async (opts: any) => topupStore.find((t) => t.request_id === opts?.where?.request_id) || null),
      find: vi.fn(async () => [...topupStore]),
      create: vi.fn((data) => data),
      save: vi.fn(async (t) => {
        const id = t.request_id || topupStore.length + 1;
        const saved = { ...t, request_id: id };
        const idx = topupStore.findIndex((item) => item.request_id === id);
        if (idx !== -1) topupStore[idx] = saved;
        else topupStore.push(saved);
        return saved;
      }),
    };

    orderRepo = {
      find: vi.fn(async (opts: any) =>
        orderStore
          .filter((o) => !opts?.where?.user_id || o.user_id === opts.where.user_id)
          .map((o) => ({
            ...o,
            items: orderItemStore.filter((i) => i.order_id === o.order_id),
          })),
      ),
      findOne: vi.fn(async (opts: any) => {
        const o = orderStore.find(
          (item) =>
            item.order_id === opts?.where?.order_id &&
            (!opts?.where?.user_id || item.user_id === opts.where.user_id),
        );
        if (!o) return null;
        return {
          ...o,
          items: orderItemStore.filter((i) => i.order_id === o.order_id),
        };
      }),
      create: vi.fn((data) => data),
      save: vi.fn(async (o) => {
        const id = o.order_id || orderStore.length + 1;
        const saved = { ...o, order_id: id };
        const idx = orderStore.findIndex((item) => item.order_id === id);
        if (idx !== -1) orderStore[idx] = saved;
        else orderStore.push(saved);
        return saved;
      }),
    };

    orderItemRepo = {
      create: vi.fn((data) => data),
      save: vi.fn(async (i) => {
        orderItemStore.push(i);
        return i;
      }),
    };

    refundRepo = {
      find: vi.fn(async () => [...refundStore]),
      findOne: vi.fn(async (opts: any) =>
        refundStore.find(
          (r) =>
            (!opts?.where?.refund_id || r.refund_id === opts.where.refund_id) &&
            (!opts?.where?.order_id || r.order_id === opts.where.order_id),
        ) || null,
      ),
      create: vi.fn((data) => data),
      save: vi.fn(async (r) => {
        const id = r.refund_id || refundStore.length + 1;
        const saved = { ...r, refund_id: id };
        const idx = refundStore.findIndex((item) => item.refund_id === id);
        if (idx !== -1) refundStore[idx] = saved;
        else refundStore.push(saved);
        return saved;
      }),
    };

    courseRepo = {
      findOne: vi.fn(async (opts: any) => courseStore.find((c) => c.course_id === opts?.where?.course_id) || null),
    };

    enrollmentRepo = {
      findOne: vi.fn(async (opts: any) =>
        enrollmentStore.find(
          (e) =>
            e.student_id === opts?.where?.student_id &&
            e.course_id === opts?.where?.course_id &&
            (!opts?.where?.status || e.status === opts.where.status),
        ) || null,
      ),
      create: vi.fn((data) => data),
      save: vi.fn(async (e) => {
        const id = e.enrollment_id || enrollmentStore.length + 1;
        const saved = { ...e, enrollment_id: id };
        const idx = enrollmentStore.findIndex((item) => item.enrollment_id === id);
        if (idx !== -1) enrollmentStore[idx] = saved;
        else enrollmentStore.push(saved);
        return saved;
      }),
    };

    service = new CommerceService(
      cartRepo,
      voucherRepo,
      walletRepo,
      ledgerRepo,
      topupRepo,
      orderRepo,
      orderItemRepo,
      refundRepo,
      courseRepo,
      enrollmentRepo,
    );
  });

  // ================= UT08: Giỏ hàng =================
  describe('UT08: Quản lý giỏ hàng (US08)', () => {
    it('thêm khóa học vào giỏ hàng thành công', async () => {
      const cart = await service.addToCart(studentUser.sub, { course_id: 1 });
      expect(cart).toHaveLength(1);
      expect(cart[0].course_id).toBe(1);
    });

    it('từ chối thêm khóa học nếu đã có trong giỏ hàng (ConflictException)', async () => {
      await service.addToCart(studentUser.sub, { course_id: 1 });
      await expect(service.addToCart(studentUser.sub, { course_id: 1 })).rejects.toThrow(ConflictException);
    });

    it('từ chối thêm khóa học nếu học viên đã sở hữu (ConflictException)', async () => {
      enrollmentStore.push({
        enrollment_id: 1,
        student_id: studentUser.sub,
        course_id: 2,
        status: EnrollmentStatus.ACTIVE,
      });

      await expect(service.addToCart(studentUser.sub, { course_id: 2 })).rejects.toThrow(
        'Bạn đã sở hữu khóa học này',
      );
    });

    it('xóa khóa học khỏi giỏ hàng thành công', async () => {
      await service.addToCart(studentUser.sub, { course_id: 1 });
      const res = await service.removeFromCart(studentUser.sub, 1);
      expect(res.success).toBe(true);
      expect(cartStore).toHaveLength(0);
    });
  });

  // ================= UT09: Báo giá & Voucher =================
  describe('UT09: Báo giá & Voucher (US09)', () => {
    beforeEach(async () => {
      await service.addToCart(studentUser.sub, { course_id: 1 }); // 500.000đ
    });

    it('tính đúng tổng tiền khóa học từ cơ sở dữ liệu server', async () => {
      const quote = await service.calculateQuote(studentUser.sub);
      expect(quote.total_amount).toBe(500000);
      expect(quote.discount_amount).toBe(0);
      expect(quote.final_amount).toBe(500000);
    });

    it('áp dụng voucher phần trăm thành công (GIAM20 = 20%)', async () => {
      const quote = await service.calculateQuote(studentUser.sub, 'GIAM20');
      expect(quote.total_amount).toBe(500000);
      expect(quote.discount_amount).toBe(100000); // 20% của 500k
      expect(quote.final_amount).toBe(400000);
    });

    it('từ chối voucher nếu đơn hàng chưa đạt giá trị tối thiểu', async () => {
      // VIP500 yêu cầu min 1.000.000đ, giỏ hiện tại chỉ có 500.000đ
      await expect(service.calculateQuote(studentUser.sub, 'VIP500')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('từ chối mã voucher không hợp lệ hoặc không tồn tại', async () => {
      await expect(service.calculateQuote(studentUser.sub, 'KHONGTONTAI')).rejects.toThrow(
        'Mã ưu đãi không tồn tại hoặc đã hết hạn',
      );
    });
  });

  // ================= UT10: Ví & Sổ cái nạp tiền =================
  describe('UT10: Ví & Sổ cái nạp tiền (US10, US33)', () => {
    it('học viên tạo yêu cầu nạp tiền trả về mã giao dịch và trạng thái PENDING', async () => {
      const res = await service.createTopupRequest(studentUser.sub, { amount: 200000 });
      expect(res.status).toBe(TopupStatus.PENDING);
      expect(res.transaction_ref).toContain('TOPUP_3_');
      expect(topupStore).toHaveLength(1);
    });

    it('quản trị viên duyệt nạp tiền: số dư ví tăng và ghi sổ cái DEPOSIT', async () => {
      await service.createTopupRequest(studentUser.sub, { amount: 200000 });
      const topupId = topupStore[0].request_id;

      const res = await service.confirmTopup(
        topupId,
        { status: TopupStatus.CONFIRMED },
        adminUser,
      );

      expect(res.success).toBe(true);
      expect(walletStore[0].balance).toBe(1200000); // 1.000.000 + 200.000
      expect(ledgerStore).toHaveLength(1);
      expect(ledgerStore[0].type).toBe(LedgerType.DEPOSIT);
      expect(ledgerStore[0].amount).toBe(200000);
      expect(topupStore[0].status).toBe(TopupStatus.CONFIRMED);
    });

    it('ngăn chặn duyệt trùng yêu cầu nạp tiền đã giải quyết', async () => {
      await service.createTopupRequest(studentUser.sub, { amount: 200000 });
      const topupId = topupStore[0].request_id;
      await service.confirmTopup(topupId, { status: TopupStatus.CONFIRMED }, adminUser);

      // Duyệt lần thứ 2
      await expect(
        service.confirmTopup(topupId, { status: TopupStatus.CONFIRMED }, adminUser),
      ).rejects.toThrow('Yêu cầu nạp tiền này đã được xử lý trước đó');
    });
  });

  // ================= UT11: Thanh toán đơn hàng =================
  describe('UT11: Thanh toán bằng số dư ví (US11)', () => {
    beforeEach(async () => {
      await service.addToCart(studentUser.sub, { course_id: 1 }); // 500k
    });

    it('thanh toán thành công: trừ số dư ví, tạo đơn PAID, cấp Enrollment và ghi PURCHASE trên ledger', async () => {
      const res = await service.checkoutWithWallet(studentUser.sub, {});

      expect(res.success).toBe(true);
      expect(walletStore[0].balance).toBe(500000); // 1.000.000 - 500.000
      expect(orderStore).toHaveLength(1);
      expect(orderStore[0].status).toBe(OrderStatus.PAID);
      expect(enrollmentStore).toHaveLength(1);
      expect(enrollmentStore[0].course_id).toBe(1);
      expect(cartStore).toHaveLength(0); // Đã làm sạch giỏ hàng

      const purchaseLedger = ledgerStore.find((l) => l.type === LedgerType.PURCHASE);
      expect(purchaseLedger).toBeDefined();
      expect(purchaseLedger.amount).toBe(500000);
    });

    it('từ chối thanh toán nếu số dư ví không đủ (BadRequestException)', async () => {
      walletStore[0].balance = 100000; // Chỉ có 100k, khóa học 500k
      await expect(service.checkoutWithWallet(studentUser.sub, {})).rejects.toThrow(
        'Số dư ví (100.000 đ) không đủ để thanh toán',
      );
      expect(orderStore).toHaveLength(0);
      expect(enrollmentStore).toHaveLength(0);
    });
  });

  // ================= UT12 & UT33: Hoàn tiền & Đối soát =================
  describe('UT12 & UT33: Hoàn tiền & Thu hồi quyền học (US12, US33)', () => {
    let paidOrderId: number;

    beforeEach(async () => {
      await service.addToCart(studentUser.sub, { course_id: 1 });
      const checkoutRes = await service.checkoutWithWallet(studentUser.sub, {});
      paidOrderId = checkoutRes.order_id;
    });

    it('học viên gửi yêu cầu hoàn tiền thành công', async () => {
      const refund = await service.requestRefund(studentUser.sub, {
        order_id: paidOrderId,
        reason: 'Nội dung không phù hợp với mục tiêu học tập',
      });

      expect(refund.status).toBe(RefundStatus.PENDING);
      expect(refund.amount).toBe(500000);
      expect(refundStore).toHaveLength(1);
    });

    it('quản trị viên duyệt hoàn tiền: hoàn lại tiền vào ví, đổi trạng thái đơn và thu hồi Enrollment', async () => {
      const refund = await service.requestRefund(studentUser.sub, {
        order_id: paidOrderId,
        reason: 'Khóa học không phù hợp',
      });

      const res = await service.reviewRefund(
        refund.refund_id,
        { status: RefundStatus.APPROVED },
        adminUser,
      );

      expect(res.success).toBe(true);
      expect(walletStore[0].balance).toBe(1000000); // 500k + hoàn 500k = 1.000.000
      expect(orderStore[0].status).toBe(OrderStatus.REFUNDED);
      expect(enrollmentStore[0].status).toBe(EnrollmentStatus.REFUNDED); // Thu hồi quyền học

      const refundLedger = ledgerStore.find((l) => l.type === LedgerType.REFUND);
      expect(refundLedger).toBeDefined();
      expect(refundLedger.amount).toBe(500000);
    });
  });
});
