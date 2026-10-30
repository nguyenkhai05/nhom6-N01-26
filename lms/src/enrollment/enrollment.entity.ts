import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, type Relation } from 'typeorm';
import { Course } from '../course/course.entity.js';
import { User } from '../user/user.entity.js';

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
}

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

  @Column({ type: 'enum', enum: EnrollmentStatus, default: EnrollmentStatus.ACTIVE })
  status: EnrollmentStatus;

  @ManyToOne(() => User, (u) => u.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Relation<User>;

  @ManyToOne(() => Course, (c) => c.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Relation<Course>;
}
