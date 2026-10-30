import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class UpdateUserRolesDto {
  @IsArray({ message: 'Danh sách vai trò phải là mảng' })
  @ArrayNotEmpty({ message: 'Danh sách vai trò không được để trống' })
  @IsString({ each: true, message: 'Tên vai trò phải là chuỗi' })
  roles: string[];
}
