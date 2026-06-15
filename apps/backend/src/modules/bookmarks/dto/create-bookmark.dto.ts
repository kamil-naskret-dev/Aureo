import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({ example: 'https://example.com' })
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  @MaxLength(1000)
  url!: string;

  @ApiProperty({ example: 'Example Domain' })
  @IsString()
  @MaxLength(100)
  title!: string;

  @ApiPropertyOptional({ example: 'A short description' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @ApiPropertyOptional({ example: ['typescript', 'nestjs'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  @ArrayMaxSize(20)
  tags?: string[];
}
