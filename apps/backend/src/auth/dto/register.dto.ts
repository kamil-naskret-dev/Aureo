import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Jan Kowalski' })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiProperty({ example: 'jan@example.com' })
  @IsEmail()
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  email!: string;

  @ApiProperty({ example: 'strongPassword123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}
