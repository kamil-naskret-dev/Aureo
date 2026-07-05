import { Injectable } from '@nestjs/common';
import { Prisma, User, UserStatus } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';

import { UserNotFoundException } from '../../common/exceptions/user.exceptions';
import { CreateUserInputDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  findById(id: string): Promise<User | null> {
    return this.repo.findById(id);
  }

  findByIdWithProfile(
    id: string,
  ): Promise<Prisma.UserGetPayload<{ include: { profile: true } }> | null> {
    return this.repo.findByIdWithProfile(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findByEmail(email);
  }

  findByEmailWithProfile(
    email: string,
  ): Promise<Prisma.UserGetPayload<{ include: { profile: true } }> | null> {
    return this.repo.findByEmailWithProfile(email);
  }

  async getProfile(
    id: string,
  ): Promise<Prisma.UserGetPayload<{ include: { profile: true } }>> {
    const user = await this.repo.findByIdWithProfile(id);

    if (!user) throw new UserNotFoundException();

    return user;
  }

  create(data: CreateUserInputDto): Promise<User> {
    return this.repo.createWithProfile(data);
  }

  activateUser(id: string): Promise<void> {
    return this.repo.updateStatus(id, UserStatus.ACTIVE);
  }

  updatePassword(id: string, hashedPassword: string): Promise<void> {
    return this.repo.updatePassword(id, hashedPassword);
  }

  async updateAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    await this.deleteAvatarFile(userId);
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    await this.repo.updateAvatarUrl(userId, avatarUrl);
    return avatarUrl;
  }

  async removeAvatar(userId: string): Promise<void> {
    await this.deleteAvatarFile(userId);
    await this.repo.updateAvatarUrl(userId, null);
  }

  private async deleteAvatarFile(userId: string): Promise<void> {
    const oldUrl = await this.repo.findAvatarUrl(userId);
    if (!oldUrl) return;
    const segments = oldUrl.split('/');
    const filename = segments[segments.length - 1] ?? '';
    if (!filename) return;
    const filepath = join(process.cwd(), 'uploads', 'avatars', filename);
    await unlink(filepath).catch(() => {});
  }
}
