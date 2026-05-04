import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Token, TokenType } from '@prisma/client';
import * as crypto from 'crypto';

import { PrismaService } from '../../../prisma/prisma.service';

export const REFRESH_TOKEN_TTL_DAYS = 30;
export const REFRESH_TOKEN_TTL_MS =
  REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

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

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

    await this.prisma.token.create({
      data: {
        userId: data.userId,
        type: TokenType.REFRESH,
        token: hashed,
        expiresAt,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
      },
    });

    return raw;
  }

  async rotateRefreshToken(
    rawToken: string,
    meta: { userAgent?: string; ipAddress?: string },
  ): Promise<{ rawToken: string; userId: string }> {
    const existing = await this.findByRawToken(rawToken);

    if (!existing || existing.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.token.delete({ where: { id: existing.id } });

    const newRawToken = await this.createRefreshToken({
      userId: existing.userId,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    });

    return { rawToken: newRawToken, userId: existing.userId };
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

  private async findByRawToken(rawToken: string): Promise<Token | null> {
    const hashed = this.hash(rawToken);
    return this.prisma.token.findUnique({
      where: { token: hashed },
    });
  }

  private hash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }
}
