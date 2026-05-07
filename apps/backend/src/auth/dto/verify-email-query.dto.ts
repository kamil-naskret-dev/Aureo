import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailQueryDto {
  @ApiProperty({ example: 'a3f1c2...' })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
