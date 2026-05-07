import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class ResendVerificationDto {
  @ApiProperty({ example: 'jan@example.com' })
  @IsEmail()
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  email!: string;
}
