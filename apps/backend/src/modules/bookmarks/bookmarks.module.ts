import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/prisma/prisma.module';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksRepository } from './bookmarks.repository';
import { BookmarksService } from './bookmarks.service';

@Module({
  imports: [PrismaModule],
  controllers: [BookmarksController],
  providers: [BookmarksRepository, BookmarksService],
})
export class BookmarksModule {}
