import { Injectable } from '@nestjs/common';
import { Prisma, User, UserStatus } from '@prisma/client';

import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateUserInputDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByIdWithProfile(
    id: string,
  ): Promise<Prisma.UserGetPayload<{ include: { profile: true } }> | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByEmailWithProfile(
    email: string,
  ): Promise<Prisma.UserGetPayload<{ include: { profile: true } }> | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  createWithProfile(data: CreateUserInputDto): Promise<User> {
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

  updatePassword(id: string, hashedPassword: string): Promise<void> {
    return this.prisma.user
      .update({ where: { id }, data: { password: hashedPassword } })
      .then();
  }

  updateStatus(id: string, status: UserStatus): Promise<void> {
    return this.prisma.user
      .updateMany({ where: { id, status: { not: status } }, data: { status } })
      .then();
  }
}
