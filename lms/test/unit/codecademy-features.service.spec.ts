import { describe, it, expect, beforeEach } from 'vitest';
import { CourseService } from '../../src/course/course.service.js';
import { CourseFinderService } from '../../src/course-finder/course-finder.service.js';
import { TrialService } from '../../src/trial/trial.service.js';
import { HelpService } from '../../src/help/help.service.js';
import { CourseStatus } from '../../src/course/course.entity.js';

describe('Codecademy-Inspired Features Unit Tests (Compare, Course Finder, Trials, Help)', () => {
  let courseService: CourseService;
  let finderService: CourseFinderService;
  let trialService: TrialService;
  let helpService: HelpService;

  let courseStore: any[];

  beforeEach(() => {
    courseStore = [
      {
        course_id: 1,
        title: 'React 19 Chuyên Sâu',
        slug: 'react-19-chuyen-sau',
        description: 'Làm chủ React 19 và Next.js',
        price: 890000,
        level: 'Beginner',
        status: CourseStatus.PUBLISHED,
        category: { category_id: 1, name: 'Frontend' },
        instructor: { user_id: 2, full_name: 'Vũ Quốc Huy' },
      },
      {
        course_id: 2,
        title: 'NestJS Clean Architecture',
        slug: 'nestjs-clean-architecture',
        description: 'REST API với NestJS và MySQL',
        price: 950000,
        level: 'Intermediate',
        status: CourseStatus.PUBLISHED,
        category: { category_id: 2, name: 'Backend' },
        instructor: { user_id: 2, full_name: 'Vũ Quốc Huy' },
      },
      {
        course_id: 3,
        title: 'MySQL Nâng Cao',
        slug: 'mysql-nang-cao',
        description: 'Tối ưu truy vấn CSDL',
        price: 490000,
        level: 'Beginner',
        status: CourseStatus.PUBLISHED,
        category: { category_id: 3, name: 'Cơ sở dữ liệu' },
        instructor: { user_id: 2, full_name: 'Vũ Quốc Huy' },
      },
    ];

    const mockCourseRepo: any = {
      find: async (opts?: any) => courseStore,
      findOne: async (opts?: any) => {
        if (opts?.where?.course_id) {
          return courseStore.find((c) => c.course_id === opts.where.course_id) || null;
        }
        return null;
      },
    };

    courseService = new CourseService(mockCourseRepo);
    finderService = new CourseFinderService(mockCourseRepo);
    trialService = new TrialService();
    helpService = new HelpService();
  });

  // 1. So sánh khóa học (CA-US03)
  describe('CA-US03: So sánh khóa học', () => {
    it('1. So sánh 2 hoặc 3 khóa trả về đầy đủ metadata (giá, điều kiện, học được gì, học thử)', async () => {
      const res = await courseService.compare('1,2');
      expect(res.length).toBe(2);
      expect(res[0]).toHaveProperty('prerequisites');
      expect(res[0]).toHaveProperty('outcomes');
      expect(res[0]).toHaveProperty('practice_format');
      expect(res[0].course_id).toBe(1);
      expect(res[1].course_id).toBe(2);
    });

    it('2. Chặn yêu cầu so sánh vượt quá 3 khóa học', async () => {
      await expect(courseService.compare('1,2,3,4')).rejects.toThrow(
        'Chỉ được so sánh tối đa 3 khóa học cùng lúc',
      );
    });

    it('3. Báo lỗi khi không truyền ID hoặc danh sách ID không hợp lệ', async () => {
      await expect(courseService.compare('')).rejects.toThrow('Vui lòng cung cấp');
      await expect(courseService.compare('abc,xyz')).rejects.toThrow('không hợp lệ');
    });
  });

  // 2. Bộ chọn khóa phù hợp (CA-US02)
  describe('CA-US02: Course Finder & Recommendations', () => {
    it('4. Trả về cấu hình câu hỏi khảo sát và phiên bản rule version finder-1', () => {
      const config = finderService.getConfig();
      expect(config.ruleVersion).toBe('finder-1');
      expect(config.questions.length).toBeGreaterThanOrEqual(4);
    });

    it('5. Gợi ý khóa Frontend React 19 khi mục tiêu là FRONTEND kèm lý do rõ ràng', async () => {
      const res = await finderService.getRecommendations({
        goal: 'FRONTEND',
        knownSkills: ['HTML_CSS'],
        budgetMaxVnd: 1000000,
      });

      expect(res.ruleVersion).toBe('finder-1');
      expect(res.items.length).toBeGreaterThan(0);
      expect(res.items[0].course.course_id).toBe(1);
      expect(res.items[0].reasons.length).toBeGreaterThan(0);
      expect(res.items[0].canTry).toBe(true);
    });

    it('6. Phát hiện thiếu điều kiện tiên quyết khi người học bắt đầu từ số 0 (ZERO)', async () => {
      const res = await finderService.getRecommendations({
        goal: 'FRONTEND',
        knownSkills: ['ZERO'],
      });

      expect(res.items[0].missingPrerequisites.length).toBeGreaterThan(0);
    });
  });

  // 3. Học thử tương tác (CA-US04, CA-US05)
  describe('CA-US04 & CA-US05: Interactive Trials', () => {
    it('7. Trả về danh sách bài học thử đại diện từ catalog thật', () => {
      const list = trialService.findAll();
      expect(list.length).toBeGreaterThanOrEqual(3);
      expect(list[0]).toHaveProperty('trial_id');
      expect(list[0]).toHaveProperty('course_id');
      expect(list[0]).toHaveProperty('duration_minutes');
    });

    it('8. Trả về chi tiết không gian học thử 3 vùng Codecademy (hướng dẫn, gợi ý, test cases) và bảo mật lời giải', () => {
      const trial = trialService.findOne(1);
      expect(trial.title).toContain('React 19');
      expect(trial.instructions).toContain('Mục tiêu bài học thử');
      expect(trial.hints.length).toBeGreaterThan(0);
      expect(trial.test_cases.length).toBeGreaterThan(0);
      expect(trial.initial_code).toBeDefined();
      expect((trial as any).solution_code).toBeUndefined();

      // Endpoint getSolution cấp lời giải khi có yêu cầu
      const sol = trialService.getSolution(1);
      expect(sol.solution_code).toBeDefined();
      expect(sol.solution_code).toContain('WelcomeCard');
    });

    it('9. Báo lỗi NotFoundException khi truy vấn bài thử không tồn tại', () => {
      expect(() => trialService.findOne(9999)).toThrow('Không tìm thấy');
    });
  });

  // 4. Hỗ trợ & FAQ (CA-US12)
  describe('CA-US12: Support & FAQ Center', () => {
    it('10. Trả về danh mục câu hỏi thường gặp theo chủ đề thực tế', () => {
      const faq = helpService.getFaq();
      expect(faq.length).toBeGreaterThanOrEqual(3);
      expect(faq[0]).toHaveProperty('topic_name');
      expect(faq[0].items.length).toBeGreaterThan(0);
    });

    it('11. Tiếp nhận yêu cầu tư vấn trước khi mua và cấp mã ticket', () => {
      const res = helpService.createSupportRequest({
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        courseId: 1,
        topic: 'Tư vấn trước khi mua khóa học',
        message: 'Khóa học này có phù hợp cho người trái ngành không?',
      });

      expect(res.success).toBe(true);
      expect(res.ticket_id).toMatch(/^TCK-\d+/);
      expect(res.message).toContain('tiếp nhận');
    });

    it('12. Báo lỗi khi thiếu email hoặc nội dung yêu cầu hỗ trợ', () => {
      expect(() =>
        helpService.createSupportRequest({
          fullName: 'Test',
          email: '',
          topic: 'Tư vấn',
          message: '',
        }),
      ).toThrow('cung cấp email');
    });

    it('13. Truy vấn danh sách ticket hỗ trợ của học viên theo email hoặc user_id', () => {
      const tickets = helpService.getUserTickets('nguyenvana@gmail.com');
      expect(tickets.length).toBeGreaterThanOrEqual(1);
      expect(tickets[0].email).toBe('nguyenvana@gmail.com');
      expect(tickets[0].status).toBe('PENDING');
    });
  });
});
