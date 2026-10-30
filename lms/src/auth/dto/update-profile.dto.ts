import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Họ tên không được vượt quá 100 ký tự' })
  full_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Đường dẫn avatar không được vượt quá 500 ký tự' })
  avatar_url?: string;
}
