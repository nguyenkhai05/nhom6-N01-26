import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  article_id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column({ unique: true, length: 255 })
  slug!: string;

  @Column({ type: 'text' })
  summary!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ length: 50, default: 'Frontend' })
  category!: string;

  @Column({ length: 100, default: 'Ban Chuyên Môn EduViet' })
  author_name!: string;

  @Column({ length: 255, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' })
  author_avatar!: string;

  @Column({ length: 50, default: '6 phút đọc' })
  read_time!: string;

  @Column({ type: 'int', default: 0 })
  views_count!: number;

  @Column({ type: 'int', default: 0 })
  likes_count!: number;

  @Column({ length: 500, nullable: true })
  thumbnail_url!: string;

  @Column({ type: 'int', nullable: true })
  related_course_id?: number;

  @Column({ length: 255, default: '[]' })
  tags!: string;

  @Column({ default: true })
  is_published!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
