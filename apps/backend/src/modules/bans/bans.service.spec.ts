import { Test } from '@nestjs/testing';
import { TokenType } from '@prisma/client';

import {
  AlreadyBannedException,
  NotBannedException,
} from '../../common/exceptions/ban.exceptions';
import { UserNotFoundException } from '../../common/exceptions/user.exceptions';
import { PrismaService } from '../../core/prisma/prisma.service';
import {
  ADMIN_ID,
  BAN_ID,
  makeBan,
} from '../../__test__/factories/ban.factory';
import { USER_ID } from '../../__test__/factories/user.factory';
import { createBanCacheMock } from '../../__test__/mocks/ban-cache.mock';
import { createPrismaMock } from '../../__test__/mocks/prisma.mock';
import { BanCacheService } from './ban-cache.service';
import { BansRepository } from './bans.repository';
import { BansService } from './bans.service';
import { BanUserDto } from './dto/ban-user.dto';

const bansRepositoryMock = {
  findActiveBan: jest.fn(),
  findAllByUser: jest.fn(),
  create: jest.fn(),
  unban: jest.fn(),
};

describe('BansService', () => {
  let service: BansService;
  let prismaMock: ReturnType<typeof createPrismaMock>;
  let banCacheMock: ReturnType<typeof createBanCacheMock>;

  beforeEach(async () => {
    jest.clearAllMocks();
    prismaMock = createPrismaMock();
    banCacheMock = createBanCacheMock();

    const module = await Test.createTestingModule({
      providers: [
        BansService,
        { provide: BansRepository, useValue: bansRepositoryMock },
        { provide: BanCacheService, useValue: banCacheMock },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(BansService);
  });

  describe('banUser', () => {
    const dto: BanUserDto = { reason: 'Spamming' };

    it('creates a permanent ban, revokes refresh tokens, and caches in Redis', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: USER_ID });
      bansRepositoryMock.findActiveBan.mockResolvedValue(null);
      bansRepositoryMock.create.mockResolvedValue(makeBan());
      prismaMock.token.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.banUser(USER_ID, ADMIN_ID, dto);

      expect(bansRepositoryMock.create).toHaveBeenCalledWith({
        userId: USER_ID,
        adminId: ADMIN_ID,
        reason: dto.reason,
        bannedUntil: null,
      });
      expect(prismaMock.token.deleteMany).toHaveBeenCalledWith({
        where: { userId: USER_ID, type: TokenType.REFRESH },
      });
      expect(banCacheMock.setBan).toHaveBeenCalledWith(USER_ID, null);
      expect(result.id).toBe(BAN_ID);
      expect(result.bannedUntil).toBeNull();
    });

    it('passes bannedUntil date to repository and cache for a temporary ban', async () => {
      const bannedUntil = new Date('2027-01-01');
      const dtoWithDate: BanUserDto = {
        reason: 'Harassment',
        bannedUntil: bannedUntil.toISOString(),
      };

      prismaMock.user.findUnique.mockResolvedValue({ id: USER_ID });
      bansRepositoryMock.findActiveBan.mockResolvedValue(null);
      bansRepositoryMock.create.mockResolvedValue(makeBan({ bannedUntil }));
      prismaMock.token.deleteMany.mockResolvedValue({ count: 0 });

      await service.banUser(USER_ID, ADMIN_ID, dtoWithDate);

      expect(bansRepositoryMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ bannedUntil }),
      );
      expect(banCacheMock.setBan).toHaveBeenCalledWith(USER_ID, bannedUntil);
    });

    it('throws UserNotFoundException when user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.banUser(USER_ID, ADMIN_ID, dto)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(bansRepositoryMock.create).not.toHaveBeenCalled();
    });

    it('throws AlreadyBannedException when an active ban already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: USER_ID });
      bansRepositoryMock.findActiveBan.mockResolvedValue(makeBan());

      await expect(service.banUser(USER_ID, ADMIN_ID, dto)).rejects.toThrow(
        AlreadyBannedException,
      );
      expect(bansRepositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('unbanUser', () => {
    it('unbans the user and removes the Redis cache entry', async () => {
      bansRepositoryMock.findActiveBan.mockResolvedValue(makeBan());
      bansRepositoryMock.unban.mockResolvedValue(
        makeBan({ unbannedAt: new Date() }),
      );

      const result = await service.unbanUser(USER_ID, ADMIN_ID);

      expect(bansRepositoryMock.unban).toHaveBeenCalledWith(BAN_ID, ADMIN_ID);
      expect(banCacheMock.removeBan).toHaveBeenCalledWith(USER_ID);
      expect(result).toEqual({
        success: true,
        message: 'User unbanned successfully.',
      });
    });

    it('throws NotBannedException when no active ban exists', async () => {
      bansRepositoryMock.findActiveBan.mockResolvedValue(null);

      await expect(service.unbanUser(USER_ID, ADMIN_ID)).rejects.toThrow(
        NotBannedException,
      );
      expect(bansRepositoryMock.unban).not.toHaveBeenCalled();
    });
  });

  describe('getBanHistory', () => {
    it('returns mapped ban history for an existing user', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: USER_ID });
      bansRepositoryMock.findAllByUser.mockResolvedValue([makeBan()]);

      const result = await service.getBanHistory(USER_ID);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: BAN_ID,
        userId: USER_ID,
        reason: 'Spamming',
      });
    });

    it('throws UserNotFoundException when user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.getBanHistory(USER_ID)).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });
});
