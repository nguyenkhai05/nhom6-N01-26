import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { courseProviders } from './course.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [CourseController],
  providers: [...courseProviders, CourseService],
  exports: [CourseService],
})
export class CourseModule {}