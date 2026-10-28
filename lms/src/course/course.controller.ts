import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { JwtPayload } from '../auth/jwt.util.js';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // ----- Công khai: ai cũng xem được (chỉ khóa Published) -----
  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  // ----- Quản lý: Admin xem tất cả, Instructor xem khóa của mình (kể cả nháp) -----
  // Phải khai báo TRƯỚC ':id' để không bị nhầm
  @Get('manage/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Instructor')
  findManage(@CurrentUser() user: JwtPayload) {
    return this.courseService.findForManager(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findOne(id);
  }

  // ----- Thay đổi dữ liệu: cần đăng nhập + đúng vai trò -----
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Instructor')
  create(@Body() body: CreateCourseDto, @CurrentUser() user: JwtPayload) {
    return this.courseService.create(body, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Instructor')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCourseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.courseService.update(id, body, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Instructor')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.courseService.remove(id, user);
  }
}