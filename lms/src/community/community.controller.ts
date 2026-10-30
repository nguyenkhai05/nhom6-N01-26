import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommunityService } from './community.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { JwtPayload } from '../auth/jwt.util.js';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('posts')
  getPosts(@Query() query: { category?: string; tag?: string; q?: string }) {
    return this.communityService.getPosts(query);
  }

  @Get('posts/:id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.communityService.getPost(id);
  }

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  createPost(
    @CurrentUser() user: JwtPayload,
    @Body() body: { category: string; title: string; content: string; tags?: string[] },
  ) {
    return this.communityService.createPost(user.sub, body);
  }

  @Post('posts/:id/replies')
  @UseGuards(JwtAuthGuard)
  createReply(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
    @Body('content') content: string,
  ) {
    return this.communityService.createReply(id, user.sub, content);
  }

  @Post('posts/:id/accept-reply')
  @UseGuards(JwtAuthGuard)
  acceptReply(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
    @Body('reply_id', ParseIntPipe) replyId: number,
  ) {
    return this.communityService.acceptReply(id, replyId, user.sub);
  }

  @Get('reports')
  @UseGuards(JwtAuthGuard)
  getReports() {
    return this.communityService.getReports();
  }

  @Post('reports')
  @UseGuards(JwtAuthGuard)
  reportContent(
    @CurrentUser() user: JwtPayload,
    @Body() body: { target_type: string; target_id: number; reason: string },
  ) {
    return this.communityService.reportContent(body, user.sub);
  }
}
