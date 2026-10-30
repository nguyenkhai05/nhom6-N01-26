import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Inject, Optional } from '@nestjs/common';
import type { Request } from 'express';
import { getJwtSecret, verifyToken } from './jwt.util.js';
import type { JwtPayload } from './jwt.util.js';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity.js';

// Gác cổng xác thực: kiểm tra token Bearer hợp lệ & trạng thái tài khoản còn hiệu lực (FIX02)
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Optional() @Inject('USER_REPOSITORY') private readonly userRepository?: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: JwtPayload }>();
    const [type, token] = (req.headers.authorization ?? '').split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Bạn cần đăng nhập để truy cập tài nguyên này');
    }
    const payload = verifyToken(token, getJwtSecret());
    if (!payload) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
    }

    // FIX02: Đọc trạng thái tài khoản từ server để khóa tức thì phiên nếu tài khoản bị vô hiệu hóa
    if (this.userRepository) {
      const user = await this.userRepository.findOne({
        where: { user_id: payload.sub },
        relations: { roles: true },
      });
      if (!user || user.is_active === false) {
        throw new UnauthorizedException('Tài khoản đã bị khóa hoặc không còn tồn tại');
      }
      // Luôn gán vai trò thực tế từ CSDL vào req.user (ngăn chặn thao túng vai trò từ phía client)
      req.user = {
        ...payload,
        roles: user.roles?.map((r) => r.role_name) ?? payload.roles,
      };
    } else {
      req.user = payload;
    }

    return true;
  }
}
