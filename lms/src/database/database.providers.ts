// lms/src/database/database.providers.ts
import { DataSource } from 'typeorm';
import { User } from '../user/user.entity';
import { Course } from '../course/course.entity';
import { Category } from '../category/category.entity';
import { CourseModule } from '../course-module/course-module.entity';
import { Enrollment } from '../enrollment/enrollment.entity';
import { Student } from '../student/student.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'your_password', // Thay bằng mật khẩu MySQL của bạn
        database: 'lms_db',
        entities: [User, Course, Category, CourseModule, Enrollment, Student],
        synchronize: true,
      });
      return dataSource.initialize();
    },
  },
];