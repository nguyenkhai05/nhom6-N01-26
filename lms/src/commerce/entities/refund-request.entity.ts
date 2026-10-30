import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum RefundStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('refund_requests')
export class RefundRequest {
  @PrimaryGeneratedColumn()
  refund_id: number;

  @Column()
  order_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'decimal', precision: 12, scale: 2,
    transformer: { to: (v?: number) => v, from: (v: string | null) => (v === null ? 0 : parseFloat(v)) },
  })
  amount: number;

  @Column({ type: 'enum', enum: RefundStatus, default: RefundStatus.PENDING })
  status: RefundStatus;

  @Column({ type: 'text', nullable: true })
  admin_comment: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  processed_at: Date | null;
}
