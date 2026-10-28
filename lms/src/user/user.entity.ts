import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany,
  ManyToMany, JoinTable, type Relation,
} from 'typeorm';
import { Course } from '../course/course.entity.js';
import { Enrollment } from '../enrollment/enrollment.entity.js';
import { Role } from '../role/role.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ length: 100 })
  full_name: string;

  @Column({ length: 100, unique: true })
  email: string;

  // select: false → mọi truy vấn thông thường KHÔNG trả về cột này (chỉ login mới addSelect)
  @Column({ length: 255, select: false })
  password_hash: string;

  @Column({ length: 500, nullable: true })
  avatar_url: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // Nhiều-nhiều qua bảng user_roles có sẵn trong lms_db.sql
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'user_id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'role_id' },
  })
  roles: Relation<Role>[];

  @OneToMany(() => Course, (course) => course.instructor)
  coursesTaught: Relation<Course>[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Relation<Enrollment>[];
}