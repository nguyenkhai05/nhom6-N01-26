import { IsOptional, IsString } from 'class-validator';

export class CheckoutDto {
  @IsOptional()
  @IsString()
  voucher_code?: string;
}
