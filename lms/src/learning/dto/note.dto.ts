import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNoteDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  timestamp_seconds: number;

  @IsString()
  @IsNotEmpty({ message: 'Nội dung ghi chú không được để trống' })
  content: string;
}

export class UpdateNoteDto {
  @IsString()
  @IsNotEmpty({ message: 'Nội dung ghi chú không được để trống' })
  content: string;
}
