import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PracticeService } from './practice.service.js';

@Controller('practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  // Danh mục bài luyện tập
  @Get('exercises')
  getExercises(@Query() query: { skill?: string; difficulty?: string; q?: string }) {
    return this.practiceService.getExercises(query);
  }

  // Chi tiết bài luyện
  @Get('exercises/:id')
  getExercise(@Param('id', ParseIntPipe) id: number) {
    return this.practiceService.getExercise(id);
  }

  // Danh sách các bài kiểm tra năng lực
  @Get('assessments')
  getAssessments() {
    return this.practiceService.getAssessments();
  }

  // Lấy đề kiểm tra năng lực (ẩn đáp án)
  @Get('assessments/:id')
  getAssessment(@Param('id', ParseIntPipe) id: number) {
    return this.practiceService.getAssessment(id);
  }

  // Nộp bài kiểm tra năng lực và chấm điểm tại server
  @Post('assessments/:id/submit')
  submitAssessment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { answers: { question_id: number; selected_index: number }[] },
  ) {
    return this.practiceService.submitAssessment(id, body.answers || []);
  }

  // Thử thách tuần và bảng xếp hạng
  @Get('challenges/weekly')
  getWeeklyChallenge() {
    return this.practiceService.getWeeklyChallenge();
  }
}
