import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống' })
  current_password: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải từ 8 ký tự trở lên' })
  @MaxLength(72)
  new_password: string;
}
