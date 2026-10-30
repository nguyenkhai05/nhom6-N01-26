import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum TopupStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

@Entity('topup_requests')
export class TopupRequest {
  @PrimaryGeneratedColumn()
  request_id: number;

  @Column()
  user_id: number;

  @Column({
    type: 'decimal', precision: 12, scale: 2,
    transformer: { to: (v?: number) => v, from: (v: string | null) => (v === null ? 0 : parseFloat(v)) },
  })
  amount: number;

  @Column({ type: 'enum', enum: TopupStatus, default: TopupStatus.PENDING })
  status: TopupStatus;

  @Column({ length: 50, default: 'DEMO_BANK' })
  payment_method: string;

  @Column({ length: 100, unique: true })
  transaction_ref: string;

  @Column({ type: 'text', nullable: true })
  admin_note: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  confirmed_at: Date | null;
}
