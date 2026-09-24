import { Controller, Get } from '@nestjs/common';
import { StudentService } from './student.service.js';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  getStudents() {
    return this.studentService.getStudents();
  }
}
import { Module } from '@nestjs/common';

@Module({})
export class DatabaseModule {}