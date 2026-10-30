import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ForbiddenException } from '@nestjs/common';
import {
  LearningService,
  calculateTotalWatchedSeconds,
  mergeIntervals,
} from '../../src/learning/learning.service.js';
import { EnrollmentStatus } from '../../src/enrollment/enrollment.entity.js';
import { CourseStatus } from '../../src/course/course.entity.js';
import { LessonContentType } from '../../src/lesson/lesson.entity.js';

describe('LearningService Unit Tests (UT13, UT14, UT15, UT16, UT17, UT19)', () => {
  let service: LearningService;

  let progressStore: any[];
  let noteStore: any[];
  let attachmentStore: any[];
  let questionStore: any[];
  let attemptStore: any[];
  let enrollmentStore: any[];
  let courseStore: any[];
  let lessonStore: any[];
  let moduleStore: any[];

  let progressRepo: any;
  let noteRepo: any;
  let attachmentRepo: any;
  let questionRepo: any;
  let attemptRepo: any;
  let enrollmentRepo: any;
  let courseRepo: any;
  let lessonRepo: any;
  let moduleRepo: any;

  beforeEach(() => {
    courseStore = [
      {
        course_id: 1,
        title: 'React 19 Masterclass',
        instructor_id: 10,
        status: CourseStatus.PUBLISHED,
      },
    ];

    moduleStore = [
      {
        module_id: 1,
        course_id: 1,
        title: 'Chương 1',
        order_index: 1,
      },
    ];

    lessonStore = [
      {
        lesson_id: 1,
        module_id: 1,
        title: '1.1 Giới thiệu học phần',
        content_type: LessonContentType.VIDEO,
        duration_seconds: 300,
        is_preview: true,
      },
      {
        lesson_id: 2,
        module_id: 1,
        title: '1.2 Bài giảng chuyên sâu',
        content_type: LessonContentType.VIDEO,
        duration_seconds: 300,
        is_preview: false,
      },
    ];

    questionStore = [
      {
        question_id: 1,
        lesson_id: 2,
        question_text: 'Câu 1: Hook nào dùng để quản lý state?',
        options: JSON.stringify(['useState', 'useRef', 'useEffect', 'useMemo']),
        correct_answer_index: 0,
        points: 50,
        explanation: 'useState dùng để khai báo và cập nhật state.',
      },
      {
        question_id: 2,
        lesson_id: 2,
        question_text: 'Câu 2: Kiểu dữ liệu typeof null là gì?',
        options: JSON.stringify(['null', 'undefined', 'object', 'boolean']),
        correct_answer_index: 2,
        points: 50,
        explanation: 'typeof null trả về object.',
      },
    ];

    progressStore = [];
    noteStore = [];
    attachmentStore = [];
    attemptStore = [];
    enrollmentStore = [];

    progressRepo = {
      findOne: vi.fn(async (opts: any) =>
        progressStore.find(
          (p) =>
            p.user_id === opts?.where?.user_id &&
            p.lesson_id === opts?.where?.lesson_id &&
            (!opts?.where?.is_completed || p.is_completed === opts.where.is_completed),
        ) || null,
      ),
      find: vi.fn(async (opts: any) =>
        progressStore.filter(
          (p) =>
            p.user_id === opts?.where?.user_id &&
            p.course_id === opts?.where?.course_id &&
            (!opts?.where?.is_completed || p.is_completed === opts.where.is_completed),
        ),
      ),
      create: vi.fn((data) => data),
      save: vi.fn(async (p) => {
        const id = p.id || progressStore.length + 1;
        const saved = { ...p, id };
        const idx = progressStore.findIndex((item) => item.id === id);
        if (idx !== -1) progressStore[idx] = saved;
        else progressStore.push(saved);
        return saved;
      }),
    };

    noteRepo = {
      find: vi.fn(async (opts: any) =>
        noteStore.filter(
          (n) => n.lesson_id === opts?.where?.lesson_id && n.user_id === opts?.where?.user_id,
        ),
      ),
      findOne: vi.fn(async (opts: any) =>
        noteStore.find(
          (n) => n.id === opts?.where?.id && n.user_id === opts?.where?.user_id,
        ) || null,
      ),
      create: vi.fn((data) => data),
      save: vi.fn(async (n) => {
        const id = n.id || noteStore.length + 1;
        const saved = { ...n, id };
        const idx = noteStore.findIndex((item) => item.id === id);
        if (idx !== -1) noteStore[idx] = saved;
        else noteStore.push(saved);
        return saved;
      }),
      delete: vi.fn(async (id: number) => {
        const idx = noteStore.findIndex((n) => n.id === id);
        if (idx !== -1) noteStore.splice(idx, 1);
        return { affected: 1 };
      }),
    };

    attachmentRepo = {
      find: vi.fn(async (opts: any) =>
        attachmentStore.filter((a) => a.lesson_id === opts?.where?.lesson_id),
      ),
    };

    questionRepo = {
      find: vi.fn(async (opts: any) =>
        questionStore.filter((q) => q.lesson_id === opts?.where?.lesson_id),
      ),
    };

    attemptRepo = {
      create: vi.fn((data) => data),
      save: vi.fn(async (a) => {
        const id = a.attempt_id || attemptStore.length + 1;
        const saved = { ...a, attempt_id: id };
        attemptStore.push(saved);
        return saved;
      }),
    };

    enrollmentRepo = {
      find: vi.fn(async (opts: any) =>
        enrollmentStore
          .filter(
            (e) =>
              e.student_id === opts?.where?.student_id &&
              (!opts?.where?.status || e.status === opts.where.status),
          )
          .map((e) => ({
            ...e,
            course: courseStore.find((c) => c.course_id === e.course_id),
          })),
      ),
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

    courseRepo = {
      findOne: vi.fn(async (opts: any) =>
        courseStore.find((c) => c.course_id === opts?.where?.course_id) || null,
      ),
    };

    lessonRepo = {
      findOne: vi.fn(async (opts: any) =>
        lessonStore.find((l) => l.lesson_id === opts?.where?.lesson_id) || null,
      ),
      find: vi.fn(async (opts: any) =>
        lessonStore.filter((l) => l.module_id === opts?.where?.module_id),
      ),
    };

    moduleRepo = {
      find: vi.fn(async (opts: any) =>
        moduleStore.filter((m) => m.course_id === opts?.where?.course_id),
      ),
    };

    service = new LearningService(
      progressRepo,
      noteRepo,
      attachmentRepo,
      questionRepo,
      attemptRepo,
      enrollmentRepo,
      courseRepo,
      lessonRepo,
      moduleRepo,
    );
  });

  // ================= UT13: Khóa học của tôi =================
  describe('UT13: Khóa học của tôi (US13)', () => {
    it('trả về danh sách khóa học đang theo học của học viên', async () => {
      enrollmentStore.push({
        enrollment_id: 1,
        student_id: 3,
        course_id: 1,
        progress_percent: 25,
        status: EnrollmentStatus.ACTIVE,
      });

      const myCourses = await service.getMyCourses(3);
      expect(myCourses).toHaveLength(1);
      expect(myCourses[0].course_id).toBe(1);
      expect(myCourses[0].progress_percent).toBe(25);
    });
  });

  // ================= UT14: Phòng học & Quyền truy cập =================
  describe('UT14: Kiểm soát quyền vào phòng học (US14)', () => {
    it('cho phép khách truy cập xem bài học thử is_preview = true', async () => {
      const room = await service.getLessonRoom(1, 1, 999, []);
      expect(room.lesson.lesson_id).toBe(1);
      expect(room.lesson.is_preview).toBe(true);
    });

    it('từ chối người chưa mua truy cập bài học không được preview (ForbiddenException)', async () => {
      await expect(service.getLessonRoom(1, 2, 999, [])).rejects.toThrow(ForbiddenException);
    });

    it('cho phép học viên đã đăng ký vào bài học chuyên sâu', async () => {
      enrollmentStore.push({
        enrollment_id: 1,
        student_id: 3,
        course_id: 1,
        status: EnrollmentStatus.ACTIVE,
      });

      const room = await service.getLessonRoom(1, 2, 3, ['Student']);
      expect(room.has_access).toBe(true);
      expect(room.lesson.lesson_id).toBe(2);
    });
  });

  // ================= UT15: Thuật toán Interval Union & Tiến độ >= 90% =================
  describe('UT15: Thuật toán Interval Union & Tiến độ học tập (US15, FIX06)', () => {
    it('hợp nhất chính xác các khoảng thời gian chồng chéo (Interval Union)', () => {
      const input: [number, number][] = [
        [0, 60],
        [50, 120],
        [150, 200],
      ];
      const merged = mergeIntervals(input);
      expect(merged).toEqual([
        [0, 120],
        [150, 200],
      ]);
      expect(calculateTotalWatchedSeconds(merged)).toBe(170); // 120 + 50 = 170s
    });

    it('tua thẳng về cuối video không được tính là hoàn thành (không bị lừa tiến độ)', async () => {
      enrollmentStore.push({
        enrollment_id: 1,
        student_id: 3,
        course_id: 1,
        status: EnrollmentStatus.ACTIVE,
      });

      // Người học tua thẳng từ 0 đến 295 rồi xem 5 giây
      const progress = await service.updateProgress(1, 2, 3, {
        resume_position_seconds: 300,
        watched_interval: [295, 300], // Chỉ xem 5s trên video 300s
        duration_seconds: 300,
      });

      expect(progress.is_completed).toBe(false);
      expect(progress.completion_percent).toBe(2); // 5s / 300s = 1.6% ~ 2%
    });

    it('xem đạt từ 90% thời lượng trở lên được đánh dấu is_completed = true', async () => {
      enrollmentStore.push({
        enrollment_id: 1,
        student_id: 3,
        course_id: 1,
        status: EnrollmentStatus.ACTIVE,
      });

      // Xem từ 0 đến 275s (275 / 300 = 91.6% >= 90%)
      const progress = await service.updateProgress(1, 2, 3, {
        resume_position_seconds: 275,
        watched_interval: [0, 275],
        duration_seconds: 300,
      });

      expect(progress.completion_percent).toBe(92);
      expect(progress.is_completed).toBe(true);
    });
  });

  // ================= UT16: Ghi chú theo mốc thời gian =================
  describe('UT16: Ghi chú bài học (US16)', () => {
    it('tạo ghi chú bài học có mốc thời gian thành công', async () => {
      const note = await service.createNote(2, 3, {
        timestamp_seconds: 125,
        content: 'Chỗ này giảng về useEffect rất hay',
      });
      expect(note.timestamp_seconds).toBe(125);
      expect(note.content).toBe('Chỗ này giảng về useEffect rất hay');
    });

    it('xóa ghi chú thành công', async () => {
      const note = await service.createNote(2, 3, {
        timestamp_seconds: 50,
        content: 'Ghi chú cần xóa',
      });
      const res = await service.deleteNote(note.id, 3);
      expect(res.success).toBe(true);
      expect(noteStore).toHaveLength(0);
    });
  });

  // ================= UT19: Quiz trắc nghiệm chuẩn 0-100 =================
  describe('UT19: Quiz trắc nghiệm bảo mật & Chấm điểm Server (US19)', () => {
    it('lấy đề thi trắc nghiệm học viên KHÔNG thấy đáp án đúng trước khi nộp', async () => {
      const quiz = await service.getQuizForStudent(2);
      expect(quiz).toHaveLength(2);
      expect(quiz[0]).not.toHaveProperty('correct_answer_index');
      expect(quiz[0]).not.toHaveProperty('explanation');
      expect(quiz[0].options).toHaveLength(4);
    });

    it('chấm điểm server chuẩn thang điểm 0-100 và đánh giá đạt >= 80%', async () => {
      // Đúng cả 2 câu: câu 1 chọn index 0, câu 2 chọn index 2
      const res = await service.submitQuiz(2, 3, {
        answers: { '1': 0, '2': 2 },
      });

      expect(res.score).toBe(100);
      expect(res.is_passed).toBe(true);
      expect(res.detailed_results[0].is_correct).toBe(true);
      expect(res.detailed_results[1].is_correct).toBe(true);
    });

    it('chấm điểm đúng 1/2 câu đạt 50 điểm và đánh giá chưa đạt (is_passed = false)', async () => {
      // Đúng câu 1 (index 0), sai câu 2 (chọn index 1 thay vì index 2)
      const res = await service.submitQuiz(2, 3, {
        answers: { '1': 0, '2': 1 },
      });

      expect(res.score).toBe(50);
      expect(res.is_passed).toBe(false);
      expect(res.detailed_results[1].is_correct).toBe(false);
    });
  });
});
