import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class MeResponseDto {
  @ApiProperty({ example: 'cm123abc' })
  id!: string;

  @ApiProperty({ example: 'jan@example.com' })
  email!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role!: UserRole;

  @ApiPropertyOptional({ example: 'Jan Kowalski' })
  name!: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  avatarUrl!: string | null;

  @ApiPropertyOptional({ example: 'Frontend developer' })
  bio!: string | null;
}
