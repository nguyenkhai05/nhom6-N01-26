import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { RefundStatus } from '../entities/refund-request.entity.js';

export class CreateRefundDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  order_id: number;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng cung cấp lý do hoàn tiền' })
  reason: string;
}

export class ReviewRefundDto {
  @IsEnum(RefundStatus, { message: 'Trạng thái xử lý hoàn tiền không hợp lệ' })
  status: RefundStatus;

  @IsOptional()
  @IsString()
  admin_comment?: string;
}
