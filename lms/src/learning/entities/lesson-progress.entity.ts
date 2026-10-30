import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, UpdateDateColumn, type Relation } from 'typeorm';
import { User } from '../../user/user.entity.js';
import { Lesson } from '../../lesson/lesson.entity.js';
import { Course } from '../../course/course.entity.js';

@Entity('lesson_progress')
export class LessonProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  lesson_id: number;

  @Column()
  course_id: number;

  @Column({ default: 0 })
  resume_position_seconds: number;

  // Lưu trữ các khoảng thời gian đã xem thực tế dạng JSON: [[start1, end1], [start2, end2]]
  @Column({ type: 'text', default: '[]' })
  watched_intervals: string;

  @Column({ default: 0 })
  duration_seconds: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  completion_percent: number;

  @Column({ default: false })
  is_completed: boolean;

  @UpdateDateColumn()
  last_watched_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Relation<Lesson>;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Relation<Course>;
}
