import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { SWAGGER_TAGS } from '../../common/constants/swagger.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { type JwtPayload } from '../../common/types/jwt-payload.type';
import { BansService } from './bans.service';
import { BanResponseDto } from './dto/ban-response.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { UnbanResponseDto } from './dto/unban-response.dto';

@ApiTags(SWAGGER_TAGS.ADMIN)
@Roles(UserRole.ADMIN)
@Controller('admin/users/:id')
export class BansController {
  constructor(private readonly bansService: BansService) {}

  @Post('ban')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ban a user' })
  @ApiCreatedResponse({ type: BanResponseDto })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiForbiddenResponse({ description: 'Access denied.' })
  async ban(
    @Param('id') targetUserId: string,
    @CurrentUser() admin: JwtPayload,
    @Body() dto: BanUserDto,
  ): Promise<BanResponseDto> {
    return this.bansService.banUser(targetUserId, admin.sub, dto);
  }

  @Post('unban')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unban a user' })
  @ApiOkResponse({ type: UnbanResponseDto })
  @ApiNotFoundResponse({ description: 'No active ban found.' })
  @ApiForbiddenResponse({ description: 'Access denied.' })
  async unban(
    @Param('id') targetUserId: string,
    @CurrentUser() admin: JwtPayload,
  ): Promise<UnbanResponseDto> {
    return this.bansService.unbanUser(targetUserId, admin.sub);
  }

  @Get('bans')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get ban history for a user' })
  @ApiOkResponse({ type: [BanResponseDto] })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiForbiddenResponse({ description: 'Access denied.' })
  async getBanHistory(
    @Param('id') targetUserId: string,
  ): Promise<BanResponseDto[]> {
    return this.bansService.getBanHistory(targetUserId);
  }
}
