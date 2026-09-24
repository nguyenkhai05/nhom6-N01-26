import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Category } from '../category/category.entity.js';
import { User } from '../user/user.entity.js';
import { CourseModule as ModuleEntity } from '../course-module/course-module.entity.js';
import { Enrollment } from '../enrollment/enrollment.entity.js';

export enum CourseStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  course_id: number;

  @Column()
  instructor_id: number;

  @Column({ nullable: true })
  category_id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 500, nullable: true })
  thumbnail_url: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  price: number;

  @Column({ type: 'enum', enum: CourseStatus, default: CourseStatus.DRAFT })
  status: CourseStatus;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.coursesTaught, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instructor_id' })
  instructor: User;

  @ManyToOne(() => Category, (category) => category.courses, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ModuleEntity, (m) => m.course)
  modules: ModuleEntity[];

  @OneToMany(() => Enrollment, (e) => e.course)
  enrollments: Enrollment[];
}