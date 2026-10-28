import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// Dùng: @Roles('Admin', 'Instructor') — chỉ các vai trò này được gọi API
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);