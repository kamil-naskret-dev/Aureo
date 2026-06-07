import { UserRole, UserStatus } from '@prisma/client';

export const USER_ID = 'user-id';

export const makeUser = (overrides: Record<string, unknown> = {}) => ({
  id: USER_ID,
  email: 'test@test.com',
  password: 'hashed-password',
  status: UserStatus.PENDING,
  role: UserRole.USER,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

export const makeUserWithProfile = (
  overrides: Record<string, unknown> = {},
) => ({
  ...makeUser({ status: UserStatus.ACTIVE, ...overrides }),
  profile: {
    id: 'profile-id',
    userId: USER_ID,
    name: 'Test User',
    avatarUrl: null,
    bio: null,
    lastActiveAt: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
});
