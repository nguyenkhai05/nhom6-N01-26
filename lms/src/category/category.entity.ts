import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import { Course } from '../course/course.entity.js';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ length: 100 })
  category_name: string;

  @Column({ nullable: true })
  parent_id: number;

  @Column({ default: 1 })
  order_index: number;

  @ManyToOne(() => Category, (cat) => cat.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Relation<Category> | null;

  @OneToMany(() => Category, (cat) => cat.parent)
  children: Relation<Category>[];

  @OneToMany(() => Course, (course) => course.category)
  courses: Relation<Course>[];
}
