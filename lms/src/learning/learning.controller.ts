import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { LearningService } from './learning.service.js';
import { UpdateProgressDto } from './dto/update-progress.dto.js';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto.js';
import { SubmitQuizDto } from './dto/quiz.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { JwtPayload } from '../auth/jwt.util.js';

@Controller('learning')
@UseGuards(JwtAuthGuard)
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  // ================= US13: KHÓA HỌC CỦA TÔI =================

  @Get('my-courses')
  getMyCourses(@CurrentUser() user: JwtPayload) {
    return this.learningService.getMyCourses(user.sub);
  }

  // ================= US14 & US15: PHÒNG HỌC & TIẾN ĐỘ =================

  @Get('courses/:courseId/lessons/:lessonId')
  getLessonRoom(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.learningService.getLessonRoom(courseId, lessonId, user.sub, user.roles);
  }

  @Put('courses/:courseId/lessons/:lessonId/progress')
  updateProgress(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() body: UpdateProgressDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.learningService.updateProgress(courseId, lessonId, user.sub, body);
  }

  // ================= US16: GHI CHÚ BÀI HỌC =================

  @Get('lessons/:lessonId/notes')
  getNotes(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.learningService.getNotes(lessonId, user.sub);
  }

  @Post('lessons/:lessonId/notes')
  createNote(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() body: CreateNoteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.learningService.createNote(lessonId, user.sub, body);
  }

  @Put('notes/:noteId')
  updateNote(
    @Param('noteId', ParseIntPipe) noteId: number,
    @Body() body: UpdateNoteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.learningService.updateNote(noteId, user.sub, body);
  }

  @Delete('notes/:noteId')
  deleteNote(
    @Param('noteId', ParseIntPipe) noteId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.learningService.deleteNote(noteId, user.sub);
  }

  // ================= US17: TÀI LIỆU ĐÍNH KÈM =================

  @Get('lessons/:lessonId/attachments')
  getAttachments(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.learningService.getAttachments(lessonId, user.sub);
  }

  // ================= US19: QUIZ ĐÁNH GIÁ =================

  @Get('lessons/:lessonId/quiz')
  getQuizQuestions(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.learningService.getQuizForStudent(lessonId);
  }

  @Post('lessons/:lessonId/quiz/submit')
  submitQuiz(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() body: SubmitQuizDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.learningService.submitQuiz(lessonId, user.sub, body);
  }
}
