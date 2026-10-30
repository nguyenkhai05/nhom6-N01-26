import { IsBoolean } from 'class-validator';

export class UpdateUserStatusDto {
  @IsBoolean({ message: 'Trạng thái is_active phải là boolean' })
  is_active: boolean;
}
