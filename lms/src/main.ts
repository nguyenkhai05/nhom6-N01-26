import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

const lmsEnv = resolve(process.cwd(), 'lms/.env');
if (existsSync(lmsEnv)) {
  dotenv.config({ path: lmsEnv });
} else {
  dotenv.config();
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Chỉ cho phép các địa chỉ frontend khai báo trong .env gọi API
  const origins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173,http://localhost:3000')
    .split(',')
    .map((o) => o.trim());
  app.enableCors({ origin: origins });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 [EduViet LMS Backend] Server listening at http://localhost:${port}`);
}

void bootstrap().catch((err: unknown) => {
  console.error('Failed to start Nest application:', err);
  process.exit(1);
});
