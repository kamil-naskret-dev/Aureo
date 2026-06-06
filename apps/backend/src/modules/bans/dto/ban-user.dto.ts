import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BanUserDto {
  @ApiProperty({ example: 'Spamming' })
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  reason!: string;

  @ApiPropertyOptional({
    example: '2026-12-31T23:59:59.000Z',
    description: 'Leave empty for permanent ban',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) =>
    value ? new Date(value as string).toISOString() : undefined,
  )
  bannedUntil?: string;
}
