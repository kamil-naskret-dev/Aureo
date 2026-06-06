import { ApiProperty } from '@nestjs/swagger';

export class UnbanResponseDto {
  @ApiProperty() success!: boolean;
  @ApiProperty() message!: string;
}
