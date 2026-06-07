import { Ban } from '@prisma/client';

import { USER_ID } from './user.factory';

export const BAN_ID = 'ban-id';
export const ADMIN_ID = 'admin-id';

export const makeBan = (overrides: Partial<Ban> = {}): Ban => ({
  id: BAN_ID,
  userId: USER_ID,
  adminId: ADMIN_ID,
  reason: 'Spamming',
  bannedAt: new Date('2026-01-01'),
  bannedUntil: null,
  unbannedAt: null,
  unbannedById: null,
  ...overrides,
});
