import { Module, Global } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { AuthController, AdminUserController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { authProviders } from './auth.providers.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { RolesGuard } from './roles.guard.js';

@Global()
@Module({
  imports: [DatabaseModule],
  controllers: [AuthController, AdminUserController],
  providers: [...authProviders, AuthService, JwtAuthGuard, RolesGuard],
  exports: [...authProviders, AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
