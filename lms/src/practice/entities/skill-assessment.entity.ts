import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('skill_assessments')
export class SkillAssessment {
  @PrimaryGeneratedColumn()
  assessment_id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 100 })
  topic: string; // React, TypeScript, SQL, NestJS

  @Column({ type: 'int', default: 15 })
  duration_minutes: number;

  @Column({ type: 'simple-json' })
  questions: {
    question_id: number;
    skill_category: string;
    question_text: string;
    options: string[];
    correct_answer_index: number;
    explanation: string;
  }[];

  @CreateDateColumn()
  created_at: Date;
}
