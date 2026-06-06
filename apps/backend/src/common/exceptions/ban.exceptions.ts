import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

export class UserBannedException extends ForbiddenException {
  constructor() {
    super('Your account has been banned.');
  }
}

export class AlreadyBannedException extends ConflictException {
  constructor() {
    super('User is already banned.');
  }
}

export class NotBannedException extends NotFoundException {
  constructor() {
    super('User has no active ban.');
  }
}
