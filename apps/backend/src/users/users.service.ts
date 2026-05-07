import { Injectable } from '@nestjs/common';
import { User, UserStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInputDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async activateUser(id: string): Promise<void> {
    await this.prisma.user.updateMany({
      where: { id, status: { not: UserStatus.ACTIVE } },
      data: { status: UserStatus.ACTIVE },
    });
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async create(data: CreateUserInputDto): Promise<User> {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: data.password,
          status: UserStatus.PENDING,
        },
      });

      await tx.userProfile.create({
        data: { userId: user.id, name: data.name },
      });

      return user;
    });
  }
}
