import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ length: 50 })
  role_name: string; // 'Admin' | 'Instructor' | 'Student'
}