import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import { CourseModule } from '../course-module/course-module.entity.js';

export enum LessonContentType {
  VIDEO = 'Video',
  ARTICLE = 'Article',
  QUIZ = 'Quiz',
  DOCUMENT = 'Document',
}

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  lesson_id: number;

  @Column()
  module_id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'enum', enum: LessonContentType })
  content_type: LessonContentType;

  @Column({ length: 500, nullable: true })
  content_url: string;

  @Column({ default: 0 })
  duration_seconds: number;

  @Column({ default: false })
  is_preview: boolean;

  @Column({ default: 1 })
  order_index: number;

  @ManyToOne(() => CourseModule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module: Relation<CourseModule>;
}