import { Module } from '@nestjs/common';
import { PracticeController } from './practice.controller.js';
import { PracticeService } from './practice.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { DataSource } from 'typeorm';
import { PracticeExercise } from './entities/practice-exercise.entity.js';
import { SkillAssessment } from './entities/skill-assessment.entity.js';

@Module({
  imports: [DatabaseModule],
  controllers: [PracticeController],
  providers: [
    PracticeService,
    {
      provide: 'PRACTICE_EXERCISE_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(PracticeExercise),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SKILL_ASSESSMENT_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(SkillAssessment),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [PracticeService],
})
export class PracticeModule {}
