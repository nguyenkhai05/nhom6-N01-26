import { IsArray, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProgressDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  resume_position_seconds: number;

  @IsOptional()
  @IsArray()
  watched_interval?: [number, number];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  duration_seconds?: number;
}
