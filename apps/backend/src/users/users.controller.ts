import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ApiAuth } from '../common/decorators/api-auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SWAGGER_TAGS } from '../common/constants/swagger.constants';
import { type JwtPayload } from '../common/types/jwt-payload.type';
import { MeResponseDto } from './dto/me-response.dto';
import { UsersService } from './users.service';

@ApiAuth()
@ApiTags(SWAGGER_TAGS.USERS)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiOkResponse({ type: MeResponseDto })
  async getMe(@CurrentUser() currentUser: JwtPayload): Promise<MeResponseDto> {
    const user = await this.users.findByIdWithProfile(currentUser.sub);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.profile?.name ?? null,
      avatarUrl: user.profile?.avatarUrl ?? null,
      bio: user.profile?.bio ?? null,
    };
  }
}
