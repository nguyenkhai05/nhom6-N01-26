import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { LessonProgress } from './entities/lesson-progress.entity.js';
import { LessonNote } from './entities/lesson-note.entity.js';
import { LessonAttachment } from './entities/lesson-attachment.entity.js';
import { QuizQuestion } from './entities/quiz-question.entity.js';
import { QuizAttempt } from './entities/quiz-attempt.entity.js';
import { Enrollment, EnrollmentStatus } from '../enrollment/enrollment.entity.js';
import { Course } from '../course/course.entity.js';
import { Lesson } from '../lesson/lesson.entity.js';
import { CourseModule } from '../course-module/course-module.entity.js';
import { UpdateProgressDto } from './dto/update-progress.dto.js';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto.js';
import { SubmitQuizDto } from './dto/quiz.dto.js';

export function mergeIntervals(intervals: [number, number][]): [number, number][] {
  if (!intervals || intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const prev = merged[merged.length - 1];

    if (current[0] <= prev[1] + 1) {
      prev[1] = Math.max(prev[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}

export function calculateTotalWatchedSeconds(intervals: [number, number][]): number {
  if (!intervals) return 0;
  return intervals.reduce((sum, [start, end]) => sum + Math.max(0, end - start), 0);
}

@Injectable()
export class LearningService {
  constructor(
    @Inject('LESSON_PROGRESS_REPOSITORY')
    private readonly progressRepo: Repository<LessonProgress>,
    @Inject('LESSON_NOTE_REPOSITORY')
    private readonly noteRepo: Repository<LessonNote>,
    @Inject('LESSON_ATTACHMENT_REPOSITORY')
    private readonly attachmentRepo: Repository<LessonAttachment>,
    @Inject('QUIZ_QUESTION_REPOSITORY')
    private readonly quizQuestionRepo: Repository<QuizQuestion>,
    @Inject('QUIZ_ATTEMPT_REPOSITORY')
    private readonly quizAttemptRepo: Repository<QuizAttempt>,
    @Inject('ENROLLMENT_REPOSITORY')
    private readonly enrollmentRepo: Repository<Enrollment>,
    @Inject('COURSE_REPOSITORY')
    private readonly courseRepo: Repository<Course>,
    @Inject('LESSON_REPOSITORY')
    private readonly lessonRepo: Repository<Lesson>,
    @Inject('COURSE_MODULE_REPOSITORY')
    private readonly moduleRepo: Repository<CourseModule>,
  ) {}

  // ================= US13: KHÓA HỌC CỦA TÔI =================

  async getMyCourses(userId: number) {
    const enrollments = await this.enrollmentRepo.find({
      where: { student_id: userId, status: EnrollmentStatus.ACTIVE },
      relations: { course: true },
    });

    return enrollments.map((e) => ({
      enrollment_id: e.enrollment_id,
      course_id: e.course_id,
      enrolled_at: e.enrolled_at,
      progress_percent: Number(e.progress_percent) || 0,
      course: e.course,
    }));
  }

  // ================= US14 & US15: PHÒNG HỌC & TIẾN ĐỘ =================

  async getLessonRoom(courseId: number, lessonId: number, userId: number, roles: string[] = []) {
    const course = await this.courseRepo.findOne({ where: { course_id: courseId } });
    if (!course) throw new NotFoundException('Không tìm thấy khóa học');

    const lesson = await this.lessonRepo.findOne({ where: { lesson_id: lessonId } });
    if (!lesson) throw new NotFoundException('Không tìm thấy bài học');

    const isPlatformAdmin = roles.includes('Admin');
    const isCourseInstructor = course.instructor_id === userId;

    const enrollment = await this.enrollmentRepo.findOne({
      where: { student_id: userId, course_id: courseId, status: EnrollmentStatus.ACTIVE },
    });

    if (!enrollment && !isPlatformAdmin && !isCourseInstructor) {
      if (!lesson.is_preview) {
        throw new ForbiddenException('Bạn chưa đăng ký khóa học này để truy cập bài học');
      }
    }

    // Lấy tiến độ đã lưu
    const progress = await this.progressRepo.findOne({
      where: { user_id: userId, lesson_id: lessonId },
    });

    // Lấy ghi chú của học viên
    const notes = await this.noteRepo.find({
      where: { user_id: userId, lesson_id: lessonId },
      order: { timestamp_seconds: 'ASC' },
    });

    // Lấy tài liệu đính kèm
    const attachments = await this.attachmentRepo.find({
      where: { lesson_id: lessonId },
    });

    return {
      course: {
        course_id: course.course_id,
        title: course.title,
        thumbnail_url: course.thumbnail_url,
      },
      lesson,
      progress: progress || {
        resume_position_seconds: 0,
        watched_intervals: '[]',
        completion_percent: 0,
        is_completed: false,
      },
      notes,
      attachments,
      has_access: Boolean(enrollment || isPlatformAdmin || isCourseInstructor),
    };
  }

  async updateProgress(courseId: number, lessonId: number, userId: number, dto: UpdateProgressDto) {
    let progress = await this.progressRepo.findOne({
      where: { user_id: userId, lesson_id: lessonId },
    });

    const lesson = await this.lessonRepo.findOne({ where: { lesson_id: lessonId } });
    const duration = dto.duration_seconds || lesson?.duration_seconds || 300;

    let intervals: [number, number][] = [];
    if (progress && progress.watched_intervals) {
      try {
        intervals = JSON.parse(progress.watched_intervals);
      } catch {
        intervals = [];
      }
    }

    if (dto.watched_interval && dto.watched_interval.length === 2) {
      const [start, end] = dto.watched_interval;
      if (end > start) {
        const clampedStart = Math.max(0, Math.min(start, duration));
        const clampedEnd = Math.max(clampedStart, Math.min(end, duration));
        intervals.push([clampedStart, clampedEnd]);
        intervals = mergeIntervals(intervals);
      }
    }

    const totalWatchedSeconds = calculateTotalWatchedSeconds(intervals);
    const completionPercent = duration > 0 ? Math.min(100, Math.round((totalWatchedSeconds / duration) * 100)) : 0;
    const isCompleted = completionPercent >= 90;

    if (!progress) {
      progress = this.progressRepo.create({
        user_id: userId,
        course_id: courseId,
        lesson_id: lessonId,
        resume_position_seconds: dto.resume_position_seconds,
        watched_intervals: JSON.stringify(intervals),
        duration_seconds: duration,
        completion_percent: completionPercent,
        is_completed: isCompleted,
      });
    } else {
      progress.resume_position_seconds = dto.resume_position_seconds;
      progress.watched_intervals = JSON.stringify(intervals);
      progress.duration_seconds = duration;
      progress.completion_percent = completionPercent;
      if (isCompleted) {
        progress.is_completed = true;
      }
    }

    const savedProgress = await this.progressRepo.save(progress);

    // Tính lại tiến độ toàn khóa học trong bảng enrollment
    await this.recalculateCourseProgress(userId, courseId);

    return savedProgress;
  }

  private async recalculateCourseProgress(userId: number, courseId: number) {
    const modules = await this.moduleRepo.find({ where: { course_id: courseId } });
    if (!modules || modules.length === 0) return;

    let totalLessonsCount = 0;
    for (const mod of modules) {
      const lessons = await this.lessonRepo.find({ where: { module_id: mod.module_id } });
      totalLessonsCount += lessons.length;
    }

    if (totalLessonsCount === 0) return;

    const completedProgresses = await this.progressRepo.find({
      where: { user_id: userId, course_id: courseId, is_completed: true },
    });

    const completedCount = completedProgresses.length;
    const coursePercent = Math.min(100, Math.round((completedCount / totalLessonsCount) * 100));

    const enrollment = await this.enrollmentRepo.findOne({
      where: { student_id: userId, course_id: courseId, status: EnrollmentStatus.ACTIVE },
    });

    if (enrollment) {
      enrollment.progress_percent = coursePercent;
      if (coursePercent === 100) {
        enrollment.status = EnrollmentStatus.COMPLETED;
      }
      await this.enrollmentRepo.save(enrollment);
    }
  }

  // ================= US16: GHI CHÚ BÀI HỌC =================

  async getNotes(lessonId: number, userId: number) {
    return this.noteRepo.find({
      where: { lesson_id: lessonId, user_id: userId },
      order: { timestamp_seconds: 'ASC' },
    });
  }

  async createNote(lessonId: number, userId: number, dto: CreateNoteDto) {
    const note = this.noteRepo.create({
      lesson_id: lessonId,
      user_id: userId,
      timestamp_seconds: dto.timestamp_seconds,
      content: dto.content,
    });
    return this.noteRepo.save(note);
  }

  async updateNote(noteId: number, userId: number, dto: UpdateNoteDto) {
    const note = await this.noteRepo.findOne({ where: { id: noteId, user_id: userId } });
    if (!note) throw new NotFoundException('Không tìm thấy ghi chú');
    note.content = dto.content;
    return this.noteRepo.save(note);
  }

  async deleteNote(noteId: number, userId: number) {
    const note = await this.noteRepo.findOne({ where: { id: noteId, user_id: userId } });
    if (!note) throw new NotFoundException('Không tìm thấy ghi chú');
    await this.noteRepo.delete(noteId);
    return { success: true, message: 'Đã xóa ghi chú' };
  }

  // ================= US17: TÀI LIỆU ĐÍNH KÈM =================

  async getAttachments(lessonId: number, _userId: number) {
    const lesson = await this.lessonRepo.findOne({ where: { lesson_id: lessonId } });
    if (!lesson) throw new NotFoundException('Không tìm thấy bài học');

    return this.attachmentRepo.find({ where: { lesson_id: lessonId } });
  }

  // ================= US19: QUIZ ĐÁNH GIÁ (0-100 ĐIỂM) =================

  async getQuizForStudent(lessonId: number) {
    const questions = await this.quizQuestionRepo.find({ where: { lesson_id: lessonId } });
    // US19 An toàn: Ẩn correct_answer_index và explanation trước khi nộp bài
    return questions.map((q) => {
      let optionsList = [];
      try {
        optionsList = JSON.parse(q.options);
      } catch {
        optionsList = [];
      }
      return {
        question_id: q.question_id,
        lesson_id: q.lesson_id,
        question_text: q.question_text,
        options: optionsList,
        points: q.points,
      };
    });
  }

  async submitQuiz(lessonId: number, userId: number, dto: SubmitQuizDto) {
    const questions = await this.quizQuestionRepo.find({ where: { lesson_id: lessonId } });
    if (!questions || questions.length === 0) {
      throw new BadRequestException('Bài học này chưa có câu hỏi trắc nghiệm');
    }

    let earnedPoints = 0;
    let totalPoints = 0;
    const details: any[] = [];

    for (const q of questions) {
      const chosenIndex = dto.answers[q.question_id];
      const isCorrect = Number(chosenIndex) === q.correct_answer_index;
      totalPoints += q.points;
      if (isCorrect) {
        earnedPoints += q.points;
      }

      let parsedOptions: string[] = [];
      try {
        parsedOptions = JSON.parse(q.options);
      } catch {
        parsedOptions = [];
      }

      details.push({
        question_id: q.question_id,
        question_text: q.question_text,
        chosen_option_index: chosenIndex,
        correct_option_index: q.correct_answer_index,
        is_correct: isCorrect,
        explanation: q.explanation,
        options: parsedOptions,
      });
    }

    // Chuẩn hóa điểm số theo thang điểm 100
    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const isPassed = score >= 80;

    const attempt = this.quizAttemptRepo.create({
      user_id: userId,
      lesson_id: lessonId,
      score,
      max_score: 100,
      is_passed: isPassed,
      answers: JSON.stringify(dto.answers),
    });

    const savedAttempt = await this.quizAttemptRepo.save(attempt);

    return {
      attempt_id: savedAttempt.attempt_id,
      score,
      max_score: 100,
      is_passed: isPassed,
      earned_points: earnedPoints,
      total_points: totalPoints,
      detailed_results: details,
    };
  }
}
