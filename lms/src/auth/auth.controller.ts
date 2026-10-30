import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { GoogleLoginDto } from './dto/google-login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UpdateUserStatusDto } from './dto/update-user-status.dto.js';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { RolesGuard } from './roles.guard.js';
import { Roles } from './roles.decorator.js';
import { CurrentUser } from './current-user.decorator.js';
import type { JwtPayload } from './jwt.util.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // US01: Đăng ký tài khoản học viên
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  // US02: Đăng nhập
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  // Đăng nhập / Đăng ký nhanh qua Google OAuth
  @Post('google')
  googleLogin(@Body() body: GoogleLoginDto) {
    return this.authService.googleLogin(body);
  }

  // US02: Đăng xuất phiên làm việc
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@CurrentUser() user: JwtPayload) {
    return this.authService.logout(user.sub);
  }

  // US02: Lấy thông tin tài khoản hiện tại từ CSDL
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: JwtPayload) {
    return this.authService.me(user.sub);
  }

  // US03: Yêu cầu đặt lại mật khẩu qua email
  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  // US03: Đặt lại mật khẩu với token xác minh
  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  // US04: Cập nhật thông tin hồ sơ
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@CurrentUser() user: JwtPayload, @Body() body: UpdateProfileDto) {
    return this.authService.updateProfile(user.sub, body);
  }

  // US04: Đổi mật khẩu
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(@CurrentUser() user: JwtPayload, @Body() body: ChangePasswordDto) {
    return this.authService.changePassword(user.sub, body);
  }
}

// Controller quản trị tài khoản người dùng (US31)
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
export class AdminUserController {
  constructor(private readonly authService: AuthService) {}

  // US31: Xem danh sách toàn bộ người dùng
  @Get()
  listUsers() {
    return this.authService.adminListUsers();
  }

  // US31: Khóa / mở khóa tài khoản
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserStatusDto,
    @CurrentUser() admin: JwtPayload,
  ) {
    return this.authService.adminUpdateUserStatus(id, body.is_active, admin.sub);
  }

  // US31: Phân quyền vai trò
  @Patch(':id/roles')
  updateRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserRolesDto,
  ) {
    return this.authService.adminUpdateUserRoles(id, body.roles);
  }
}
