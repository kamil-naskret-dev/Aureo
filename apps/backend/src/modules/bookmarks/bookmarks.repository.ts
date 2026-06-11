import { Injectable } from '@nestjs/common';
import { Bookmark, Prisma, UserBookmarkState } from '@prisma/client';

import { PrismaService } from '../../core/prisma/prisma.service';
import { BookmarkSort } from './dto/bookmark-query.dto';

export type BookmarkWithRelations = Prisma.BookmarkGetPayload<{
  include: { tags: { include: { tag: true } }; userStates: true };
}>;

export type BookmarkFilters = {
  search?: string;
  tags?: string[];
  archived?: boolean;
  pinned?: boolean;
  sort?: BookmarkSort;
};

@Injectable()
export class BookmarksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
    userId: string,
  ): Promise<BookmarkWithRelations | null> {
    return this.prisma.bookmark.findUnique({
      where: { id, userId },
      include: { tags: { include: { tag: true } }, userStates: true },
    });
  }

  async findMany(
    userId: string,
    filters: BookmarkFilters,
    page: number,
    limit: number,
  ): Promise<{ data: BookmarkWithRelations[]; total: number }> {
    const where = this.buildWhereClause(userId, filters);

    const orderBy = this.buildOrderBy(filters.sort);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.bookmark.findMany({
        where,
        include: { tags: { include: { tag: true } }, userStates: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.bookmark.count({ where }),
    ]);

    return { data, total };
  }

  async create(
    userId: string,
    data: {
      url: string;
      title: string;
      description?: string;
      domain: string;
      tags?: string[];
    },
  ): Promise<BookmarkWithRelations> {
    return this.prisma.bookmark.create({
      data: {
        userId,
        url: data.url,
        title: data.title,
        description: data.description,
        domain: data.domain,
        tags: data.tags?.length
          ? {
              create: data.tags.map((name) => ({
                tag: {
                  connectOrCreate: {
                    where: { name },
                    create: { name },
                  },
                },
              })),
            }
          : undefined,
      },
      include: { tags: { include: { tag: true } }, userStates: true },
    });
  }

  async update(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      tags?: string[];
    },
  ): Promise<BookmarkWithRelations> {
    return this.prisma.bookmark.update({
      where: { id, userId },
      data: {
        title: data.title,
        description: data.description,
        tags:
          data.tags !== undefined
            ? {
                deleteMany: {},
                create: data.tags.map((name) => ({
                  tag: {
                    connectOrCreate: {
                      where: { name },
                      create: { name },
                    },
                  },
                })),
              }
            : undefined,
      },
      include: { tags: { include: { tag: true } }, userStates: true },
    });
  }

  async delete(id: string, userId: string): Promise<Bookmark> {
    return this.prisma.bookmark.delete({ where: { id, userId } });
  }

  async upsertState(
    userId: string,
    bookmarkId: string,
    data: Partial<
      Pick<UserBookmarkState, 'pinned' | 'pinnedAt' | 'archived' | 'archivedAt'>
    >,
  ): Promise<UserBookmarkState> {
    return this.prisma.userBookmarkState.upsert({
      where: { userId_bookmarkId: { userId, bookmarkId } },
      create: { userId, bookmarkId, ...data },
      update: data,
    });
  }

  async getState(
    userId: string,
    bookmarkId: string,
  ): Promise<UserBookmarkState | null> {
    return this.prisma.userBookmarkState.findUnique({
      where: { userId_bookmarkId: { userId, bookmarkId } },
    });
  }

  private buildOrderBy(
    sort?: BookmarkSort,
  ): Prisma.BookmarkOrderByWithRelationInput {
    switch (sort) {
      case BookmarkSort.MOST_VISITED:
        return { views: 'desc' };
      case BookmarkSort.RECENTLY_VISITED:
        return { updatedAt: 'desc' };
      default:
        return { createdAt: 'desc' };
    }
  }

  private buildWhereClause(
    userId: string,
    filters: BookmarkFilters,
  ): Prisma.BookmarkWhereInput {
    const where: Prisma.BookmarkWhereInput = { userId };

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { url: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.tags?.length) {
      where.tags = {
        some: { tag: { name: { in: filters.tags } } },
      };
    }

    if (filters.archived !== undefined || filters.pinned !== undefined) {
      const stateFilter: Prisma.UserBookmarkStateWhereInput = { userId };
      if (filters.archived !== undefined)
        stateFilter.archived = filters.archived;
      if (filters.pinned !== undefined) stateFilter.pinned = filters.pinned;
      where.userStates = { some: stateFilter };
    }

    return where;
  }
}
