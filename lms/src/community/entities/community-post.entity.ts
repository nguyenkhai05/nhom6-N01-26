import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, type Relation } from 'typeorm';
import type { User } from '../../user/user.entity.js';
import type { CommunityReply } from './community-reply.entity.js';

@Entity('community_posts')
export class CommunityPost {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column()
  user_id: number;

  @Column({ length: 100 })
  category: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'simple-json', nullable: true })
  tags: string[];

  @Column({ default: 0 })
  views_count: number;

  @Column({ default: 0 })
  likes_count: number;

  @Column({ default: false })
  is_solved: boolean;

  @Column({ type: 'int', nullable: true })
  accepted_reply_id: number | null;

  @ManyToOne('User', { eager: true })
  @JoinColumn({ name: 'user_id' })
  author: Relation<User>;

  @OneToMany('CommunityReply', 'post')
  replies: Relation<CommunityReply>[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
