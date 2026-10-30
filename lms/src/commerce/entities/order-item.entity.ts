import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import { Order } from './order.entity.js';
import { Course } from '../../course/course.entity.js';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  item_id: number;

  @Column()
  order_id: number;

  @Column()
  course_id: number;

  @Column({
    type: 'decimal', precision: 10, scale: 2,
    transformer: { to: (v?: number) => v, from: (v: string | null) => (v === null ? 0 : parseFloat(v)) },
  })
  price: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Relation<Order>;

  @ManyToOne(() => Course, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'course_id' })
  course: Relation<Course>;
}
