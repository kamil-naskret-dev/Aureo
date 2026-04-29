import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import * as Express from 'express';

import { SWAGGER_TAGS } from '../common/constants/swagger.constants';
import { REFRESH_TOKEN_TTL_MS } from '../token/token.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

const REFRESH_TOKEN_COOKIE = 'refreshToken';

@ApiTags(SWAGGER_TAGS.AUTH)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiCreatedResponse({
    type: RegisterResponseDto,
    description: 'User registered successfully.',
  })
  @ApiConflictResponse({ description: 'Email is already in use.' })
  @ApiBadRequestResponse({
    description: 'Validation failed (invalid email, password too short, etc.).',
  })
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive tokens' })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  @ApiForbiddenResponse({ description: 'Email not verified.' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Express.Request,
    @Res({ passthrough: true }) res: Express.Response,
  ): Promise<LoginResponseDto> {
    const { response, refreshToken } = await this.authService.login(dto, {
      userAgent: req.headers['user-agent'] ?? 'unknown',
      ipAddress: req.ip ?? req.socket?.remoteAddress ?? 'unknown',
    });

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_TTL_MS,
      path: '/',
    });

    return response;
  }
}
