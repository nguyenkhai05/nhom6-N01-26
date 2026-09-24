import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Course } from '../course/course.entity.js';
import { User } from '../user/user.entity.js';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  enrollment_id: number;

  @Column()
  student_id: number;

  @Column()
  course_id: number;

  @CreateDateColumn()
  enrolled_at: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  progress_percent: number;

  @ManyToOne(() => User, (u) => u.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => Course, (c) => c.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}