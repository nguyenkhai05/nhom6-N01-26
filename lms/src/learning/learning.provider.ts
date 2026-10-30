import { DataSource } from 'typeorm';
import { LessonProgress } from './entities/lesson-progress.entity.js';
import { LessonNote } from './entities/lesson-note.entity.js';
import { LessonAttachment } from './entities/lesson-attachment.entity.js';
import { QuizQuestion } from './entities/quiz-question.entity.js';
import { QuizAttempt } from './entities/quiz-attempt.entity.js';
import { Enrollment } from '../enrollment/enrollment.entity.js';
import { Course } from '../course/course.entity.js';
import { Lesson } from '../lesson/lesson.entity.js';
import { CourseModule } from '../course-module/course-module.entity.js';

export const learningProviders = [
  {
    provide: 'LESSON_PROGRESS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(LessonProgress),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'LESSON_NOTE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(LessonNote),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'LESSON_ATTACHMENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(LessonAttachment),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'QUIZ_QUESTION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(QuizQuestion),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'QUIZ_ATTEMPT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(QuizAttempt),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ENROLLMENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Enrollment),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'COURSE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Course),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'LESSON_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Lesson),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'COURSE_MODULE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CourseModule),
    inject: ['DATA_SOURCE'],
  },
];
