import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookmarkStateDto {
  @ApiProperty() pinned!: boolean;
  @ApiProperty() archived!: boolean;
}

export class BookmarkResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() url!: string;
  @ApiProperty() title!: string;
  @ApiPropertyOptional() description!: string | null;
  @ApiProperty() domain!: string;
  @ApiProperty() views!: number;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
  @ApiProperty({ type: [String] }) tags!: string[];
  @ApiPropertyOptional({ type: BookmarkStateDto })
  state!: BookmarkStateDto | null;
}

export class PaginatedBookmarksDto {
  @ApiProperty({ type: [BookmarkResponseDto] }) data!: BookmarkResponseDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
}
