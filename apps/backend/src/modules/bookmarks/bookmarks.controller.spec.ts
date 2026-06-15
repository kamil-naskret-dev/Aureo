import { Test } from '@nestjs/testing';
import { UserRole } from '@prisma/client';

import { JwtPayload } from '../../common/types/jwt-payload.type';
import {
  BOOKMARK_ID,
  makeBookmarkWithRelations,
} from '../../__test__/factories/bookmark.factory';
import { USER_ID } from '../../__test__/factories/user.factory';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import {
  BookmarkQueryDto,
  BookmarkTagQueryDto,
} from './dto/bookmark-query.dto';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

const mockUser: JwtPayload = {
  sub: USER_ID,
  email: 'test@test.com',
  role: UserRole.USER,
  iat: 0,
  exp: 9_999_999_999,
};

const serviceMock = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findTags: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  togglePin: jest.fn(),
  toggleArchive: jest.fn(),
  recordView: jest.fn(),
};

describe('BookmarksController', () => {
  let controller: BookmarksController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      controllers: [BookmarksController],
      providers: [{ provide: BookmarksService, useValue: serviceMock }],
    }).compile();

    controller = module.get(BookmarksController);
  });

  describe('create', () => {
    it('delegates to service.create with userId and dto', async () => {
      const dto: CreateBookmarkDto = {
        url: 'https://example.com',
        title: 'Example',
      };
      const response = makeBookmarkWithRelations();
      serviceMock.create.mockResolvedValue(response);

      const result = await controller.create(mockUser, dto);

      expect(serviceMock.create).toHaveBeenCalledWith(USER_ID, dto);
      expect(result).toBe(response);
    });
  });

  describe('findAll', () => {
    it('delegates to service.findAll with userId and query', async () => {
      const query: BookmarkQueryDto = { page: 1, limit: 20 };
      const response = { data: [], total: 0, page: 1, limit: 20 };
      serviceMock.findAll.mockResolvedValue(response);

      const result = await controller.findAll(mockUser, query);

      expect(serviceMock.findAll).toHaveBeenCalledWith(USER_ID, query);
      expect(result).toBe(response);
    });
  });

  describe('findTags', () => {
    it('delegates to service.findTags with userId and archived=false', async () => {
      const query: BookmarkTagQueryDto = { archived: false };
      const response = [{ name: 'typescript', count: 3 }];
      serviceMock.findTags.mockResolvedValue(response);

      const result = await controller.findTags(mockUser, query);

      expect(serviceMock.findTags).toHaveBeenCalledWith(USER_ID, false);
      expect(result).toBe(response);
    });

    it('delegates to service.findTags with archived=true', async () => {
      const query: BookmarkTagQueryDto = { archived: true };
      serviceMock.findTags.mockResolvedValue([]);

      await controller.findTags(mockUser, query);

      expect(serviceMock.findTags).toHaveBeenCalledWith(USER_ID, true);
    });
  });

  describe('findOne', () => {
    it('delegates to service.findOne with userId and id', async () => {
      const response = makeBookmarkWithRelations();
      serviceMock.findOne.mockResolvedValue(response);

      const result = await controller.findOne(mockUser, BOOKMARK_ID);

      expect(serviceMock.findOne).toHaveBeenCalledWith(USER_ID, BOOKMARK_ID);
      expect(result).toBe(response);
    });
  });

  describe('update', () => {
    it('delegates to service.update with userId, id and dto', async () => {
      const dto: UpdateBookmarkDto = { title: 'Updated Title' };
      const response = makeBookmarkWithRelations({ title: 'Updated Title' });
      serviceMock.update.mockResolvedValue(response);

      const result = await controller.update(mockUser, BOOKMARK_ID, dto);

      expect(serviceMock.update).toHaveBeenCalledWith(
        USER_ID,
        BOOKMARK_ID,
        dto,
      );
      expect(result).toBe(response);
    });
  });

  describe('delete', () => {
    it('delegates to service.delete with userId and id', async () => {
      serviceMock.delete.mockResolvedValue(undefined);

      await controller.delete(mockUser, BOOKMARK_ID);

      expect(serviceMock.delete).toHaveBeenCalledWith(USER_ID, BOOKMARK_ID);
    });
  });

  describe('togglePin', () => {
    it('delegates to service.togglePin with userId and id', async () => {
      const response = makeBookmarkWithRelations();
      serviceMock.togglePin.mockResolvedValue(response);

      const result = await controller.togglePin(mockUser, BOOKMARK_ID);

      expect(serviceMock.togglePin).toHaveBeenCalledWith(USER_ID, BOOKMARK_ID);
      expect(result).toBe(response);
    });
  });

  describe('toggleArchive', () => {
    it('delegates to service.toggleArchive with userId and id', async () => {
      const response = makeBookmarkWithRelations();
      serviceMock.toggleArchive.mockResolvedValue(response);

      const result = await controller.toggleArchive(mockUser, BOOKMARK_ID);

      expect(serviceMock.toggleArchive).toHaveBeenCalledWith(
        USER_ID,
        BOOKMARK_ID,
      );
      expect(result).toBe(response);
    });
  });

  describe('recordView', () => {
    it('delegates to service.recordView with userId and id', async () => {
      serviceMock.recordView.mockResolvedValue(undefined);

      await controller.recordView(mockUser, BOOKMARK_ID);

      expect(serviceMock.recordView).toHaveBeenCalledWith(USER_ID, BOOKMARK_ID);
    });
  });
});
