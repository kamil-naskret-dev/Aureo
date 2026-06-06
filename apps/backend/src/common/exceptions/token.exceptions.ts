import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor() {
    super('Invalid or expired refresh token');
  }
}

export class MissingRefreshTokenException extends UnauthorizedException {
  constructor() {
    super('Missing refresh token');
  }
}

export class InvalidVerificationTokenException extends BadRequestException {
  constructor() {
    super('Invalid or expired verification token');
  }
}

export class InvalidPasswordResetTokenException extends BadRequestException {
  constructor() {
    super('Invalid or expired password reset token');
  }
}

export class RefreshTokenReuseException extends ForbiddenException {
  constructor() {
    super('Token reuse detected. All sessions have been invalidated.');
  }
}
