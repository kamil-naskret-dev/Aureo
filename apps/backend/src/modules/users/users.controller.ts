import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';

import { ApiAuth } from '../../common/decorators/api-auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SWAGGER_TAGS } from '../../common/constants/swagger.constants';
import { type JwtPayload } from '../../common/types/jwt-payload.type';
import { MeResponseDto } from './dto/me-response.dto';
import { UsersService } from './users.service';

const AVATARS_DIR = join(process.cwd(), 'uploads', 'avatars');
mkdirSync(AVATARS_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

@ApiAuth()
@ApiTags(SWAGGER_TAGS.USERS)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiOkResponse({ type: MeResponseDto })
  async getMe(@CurrentUser() currentUser: JwtPayload): Promise<MeResponseDto> {
    const user = await this.users.getProfile(currentUser.sub);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.profile?.name ?? null,
      avatarUrl: user.profile?.avatarUrl ?? null,
      bio: user.profile?.bio ?? null,
    };
  }

  @Patch('me/avatar')
  @ApiOperation({ summary: 'Upload or replace avatar' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: AVATARS_DIR,
        filename: (_, file, cb) =>
          cb(
            null,
            `${randomUUID()}${extname(file.originalname).toLowerCase()}`,
          ),
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only jpeg, png, webp, or gif files are allowed',
            ),
            false,
          );
        }
      },
    }),
  )
  async updateAvatar(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ avatarUrl: string }> {
    if (!file) throw new BadRequestException('File is required');
    const avatarUrl = await this.users.updateAvatar(user.sub, file);
    return { avatarUrl };
  }

  @Delete('me/avatar')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove avatar' })
  async removeAvatar(@CurrentUser() user: JwtPayload): Promise<void> {
    await this.users.removeAvatar(user.sub);
  }
}
