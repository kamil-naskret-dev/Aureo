import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/prisma/prisma.module';
import { RedisModule } from '../../core/redis/redis.module';
import { BanCacheService } from './ban-cache.service';
import { BansController } from './bans.controller';
import { BansRepository } from './bans.repository';
import { BansService } from './bans.service';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [BansController],
  providers: [BansRepository, BanCacheService, BansService],
  exports: [BanCacheService],
})
export class BansModule {}
