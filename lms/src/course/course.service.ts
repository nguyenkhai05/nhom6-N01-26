import {
  BadRequestException, ConflictException, ForbiddenException, Inject, Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Course, CourseStatus } from './course.entity.js';
import { User } from '../user/user.entity.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import type { JwtPayload } from '../auth/jwt.util.js';

@Injectable()
export class CourseService {
  constructor(
    @Inject('COURSE_REPOSITORY')
    private courseRepository: Repository<Course>,
  ) {}

  // Danh sách công khai: chỉ khóa học đã Published
  async findAll(): Promise<Course[]> {
    const courses = await this.courseRepository.find({
      where: { status: CourseStatus.PUBLISHED },
      relations: { category: true, instructor: true },
    });
    return courses.map((c) => this.toPublic(c));
  }

  // Danh sách quản lý: Admin thấy tất cả, Instructor chỉ thấy khóa của mình (mọi trạng thái)
  async findForManager(user: JwtPayload): Promise<Course[]> {
    const where: FindOptionsWhere<Course> = this.isAdmin(user) ? {} : { instructor_id: user.sub };
    const courses = await this.courseRepository.find({
      where,
      relations: { category: true, instructor: true },
    });
    return courses.map((c) => this.toPublic(c));
  }

  // Chi tiết công khai: khóa nháp/lưu trữ coi như không tồn tại
  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { course_id: id, status: CourseStatus.PUBLISHED },
      relations: { category: true, instructor: true, modules: true },
    });
    if (!course) throw new NotFoundException('Không tìm thấy khóa học');
    return this.toPublic(course);
  }

  async create(data: CreateCourseDto, user: JwtPayload): Promise<Course> {
    // Instructor luôn là chủ khóa học; chỉ Admin mới được chỉ định giảng viên khác
    const instructorId = this.isAdmin(user) ? data.instructor_id : user.sub;
    if (!instructorId) {
      throw new BadRequestException('Admin cần truyền instructor_id');
    }
    try {
      const course = this.courseRepository.create({ ...data, instructor_id: instructorId });
      return await this.courseRepository.save(course);
    } catch (err) {
      throw this.mapDbError(err);
    }
  }

  async update(id: number, data: UpdateCourseDto, user: JwtPayload): Promise<Course> {
    const course = await this.findByIdOrFail(id); // 404 nếu không tồn tại
    this.assertCanModify(course, user);

    // Chỉ Admin được đổi chủ khóa học
    const { instructor_id, ...rest } = data;
    const changes = this.isAdmin(user) ? data : rest;

    try {
      await this.courseRepository.update(id, changes);
    } catch (err) {
      throw this.mapDbError(err);
    }
    return this.toPublic(await this.findByIdOrFail(id));
  }

  async remove(id: number, user: JwtPayload): Promise<{ deleted: boolean }> {
    const course = await this.findByIdOrFail(id);
    this.assertCanModify(course, user);
    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Không tìm thấy khóa học');
    return { deleted: true };
  }

  private isAdmin(user: JwtPayload): boolean {
    return user.roles.includes('Admin');
  }

  // Admin sửa được mọi khóa; Instructor chỉ sửa/xóa khóa của chính mình
  private assertCanModify(course: Course, user: JwtPayload): void {
    if (!this.isAdmin(user) && course.instructor_id !== user.sub) {
      throw new ForbiddenException('Bạn chỉ được thao tác trên khóa học của mình');
    }
  }

  // Tìm theo id, không lọc trạng thái (dùng nội bộ cho sửa/xóa)
  private async findByIdOrFail(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { course_id: id },
      relations: { category: true, instructor: true },
    });
    if (!course) throw new NotFoundException('Không tìm thấy khóa học');
    return course;
  }

  // Chỉ giữ thông tin công khai của giảng viên, không lộ email
  private toPublic(course: Course): Course {
    if (course.instructor) {
      const { user_id, full_name, avatar_url } = course.instructor;
      course.instructor = { user_id, full_name, avatar_url } as User;
    }
    return course;
  }

  // Chuyển lỗi MySQL thành lỗi HTTP dễ hiểu
  private mapDbError(err: any) {
    const code = err?.driverError?.code ?? err?.code;
    if (code === 'ER_DUP_ENTRY') return new ConflictException('Slug đã tồn tại');
    if (code === 'ER_NO_REFERENCED_ROW_2') {
      return new BadRequestException('instructor_id hoặc category_id không tồn tại');
    }
    return err;
  }
}