import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import type { User } from '../../user/user.entity.js';
import type { CommunityPost } from './community-post.entity.js';

@Entity('community_replies')
export class CommunityReply {
  @PrimaryGeneratedColumn()
  reply_id: number;

  @Column()
  post_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  is_accepted: boolean;

  @Column({ default: 0 })
  likes_count: number;

  @ManyToOne('CommunityPost', 'replies', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Relation<CommunityPost>;

  @ManyToOne('User', { eager: true })
  @JoinColumn({ name: 'user_id' })
  author: Relation<User>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
