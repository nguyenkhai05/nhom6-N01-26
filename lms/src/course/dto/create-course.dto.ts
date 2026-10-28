import { Type } from 'class-transformer';
import {
  IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, Min,
} from 'class-validator';
import { CourseLevel, CourseStatus } from '../course.entity.js';

export class CreateCourseDto {
  // Giảng viên: bỏ qua (hệ thống lấy từ token). Admin: bắt buộc truyền.
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'instructor_id phải là số nguyên' })
  @Min(1)
  instructor_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  category_id?: number;

  @IsString()
  @IsNotEmpty({ message: 'title không được để trống' })
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug chỉ gồm chữ thường, số và dấu gạch ngang (vd: khoa-hoc-react)',
  })
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  thumbnail_url?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'price không được âm' })
  price?: number;

  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;
}