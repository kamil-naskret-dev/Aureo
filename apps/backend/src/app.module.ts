import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from './auth/auth.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import appConfig, { AppConfig } from './config/app.config';
import { validate } from './config/config.validation';
import databaseConfig from './config/database.config';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validate,
    }),

    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDev =
          config.getOrThrow<AppConfig>('app').nodeEnv !== 'production';
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

    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),

    PrismaModule,
    HealthModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
