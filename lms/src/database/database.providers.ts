// lms/src/database/database.providers.ts
import { DataSource } from 'typeorm';
import { User } from '../user/user.entity.js';
import { Course } from '../course/course.entity.js';
import { Category } from '../category/category.entity.js';
import { CourseModule } from '../course-module/course-module.entity.js';
import { Enrollment } from '../enrollment/enrollment.entity.js';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 3306),
        username: process.env.DB_USERNAME ?? 'root',
        password: process.env.DB_PASSWORD ?? '',
        database: process.env.DB_DATABASE ?? 'lms_db',
        entities: [User, Course, Category, CourseModule, Enrollment],
        synchronize: true,
      });
      return dataSource.initialize();
    },
  },
];