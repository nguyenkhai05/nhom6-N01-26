import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, type Relation } from 'typeorm';
import type { BundleItem } from './bundle-item.entity.js';

@Entity('bundles')
export class Bundle {
  @PrimaryGeneratedColumn()
  bundle_id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 500, nullable: true })
  thumbnail_url: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  bundle_price: number;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany('BundleItem', 'bundle', { cascade: true })
  items: Relation<BundleItem>[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
