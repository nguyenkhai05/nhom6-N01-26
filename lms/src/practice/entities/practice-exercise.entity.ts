import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('practice_exercises')
export class PracticeExercise {
  @PrimaryGeneratedColumn()
  exercise_id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 100 })
  skill: string; // JavaScript, React, SQL, Algorithm

  @Column({ length: 50, default: 'Beginner' })
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  initial_code: string;

  @Column({ type: 'text', nullable: true })
  solution_code: string;

  @Column({ type: 'simple-json', nullable: true })
  test_cases: { input: string; expected_output: string; description: string }[];

  @Column({ type: 'text', nullable: true })
  hint: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
