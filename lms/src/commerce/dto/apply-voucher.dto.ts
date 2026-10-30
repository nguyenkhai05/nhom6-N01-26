import { IsOptional, IsString } from 'class-validator';

export class ApplyVoucherDto {
  @IsOptional()
  @IsString()
  code?: string;
}
