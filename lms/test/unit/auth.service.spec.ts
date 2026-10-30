import { describe, it, expect, beforeEach } from 'vitest';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service.js';
import { hashPassword } from '../../src/auth/password.util.js';

describe('AuthService Unit Tests (UT01, UT02, UT03, UT04, UT31)', () => {
  let authService: AuthService;
  let mockUserRepo: any;
  let mockRoleRepo: any;
  let userStore: any[];
  let roleStore: any[];

  beforeEach(() => {
    process.env.JWT_SECRET = 'eduviet_super_secret_jwt_key_2026_mastery_secure';
    roleStore = [
      { role_id: 1, role_name: 'Admin' },
      { role_id: 2, role_name: 'Instructor' },
      { role_id: 3, role_name: 'Student' },
    ];

    userStore = [
      {
        user_id: 1,
        full_name: 'Quản trị viên EduViet',
        email: 'admin@eduviet.vn',
        password_hash: hashPassword('Eduenglish123'),
        is_active: true,
        roles: [roleStore[0]],
      },
      {
        user_id: 2,
        full_name: 'Vũ Quốc Huy',
        email: 'giangvien@eduviet.vn',
        password_hash: hashPassword('Giangvien@123'),
        is_active: true,
        roles: [roleStore[1]],
      },
      {
        user_id: 3,
        full_name: 'Nguyễn Văn Dev',
        email: 'dev.nguyen@gmail.com',
        password_hash: hashPassword('Hocvien@123'),
        is_active: false, // Inactive user for testing lock
        roles: [roleStore[2]],
      },
    ];

    mockUserRepo = {
      find: async (_opts?: any) => [...userStore],
      findOne: async (opts: any) => {
        const id = opts?.where?.user_id;
        const email = opts?.where?.email;
        if (id) return userStore.find((u) => u.user_id === id) || null;
        if (email) return userStore.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
        return userStore[0] || null;
      },
      findOneBy: async (where: any) => {
        if (where.email) {
          return userStore.find((u) => u.email.toLowerCase() === where.email.toLowerCase()) || null;
        }
        if (where.user_id) {
          return userStore.find((u) => u.user_id === Number(where.user_id)) || null;
        }
        return null;
      },
      create: (data: any) => ({ ...data }),
      save: async (data: any) => {
        const user_id = data.user_id || userStore.length + 1;
        const saved = { ...data, user_id };
        const idx = userStore.findIndex((u) => u.user_id === user_id);
        if (idx !== -1) userStore[idx] = saved;
        else userStore.push(saved);
        return saved;
      },
      update: async (id: number, data: any) => {
        const idx = userStore.findIndex((u) => u.user_id === id);
        if (idx !== -1) {
          userStore[idx] = { ...userStore[idx], ...data };
        }
        return { affected: idx !== -1 ? 1 : 0 };
      },
      createQueryBuilder: () => {
        let whereEmail: string | null = null;
        let whereId: number | null = null;
        const builder = {
          addSelect: () => builder,
          leftJoinAndSelect: () => builder,
          where: (clause: string, params: any) => {
            if (params?.email) whereEmail = params.email;
            if (params?.userId) whereId = params.userId;
            return builder;
          },
          getOne: async () => {
            if (whereEmail) {
              return userStore.find((u) => u.email.toLowerCase() === whereEmail?.toLowerCase()) || null;
            }
            if (whereId) {
              return userStore.find((u) => u.user_id === whereId) || null;
            }
            return userStore[0] || null;
          },
        };
        return builder;
      },
    };

    mockRoleRepo = {
      find: async () => [...roleStore],
      findOneBy: async (where: any) => {
        if (where.role_name) {
          return roleStore.find((r) => r.role_name === where.role_name) || null;
        }
        return null;
      },
    };

    authService = new AuthService(mockUserRepo, mockRoleRepo);
  });

  // UT01: Đăng ký tài khoản (US01)
  describe('UT01: Register user', () => {
    it('Đăng ký tài khoản mới thành công với vai trò mặc định Student', async () => {
      const res = await authService.register({
        full_name: 'Trần Thị Học Viên',
        email: 'hocvien.moi@gmail.com',
        password: 'Password@123',
      });

      expect(res).toBeDefined();
      expect(res.access_token).toBeDefined();
      expect(res.user.email).toBe('hocvien.moi@gmail.com');
      expect(res.user.roles).toContain('Student');
    });

    it('Từ chối đăng ký nếu email đã tồn tại trong hệ thống (ConflictException)', async () => {
      await expect(
        authService.register({
          full_name: 'Admin Clone',
          email: 'admin@eduviet.vn',
          password: 'Password@123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // UT02: Đăng nhập & Đăng xuất (US02)
  describe('UT02: Login, Logout and Me', () => {
    it('Đăng nhập thành công với thông tin chính xác và trả về JWT Bearer', async () => {
      const res = await authService.login({
        email: 'admin@eduviet.vn',
        password: 'Eduenglish123',
      });

      expect(res.access_token).toBeDefined();
      expect(res.user.email).toBe('admin@eduviet.vn');
      expect(res.user.roles).toContain('Admin');
    });

    it('Từ chối đăng nhập với mật khẩu không chính xác (UnauthorizedException)', async () => {
      await expect(
        authService.login({
          email: 'admin@eduviet.vn',
          password: 'WrongPassword123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Từ chối đăng nhập nếu tài khoản đã bị khóa (is_active = false)', async () => {
      await expect(
        authService.login({
          email: 'dev.nguyen@gmail.com',
          password: 'Hocvien@123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Đăng xuất thành công và trả về thông báo xác nhận', async () => {
      const res = await authService.logout(1);
      expect(res.success).toBe(true);
      expect(res.message).toContain('Đăng xuất thành công');
    });

    it('Lấy thông tin người dùng hiện tại (me) từ CSDL', async () => {
      const me = await authService.me(1);
      expect(me.user_id).toBe(1);
      expect(me.email).toBe('admin@eduviet.vn');
      expect(me.roles).toContain('Admin');
    });
  });

  // UT03: Quên mật khẩu & Đặt lại mật khẩu (US03)
  describe('UT03: Forgot & Reset password', () => {
    it('Tạo yêu cầu đặt lại mật khẩu với thông báo an toàn', async () => {
      const res = await authService.forgotPassword({ email: 'giangvien@eduviet.vn' });
      expect(res.message).toContain('Nếu email tồn tại trong hệ thống');
      expect(res.dev_reset_token).toBeDefined();
    });

    it('Đặt lại mật khẩu thành công với token hợp lệ', async () => {
      const forgotRes = await authService.forgotPassword({ email: 'giangvien@eduviet.vn' });
      const token = forgotRes.dev_reset_token;

      const resetRes = await authService.resetPassword({
        token,
        new_password: 'NewGiangvien@123',
      });

      expect(resetRes.success).toBe(true);

      // Đăng nhập lại với mật khẩu mới thành công
      const loginRes = await authService.login({
        email: 'giangvien@eduviet.vn',
        password: 'NewGiangvien@123',
      });
      expect(loginRes.access_token).toBeDefined();
    });

    it('Từ chối đặt lại mật khẩu với token không hợp lệ hoặc đã qua sử dụng', async () => {
      await expect(
        authService.resetPassword({
          token: 'invalid-fake-token-123456',
          new_password: 'NewPassword@123',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // UT04: Cập nhật hồ sơ & Đổi mật khẩu (US04)
  describe('UT04: Update profile & Change password', () => {
    it('Cập nhật họ tên và avatar thành công', async () => {
      const updated = await authService.updateProfile(1, {
        full_name: 'Quản Trị Viên Master',
        avatar_url: 'https://eduviet.vn/avatar.png',
      });

      expect(updated.full_name).toBe('Quản Trị Viên Master');
      expect(updated.avatar_url).toBe('https://eduviet.vn/avatar.png');
    });

    it('Đổi mật khẩu thành công khi nhập đúng mật khẩu hiện tại', async () => {
      const res = await authService.changePassword(1, {
        current_password: 'Eduenglish123',
        new_password: 'AdminPassword@2026',
      });

      expect(res.success).toBe(true);

      // Đăng nhập lại bằng mật khẩu mới
      const loginRes = await authService.login({
        email: 'admin@eduviet.vn',
        password: 'AdminPassword@2026',
      });
      expect(loginRes.access_token).toBeDefined();
    });

    it('Từ chối đổi mật khẩu nếu mật khẩu hiện tại bị sai', async () => {
      await expect(
        authService.changePassword(1, {
          current_password: 'SaiMatKhau123',
          new_password: 'AdminPassword@2026',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // UT31: Quản trị tài khoản & Khóa/Mở khóa (US31)
  describe('UT31: Admin user management and status update', () => {
    it('Quản trị viên xem được danh sách toàn bộ người dùng', async () => {
      const list = await authService.adminListUsers();
      expect(list.length).toBe(3);
      expect(list[0].email).toBe('admin@eduviet.vn');
    });

    it('Quản trị viên mở khóa tài khoản thành công', async () => {
      const res = await authService.adminUpdateUserStatus(3, true, 1);
      expect(res.is_active).toBe(true);

      // Sau khi mở khóa, người dùng đăng nhập được
      const loginRes = await authService.login({
        email: 'dev.nguyen@gmail.com',
        password: 'Hocvien@123',
      });
      expect(loginRes.access_token).toBeDefined();
    });

    it('Ngăn chặn quản trị viên tự khóa tài khoản của chính mình (ForbiddenException)', async () => {
      await expect(authService.adminUpdateUserStatus(1, false, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('Quản trị viên phân quyền vai trò cho người dùng thành công', async () => {
      const res = await authService.adminUpdateUserRoles(3, ['Instructor', 'Student']);
      expect(res.roles).toContain('Instructor');
      expect(res.roles).toContain('Student');
    });
  });

  // Google OAuth Login
  describe('Google OAuth Login', () => {
    it('Đăng nhập Google với email mới tự động tạo tài khoản học viên và trả JWT', async () => {
      const res = await authService.googleLogin({
        email: 'newbie.google@gmail.com',
        full_name: 'Google Newbie',
      });
      expect(res.access_token).toBeDefined();
      expect(res.user.email).toBe('newbie.google@gmail.com');
      expect(res.user.roles).toContain('Student');
    });

    it('Đăng nhập Google với tài khoản đã tồn tại trả về phiên đăng nhập', async () => {
      const res = await authService.googleLogin({
        email: 'admin@eduviet.vn',
      });
      expect(res.access_token).toBeDefined();
      expect(res.user.user_id).toBe(1);
      expect(res.user.roles).toContain('Admin');
    });

    it('Chặn đăng nhập Google nếu tài khoản bị khóa (UnauthorizedException)', async () => {
      await expect(
        authService.googleLogin({
          email: 'dev.nguyen@gmail.com',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
