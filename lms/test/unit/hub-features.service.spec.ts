import { describe, it, expect, beforeEach } from 'vitest';
import { BundleService, INITIAL_BUNDLES } from '../../src/bundle/bundle.service.js';
import { ProjectService, INITIAL_PROJECTS } from '../../src/project/project.service.js';
import { PracticeService, INITIAL_EXERCISES, INITIAL_ASSESSMENTS } from '../../src/practice/practice.service.js';
import { CommunityService, INITIAL_COMMUNITY_POSTS } from '../../src/community/community.service.js';

describe('Hub Features Unit Tests (Bundles, Projects, Practice, Community)', () => {
  let bundleService: BundleService;
  let projectService: ProjectService;
  let practiceService: PracticeService;
  let communityService: CommunityService;

  let bundleStore: any[];
  let courseStore: any[];
  let enrollmentStore: any[];
  let walletStore: any[];
  let ledgerStore: any[];
  let orderStore: any[];
  let projectStore: any[];
  let submissionStore: any[];
  let userStore: any[];

  beforeEach(() => {
    courseStore = [
      { course_id: 1, title: 'React 19 Chuyên Sâu', price: 890000 },
      { course_id: 2, title: 'NestJS Clean Architecture', price: 990000 },
      { course_id: 3, title: 'MySQL Nâng Cao', price: 590000 },
      { course_id: 4, title: 'Python AI', price: 790000 },
      { course_id: 5, title: 'DevOps Docker', price: 690000 },
      { course_id: 6, title: 'Flutter Mobile', price: 850000 },
    ];

    enrollmentStore = [
      { id: 1, student_id: 10, course_id: 1, status: 'ACTIVE' }, // User 10 already owns course 1
    ];

    walletStore = [
      { wallet_id: 1, user_id: 10, balance: 2000000 },
      { wallet_id: 2, user_id: 20, balance: 500000 }, // Low balance
    ];

    ledgerStore = [];
    orderStore = [];
    projectStore = [...INITIAL_PROJECTS];
    submissionStore = [];
    userStore = [
      { user_id: 1, full_name: 'Quản trị viên EduViet', roles: [{ role_name: 'Admin' }] },
      { user_id: 3, full_name: 'Nguyễn Văn Dev', roles: [{ role_name: 'Student' }] },
      { user_id: 10, full_name: 'Nguyễn Học Viên', roles: [{ role_name: 'Student' }] },
      { user_id: 99, full_name: 'Giảng Viên Vũ', roles: [{ role_name: 'Instructor' }] },
    ];

    bundleStore = JSON.parse(JSON.stringify(INITIAL_BUNDLES));

    const mockBundleRepo: any = {
      find: async () => bundleStore,
      findOneBy: async (cond: any) => bundleStore.find((b) => b.bundle_id === cond.bundle_id) || null,
    };
    const mockCourseRepo: any = {
      find: async () => courseStore,
      findOneBy: async (cond: any) => courseStore.find((c) => c.course_id === cond.course_id) || null,
    };
    const mockEnrollmentRepo: any = {
      find: async (opts: any) => {
        if (opts?.where?.student_id) {
          return enrollmentStore.filter((e) => e.student_id === opts.where.student_id);
        }
        return enrollmentStore;
      },
      save: async (item: any) => {
        enrollmentStore.push(item);
        return item;
      },
      create: (data: any) => data,
    };
    const mockWalletRepo: any = {
      findOneBy: async (cond: any) => walletStore.find((w) => w.user_id === cond.user_id) || null,
      update: async (id: number, patch: any) => {
        const found = walletStore.find((w) => w.wallet_id === id);
        if (found) Object.assign(found, patch);
        return { affected: 1 };
      },
      save: async (data: any) => {
        walletStore.push(data);
        return data;
      },
      create: (data: any) => data,
    };
    const mockLedgerRepo: any = {
      save: async (item: any) => {
        ledgerStore.push(item);
        return item;
      },
      create: (data: any) => data,
    };
    const mockOrderRepo: any = {
      save: async (item: any) => {
        item.order_id = orderStore.length + 1;
        orderStore.push(item);
        return item;
      },
      create: (data: any) => data,
    };

    bundleService = new BundleService(
      mockBundleRepo,
      mockCourseRepo,
      mockEnrollmentRepo,
      mockWalletRepo,
      mockLedgerRepo,
      mockOrderRepo,
    );

    const mockProjectRepo: any = {
      find: async () => projectStore,
    };
    const mockSubmissionRepo: any = {
      findOne: async (opts: any) => {
        return (
          submissionStore.find(
            (s) =>
              (opts.where.project_id === undefined || s.project_id === opts.where.project_id) &&
              (opts.where.user_id === undefined || s.user_id === opts.where.user_id) &&
              (opts.where.submission_id === undefined || s.submission_id === opts.where.submission_id),
          ) || null
        );
      },
      find: async () => submissionStore,
      save: async (item: any) => {
        if (!item.submission_id) item.submission_id = submissionStore.length + 1;
        const idx = submissionStore.findIndex((s) => s.submission_id === item.submission_id);
        if (idx !== -1) submissionStore[idx] = item;
        else submissionStore.push(item);
        return item;
      },
      create: (data: any) => data,
    };

    projectService = new ProjectService(mockProjectRepo, mockSubmissionRepo);

    const mockExerciseRepo: any = {
      find: async () => INITIAL_EXERCISES,
    };
    const mockAssessmentRepo: any = {
      find: async () => INITIAL_ASSESSMENTS,
    };
    practiceService = new PracticeService(mockExerciseRepo, mockAssessmentRepo);

    const mockPostRepo: any = {
      find: async () => INITIAL_COMMUNITY_POSTS,
    };
    const mockReplyRepo: any = {
      find: async () => [],
    };
    const mockUserRepo: any = {
      findOneBy: async (cond: any) => userStore.find((u) => u.user_id === cond.user_id) || null,
      findOne: async (opts: any) => userStore.find((u) => u.user_id === opts?.where?.user_id) || null,
    };
    communityService = new CommunityService(mockPostRepo, mockReplyRepo, mockUserRepo);
  });

  // 1. Bundle Tests
  describe('HUB-US11, HUB-US12, HUB-US13: Bundle Service & Smart Quote', () => {
    it('findAll: trả về danh sách combo kèm tổng giá lẻ và số tiền tiết kiệm', async () => {
      const bundles = await bundleService.findAll();
      expect(bundles.length).toBe(3);
      expect(bundles[0].retail_total).toBe(890000 + 990000 + 590000); // 2.470.000đ
      expect(bundles[0].savings_amount).toBe(2470000 - 1890000); // 580.000đ
      expect(bundles[0].savings_percent).toBeGreaterThan(20);
    });

    it('calculateQuote: khấu trừ khóa đã sở hữu cho học viên', async () => {
      // User 10 đã sở hữu khóa 1 (React)
      const quote = await bundleService.calculateQuote(1, 10);
      expect(quote.bundle_id).toBe(1);
      expect(quote.allocation_breakdown[0].is_owned).toBe(true);
      expect(quote.allocation_breakdown[0].payable_amount).toBe(0);
      // Giá thanh toán phải nhỏ hơn giá gốc của combo
      expect(quote.final_amount).toBeLessThan(quote.bundle_price);
      expect(quote.already_owned_all).toBe(false);
    });

    it('checkout: trừ ví, ghi ledger và kích hoạt các khóa chưa sở hữu', async () => {
      const res = await bundleService.checkout(1, 10);
      expect(res.success).toBe(true);
      expect(res.granted_courses_count).toBe(2); // Cấp khóa 2 và 3, khóa 1 đã có
      expect(ledgerStore.length).toBe(1);
      expect(ledgerStore[0].type).toBe('PURCHASE');
      expect(orderStore.length).toBe(1);
      expect(orderStore[0].status).toBe('PAID');
    });

    it('checkout: chặn thanh toán khi số dư ví không đủ', async () => {
      // User 20 chỉ có 500.000đ trong ví, không đủ mua combo 1.890.000đ
      await expect(bundleService.checkout(1, 20)).rejects.toThrow();
    });
  });

  // 2. Project Tests
  describe('HUB-US04, HUB-US05, HUB-US06: Real Projects & Submission Flow', () => {
    it('findAll: lấy danh sách các đề bài dự án thực tế có brief và rubric', async () => {
      const projects = await projectService.findAll();
      expect(projects.length).toBe(4);
      expect(projects[0].rubric.length).toBe(3);
      expect(projects[0].milestones.length).toBe(4);
    });

    it('saveSubmission: lưu bản nháp dự án với repo_url và checklist mốc', async () => {
      const sub = await projectService.saveSubmission(1, 10, {
        repo_url: 'https://github.com/student/portfolio',
        demo_url: 'https://portfolio-student.vercel.app',
        completed_milestones: ['Thiết lập cấu trúc dự án', 'Xây dựng section'],
        is_submit: false,
      });
      expect(sub.status).toBe('DRAFT');
      expect(sub.repo_url).toContain('github.com');
    });

    it('gradeSubmission: giảng viên chấm điểm theo rubric và cập nhật trạng thái ACCEPTED', async () => {
      await projectService.saveSubmission(1, 10, {
        repo_url: 'https://github.com/student/portfolio',
        is_submit: true,
      });
      const graded = await projectService.gradeSubmission(1, {
        score: 95,
        feedback: 'Sản phẩm hoàn thiện rất xuất sắc, điểm Lighthouse cao!',
        status: 'ACCEPTED',
      });
      expect(graded.grade_score).toBe(95);
      expect(graded.status).toBe('ACCEPTED');
    });
  });

  // 3. Practice Tests
  describe('HUB-US01, HUB-US02: Practice Center & Assessment Engine', () => {
    it('getExercises: lọc bài luyện theo kỹ năng', async () => {
      const jsExercises = await practiceService.getExercises({ skill: 'JavaScript' });
      expect(jsExercises.length).toBeGreaterThan(0);
      expect(jsExercises[0].skill).toBe('JavaScript');
    });

    it('submitAssessment: chấm điểm server và phân tích radar năng lực', async () => {
      const result = await practiceService.submitAssessment(1, [
        { question_id: 101, selected_index: 2 }, // Đúng
        { question_id: 102, selected_index: 1 }, // Đúng
        { question_id: 103, selected_index: 0 }, // Đúng
        { question_id: 104, selected_index: 0 }, // Đúng
      ]);
      expect(result.score).toBe(100);
      expect(result.is_passed).toBe(true);
      expect(result.skill_radar.length).toBeGreaterThan(0);
    });
  });

  // 4. Community Tests
  describe('HUB-US08, HUB-US09: Community Hub & Discussion', () => {
    it('getPosts: lấy danh sách thảo luận cộng đồng', async () => {
      const posts = await communityService.getPosts();
      expect(posts.length).toBeGreaterThanOrEqual(3);
    });

    it('createPost & createReply: tạo bài viết và gửi câu trả lời', async () => {
      const post = await communityService.createPost(10, {
        category: 'Hỏi đáp lập trình',
        title: 'Làm sao giải quyết CORS trong NestJS?',
        content: 'Mình gọi API từ frontend bị lỗi CORS policy.',
        tags: ['NestJS', 'CORS'],
      });
      expect(post.title).toContain('CORS');

      const reply = await communityService.createReply(post.post_id, 99, 'Bạn dùng app.enableCors() trong main.ts nhé.');
      expect(reply.content).toContain('enableCors');
    });

    it('acceptReply: tác giả bài viết chọn câu trả lời hữu ích nhất', async () => {
      const res = await communityService.acceptReply(1, 1, 3); // User 3 là tác giả post 1
      expect(res.success).toBe(true);
      expect(res.accepted_reply_id).toBe(1);
    });

    it('acceptReply: chặn người dùng lạ không có quyền duyệt câu trả lời (ForbiddenException)', async () => {
      await expect(communityService.acceptReply(1, 1, 10)).rejects.toThrow();
    });

    it('acceptReply: cho phép Quản trị viên duyệt câu trả lời ngay cả khi không phải tác giả', async () => {
      const res = await communityService.acceptReply(1, 1, 1); // User 1 là Admin
      expect(res.success).toBe(true);
      expect(res.accepted_reply_id).toBe(1);
    });

    it('reportContent: ghi nhận báo cáo nội dung vi phạm và lưu trữ hàng đợi kiểm duyệt', async () => {
      const rep = await communityService.reportContent(
        { target_type: 'post', target_id: 1, reason: 'Nội dung spam quảng cáo' },
        10,
      );
      expect(rep.success).toBe(true);
      expect(rep.report.status).toBe('PENDING');

      const allReports = await communityService.getReports();
      expect(allReports.length).toBeGreaterThanOrEqual(1);
      expect(allReports[0].target_id).toBe(1);
    });
  });
});
