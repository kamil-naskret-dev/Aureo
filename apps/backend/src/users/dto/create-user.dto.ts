import { UserStatus } from '@prisma/client';

export class CreateUserInputDto {
  email!: string;
  password!: string;
  name!: string;
  status?: UserStatus;
}
