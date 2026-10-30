import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TopupStatus } from '../entities/topup-request.entity.js';

export class CreateTopupDto {
  @Type(() => Number)
  @IsInt({ message: 'Số tiền nạp phải là số nguyên' })
  @Min(10000, { message: 'Số tiền nạp tối thiểu là 10.000 VNĐ' })
  amount: number;

  @IsOptional()
  @IsString()
  payment_method?: string = 'DEMO_BANK';

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsBoolean()
  auto_confirm?: boolean;
}

export class ConfirmTopupDto {
  @IsOptional()
  @IsEnum(TopupStatus, { message: 'Trạng thái duyệt nạp tiền không hợp lệ' })
  status?: TopupStatus;

  @IsOptional()
  @IsBoolean()
  approved?: boolean;

  @IsOptional()
  @IsString()
  admin_note?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
