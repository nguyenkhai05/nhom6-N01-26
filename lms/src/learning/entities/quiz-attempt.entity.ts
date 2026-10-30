import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, type Relation } from 'typeorm';
import { User } from '../../user/user.entity.js';
import { Lesson } from '../../lesson/lesson.entity.js';

@Entity('quiz_attempts')
export class QuizAttempt {
  @PrimaryGeneratedColumn()
  attempt_id: number;

  @Column()
  user_id: number;

  @Column()
  lesson_id: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  score: number;

  @Column({ default: 100 })
  max_score: number;

  @Column({ default: false })
  is_passed: boolean;

  // JSON string ghi lại các câu trả lời của học viên
  @Column({ type: 'text' })
  answers: string;

  @CreateDateColumn()
  submitted_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Relation<Lesson>;
}
