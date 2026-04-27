import { Injectable } from '@nestjs/common';
import { User, UserStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInputDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
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
