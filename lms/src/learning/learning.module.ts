import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { LearningController } from './learning.controller.js';
import { LearningService } from './learning.service.js';
import { learningProviders } from './learning.provider.js';

@Module({
  imports: [DatabaseModule],
  controllers: [LearningController],
  providers: [...learningProviders, LearningService],
  exports: [LearningService],
})
export class LearningModule {}
