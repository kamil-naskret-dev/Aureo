import { Test } from '@nestjs/testing';

import { REDIS_CLIENT } from '../../core/redis/redis.module';
import { BanCacheService } from './ban-cache.service';

const redisMock = {
  set: jest.fn(),
  del: jest.fn(),
  exists: jest.fn(),
};

describe('BanCacheService', () => {
  let service: BanCacheService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        BanCacheService,
        { provide: REDIS_CLIENT, useValue: redisMock },
      ],
    }).compile();

    service = module.get(BanCacheService);
  });

  describe('setBan', () => {
    it('sets key with computed TTL for a temporary ban', async () => {
      const future = new Date(Date.now() + 60_000);
      await service.setBan('user-1', future);

      expect(redisMock.set).toHaveBeenCalledWith(
        'ban:user-1',
        '1',
        'EX',
        expect.any(Number),
      );
      const ttl = redisMock.set.mock.calls[0][3] as number;
      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(60);
    });

    it('sets key with 30-year TTL for a permanent ban (null)', async () => {
      await service.setBan('user-1', null);

      expect(redisMock.set).toHaveBeenCalledWith(
        'ban:user-1',
        '1',
        'EX',
        60 * 60 * 24 * 365 * 30,
      );
    });

    it('sets key with 30-year TTL for a permanent ban (undefined)', async () => {
      await service.setBan('user-1');

      expect(redisMock.set).toHaveBeenCalledWith(
        'ban:user-1',
        '1',
        'EX',
        60 * 60 * 24 * 365 * 30,
      );
    });

    it('falls through to permanent ban when bannedUntil is in the past', async () => {
      const past = new Date(Date.now() - 10_000);
      await service.setBan('user-1', past);

      expect(redisMock.set).toHaveBeenCalledWith(
        'ban:user-1',
        '1',
        'EX',
        60 * 60 * 24 * 365 * 30,
      );
    });
  });

  describe('removeBan', () => {
    it('deletes the Redis key for the user', async () => {
      await service.removeBan('user-1');
      expect(redisMock.del).toHaveBeenCalledWith('ban:user-1');
    });
  });

  describe('isBanned', () => {
    it('returns true when key exists in Redis', async () => {
      redisMock.exists.mockResolvedValue(1);

      await expect(service.isBanned('user-1')).resolves.toBe(true);
      expect(redisMock.exists).toHaveBeenCalledWith('ban:user-1');
    });

    it('returns false when key does not exist in Redis', async () => {
      redisMock.exists.mockResolvedValue(0);

      await expect(service.isBanned('user-1')).resolves.toBe(false);
    });
  });
});
