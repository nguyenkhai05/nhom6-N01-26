import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { JwtPayload } from '../auth/jwt.util.js';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  // Khu trưng bày sản phẩm học viên (Showcase công khai)
  @Get('showcase')
  getShowcase() {
    return this.projectService.getShowcase();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  // Lấy bài làm / workspace của học viên
  @Get(':id/my-submission')
  @UseGuards(JwtAuthGuard)
  getMySubmission(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.projectService.getMySubmission(id, user.sub);
  }

  // Lưu bản nháp hoặc nộp bài dự án
  @Post(':id/submissions')
  @UseGuards(JwtAuthGuard)
  saveSubmission(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
    @Body()
    body: {
      repo_url?: string;
      demo_url?: string;
      notes?: string;
      completed_milestones?: string[];
      is_submit?: boolean;
      is_public?: boolean;
    },
  ) {
    return this.projectService.saveSubmission(id, user.sub, body);
  }

  // Giảng viên / Quản trị viên chấm điểm bài nộp theo Rubric
  @Post('submissions/:id/grade')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Instructor', 'Admin')
  gradeSubmission(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      score: number;
      feedback: string;
      status: 'ACCEPTED' | 'CHANGES_REQUESTED';
    },
  ) {
    return this.projectService.gradeSubmission(id, body);
  }
}
