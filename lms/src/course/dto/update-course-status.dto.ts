import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CourseStatus } from '../course.entity.js';

export class UpdateCourseStatusDto {
  @IsEnum(CourseStatus, { message: 'Trạng thái khóa học không hợp lệ' })
  status: CourseStatus;

  @IsOptional()
  @IsString()
  rejection_reason?: string;
}
