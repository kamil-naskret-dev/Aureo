import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Token, TokenType } from '@prisma/client';
import * as crypto from 'crypto';

import { PrismaService } from '../../../prisma/prisma.service';
import {
  EMAIL_VERIFY_TOKEN_TTL_MS,
  PASSWORD_RESET_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_MS,
} from './token.constants';

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  async createRefreshToken(data: {
    userId: string;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<string> {
    const raw = crypto.randomBytes(40).toString('hex');
    const hashed = this.hash(raw);

    await this.prisma.token.create({
      data: {
        userId: data.userId,
        type: TokenType.REFRESH,
        token: hashed,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
      },
    });

    return raw;
  }

  async createEmailVerifyToken(userId: string): Promise<string> {
    return this.createSingleUseToken(
      userId,
      TokenType.EMAIL_VERIFY,
      EMAIL_VERIFY_TOKEN_TTL_MS,
    );
  }

  async createPasswordResetToken(userId: string): Promise<string> {
    return this.createSingleUseToken(
      userId,
      TokenType.PASSWORD_RESET,
      PASSWORD_RESET_TOKEN_TTL_MS,
    );
  }

  async consumeEmailVerifyToken(rawToken: string): Promise<string> {
    return this.consumeSingleUseToken(
      rawToken,
      TokenType.EMAIL_VERIFY,
      'Invalid or expired verification token',
    );
  }

  async consumePasswordResetToken(rawToken: string): Promise<string> {
    return this.consumeSingleUseToken(
      rawToken,
      TokenType.PASSWORD_RESET,
      'Invalid or expired password reset token',
    );
  }

  async rotateRefreshToken(
    rawToken: string,
    meta: { userAgent?: string; ipAddress?: string },
  ): Promise<{ rawToken: string; userId: string }> {
    const existing = await this.findByRawToken(rawToken);

    if (!existing || existing.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const newRaw = crypto.randomBytes(40).toString('hex');
    const newHashed = this.hash(newRaw);

    await this.prisma.$transaction(async (tx) => {
      await tx.token.delete({ where: { id: existing.id } });

      await tx.token.create({
        data: {
          userId: existing.userId,
          type: TokenType.REFRESH,
          token: newHashed,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
          userAgent: meta.userAgent,
          ipAddress: meta.ipAddress,
        },
      });
    });

    return { rawToken: newRaw, userId: existing.userId };
  }

  async findActiveRefreshTokens(userId: string): Promise<Token[]> {
    return this.prisma.token.findMany({
      where: { userId, type: TokenType.REFRESH, expiresAt: { gt: new Date() } },
    });
  }

  async deleteByRawToken(rawToken: string): Promise<void> {
    const hashed = this.hash(rawToken);
    await this.prisma.token.deleteMany({
      where: { token: hashed, type: TokenType.REFRESH },
    });
  }

  async deleteAllRefreshTokens(userId: string): Promise<void> {
    await this.prisma.token.deleteMany({
      where: { userId, type: TokenType.REFRESH },
    });
  }

  private async createSingleUseToken(
    userId: string,
    type: TokenType,
    ttlMs: number,
  ): Promise<string> {
    const raw = crypto.randomBytes(40).toString('hex');
    const hashed = this.hash(raw);

    await this.prisma.$transaction(async (tx) => {
      await tx.token.deleteMany({ where: { userId, type } });
      await tx.token.create({
        data: {
          userId,
          type,
          token: hashed,
          expiresAt: new Date(Date.now() + ttlMs),
        },
      });
    });

    return raw;
  }

  private async consumeSingleUseToken(
    rawToken: string,
    type: TokenType,
    errorMessage: string,
  ): Promise<string> {
    const hashed = this.hash(rawToken);

    const token = await this.prisma.token.findUnique({
      where: { token: hashed },
    });

    if (!token || token.type !== type || token.expiresAt < new Date()) {
      throw new BadRequestException(errorMessage);
    }

    const { count } = await this.prisma.token.deleteMany({
      where: { id: token.id },
    });

    if (count === 0) {
      throw new BadRequestException(errorMessage);
    }

    return token.userId;
  }

  private async findByRawToken(rawToken: string): Promise<Token | null> {
    const hashed = this.hash(rawToken);
    return this.prisma.token.findUnique({ where: { token: hashed } });
  }

  private hash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }
}
