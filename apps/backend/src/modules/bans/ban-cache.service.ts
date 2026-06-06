import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { REDIS_CLIENT } from '../../core/redis/redis.module';

const BAN_KEY = (userId: string) => `ban:${userId}`;

@Injectable()
export class BanCacheService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async setBan(userId: string, bannedUntil?: Date | null): Promise<void> {
    const key = BAN_KEY(userId);

    if (bannedUntil) {
      const ttlSeconds = Math.ceil((bannedUntil.getTime() - Date.now()) / 1000);
      if (ttlSeconds > 0) {
        await this.redis.set(key, '1', 'EX', ttlSeconds);
        return;
      }
    }

    // Permanent ban
    await this.redis.set(key, '1', 'EX', 60 * 60 * 24 * 365 * 30);
  }

  async removeBan(userId: string): Promise<void> {
    await this.redis.del(BAN_KEY(userId));
  }

  async isBanned(userId: string): Promise<boolean> {
    const result = await this.redis.exists(BAN_KEY(userId));
    return result === 1;
  }
}
