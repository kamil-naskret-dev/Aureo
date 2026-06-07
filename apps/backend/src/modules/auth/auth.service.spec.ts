import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import {
  EmailNotVerifiedException,
  InvalidCredentialsException,
} from '../../common/exceptions/auth.exceptions';
import { UserBannedException } from '../../common/exceptions/ban.exceptions';
import {
  InvalidRefreshTokenException,
  MissingRefreshTokenException,
} from '../../common/exceptions/token.exceptions';
import { UserAlreadyExistsException } from '../../common/exceptions/user.exceptions';
import { isUniqueConstraintError } from '../../core/prisma/utils/prisma-error.util';
import { NotificationsService } from '../../core/notifications/notifications.service';
import {
  USER_ID,
  makeUser,
  makeUserWithProfile,
} from '../../__test__/factories/user.factory';
import { createBanCacheMock } from '../../__test__/mocks/ban-cache.mock';
import { BanCacheService } from '../bans/ban-cache.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { TokenService } from './infrastructure/token/token.service';

jest.mock('bcrypt');
jest.mock('../../core/prisma/utils/prisma-error.util');

const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;
const isUniqueConstraintErrorMock =
  isUniqueConstraintError as jest.MockedFunction<
    typeof isUniqueConstraintError
  >;

const META = { userAgent: 'jest', ipAddress: '127.0.0.1' };

const usersMock = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findByEmailWithProfile: jest.fn(),
  findByIdWithProfile: jest.fn(),
  activateUser: jest.fn(),
  updatePassword: jest.fn(),
};

const tokensMock = {
  createRefreshToken: jest.fn(),
  createEmailVerifyToken: jest.fn(),
  createPasswordResetToken: jest.fn(),
  consumeEmailVerifyToken: jest.fn(),
  consumePasswordResetToken: jest.fn(),
  deleteByRawToken: jest.fn(),
  deleteAllRefreshTokens: jest.fn(),
  rotateRefreshToken: jest.fn(),
};

const jwtMock = { sign: jest.fn() };
const notificationsMock = { send: jest.fn() };
const configMock = {
  getOrThrow: jest
    .fn()
    .mockReturnValue({ frontendUrl: 'http://localhost:5173' }),
};

