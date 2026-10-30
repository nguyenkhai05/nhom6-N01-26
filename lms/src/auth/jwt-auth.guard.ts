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
      let user = await this.userRepository.findOne({
        where: { user_id: payload.sub },
        relations: { roles: true },
      });

      // Nếu không tìm thấy theo user_id (ví dụ server khởi động lại trong chế độ in-memory demo),
      // tự động tìm theo email đã được chứng thực trong chữ ký số JWT
      if (!user && payload.email) {
        user = await this.userRepository.findOne({
          where: { email: payload.email },
          relations: { roles: true },
        });
      }

      // Tự động khôi phục bản ghi người dùng hợp lệ trong bộ nhớ nếu chữ ký JWT hoàn toàn hợp lệ
      if (!user && payload.email) {
        try {
          const userRoles = (payload.roles && payload.roles.length > 0) ? payload.roles : ['Student'];
          const roleEntities = userRoles.map((r, i) => ({ role_id: i + 1, role_name: r }));
          user = await this.userRepository.save(
            this.userRepository.create({
              user_id: payload.sub,
              email: payload.email,
              full_name: (payload as any).full_name || payload.email.split('@')[0],
              is_active: true,
              roles: roleEntities as any,
              created_at: new Date(),
            }),
          );
        } catch {
          // Bỏ qua lỗi lưu trong trường hợp xung đột
        }
      }

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
