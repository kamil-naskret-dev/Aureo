import { ConflictException, NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('User not found');
  }
}

export class UserAlreadyExistsException extends ConflictException {
  constructor() {
    super('Email already in use');
  }
}