describe('AuthService', () => {
  let service: AuthService;
  let banCacheMock: ReturnType<typeof createBanCacheMock>;

  beforeEach(async () => {
    jest.clearAllMocks();
    banCacheMock = createBanCacheMock();
    isUniqueConstraintErrorMock.mockReturnValue(false);
    banCacheMock.isBanned.mockResolvedValue(false);
    jwtMock.sign.mockReturnValue('access-token');

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersMock },
        { provide: TokenService, useValue: tokensMock },
        { provide: JwtService, useValue: jwtMock },
        { provide: NotificationsService, useValue: notificationsMock },
        { provide: ConfigService, useValue: configMock },
        { provide: BanCacheService, useValue: banCacheMock },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('register', () => {
    it('creates a user, sends verification email, and returns success', async () => {
      bcryptMock.hash.mockResolvedValue('hashed' as never);
      usersMock.create.mockResolvedValue(makeUser());
      tokensMock.createEmailVerifyToken.mockResolvedValue('verify-token');

      const result = await service.register({
        name: 'Test User',
        email: 'test@test.com',
        password: 'Password1!',
      });

      expect(usersMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@test.com' }),
      );
      expect(tokensMock.createEmailVerifyToken).toHaveBeenCalledWith(USER_ID);
      expect(notificationsMock.send).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(true);
    });

    it('throws UserAlreadyExistsException when email is taken', async () => {
      bcryptMock.hash.mockResolvedValue('hashed' as never);
      usersMock.create.mockRejectedValue(new Error('Unique constraint'));
      isUniqueConstraintErrorMock.mockReturnValue(true);

      await expect(
        service.register({
          name: 'Test',
          email: 'test@test.com',
          password: 'Password1!',
        }),
      ).rejects.toThrow(UserAlreadyExistsException);
    });
  });

  describe('login', () => {
    it('returns accessToken and user on valid credentials', async () => {
      usersMock.findByEmailWithProfile.mockResolvedValue(makeUserWithProfile());
      bcryptMock.compare.mockResolvedValue(true as never);
      tokensMock.createRefreshToken.mockResolvedValue('refresh-token');

      const result = await service.login(
        { email: 'test@test.com', password: 'Password1!' },
        META,
      );

      expect(result.response.accessToken).toBe('access-token');
      expect(result.response.user.id).toBe(USER_ID);
      expect(result.refreshToken).toBe('refresh-token');
    });

    it('throws InvalidCredentialsException when user does not exist', async () => {
      usersMock.findByEmailWithProfile.mockResolvedValue(null);

      await expect(
        service.login({ email: 'x@x.com', password: 'pass' }, META),
      ).rejects.toThrow(InvalidCredentialsException);
    });

    it('throws InvalidCredentialsException when password is wrong', async () => {
      usersMock.findByEmailWithProfile.mockResolvedValue(makeUserWithProfile());
      bcryptMock.compare.mockResolvedValue(false as never);

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }, META),
      ).rejects.toThrow(InvalidCredentialsException);
    });

    it('throws EmailNotVerifiedException when account is PENDING', async () => {
      usersMock.findByEmailWithProfile.mockResolvedValue(
        makeUserWithProfile({ status: UserStatus.PENDING }),
      );
      bcryptMock.compare.mockResolvedValue(true as never);

      await expect(
        service.login({ email: 'test@test.com', password: 'Password1!' }, META),
      ).rejects.toThrow(EmailNotVerifiedException);
    });

    it('throws UserBannedException when account is banned in Redis', async () => {
      usersMock.findByEmailWithProfile.mockResolvedValue(makeUserWithProfile());
      bcryptMock.compare.mockResolvedValue(true as never);
      banCacheMock.isBanned.mockResolvedValue(true);

      await expect(
        service.login({ email: 'test@test.com', password: 'Password1!' }, META),
      ).rejects.toThrow(UserBannedException);
      expect(tokensMock.createRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('deletes the refresh token when one is provided', async () => {
      const result = await service.logout('raw-token');

      expect(tokensMock.deleteByRawToken).toHaveBeenCalledWith('raw-token');
      expect(result.success).toBe(true);
    });

    it('skips deletion and returns success when no token is provided', async () => {
      const result = await service.logout(undefined);

      expect(tokensMock.deleteByRawToken).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('refresh', () => {
    it('rotates the token and returns new access and refresh tokens', async () => {
      tokensMock.rotateRefreshToken.mockResolvedValue({
        rawToken: 'new-refresh-token',
        userId: USER_ID,
      });
      usersMock.findByIdWithProfile.mockResolvedValue(makeUserWithProfile());

      const result = await service.refresh('old-refresh-token', META);

      expect(result.response.accessToken).toBe('access-token');
      expect(result.newRefreshToken).toBe('new-refresh-token');
    });

    it('throws MissingRefreshTokenException when token is undefined', async () => {
      await expect(service.refresh(undefined, META)).rejects.toThrow(
        MissingRefreshTokenException,
      );
    });

    it('throws InvalidRefreshTokenException when user no longer exists after rotation', async () => {
      tokensMock.rotateRefreshToken.mockResolvedValue({
        rawToken: 'new-refresh-token',
        userId: USER_ID,
      });
      usersMock.findByIdWithProfile.mockResolvedValue(null);

      await expect(service.refresh('stale-token', META)).rejects.toThrow(
        InvalidRefreshTokenException,
      );
    });
  });

  describe('forgotPassword', () => {
    it('sends a reset email when user exists and is ACTIVE', async () => {
      usersMock.findByEmail.mockResolvedValue(
        makeUser({ status: UserStatus.ACTIVE }),
      );
      tokensMock.createPasswordResetToken.mockResolvedValue('reset-token');

      const result = await service.forgotPassword({ email: 'test@test.com' });

      expect(tokensMock.createPasswordResetToken).toHaveBeenCalledWith(USER_ID);
      expect(notificationsMock.send).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(true);
    });

    it('returns success silently when user does not exist', async () => {
      usersMock.findByEmail.mockResolvedValue(null);

      const result = await service.forgotPassword({ email: 'ghost@test.com' });

      expect(notificationsMock.send).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('returns success silently when user is PENDING', async () => {
      usersMock.findByEmail.mockResolvedValue(makeUser());

      const result = await service.forgotPassword({ email: 'test@test.com' });

      expect(notificationsMock.send).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('resetPassword', () => {
    it('consumes the token, updates password, and revokes all refresh tokens', async () => {
      tokensMock.consumePasswordResetToken.mockResolvedValue(USER_ID);
      bcryptMock.hash.mockResolvedValue('new-hashed' as never);

      const result = await service.resetPassword({
        token: 'reset-token',
        password: 'NewPass1!',
      });

      expect(usersMock.updatePassword).toHaveBeenCalledWith(
        USER_ID,
        'new-hashed',
      );
      expect(tokensMock.deleteAllRefreshTokens).toHaveBeenCalledWith(USER_ID);
      expect(result.success).toBe(true);
    });
  });

  describe('resendVerificationEmail', () => {
    it('sends a new verification email when user is PENDING', async () => {
      usersMock.findByEmail.mockResolvedValue(makeUser());
      tokensMock.createEmailVerifyToken.mockResolvedValue('verify-token');

      const result = await service.resendVerificationEmail({
        email: 'test@test.com',
      });

      expect(tokensMock.createEmailVerifyToken).toHaveBeenCalledWith(USER_ID);
      expect(notificationsMock.send).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(true);
    });

    it('returns success silently when user does not exist', async () => {
      usersMock.findByEmail.mockResolvedValue(null);

      const result = await service.resendVerificationEmail({
        email: 'ghost@test.com',
      });

      expect(notificationsMock.send).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('verifyEmail', () => {
    it('consumes the token and activates the user', async () => {
      tokensMock.consumeEmailVerifyToken.mockResolvedValue(USER_ID);

      const result = await service.verifyEmail('verify-token');

      expect(usersMock.activateUser).toHaveBeenCalledWith(USER_ID);
      expect(result.success).toBe(true);
    });
  });
});
