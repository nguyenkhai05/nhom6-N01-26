import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class RecommendationRequestDto {
  @IsOptional()
  @IsString()
  goal?: 'FRONTEND' | 'BACKEND' | 'AI' | 'FOUNDATION' | string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  knownSkills?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetMaxVnd?: number;

  @IsOptional()
  @IsEnum(['STRICT', 'FLEXIBLE', 'UNKNOWN'])
  budgetMode?: 'STRICT' | 'FLEXIBLE' | 'UNKNOWN';

  @IsOptional()
  @IsNumber()
  @Min(0)
  hoursPerWeek?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;
}
