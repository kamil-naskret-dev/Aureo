import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'a3f1c2...' })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({ example: 'newStrongPassword123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}
