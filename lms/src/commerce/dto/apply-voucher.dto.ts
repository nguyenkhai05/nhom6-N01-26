import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyVoucherDto {
  @IsString()
  @IsNotEmpty({ message: 'Mã voucher không được để trống' })
  code: string;
}
