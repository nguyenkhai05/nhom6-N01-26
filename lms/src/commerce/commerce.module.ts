import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { CommerceController } from './commerce.controller.js';
import { CommerceService } from './commerce.service.js';
import { commerceProviders } from './commerce.provider.js';

@Module({
  imports: [DatabaseModule],
  controllers: [CommerceController],
  providers: [...commerceProviders, CommerceService],
  exports: [CommerceService],
})
export class CommerceModule {}
