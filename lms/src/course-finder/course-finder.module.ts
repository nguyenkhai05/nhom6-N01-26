import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DatabaseModule } from '../database/database.module.js';
import { CourseFinderController } from './course-finder.controller.js';
import { CourseFinderService } from './course-finder.service.js';
import { Course } from '../course/course.entity.js';

@Module({
  imports: [DatabaseModule],
  controllers: [CourseFinderController],
  providers: [
    CourseFinderService,
    {
      provide: 'COURSE_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Course),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [CourseFinderService],
})
export class CourseFinderModule {}
