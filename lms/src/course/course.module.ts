import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { CourseController } from './course.controller.js';
import { CourseService } from './course.service.js';
import { courseProviders } from './course.provider.js';

@Module({
  imports: [DatabaseModule],
  controllers: [CourseController],
  providers: [...courseProviders, CourseService],
  exports: [CourseService],
})
export class CourseModule {}