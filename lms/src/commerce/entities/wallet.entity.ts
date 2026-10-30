import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, UpdateDateColumn, type Relation } from 'typeorm';
import { User } from '../../user/user.entity.js';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  wallet_id: number;

  @Column({ unique: true })
  user_id: number;

  @Column({
    type: 'decimal', precision: 12, scale: 2, default: 0.0,
    transformer: { to: (v?: number) => v, from: (v: string | null) => (v === null ? 0 : parseFloat(v)) },
  })
  balance: number;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
