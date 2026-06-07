import { Injectable } from '@nestjs/common';

import {
  BookmarkAlreadyExistsException,
  BookmarkNotFoundException,
} from '../../common/exceptions/bookmark.exceptions';
import { isUniqueConstraintError } from '../../core/prisma/utils/prisma-error.util';
import {
  BookmarksRepository,
  BookmarkWithRelations,
} from './bookmarks.repository';
import { BookmarkQueryDto } from './dto/bookmark-query.dto';
import {
  BookmarkResponseDto,
  PaginatedBookmarksDto,
} from './dto/bookmark-response.dto';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(private readonly bookmarks: BookmarksRepository) {}

  async create(
    userId: string,
    dto: CreateBookmarkDto,
  ): Promise<BookmarkResponseDto> {
    const domain = new URL(dto.url).hostname;

    try {
      const bookmark = await this.bookmarks.create(userId, {
        url: dto.url,
        title: dto.title,
        description: dto.description,
        domain,
        tags: dto.tags,
      });
      return this.mapToResponse(bookmark, userId);
    } catch (error) {
      if (isUniqueConstraintError(error))
        throw new BookmarkAlreadyExistsException();
      throw error;
    }
  }

  async findAll(
    userId: string,
    query: BookmarkQueryDto,
  ): Promise<PaginatedBookmarksDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const { data, total } = await this.bookmarks.findMany(
      userId,
      {
        search: query.search,
        tags: query.tags,
        archived: query.archived,
        pinned: query.pinned,
      },
      page,
      limit,
    );

    return {
      data: data.map((b) => this.mapToResponse(b, userId)),
      total,
      page,
      limit,
    };
  }

  async findOne(userId: string, id: string): Promise<BookmarkResponseDto> {
    const bookmark = await this.bookmarks.findById(id, userId);
    if (!bookmark) throw new BookmarkNotFoundException();
    return this.mapToResponse(bookmark, userId);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateBookmarkDto,
  ): Promise<BookmarkResponseDto> {
    const existing = await this.bookmarks.findById(id, userId);
    if (!existing) throw new BookmarkNotFoundException();

    const bookmark = await this.bookmarks.update(id, userId, {
      title: dto.title,
      description: dto.description,
      tags: dto.tags,
    });
    return this.mapToResponse(bookmark, userId);
  }

  async delete(userId: string, id: string): Promise<void> {
    const existing = await this.bookmarks.findById(id, userId);
    if (!existing) throw new BookmarkNotFoundException();
    await this.bookmarks.delete(id, userId);
  }

  async togglePin(userId: string, id: string): Promise<BookmarkResponseDto> {
    const bookmark = await this.bookmarks.findById(id, userId);
    if (!bookmark) throw new BookmarkNotFoundException();

    const currentState = await this.bookmarks.getState(userId, id);
    const pinned = !currentState?.pinned;

    await this.bookmarks.upsertState(userId, id, {
      pinned,
      pinnedAt: pinned ? new Date() : null,
    });

    const updated = await this.bookmarks.findById(id, userId);
    return this.mapToResponse(updated!, userId);
  }

  async toggleArchive(
    userId: string,
    id: string,
  ): Promise<BookmarkResponseDto> {
    const bookmark = await this.bookmarks.findById(id, userId);
    if (!bookmark) throw new BookmarkNotFoundException();

    const currentState = await this.bookmarks.getState(userId, id);
    const archived = !currentState?.archived;

    await this.bookmarks.upsertState(userId, id, {
      archived,
      archivedAt: archived ? new Date() : null,
    });

    const updated = await this.bookmarks.findById(id, userId);
    return this.mapToResponse(updated!, userId);
  }

  private mapToResponse(
    bookmark: BookmarkWithRelations,
    userId: string,
  ): BookmarkResponseDto {
    const state = bookmark.userStates.find((s) => s.userId === userId);

    return {
      id: bookmark.id,
      url: bookmark.url,
      title: bookmark.title,
      description: bookmark.description,
      domain: bookmark.domain,
      views: bookmark.views,
      createdAt: bookmark.createdAt,
      updatedAt: bookmark.updatedAt,
      tags: bookmark.tags.map((bt) => bt.tag.name),
      state: state ? { pinned: state.pinned, archived: state.archived } : null,
    };
  }
}
