import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { CategoryModule } from './category/category.module.js';
import { CourseModule } from './course/course.module.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [AuthModule, CategoryModule, CourseModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}