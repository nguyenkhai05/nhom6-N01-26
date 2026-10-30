import { DataSource } from 'typeorm';
import { Course } from './course.entity.js';
import { CourseModule } from '../course-module/course-module.entity.js';
import { Lesson } from '../lesson/lesson.entity.js';

export const courseProviders = [
  {
    provide: 'COURSE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Course),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'COURSE_MODULE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CourseModule),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'LESSON_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Lesson),
    inject: ['DATA_SOURCE'],
  },
];
