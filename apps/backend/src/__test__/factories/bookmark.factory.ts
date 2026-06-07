import { Bookmark } from '@prisma/client';

import { USER_ID } from './user.factory';

export const BOOKMARK_ID = 'bookmark-id';

export const makeBookmark = (overrides: Partial<Bookmark> = {}): Bookmark => ({
  id: BOOKMARK_ID,
  userId: USER_ID,
  url: 'https://example.com',
  title: 'Example',
  description: null,
  domain: 'example.com',
  views: 0,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

export const makeBookmarkWithRelations = (
  overrides: Partial<Bookmark> = {},
) => ({
  ...makeBookmark(overrides),
  tags: [],
  userStates: [],
});
