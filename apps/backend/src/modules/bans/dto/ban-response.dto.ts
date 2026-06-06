import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BanResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() userId!: string;
  @ApiProperty() adminId!: string;
  @ApiProperty() reason!: string;
  @ApiProperty() bannedAt!: Date;
  @ApiPropertyOptional() bannedUntil!: Date | null;
}
