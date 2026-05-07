import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
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
import { LoginDto } from './dto/login/login.dto';
import { LoginResponseDto } from './dto/login/login-response.dto';
import { LogoutResponseDto } from './dto/logout/logout-response.dto';
import { RegisterDto } from './dto/register/register.dto';
import { RegisterResponseDto } from './dto/register/register-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password/forgot-password.dto';
import { ForgotPasswordResponseDto } from './dto/forgot-password/forgot-password-response.dto';
import { ResendVerificationDto } from './dto/resend-verification/resend-verification.dto';
import { ResendVerificationResponseDto } from './dto/resend-verification/resend-verification-response.dto';
import { ResetPasswordDto } from './dto/reset-password/reset-password.dto';
import { ResetPasswordResponseDto } from './dto/reset-password/reset-password-response.dto';
import { VerifyEmailQueryDto } from './dto/verify-email/verify-email-query.dto';
import { VerifyEmailResponseDto } from './dto/verify-email/verify-email-response.dto';
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

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset link' })
  @ApiOkResponse({ type: ForgotPasswordResponseDto })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using token from email link' })
  @ApiOkResponse({ type: ResetPasswordResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid or expired reset token.' })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.authService.resetPassword(dto);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend email verification link' })
  @ApiOkResponse({ type: ResendVerificationResponseDto })
  async resendVerification(
    @Body() dto: ResendVerificationDto,
  ): Promise<ResendVerificationResponseDto> {
    return this.authService.resendVerificationEmail(dto);
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address using token from email link' })
  @ApiOkResponse({ type: VerifyEmailResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid or expired verification token.',
  })
  async verifyEmail(
    @Query() query: VerifyEmailQueryDto,
  ): Promise<VerifyEmailResponseDto> {
    return this.authService.verifyEmail(query.token);
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

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  @ApiOkResponse({ type: LogoutResponseDto })
  async logout(
    @Req() req: Express.Request,
    @Res({ passthrough: true }) res: Express.Response,
  ): Promise<LogoutResponseDto> {
    const refreshToken = this.cookieService.getRefreshToken(req);

    const result = await this.authService.logout(refreshToken);

    this.cookieService.clearRefreshToken(res);

    return result;
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
