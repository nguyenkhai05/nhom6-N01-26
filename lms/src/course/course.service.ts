import {
  BadRequestException, ConflictException, Inject, Injectable, NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Course, CourseStatus } from './course.entity.js';
import { User } from '../user/user.entity.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';

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

  // Chi tiết công khai: khóa nháp/lưu trữ coi như không tồn tại
  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { course_id: id, status: CourseStatus.PUBLISHED },
      relations: { category: true, instructor: true, modules: true },
    });
    if (!course) throw new NotFoundException('Không tìm thấy khóa học');
    return this.toPublic(course);
  }

  async create(data: CreateCourseDto): Promise<Course> {
    try {
      const course = this.courseRepository.create(data);
      return await this.courseRepository.save(course);
    } catch (err) {
      throw this.mapDbError(err);
    }
  }

  async update(id: number, data: UpdateCourseDto): Promise<Course> {
    await this.findByIdOrFail(id); // 404 nếu không tồn tại (kể cả khóa nháp)
    try {
      await this.courseRepository.update(id, data);
    } catch (err) {
      throw this.mapDbError(err);
    }
    return this.toPublic(await this.findByIdOrFail(id));
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Không tìm thấy khóa học');
    return { deleted: true };
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

  // Chỉ giữ thông tin công khai của giảng viên, không lộ email/password_hash
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