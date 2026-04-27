import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { SWAGGER_TAGS } from '../common/constants/swagger.constants';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

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
}
