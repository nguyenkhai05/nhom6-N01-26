import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller.js';
import { CommunityService } from './community.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { DataSource } from 'typeorm';
import { CommunityPost } from './entities/community-post.entity.js';
import { CommunityReply } from './entities/community-reply.entity.js';
import { User } from '../user/user.entity.js';

@Module({
  imports: [DatabaseModule],
  controllers: [CommunityController],
  providers: [
    CommunityService,
    {
      provide: 'COMMUNITY_POST_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(CommunityPost),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'COMMUNITY_REPLY_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(CommunityReply),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [CommunityService],
})
export class CommunityModule {}
