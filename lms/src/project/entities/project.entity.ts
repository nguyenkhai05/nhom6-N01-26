import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  project_id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ length: 100 })
  category: string;

  @Column({ length: 50, default: 'Intermediate' })
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';

  @Column({ type: 'text' })
  brief: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ type: 'simple-json', nullable: true })
  milestones: string[];

  @Column({ type: 'simple-json', nullable: true })
  rubric: { criterion: string; weight_percent: number; description: string }[];

  @Column({ length: 500, nullable: true })
  thumbnail_url: string;

  @Column({ default: true })
  is_published: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
