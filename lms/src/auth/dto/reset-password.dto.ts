import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Mã token không được để trống' })
  token: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải từ 8 ký tự trở lên' })
  @MaxLength(72)
  new_password: string;
}
