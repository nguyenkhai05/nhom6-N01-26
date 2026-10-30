import { IsNotEmpty, IsObject } from 'class-validator';

export class SubmitQuizDto {
  @IsObject()
  @IsNotEmpty({ message: 'Danh sách câu trả lời không được để trống' })
  answers: Record<string, number>;
}
