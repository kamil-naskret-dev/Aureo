import { Injectable } from '@nestjs/common';
import { TokenType } from '@prisma/client';

import { PrismaService } from '../../core/prisma/prisma.service';
import {
  AlreadyBannedException,
  NotBannedException,
} from '../../common/exceptions/ban.exceptions';
import { UserNotFoundException } from '../../common/exceptions/user.exceptions';
import { BanCacheService } from './ban-cache.service';
import { BansRepository } from './bans.repository';
import { BanUserDto } from './dto/ban-user.dto';
import { BanResponseDto } from './dto/ban-response.dto';
import { UnbanResponseDto } from './dto/unban-response.dto';

@Injectable()
export class BansService {
  constructor(
    private readonly bans: BansRepository,
    private readonly banCache: BanCacheService,
    private readonly prisma: PrismaService,
  ) {}

  async banUser(
    targetUserId: string,
    adminId: string,
    dto: BanUserDto,
  ): Promise<BanResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!user) throw new UserNotFoundException();

    const existing = await this.bans.findActiveBan(targetUserId);
    if (existing) throw new AlreadyBannedException();

    const bannedUntil = dto.bannedUntil ? new Date(dto.bannedUntil) : null;

    const ban = await this.bans.create({
      userId: targetUserId,
      adminId,
      reason: dto.reason,
      bannedUntil,
    });

    // Revoke all refresh tokens immediately
    await this.prisma.token.deleteMany({
      where: { userId: targetUserId, type: TokenType.REFRESH },
    });

    // Cache ban in Redis (existing access tokens will be blocked on next request)
    await this.banCache.setBan(targetUserId, bannedUntil);

    return {
      id: ban.id,
      userId: ban.userId,
      adminId: ban.adminId,
      reason: ban.reason,
      bannedAt: ban.bannedAt,
      bannedUntil: ban.bannedUntil,
    };
  }

  async unbanUser(
    targetUserId: string,
    adminId: string,
  ): Promise<UnbanResponseDto> {
    const existing = await this.bans.findActiveBan(targetUserId);
    if (!existing) throw new NotBannedException();

    await this.bans.unban(existing.id, adminId);
    await this.banCache.removeBan(targetUserId);

    return { success: true, message: 'User unbanned successfully.' };
  }

  async getBanHistory(targetUserId: string): Promise<BanResponseDto[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!user) throw new UserNotFoundException();

    const bans = await this.bans.findAllByUser(targetUserId);

    return bans.map((ban) => ({
      id: ban.id,
      userId: ban.userId,
      adminId: ban.adminId,
      reason: ban.reason,
      bannedAt: ban.bannedAt,
      bannedUntil: ban.bannedUntil,
    }));
  }
}
