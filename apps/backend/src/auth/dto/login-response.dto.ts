import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

class LoggedInUserDto {
  @ApiProperty({ example: 'clx1234abcd' })
  id!: string;

  @ApiProperty({ example: 'jan@example.com' })
  email!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role!: UserRole;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ type: LoggedInUserDto })
  user!: LoggedInUserDto;
}
