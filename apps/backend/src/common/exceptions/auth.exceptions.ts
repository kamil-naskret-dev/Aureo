import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('Invalid credentials');
  }
}

export class EmailNotVerifiedException extends ForbiddenException {
  constructor() {
    super('Please verify your email first');
  }
}
