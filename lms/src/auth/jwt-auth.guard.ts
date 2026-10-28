import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { getJwtSecret, verifyToken } from './jwt.util.js';
import type { JwtPayload } from './jwt.util.js';

// Gác cổng 1: yêu cầu header "Authorization: Bearer <token>" hợp lệ
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & { user?: JwtPayload }>();
    const [type, token] = (req.headers.authorization ?? '').split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Bạn cần đăng nhập');
    }
    const payload = verifyToken(token, getJwtSecret());
    if (!payload) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
    }
    req.user = payload; // các bước sau lấy được người dùng từ req.user
    return true;
  }
}