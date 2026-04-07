import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module.js';
import {
  SWAGGER_BEARER_NAME,
  SWAGGER_DESCRIPTION,
  SWAGGER_TITLE,
  SWAGGER_VERSION,
} from './common/constants/swagger.constants.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { AppConfig } from './config/app.config.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    // Disable the default NestJS logger — nestjs-pino replaces it.
    bufferLogs: true,
  });

  // ── Logging ────────────────────────────────────────────────────────────────
  app.useLogger(app.get(Logger));

  // ── Config ─────────────────────────────────────────────────────────────────
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app')!;

  // ── Security ───────────────────────────────────────────────────────────────
  app.use(helmet());

  // ── CORS ───────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: appConfig.corsOrigin,
    credentials: true,
  });

  // ── Global prefix ──────────────────────────────────────────────────────────
  app.setGlobalPrefix(appConfig.apiPrefix);

  // ── Global pipes ───────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      transform: true, // Auto-transform payloads to DTO class instances
      forbidNonWhitelisted: true, // Throw on unknown properties
      transformOptions: {
        enableImplicitConversion: true, // Convert query params to correct types automatically
      },
    }),
  );

  // ── Global filters ─────────────────────────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());

  // ── Global interceptors ────────────────────────────────────────────────────
  app.useGlobalInterceptors(new TransformInterceptor());

  // ── Swagger ────────────────────────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(SWAGGER_VERSION)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      SWAGGER_BEARER_NAME,
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${appConfig.apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // ── Graceful shutdown ──────────────────────────────────────────────────────
  app.enableShutdownHooks();

  // ── Listen ─────────────────────────────────────────────────────────────────
  await app.listen(appConfig.port);
}

bootstrap();
