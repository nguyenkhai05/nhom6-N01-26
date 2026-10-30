import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller.js';
import { ProjectService } from './project.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { DataSource } from 'typeorm';
import { Project } from './entities/project.entity.js';
import { ProjectSubmission } from './entities/project-submission.entity.js';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    {
      provide: 'PROJECT_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Project),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'PROJECT_SUBMISSION_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(ProjectSubmission),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
