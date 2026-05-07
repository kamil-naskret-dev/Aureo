import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/infrastructure/jwt/jwt-auth.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import appConfig, { AppConfig } from './config/app.config';
import { validate } from './config/config.validation';
import databaseConfig from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import mailConfig from './config/mail.config';
import redisConfig, { RedisConfig } from './config/redis.config';
import { HealthModule } from './health/health.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, mailConfig, redisConfig],
      validate,
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redis = config.getOrThrow<RedisConfig>('redis');
        return { connection: { host: redis.host, port: redis.port } };
      },
    }),

    ...(process.env.NODE_ENV !== 'production'
      ? [BullBoardModule.forRoot({ route: '/queues', adapter: ExpressAdapter })]
      : []),

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
                  options: { colorize: true },
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
    MailModule,
    UsersModule,
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
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
