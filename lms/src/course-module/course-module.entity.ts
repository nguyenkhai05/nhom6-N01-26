import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, type Relation } from 'typeorm';
import { Course } from '../course/course.entity.js';
import { Lesson } from '../lesson/lesson.entity.js';

@Entity('modules')
export class CourseModule {
  @PrimaryGeneratedColumn()
  module_id: number;

  @Column()
  course_id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ default: 1 })
  order_index: number;

  @ManyToOne(() => Course, (course) => course.modules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Relation<Course>;

  @OneToMany(() => Lesson, (lesson) => lesson.module)
  lessons: Relation<Lesson>[];
}
