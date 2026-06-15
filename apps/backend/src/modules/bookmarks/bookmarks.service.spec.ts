import { Test } from '@nestjs/testing';

import {
  BookmarkAlreadyExistsException,
  BookmarkNotFoundException,
} from '../../common/exceptions/bookmark.exceptions';
import { isUniqueConstraintError } from '../../core/prisma/utils/prisma-error.util';
import {
  BOOKMARK_ID,
  makeBookmarkWithRelations,
} from '../../__test__/factories/bookmark.factory';
import { USER_ID } from '../../__test__/factories/user.factory';
import { BookmarksRepository } from './bookmarks.repository';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

jest.mock('../../core/prisma/utils/prisma-error.util');

const isUniqueConstraintErrorMock =
  isUniqueConstraintError as jest.MockedFunction<
    typeof isUniqueConstraintError
  >;

const repoMock = {
  findById: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  upsertState: jest.fn(),
  getState: jest.fn(),
  atomicTogglePin: jest.fn(),
  atomicToggleArchive: jest.fn(),
  incrementViews: jest.fn(),
  findUserTags: jest.fn(),
};

describe('BookmarksService', () => {
  let service: BookmarksService;

  beforeEach(async () => {
    jest.clearAllMocks();
    isUniqueConstraintErrorMock.mockReturnValue(false);

    const module = await Test.createTestingModule({
      providers: [
        BookmarksService,
        { provide: BookmarksRepository, useValue: repoMock },
      ],
    }).compile();

    service = module.get(BookmarksService);
  });

  describe('create', () => {
    const dto: CreateBookmarkDto = {
      url: 'https://example.com/article',
      title: 'Example Article',
      tags: ['typescript'],
    };

    it('creates a bookmark and returns mapped response', async () => {
      repoMock.create.mockResolvedValue(makeBookmarkWithRelations());

      const result = await service.create(USER_ID, dto);

      expect(repoMock.create).toHaveBeenCalledWith(
        USER_ID,
        expect.objectContaining({
          url: dto.url,
          title: dto.title,
          domain: 'example.com',
        }),
      );
      expect(result.id).toBe(BOOKMARK_ID);
      expect(result.domain).toBe('example.com');
    });

    it('throws BookmarkAlreadyExistsException on duplicate URL', async () => {
      repoMock.create.mockRejectedValue(new Error('Unique constraint'));
      isUniqueConstraintErrorMock.mockReturnValue(true);

      await expect(service.create(USER_ID, dto)).rejects.toThrow(
        BookmarkAlreadyExistsException,
      );
    });
  });

  describe('findAll', () => {
    it('returns paginated bookmarks', async () => {
      repoMock.findMany.mockResolvedValue({
        data: [makeBookmarkWithRelations()],
        total: 1,
      });

      const result = await service.findAll(USER_ID, { page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });
  });

  describe('findOne', () => {
    it('returns a bookmark when it exists and belongs to user', async () => {
      repoMock.findById.mockResolvedValue(makeBookmarkWithRelations());

      const result = await service.findOne(USER_ID, BOOKMARK_ID);

      expect(result.id).toBe(BOOKMARK_ID);
    });

    it('throws BookmarkNotFoundException when bookmark does not exist', async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.findOne(USER_ID, BOOKMARK_ID)).rejects.toThrow(
        BookmarkNotFoundException,
      );
    });
  });

  describe('update', () => {
    const dto: UpdateBookmarkDto = { title: 'Updated Title' };

    it('updates and returns the bookmark', async () => {
      repoMock.findById.mockResolvedValue(makeBookmarkWithRelations());
      repoMock.update.mockResolvedValue(
        makeBookmarkWithRelations({ title: 'Updated Title' }),
      );

      const result = await service.update(USER_ID, BOOKMARK_ID, dto);

      expect(repoMock.update).toHaveBeenCalledWith(
        BOOKMARK_ID,
        USER_ID,
        expect.objectContaining({ title: 'Updated Title' }),
      );
      expect(result.title).toBe('Updated Title');
    });

    it('throws BookmarkNotFoundException when bookmark does not exist', async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.update(USER_ID, BOOKMARK_ID, dto)).rejects.toThrow(
        BookmarkNotFoundException,
      );
      expect(repoMock.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deletes the bookmark', async () => {
      repoMock.findById.mockResolvedValue(makeBookmarkWithRelations());
      repoMock.delete.mockResolvedValue(undefined);

      await service.delete(USER_ID, BOOKMARK_ID);

      expect(repoMock.delete).toHaveBeenCalledWith(BOOKMARK_ID, USER_ID);
    });

    it('throws BookmarkNotFoundException when bookmark does not exist', async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.delete(USER_ID, BOOKMARK_ID)).rejects.toThrow(
        BookmarkNotFoundException,
      );
      expect(repoMock.delete).not.toHaveBeenCalled();
    });
  });

  describe('recordView', () => {
    it('increments views when bookmark exists', async () => {
      repoMock.findById.mockResolvedValue(makeBookmarkWithRelations());
      repoMock.incrementViews.mockResolvedValue(undefined);

      await service.recordView(USER_ID, BOOKMARK_ID);

      expect(repoMock.incrementViews).toHaveBeenCalledWith(
        BOOKMARK_ID,
        USER_ID,
      );
    });

    it('throws BookmarkNotFoundException when bookmark does not exist', async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.recordView(USER_ID, BOOKMARK_ID)).rejects.toThrow(
        BookmarkNotFoundException,
      );
      expect(repoMock.incrementViews).not.toHaveBeenCalled();
    });
  });

  describe('togglePin', () => {
    it('calls atomicTogglePin and returns updated bookmark', async () => {
      repoMock.findById.mockResolvedValue(makeBookmarkWithRelations());
      repoMock.atomicTogglePin.mockResolvedValue(undefined);

      await service.togglePin(USER_ID, BOOKMARK_ID);

      expect(repoMock.atomicTogglePin).toHaveBeenCalledWith(
        USER_ID,
        BOOKMARK_ID,
      );
    });

    it('throws BookmarkNotFoundException when bookmark does not exist', async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.togglePin(USER_ID, BOOKMARK_ID)).rejects.toThrow(
        BookmarkNotFoundException,
      );
      expect(repoMock.atomicTogglePin).not.toHaveBeenCalled();
    });
  });

  describe('toggleArchive', () => {
    it('calls atomicToggleArchive and returns updated bookmark', async () => {
      repoMock.findById.mockResolvedValue(makeBookmarkWithRelations());
      repoMock.atomicToggleArchive.mockResolvedValue(undefined);

      await service.toggleArchive(USER_ID, BOOKMARK_ID);

      expect(repoMock.atomicToggleArchive).toHaveBeenCalledWith(
        USER_ID,
        BOOKMARK_ID,
      );
    });

    it('throws BookmarkNotFoundException when bookmark does not exist', async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.toggleArchive(USER_ID, BOOKMARK_ID)).rejects.toThrow(
        BookmarkNotFoundException,
      );
      expect(repoMock.atomicToggleArchive).not.toHaveBeenCalled();
    });
  });
});
