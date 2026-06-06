import { Injectable } from '@nestjs/common';
import { Ban } from '@prisma/client';

import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class BansRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveBan(userId: string): Promise<Ban | null> {
    return this.prisma.ban.findFirst({
      where: {
        userId,
        unbannedAt: null,
        OR: [{ bannedUntil: null }, { bannedUntil: { gt: new Date() } }],
      },
      orderBy: { bannedAt: 'desc' },
    });
  }

  async findAllByUser(userId: string): Promise<Ban[]> {
    return this.prisma.ban.findMany({
      where: { userId },
      orderBy: { bannedAt: 'desc' },
    });
  }

  async create(data: {
    userId: string;
    adminId: string;
    reason: string;
    bannedUntil?: Date | null;
  }): Promise<Ban> {
    return this.prisma.ban.create({ data });
  }

  async unban(banId: string, adminId: string): Promise<Ban> {
    return this.prisma.ban.update({
      where: { id: banId },
      data: { unbannedAt: new Date(), unbannedById: adminId },
    });
  }
}
