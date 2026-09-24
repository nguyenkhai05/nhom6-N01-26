import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Course } from './course.entity';

@Injectable()
export class CourseService {
  constructor(
    @Inject('COURSE_REPOSITORY')
    private courseRepository: Repository<Course>,
  ) {}

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  async findOne(id: any): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async create(data: Partial<Course>): Promise<Course> {
    const course = this.courseRepository.create(data);
    return this.courseRepository.save(course);
  }

  async update(id: any, data: Partial<Course>): Promise<Course> {
    await this.courseRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: any): Promise<{ deleted: boolean }> {
    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Course not found');
    return { deleted: true };
  }
}