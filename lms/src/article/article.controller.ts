import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ArticleService } from './article.service.js';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.articleService.findAll(category, keyword);
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.articleService.findOne(idOrSlug);
  }

  @Post(':id/like')
  likeArticle(@Param('id') id: string) {
    return this.articleService.likeArticle(Number(id));
  }
}
