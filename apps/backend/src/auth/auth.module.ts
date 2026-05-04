import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { jwtConfig } from '../config/jwt.config';
import { TokenModule } from './infrastructure/token/token.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookieModule } from './infrastructure/cookie/cookie.module';

@Module({
  imports: [
    UsersModule,
    TokenModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [jwtConfig.KEY],
      useFactory: (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.secret,
        signOptions: { expiresIn: config.expiresIn },
      }),
    }),
    CookieModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
