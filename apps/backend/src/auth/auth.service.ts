import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { isUniqueConstraintError } from '../prisma/utils/prisma-error.util';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService) {}

  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    try {
      await this.users.create({
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      });

      return {
        success: true,
        message: 'Account created.',
      };
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('Email already in use');
      }
      throw error;
    }
  }
}
