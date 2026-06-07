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
  @IsUrl()
  @MaxLength(2048)
  url!: string;

  @ApiProperty({ example: 'Example Domain' })
  @IsString()
  @MaxLength(500)
  title!: string;

  @ApiPropertyOptional({ example: 'A short description' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({ example: ['typescript', 'nestjs'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  @ArrayMaxSize(20)
  tags?: string[];
}
