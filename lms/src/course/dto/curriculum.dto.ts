import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { LessonContentType } from '../../lesson/lesson.entity.js';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên chương học không được để trống' })
  title: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  order_index?: number;
}

export class UpdateModuleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Tên chương học không được để trống' })
  title?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  order_index?: number;
}

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề bài học không được để trống' })
  title: string;

  @IsEnum(LessonContentType, { message: 'Loại bài học phải là Video, Article, Quiz hoặc Document' })
  content_type: LessonContentType;

  @IsOptional()
  @IsString()
  content_url?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  duration_seconds?: number;

  @IsOptional()
  @IsBoolean()
  is_preview?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  order_index?: number;
}

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề bài học không được để trống' })
  title?: string;

  @IsOptional()
  @IsEnum(LessonContentType)
  content_type?: LessonContentType;

  @IsOptional()
  @IsString()
  content_url?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  duration_seconds?: number;

  @IsOptional()
  @IsBoolean()
  is_preview?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  order_index?: number;
}

export class ReorderItemDto {
  @Type(() => Number)
  @IsInt()
  id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  order_index: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parent_id?: number; // Ví dụ module_id cho bài học khi đổi chương
}

export class ReorderCurriculumDto {
  @IsOptional()
  modules?: ReorderItemDto[];

  @IsOptional()
  lessons?: ReorderItemDto[];
}
