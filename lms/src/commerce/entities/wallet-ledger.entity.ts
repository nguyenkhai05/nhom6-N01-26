import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, type Relation } from 'typeorm';
import { Wallet } from './wallet.entity.js';

export enum LedgerType {
  DEPOSIT = 'DEPOSIT',
  PURCHASE = 'PURCHASE',
  REFUND = 'REFUND',
}

@Entity('wallet_ledgers')
export class WalletLedger {
  @PrimaryGeneratedColumn()
  ledger_id: number;

  @Column()
  wallet_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'enum', enum: LedgerType })
  type: LedgerType;

  @Column({
    type: 'decimal', precision: 12, scale: 2,
    transformer: { to: (v?: number) => v, from: (v: string | null) => (v === null ? 0 : parseFloat(v)) },
  })
  amount: number;

  @Column({
    type: 'decimal', precision: 12, scale: 2,
    transformer: { to: (v?: number) => v, from: (v: string | null) => (v === null ? 0 : parseFloat(v)) },
  })
  balance_before: number;

  @Column({
    type: 'decimal', precision: 12, scale: 2,
    transformer: { to: (v?: number) => v, from: (v: string | null) => (v === null ? 0 : parseFloat(v)) },
  })
  balance_after: number;

  @Column({ length: 50 })
  reference_type: string; // 'TOPUP' | 'ORDER' | 'REFUND_REQUEST'

  @Column({ length: 100 })
  reference_id: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Relation<Wallet>;
}
