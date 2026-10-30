import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import type { Project } from './project.entity.js';
import type { User } from '../../user/user.entity.js';

@Entity('project_submissions')
export class ProjectSubmission {
  @PrimaryGeneratedColumn()
  submission_id: number;

  @Column()
  project_id: number;

  @Column()
  user_id: number;

  @Column({ length: 500, nullable: true })
  repo_url: string;

  @Column({ length: 500, nullable: true })
  demo_url: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'simple-json', nullable: true })
  completed_milestones: string[];

  @Column({ length: 50, default: 'DRAFT' })
  status: 'DRAFT' | 'SUBMITTED' | 'CHANGES_REQUESTED' | 'ACCEPTED';

  @Column({ type: 'int', nullable: true })
  grade_score: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ default: false })
  is_public: boolean;

  @ManyToOne('Project', { eager: true })
  @JoinColumn({ name: 'project_id' })
  project: Relation<Project>;

  @ManyToOne('User', { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
