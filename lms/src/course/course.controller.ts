import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { QueryCourseDto } from './dto/query-course.dto.js';
import {
  CreateLessonDto,
  CreateModuleDto,
  ReorderCurriculumDto,
  UpdateLessonDto,
  UpdateModuleDto,
} from './dto/curriculum.dto.js';
import { UpdateCourseStatusDto } from './dto/update-course-status.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { getJwtSecret, verifyToken, type JwtPayload } from '../auth/jwt.util.js';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // US05: Công khai: tìm kiếm, lọc, phân trang khóa học đã Published
  @Get()
  findAll(@Query() query: QueryCourseDto) {
    return this.courseService.findAll(query);
  }

  // Quản lý: Admin xem tất cả, Instructor xem khóa của mình
  @Get('manage/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Instructor')
  findManage(@CurrentUser() user: JwtPayload) {
    return this.courseService.findForManager(user);
  }

  // US27: Giảng viên xem danh sách các khóa học do chính mình giảng dạy
  @Get('instructor/my-courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Instructor')
  findInstructorCourses(@CurrentUser() user: JwtPayload) {
    return this.courseService.findForInstructor(user);
  }

  // US06: Chi tiết khóa học và bài học thử (hỗ trợ đọc token nếu có để mở khóa link bài giảng)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') authHeader?: string,
  ) {
    let currentUser: JwtPayload | undefined;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7);
        currentUser = verifyToken(token, getJwtSecret());
      } catch {
        // Token không hợp lệ thì coi như khách vãng lai
      }
    }
    return this.courseService.findOne(id, currentUser);
  }

  // US32: Quản trị viên duyệt / từ chối / gỡ khóa học
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCourseStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.courseService.updateStatus(id, body, user);
  }

  // ================= US28 & US29: CURRICULUM MANAGEMENT =================

  @Get(':id/curriculum')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Instructor')
  getCurriculum(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.courseService.getCurriculum(id, user);
  }

  @Post(':id/modules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Instructor')
  createModule(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateModuleDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.courseService.createModule(id, body, user);
  }

  @Put(':id/modules/:moduleId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Instructor')
  updateModule(
    @Param('id', ParseIntPipe) id: number,
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @Body() body: UpdateModuleDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.courseService.updateModule(id, moduleId, body, user);
  }

  @Delete(':id/modules/:moduleId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Instructor')
  deleteModule(
    @Param('id', ParseIntPipe) id: number,
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.courseService.deleteModule(id, moduleId, user);
  }

  @Post(':id/modules/:moduleId/lessons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Instructor')
  createLesson(
    @Param('id', ParseIntPipe) id: number,
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @Body() body: CreateLessonDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.courseService.createLesson(id, moduleId, body, user);
  }

  @Put(':id/modules/:moduleId/lessons/:lessonId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Instructor')
  updateLesson(
    @Param('id', ParseIntPipe) id: number,
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() body: UpdateLessonDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.courseService.updateLesson(id, moduleId, lessonId, body, user);
  }

  @Delete(':id/modules/:moduleId/lessons/:lessonId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Instructor')
  deleteLesson(
    @Param('id', ParseIntPipe) id: number,
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.courseService.deleteLesson(id, moduleId, lessonId, user);
  }

  @Put(':id/curriculum/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Instructor')
  reorderCurriculum(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ReorderCurriculumDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.courseService.reorderCurriculum(id, body, user);
  }

  // ================= COURSE CRUD =================

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
