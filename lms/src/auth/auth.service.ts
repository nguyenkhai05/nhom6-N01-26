import {
  ConflictException, Inject, Injectable, InternalServerErrorException, UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity.js';
import { Role } from '../role/role.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { hashPassword, isLegacyHash, verifyPassword } from './password.util.js';
import { getJwtSecret, parseExpiresIn, signToken } from './jwt.util.js';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY') private readonly roleRepository: Repository<Role>,
  ) {}

  // Đăng ký: luôn tạo tài khoản Student, vai trò không lấy từ client
  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    if (await this.userRepository.findOneBy({ email })) {
      throw new ConflictException('Email đã được đăng ký');
    }

    const studentRole = await this.roleRepository.findOneBy({ role_name: 'Student' });
    if (!studentRole) {
      throw new InternalServerErrorException('Chưa có vai trò Student trong CSDL');
    }

    try {
      const user = await this.userRepository.save(
        this.userRepository.create({
          full_name: dto.full_name.trim(),
          email,
          password_hash: hashPassword(dto.password),
          roles: [studentRole],
        }),
      );
      return this.buildResponse(user.user_id, user.full_name, user.email, ['Student']);
    } catch (err: any) {
      if ((err?.driverError?.code ?? err?.code) === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email đã được đăng ký');
      }
      throw err;
    }
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    // password_hash mặc định không được tải, phải addSelect mới lấy ra để so sánh
    const user = await this.userRepository
      .createQueryBuilder('u')
      .addSelect('u.password_hash')
      .leftJoinAndSelect('u.roles', 'r')
      .where('u.email = :email', { email })
      .getOne();

    // Cùng một thông báo cho "sai email" và "sai mật khẩu" để không lộ email nào tồn tại
    if (!user || !user.is_active || !verifyPassword(dto.password, user.password_hash)) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tài khoản mẫu cũ dùng SHA-256: nâng cấp lên scrypt ngay lần đăng nhập này
    if (isLegacyHash(user.password_hash)) {
      await this.userRepository.update(user.user_id, {
        password_hash: hashPassword(dto.password),
      });
    }

    const roles = user.roles.map((r) => r.role_name);
    return this.buildResponse(user.user_id, user.full_name, user.email, roles);
  }

  // Thông tin người đang đăng nhập (đọc lại từ CSDL, không tin hoàn toàn vào token)
  async me(userId: number) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: { roles: true },
    });
    if (!user || !user.is_active) {
      throw new UnauthorizedException('Tài khoản không còn hiệu lực');
    }
    return {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      avatar_url: user.avatar_url,
      roles: user.roles.map((r) => r.role_name),
    };
  }

  private buildResponse(userId: number, fullName: string, email: string, roles: string[]) {
    const access_token = signToken({ sub: userId, email, roles }, getJwtSecret(), parseExpiresIn());
    return { access_token, user: { user_id: userId, full_name: fullName, email, roles } };
  }
}