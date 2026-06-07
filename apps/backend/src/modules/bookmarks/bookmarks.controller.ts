import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { SWAGGER_TAGS } from '../../common/constants/swagger.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { type JwtPayload } from '../../common/types/jwt-payload.type';
import { BookmarksService } from './bookmarks.service';
import { BookmarkQueryDto } from './dto/bookmark-query.dto';
import {
  BookmarkResponseDto,
  PaginatedBookmarksDto,
} from './dto/bookmark-response.dto';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@ApiTags(SWAGGER_TAGS.BOOKMARKS)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a bookmark' })
  @ApiCreatedResponse({ type: BookmarkResponseDto })
  create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateBookmarkDto,
  ): Promise<BookmarkResponseDto> {
    return this.bookmarksService.create(user.sub, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List bookmarks with filtering and pagination' })
  @ApiOkResponse({ type: PaginatedBookmarksDto })
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query() query: BookmarkQueryDto,
  ): Promise<PaginatedBookmarksDto> {
    return this.bookmarksService.findAll(user.sub, query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single bookmark' })
  @ApiOkResponse({ type: BookmarkResponseDto })
  @ApiNotFoundResponse({ description: 'Bookmark not found.' })
  findOne(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<BookmarkResponseDto> {
    return this.bookmarksService.findOne(user.sub, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a bookmark' })
  @ApiOkResponse({ type: BookmarkResponseDto })
  @ApiNotFoundResponse({ description: 'Bookmark not found.' })
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateBookmarkDto,
  ): Promise<BookmarkResponseDto> {
    return this.bookmarksService.update(user.sub, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a bookmark' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Bookmark not found.' })
  delete(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<void> {
    return this.bookmarksService.delete(user.sub, id);
  }

  @Patch(':id/pin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle pin on a bookmark' })
  @ApiOkResponse({ type: BookmarkResponseDto })
  @ApiNotFoundResponse({ description: 'Bookmark not found.' })
  togglePin(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<BookmarkResponseDto> {
    return this.bookmarksService.togglePin(user.sub, id);
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle archive on a bookmark' })
  @ApiOkResponse({ type: BookmarkResponseDto })
  @ApiNotFoundResponse({ description: 'Bookmark not found.' })
  toggleArchive(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<BookmarkResponseDto> {
    return this.bookmarksService.toggleArchive(user.sub, id);
  }
}
