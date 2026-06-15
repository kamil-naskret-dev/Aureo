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

export type TagWithCount = {
  name: string;
  count: number;
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
    const orderSql = this.buildRawOrderBy(filters.sort);
    const conditions = this.buildRawConditions(userId, filters);
    const whereSql = Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`;

    const [rows, countResult] = await this.prisma.$transaction([
      this.prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
        SELECT b.id
        FROM "Bookmark" b
        LEFT JOIN "UserBookmarkState" ubs
          ON b.id = ubs."bookmarkId" AND ubs."userId" = ${userId}
        ${whereSql}
        ORDER BY COALESCE(ubs.pinned, false) DESC, ${orderSql}
        LIMIT ${limit} OFFSET ${(page - 1) * limit}
      `),
      this.prisma.$queryRaw<[{ count: bigint }]>(Prisma.sql`
        SELECT COUNT(*) as count
        FROM "Bookmark" b
        LEFT JOIN "UserBookmarkState" ubs
          ON b.id = ubs."bookmarkId" AND ubs."userId" = ${userId}
        ${whereSql}
      `),
    ]);

    const total = Number(countResult[0].count);

    if (rows.length === 0) return { data: [], total };

    const ids = rows.map((r) => r.id);

    const unsorted = await this.prisma.bookmark.findMany({
      where: { id: { in: ids } },
      include: { tags: { include: { tag: true } }, userStates: true },
    });

    const data = ids.map((id) => unsorted.find((b) => b.id === id)!);

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

  async findUserTags(
    userId: string,
    archived: boolean,
  ): Promise<TagWithCount[]> {
    const rows = await this.prisma.$queryRaw<TagWithCount[]>(Prisma.sql`
      SELECT t.name, COUNT(bt."bookmarkId")::int AS count
      FROM "Tag" t
      JOIN "BookmarkTag" bt ON bt."tagId" = t.id
      JOIN "Bookmark" b ON b.id = bt."bookmarkId"
      LEFT JOIN "UserBookmarkState" ubs
        ON ubs."bookmarkId" = b.id AND ubs."userId" = ${userId}
      WHERE b."userId" = ${userId}
        AND COALESCE(ubs.archived, false) = ${archived}
      GROUP BY t.name
      ORDER BY count DESC, t.name ASC
    `);

    return rows;
  }

  private buildRawOrderBy(sort?: BookmarkSort): Prisma.Sql {
    switch (sort) {
      case BookmarkSort.MOST_VISITED:
        return Prisma.sql`b.views DESC`;
      case BookmarkSort.RECENTLY_VISITED:
        return Prisma.sql`b."updatedAt" DESC`;
      default:
        return Prisma.sql`b."createdAt" DESC`;
    }
  }

  private buildRawConditions(
    userId: string,
    filters: BookmarkFilters,
  ): Prisma.Sql[] {
    const conditions: Prisma.Sql[] = [Prisma.sql`b."userId" = ${userId}`];

    if (filters.search) {
      const term = `%${filters.search}%`;
      conditions.push(Prisma.sql`(
        b.title ILIKE ${term} OR
        b.description ILIKE ${term} OR
        b.url ILIKE ${term}
      )`);
    }

    if (filters.tags?.length) {
      conditions.push(Prisma.sql`EXISTS (
        SELECT 1 FROM "BookmarkTag" bt
        JOIN "Tag" t ON bt."tagId" = t.id
        WHERE bt."bookmarkId" = b.id
        AND t.name IN (${Prisma.join(filters.tags)})
      )`);
    }

    if (filters.archived !== undefined) {
      conditions.push(
        Prisma.sql`COALESCE(ubs.archived, false) = ${filters.archived}`,
      );
    }

    if (filters.pinned !== undefined) {
      conditions.push(
        Prisma.sql`COALESCE(ubs.pinned, false) = ${filters.pinned}`,
      );
    }

    return conditions;
  }
}
