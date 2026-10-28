import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'category_name không được để trống' })
  @MaxLength(100)
  category_name: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  parent_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order_index?: number;
}