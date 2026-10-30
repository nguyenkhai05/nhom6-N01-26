import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum VoucherDiscountType {
  PERCENT = 'PERCENT',
  FIXED = 'FIXED',
}

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn()
  voucher_id: number;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ type: 'enum', enum: VoucherDiscountType })
  discount_type: VoucherDiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount_value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  min_order_value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  max_discount_amount: number | null;

  @Column({ type: 'datetime', nullable: true })
  valid_from: Date | null;

  @Column({ type: 'datetime', nullable: true })
  valid_until: Date | null;

  @Column({ default: 100 })
  usage_limit: number;

  @Column({ default: 0 })
  used_count: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}
