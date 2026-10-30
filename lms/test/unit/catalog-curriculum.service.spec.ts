import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { Repository } from 'typeorm';
import { Course, CourseLevel, CourseStatus } from '../../src/course/course.entity.js';
import { CourseService } from '../../src/course/course.service.js';
import { CourseModule } from '../../src/course-module/course-module.entity.js';
import { Lesson, LessonContentType } from '../../src/lesson/lesson.entity.js';
import { CourseSort } from '../../src/course/dto/query-course.dto.js';
import type { JwtPayload } from '../../src/auth/jwt.util.js';

function makeUser(overrides: Partial<JwtPayload> = {}): JwtPayload {
  return {
    sub: 10,
    email: 'instructor@eduviet.vn',
    roles: ['Instructor'],
    iat: 1,
    exp: 9999999999,
    ...overrides,
  };
}

describe('Catalog & Curriculum Service Unit Tests (UT05, UT06, UT27, UT28, UT32)', () => {
  let service: CourseService;
  let mockCourseRepo: any;
  let mockModuleRepo: any;
  let mockLessonRepo: any;

  let coursesStore: Course[];
  let modulesStore: CourseModule[];
  let lessonsStore: Lesson[];

  beforeEach(() => {
    coursesStore = [
      {
        course_id: 1,
        instructor_id: 10,
        category_id: 1,
        title: 'React 19 Frontend Masterclass',
        slug: 'react-19-masterclass',
        description: 'Khoá học lập trình React chuyên sâu',
        thumbnail_url: 'react.png',
        price: 500000,
        level: CourseLevel.BEGINNER,
        status: CourseStatus.PUBLISHED,
        rejection_reason: null,
        created_at: new Date('2026-01-01'),
        instructor: { user_id: 10, full_name: 'Vũ Quốc Huy' } as any,
        category: { category_id: 1, category_name: 'Frontend' } as any,
        modules: [],
        enrollments: [],
      },
      {
        course_id: 2,
        instructor_id: 10,
        category_id: 2,
        title: 'NestJS Backend Architecture',
        slug: 'nestjs-backend',
        description: 'Khoá học xây dựng API chuyên nghiệp',
        thumbnail_url: 'nest.png',
        price: 900000,
        level: CourseLevel.INTERMEDIATE,
        status: CourseStatus.PUBLISHED,
        rejection_reason: null,
        created_at: new Date('2026-02-01'),
        instructor: { user_id: 10, full_name: 'Vũ Quốc Huy' } as any,
        category: { category_id: 2, category_name: 'Backend' } as any,
        modules: [],
        enrollments: [],
      },
      {
        course_id: 3,
        instructor_id: 20,
        category_id: 1,
        title: 'Vue 3 Bản Nháp Đang Soạn',
        slug: 'vue-3-draft',
        description: 'Bản nháp chưa công khai',
        thumbnail_url: 'vue.png',
        price: 300000,
        level: CourseLevel.ADVANCED,
        status: CourseStatus.DRAFT,
        rejection_reason: null,
        created_at: new Date('2026-03-01'),
        instructor: { user_id: 20, full_name: 'Trần Văn B' } as any,
        category: { category_id: 1, category_name: 'Frontend' } as any,
        modules: [],
        enrollments: [],
      },
    ];

    modulesStore = [
      {
        module_id: 1,
        course_id: 1,
        title: 'Chương 1: Mở đầu',
        order_index: 1,
        course: null as any,
        lessons: [],
      },
      {
        module_id: 2,
        course_id: 1,
        title: 'Chương 2: React Hooks',
        order_index: 2,
        course: null as any,
        lessons: [],
      },
    ];

    lessonsStore = [
      {
        lesson_id: 1,
        module_id: 1,
        title: '1.1 Giới thiệu tổng quan',
        content_type: LessonContentType.VIDEO,
        content_url: 'https://video.com/preview1.mp4',
        duration_seconds: 300,
        is_preview: true,
        order_index: 1,
        module: null as any,
      },
      {
        lesson_id: 2,
        module_id: 1,
        title: '1.2 Cài đặt công cụ bảo mật',
        content_type: LessonContentType.VIDEO,
        content_url: 'https://video.com/secret_content2.mp4',
        duration_seconds: 600,
        is_preview: false,
        order_index: 2,
        module: null as any,
      },
    ];

    mockCourseRepo = {
      find: vi.fn(async (opts?: any) => {
        let res = [...coursesStore];
        if (opts?.where?.status) {
          res = res.filter((c) => c.status === opts.where.status);
        }
        if (opts?.where?.instructor_id) {
          res = res.filter((c) => c.instructor_id === opts.where.instructor_id);
        }
        return res;
      }),
      findOne: vi.fn(async (opts: any) => {
        const id = opts?.where?.course_id ?? opts?.where?.id;
        return coursesStore.find((c) => c.course_id === id) || null;
      }),
      create: vi.fn((data) => data),
      save: vi.fn(async (data) => {
        const id = data.course_id || coursesStore.length + 1;
        const saved = { ...data, course_id: id };
        const idx = coursesStore.findIndex((c) => c.course_id === id);
        if (idx !== -1) coursesStore[idx] = saved;
        else coursesStore.push(saved);
        return saved;
      }),
      update: vi.fn(async (id: number, data: any) => {
        const idx = coursesStore.findIndex((c) => c.course_id === id);
        if (idx !== -1) {
          coursesStore[idx] = { ...coursesStore[idx], ...data };
        }
        return { affected: idx !== -1 ? 1 : 0 };
      }),
      delete: vi.fn(async (id: number) => {
        const idx = coursesStore.findIndex((c) => c.course_id === id);
        if (idx !== -1) {
          coursesStore.splice(idx, 1);
          return { affected: 1 };
        }
        return { affected: 0 };
      }),
    };

    mockModuleRepo = {
      find: vi.fn(async (opts: any) => {
        return modulesStore.filter((m) => m.course_id === opts?.where?.course_id);
      }),
      findOne: vi.fn(async (opts: any) => {
        return (
          modulesStore.find(
            (m) =>
              m.module_id === opts?.where?.module_id &&
              (!opts?.where?.course_id || m.course_id === opts.where.course_id),
          ) || null
        );
      }),
      create: vi.fn((data) => data),
      save: vi.fn(async (data) => {
        const id = data.module_id || modulesStore.length + 1;
        const saved = { ...data, module_id: id };
        const idx = modulesStore.findIndex((m) => m.module_id === id);
        if (idx !== -1) modulesStore[idx] = saved;
        else modulesStore.push(saved);
        return saved;
      }),
      update: vi.fn(async (id: number, data: any) => {
        const idx = modulesStore.findIndex((m) => m.module_id === id);
        if (idx !== -1) modulesStore[idx] = { ...modulesStore[idx], ...data };
        return { affected: 1 };
      }),
      delete: vi.fn(async (id: number) => {
        const idx = modulesStore.findIndex((m) => m.module_id === id);
        if (idx !== -1) modulesStore.splice(idx, 1);
        return { affected: 1 };
      }),
    };

    mockLessonRepo = {
      find: vi.fn(async (opts: any) => {
        return lessonsStore.filter((l) => l.module_id === opts?.where?.module_id);
      }),
      findOne: vi.fn(async (opts: any) => {
        return (
          lessonsStore.find(
            (l) =>
              l.lesson_id === opts?.where?.lesson_id &&
              (!opts?.where?.module_id || l.module_id === opts.where.module_id),
          ) || null
        );
      }),
      create: vi.fn((data) => data),
      save: vi.fn(async (data) => {
        const id = data.lesson_id || lessonsStore.length + 1;
        const saved = { ...data, lesson_id: id };
        const idx = lessonsStore.findIndex((l) => l.lesson_id === id);
        if (idx !== -1) lessonsStore[idx] = saved;
        else lessonsStore.push(saved);
        return saved;
      }),
      update: vi.fn(async (id: number, data: any) => {
        const idx = lessonsStore.findIndex((l) => l.lesson_id === id);
        if (idx !== -1) lessonsStore[idx] = { ...lessonsStore[idx], ...data };
        return { affected: 1 };
      }),
      delete: vi.fn(async (id: number) => {
        const idx = lessonsStore.findIndex((l) => l.lesson_id === id);
        if (idx !== -1) lessonsStore.splice(idx, 1);
        return { affected: 1 };
      }),
    };

    service = new CourseService(
      mockCourseRepo as unknown as Repository<Course>,
      mockModuleRepo as unknown as Repository<CourseModule>,
      mockLessonRepo as unknown as Repository<Lesson>,
    );
  });

  // ================= UT05: Search & Filter Query Policy =================
  describe('UT05: Search & Filter (US05)', () => {
    it('tìm kiếm theo từ khóa q thành công', async () => {
      const res = await service.findAll({ q: 'react' });
      expect(res.data).toHaveLength(1);
      expect(res.data[0].title).toContain('React 19');
    });

    it('lọc theo khoảng giá min_price và max_price hợp lệ', async () => {
      const res = await service.findAll({ min_price: 600000, max_price: 1000000 });
      expect(res.data).toHaveLength(1);
      expect(res.data[0].title).toContain('NestJS');
    });

    it('từ chối khi min_price > max_price và ném BadRequestException', async () => {
      await expect(
        service.findAll({ min_price: 900000, max_price: 500000 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('sắp xếp theo giá tăng dần (price_asc)', async () => {
      const res = await service.findAll({ sort: CourseSort.PRICE_ASC });
      expect(res.data[0].price).toBe(500000);
      expect(res.data[1].price).toBe(900000);
    });

    it('phân trang đúng số lượng và trả về total, page, total_pages', async () => {
      const res = await service.findAll({ page: 1, limit: 1 });
      expect(res.data).toHaveLength(1);
      expect(res.total).toBe(2); // Chỉ 2 khóa Published
      expect(res.total_pages).toBe(2);
    });
  });

  // ================= UT06: Course Detail & Preview Policy =================
  describe('UT06: Course Detail & Preview Protection (US06)', () => {
    it('khách truy cập xem bài học thử được giữ nguyên URL bài học thử', async () => {
      const course = await service.findOne(1, undefined);
      const mod1 = course.modules[0];
      const previewLesson = mod1.lessons.find((l) => l.is_preview);
      expect(previewLesson?.content_url).toBe('https://video.com/preview1.mp4');
    });

    it('khách truy cập bị ẩn content_url đối với bài học không được preview', async () => {
      const course = await service.findOne(1, undefined);
      const mod1 = course.modules[0];
      const lockedLesson = mod1.lessons.find((l) => !l.is_preview);
      expect(lockedLesson?.content_url).toBe('');
    });

    it('giảng viên sở hữu khóa học được xem đầy đủ mọi URL bài học', async () => {
      const instructorUser = makeUser({ sub: 10 });
      const course = await service.findOne(1, instructorUser);
      const mod1 = course.modules[0];
      const lockedLesson = mod1.lessons.find((l) => !l.is_preview);
      expect(lockedLesson?.content_url).toBe('https://video.com/secret_content2.mp4');
    });

    it('từ chối xem khóa học trạng thái Draft nếu không phải chủ sở hữu hoặc Admin', async () => {
      const stranger = makeUser({ sub: 99 });
      await expect(service.findOne(3, stranger)).rejects.toThrow(NotFoundException);
    });
  });

  // ================= UT27: Instructor Course Management =================
  describe('UT27: Instructor Course Isolation (US27)', () => {
    it('giảng viên chỉ nhìn thấy các khóa học do chính mình tạo ra', async () => {
      const instructorUser = makeUser({ sub: 10 });
      const list = await service.findForInstructor(instructorUser);
      expect(list.every((c) => c.instructor_id === 10)).toBe(true);
    });
  });

  // ================= UT28 & UT29: Curriculum Editor =================
  describe('UT28 & UT29: Curriculum Editor (US28, US29)', () => {
    it('thêm chương học mới thành công', async () => {
      const instructorUser = makeUser({ sub: 10 });
      const newMod = await service.createModule(
        1,
        { title: 'Chương 3: Redux Toolkit', order_index: 3 },
        instructorUser,
      );
      expect(newMod.title).toBe('Chương 3: Redux Toolkit');
      expect(newMod.course_id).toBe(1);
    });

    it('thêm bài giảng mới vào chương học thành công', async () => {
      const instructorUser = makeUser({ sub: 10 });
      const newLesson = await service.createLesson(
        1,
        1,
        {
          title: '1.3 Tổng kết chương',
          content_type: LessonContentType.VIDEO,
          content_url: 'https://video.com/lesson3.mp4',
          duration_seconds: 400,
          is_preview: false,
        },
        instructorUser,
      );
      expect(newLesson.title).toBe('1.3 Tổng kết chương');
      expect(newLesson.module_id).toBe(1);
    });

    it('sắp xếp lại thứ tự bài học và chương học qua reorderCurriculum', async () => {
      const instructorUser = makeUser({ sub: 10 });
      await service.reorderCurriculum(
        1,
        {
          modules: [
            { id: 1, order_index: 2 },
            { id: 2, order_index: 1 },
          ],
        },
        instructorUser,
      );
      expect(mockModuleRepo.update).toHaveBeenCalledWith(1, { order_index: 2 });
      expect(mockModuleRepo.update).toHaveBeenCalledWith(2, { order_index: 1 });
    });
  });

  // ================= UT32: Admin Moderation =================
  describe('UT32: Admin Moderation (US32)', () => {
    it('quản trị viên phê duyệt hoặc từ chối khóa học thành công', async () => {
      const adminUser = makeUser({ roles: ['Admin'], sub: 1 });
      const updated = await service.updateStatus(
        3,
        { status: CourseStatus.PUBLISHED, rejection_reason: undefined },
        adminUser,
      );
      expect(updated.status).toBe(CourseStatus.PUBLISHED);
    });

    it('từ chối giảng viên hoặc học viên tự ý cập nhật trạng thái kiểm duyệt (ForbiddenException)', async () => {
      const instructorUser = makeUser({ roles: ['Instructor'], sub: 10 });
      await expect(
        service.updateStatus(3, { status: CourseStatus.PUBLISHED }, instructorUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
