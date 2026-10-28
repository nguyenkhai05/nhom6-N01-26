import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { authProviders } from './auth.providers.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [...authProviders, AuthService],
})
export class AuthModule {}