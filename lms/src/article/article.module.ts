import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DatabaseModule } from '../database/database.module.js';
import { ArticleController } from './article.controller.js';
import { ArticleService } from './article.service.js';
import { Article } from './entities/article.entity.js';

@Module({
  imports: [DatabaseModule],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    {
      provide: 'ARTICLE_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Article),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [ArticleService],
})
export class ArticleModule {}
