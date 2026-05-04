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
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RequestMeta } from '../common/decorators/request-meta.decorator';
import { type RequestMetaType } from '../common/types/request-meta.type';
import { CookieService } from './infrastructure/cookie/cookie.service';

@ApiTags(SWAGGER_TAGS.AUTH)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

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
    @RequestMeta() meta: RequestMetaType,
    @Res({ passthrough: true }) res: Express.Response,
  ): Promise<LoginResponseDto> {
    const { response, refreshToken } = await this.authService.login(dto, meta);

    this.cookieService.setRefreshToken(res, refreshToken);

    return response;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid refresh token.' })
  @ApiForbiddenResponse({ description: 'Account banned.' })
  async refresh(
    @Req() req: Express.Request,
    @RequestMeta() meta: RequestMetaType,
    @Res({ passthrough: true }) res: Express.Response,
  ): Promise<LoginResponseDto> {
    const refreshToken = this.cookieService.getRefreshToken(req);

    const { response, newRefreshToken } = await this.authService.refresh(
      refreshToken,
      meta,
    );

    this.cookieService.setRefreshToken(res, newRefreshToken);

    return response;
  }
}
