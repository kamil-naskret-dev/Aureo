import { Injectable } from '@nestjs/common';
import { Prisma, User, UserStatus } from '@prisma/client';

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
}
