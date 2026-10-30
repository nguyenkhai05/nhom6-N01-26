import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CheckoutDto {
  @IsOptional()
  @IsString()
  voucher_code?: string;

  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  course_ids?: number[];
}
