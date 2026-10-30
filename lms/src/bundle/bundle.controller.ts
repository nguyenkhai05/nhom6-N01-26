import {
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BundleService } from './bundle.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { JwtPayload } from '../auth/jwt.util.js';
import { verifyToken, getJwtSecret } from '../auth/jwt.util.js';

@Controller('bundles')
export class BundleController {
  constructor(private readonly bundleService: BundleService) {}

  @Get()
  findAll() {
    return this.bundleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bundleService.findOne(id);
  }

  // Báo giá thông minh (Smart Quote) cho gói combo
  @Post(':id/quote')
  calculateQuote(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') authHeader?: string,
  ) {
    let userId: number | undefined;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const decoded = verifyToken(authHeader.slice(7), getJwtSecret());
        if (decoded?.sub) userId = decoded.sub;
      } catch {
        // Khách vãng lai
      }
    }
    return this.bundleService.calculateQuote(id, userId);
  }

  // Mua gói combo bằng số dư ví điện tử
  @Post(':id/checkout')
  @UseGuards(JwtAuthGuard)
  checkout(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bundleService.checkout(id, user.sub);
  }
}
