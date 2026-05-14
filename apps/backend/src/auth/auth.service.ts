import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { TokenService } from './infrastructure/token/token.service';
import { AppConfig } from '../config/app.config';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { LoginDto } from './dto/login/login.dto';
import { LoginResponseDto } from './dto/login/login-response.dto';
import { LogoutResponseDto } from './dto/logout/logout-response.dto';
import { RegisterDto } from './dto/register/register.dto';
import { RegisterResponseDto } from './dto/register/register-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password/forgot-password.dto';
import { ForgotPasswordResponseDto } from './dto/forgot-password/forgot-password-response.dto';
import { ResendVerificationDto } from './dto/resend-verification/resend-verification.dto';
import { ResendVerificationResponseDto } from './dto/resend-verification/resend-verification-response.dto';
import { ResetPasswordDto } from './dto/reset-password/reset-password.dto';
import { ResetPasswordResponseDto } from './dto/reset-password/reset-password-response.dto';
import { VerifyEmailResponseDto } from './dto/verify-email/verify-email-response.dto';
import { isUniqueConstraintError } from '../prisma/utils/prisma-error.util';
import { PASSWORD_SALT_ROUNDS } from './auth.constants';
import { RequestMetaType } from '../common/types/request-meta.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly tokens: TokenService,
    private readonly jwt: JwtService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  private generateAccessToken(user: {
    id: string;
    email: string;
    role: string;
  }): string {
    return this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    const { frontendUrl }: AppConfig = this.config.getOrThrow<AppConfig>('app');

    const hashedPassword = await bcrypt.hash(
      dto.password,
      PASSWORD_SALT_ROUNDS,
    );

    try {
      const user = await this.users.create({
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      });

      const verifyToken = await this.tokens.createEmailVerifyToken(user.id);

      await this.mail.sendVerificationEmail(
        user.email,
        `${frontendUrl}/verify-email?token=${verifyToken}`,
      );

      return {
        success: true,
        message: 'Account created. Please verify your email.',
      };
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('Email already in use');
      }
      throw error;
    }
  }

  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    const { frontendUrl }: AppConfig = this.config.getOrThrow<AppConfig>('app');

    const user = await this.users.findByEmail(dto.email);

    if (user && user.status === UserStatus.ACTIVE) {
      const resetToken = await this.tokens.createPasswordResetToken(user.id);

      await this.mail.sendPasswordResetEmail(
        user.email,
        `${frontendUrl}/reset-password?token=${resetToken}`,
      );
    }

    return {
      success: true,
      message: 'If the email exists, a reset link has been sent.',
    };
  }

  async resetPassword(
    dto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    const userId = await this.tokens.consumePasswordResetToken(dto.token);

    const hashedPassword = await bcrypt.hash(
      dto.password,
      PASSWORD_SALT_ROUNDS,
    );

    await this.users.updatePassword(userId, hashedPassword);
    await this.tokens.deleteAllRefreshTokens(userId);

    return { success: true, message: 'Password reset successfully.' };
  }

  async resendVerificationEmail(
    dto: ResendVerificationDto,
  ): Promise<ResendVerificationResponseDto> {
    const { frontendUrl }: AppConfig = this.config.getOrThrow<AppConfig>('app');

    const user = await this.users.findByEmail(dto.email);

    if (user && user.status === UserStatus.PENDING) {
      const verifyToken = await this.tokens.createEmailVerifyToken(user.id);

      await this.mail.sendVerificationEmail(
        user.email,
        `${frontendUrl}/verify-email?token=${verifyToken}`,
      );
    }

    return { success: true, message: 'Verification email sent.' };
  }

  async verifyEmail(rawToken: string): Promise<VerifyEmailResponseDto> {
    const userId = await this.tokens.consumeEmailVerifyToken(rawToken);

    await this.users.activateUser(userId);

    return { success: true, message: 'Email verified successfully.' };
  }

  async login(
    dto: LoginDto,
    meta: RequestMetaType,
  ): Promise<{ response: LoginResponseDto; refreshToken: string }> {
    const user = await this.users.findByEmailWithProfile(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === UserStatus.PENDING) {
      throw new ForbiddenException('Please verify your email first');
    }

    const accessToken = this.generateAccessToken(user);

    const refreshToken = await this.tokens.createRefreshToken({
      userId: user.id,
      ...meta,
    });

    return {
      response: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.profile!.name,
          role: user.role,
          image: user.profile?.avatarUrl ?? null,
        },
      },
      refreshToken,
    };
  }

  async logout(rawToken: string | undefined): Promise<LogoutResponseDto> {
    if (rawToken) {
      await this.tokens.deleteByRawToken(rawToken);
    }

    return { success: true, message: 'Logged out successfully.' };
  }

  async refresh(
    rawToken: string | undefined,
    meta: RequestMetaType,
  ): Promise<{ response: LoginResponseDto; newRefreshToken: string }> {
    if (!rawToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const { rawToken: newRawToken, userId } =
      await this.tokens.rotateRefreshToken(rawToken, meta);

    const user = await this.users.findByIdWithProfile(userId);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // @TODO: Handle BANNED status
    // if (user.status === UserStatus.BANNED) {
    //   await this.tokens.deleteAllRefreshTokens(userId);
    //   throw new ForbiddenException('Your account has been banned');
    // }

    const accessToken = this.generateAccessToken(user);

    return {
      response: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.profile!.name,
          role: user.role,
          image: user.profile?.avatarUrl ?? null,
        },
      },
      newRefreshToken: newRawToken,
    };
  }
}
