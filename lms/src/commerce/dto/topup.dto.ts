import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
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
  auto_confirm?: boolean;
}

export class ConfirmTopupDto {
  @IsEnum(TopupStatus, { message: 'Trạng thái duyệt nạp tiền không hợp lệ' })
  status: TopupStatus;

  @IsOptional()
  @IsString()
  admin_note?: string;
}
