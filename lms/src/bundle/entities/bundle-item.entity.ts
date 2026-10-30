import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import type { Bundle } from './bundle.entity.js';
import type { Course } from '../../course/course.entity.js';

@Entity('bundle_items')
export class BundleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bundle_id: number;

  @Column()
  course_id: number;

  @ManyToOne('Bundle', 'items', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bundle_id' })
  bundle: Relation<Bundle>;

  @ManyToOne('Course', { eager: true })
  @JoinColumn({ name: 'course_id' })
  course: Relation<Course>;
}
