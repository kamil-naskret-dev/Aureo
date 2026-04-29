import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { TokenService } from '../token/token.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { isUniqueConstraintError } from '../prisma/utils/prisma-error.util';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly tokens: TokenService,
    private readonly jwt: JwtService,
  ) {}

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
        message: 'Account created. Please verify your email.',
      };
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('Email already in use');
      }
      throw error;
    }
  }

  async login(
    dto: LoginDto,
    meta: { userAgent?: string; ipAddress?: string },
  ): Promise<{ response: LoginResponseDto; refreshToken: string }> {
    const user = await this.users.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === UserStatus.PENDING) {
      throw new ForbiddenException('Please verify your email first');
    }

    const accessToken = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await this.tokens.createRefreshToken({
      userId: user.id,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    });

    return {
      response: {
        accessToken,
        user: { id: user.id, email: user.email, role: user.role },
      },
      refreshToken,
    };
  }
}
