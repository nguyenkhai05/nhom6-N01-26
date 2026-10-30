import { IsOptional, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsOptional()
  @IsString()
  id_token?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;
}
