import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import { Lesson } from '../../lesson/lesson.entity.js';

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn()
  question_id: number;

  @Column()
  lesson_id: number;

  @Column({ type: 'text' })
  question_text: string;

  // JSON array string chứa danh sách các lựa chọn (e.g. ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"])
  @Column({ type: 'text' })
  options: string;

  @Column({ default: 0 })
  correct_answer_index: number;

  @Column({ default: 10 })
  points: number;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Relation<Lesson>;
}
