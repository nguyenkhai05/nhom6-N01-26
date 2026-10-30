import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, type Relation } from 'typeorm';
import { Lesson } from '../../lesson/lesson.entity.js';

@Entity('lesson_attachments')
export class LessonAttachment {
  @PrimaryGeneratedColumn()
  attachment_id: number;

  @Column()
  lesson_id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 50, default: 'PDF' })
  file_type: string;

  @Column({ length: 500 })
  file_url: string;

  @Column({ default: 0 })
  file_size_bytes: number;

  @Column({ default: false })
  is_preview: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Relation<Lesson>;
}
