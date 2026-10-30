import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, type Relation } from 'typeorm';
import { OrderItem } from './order-item.entity.js';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column()
  user_id: number;

  @Column({ length: 50, unique: true })
  order_code: string;

  @Column({
    type: 'decimal', precision: 12, scale: 2,
    transformer: { to: (v?: number) => v, from: (v: string | null) => (v === null ? 0 : parseFloat(v)) },
  })
  total_amount: number;

  @Column({
    type: 'decimal', precision: 12, scale: 2, default: 0,
    transformer: { to: (v?: number) => v, from: (v: string | null) => (v === null ? 0 : parseFloat(v)) },
  })
  discount_amount: number;

  @Column({
    type: 'decimal', precision: 12, scale: 2,
    transformer: { to: (v?: number) => v, from: (v: string | null) => (v === null ? 0 : parseFloat(v)) },
  })
  final_amount: number;

  @Column({ nullable: true })
  voucher_id: number | null;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ length: 50, default: 'WALLET' })
  payment_method: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  paid_at: Date | null;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: Relation<OrderItem>[];
}
