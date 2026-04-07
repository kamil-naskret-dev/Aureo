import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

import appConfig, { AppConfig } from './config/app.config.js';
import { validationSchema } from './config/config.validation.js';
import databaseConfig from './config/database.config.js';
import { HealthModule } from './health/health.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    // Config: loads .env, validates with Joi, registers typed namespaces.
    // isGlobal: true — ConfigService available everywhere without importing ConfigModule.
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validationSchema,
      validationOptions: {
        abortEarly: true, // Fail-fast: show the first env error and exit.
      },
    }),

    // Structured logging — pino-pretty in development, JSON in production.
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDev = config.get<AppConfig>('app')!.nodeEnv !== 'production';
        return {
          pinoHttp: {
            transport: isDev
              ? {
                  target: 'pino-pretty',
                  options: { singleLine: true, colorize: true },
                }
              : undefined,
            level: isDev ? 'debug' : 'info',
            redact: ['req.headers.authorization'],
          },
        };
      },
    }),

    // Rate limiting: 100 requests per 60 seconds per IP by default.
    // Individual routes can override with @Throttle().
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),

    PrismaModule,
    HealthModule,
  ],
})
export class AppModule {}
