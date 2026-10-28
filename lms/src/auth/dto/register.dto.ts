import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @MaxLength(100)
  full_name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(100)
  email: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải từ 8 ký tự trở lên' })
  @MaxLength(72)
  password: string;
}