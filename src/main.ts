import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { LoggerInterceptor } from './core/interceptors/logger.interceptor';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser(configService.get('COOKIE_SECRET'))); // Use the same secret key used in Node.js

  app.useGlobalInterceptors(new LoggerInterceptor());
  // Set global prefix
  app.setGlobalPrefix('api');
  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI, // URL-based versioning (e.g., /api/v1/portfolio-concentration-limit)
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

// 15 > 12
