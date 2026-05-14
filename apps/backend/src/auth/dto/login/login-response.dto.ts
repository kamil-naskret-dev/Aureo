import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

class LoggedInUserDto {
  @ApiProperty({ example: 'clx1234abcd' })
  id!: string;

  @ApiProperty({ example: 'jan@example.com' })
  email!: string;

  @ApiProperty({ example: 'Jan Kowalski' })
  name!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role!: UserRole;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
  image!: string | null;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ type: LoggedInUserDto })
  user!: LoggedInUserDto;
}
