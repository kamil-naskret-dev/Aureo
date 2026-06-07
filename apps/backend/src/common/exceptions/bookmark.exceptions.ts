import { ConflictException, NotFoundException } from '@nestjs/common';

export class BookmarkNotFoundException extends NotFoundException {
  constructor() {
    super('Bookmark not found.');
  }
}

export class BookmarkAlreadyExistsException extends ConflictException {
  constructor() {
    super('Bookmark with this URL already exists.');
  }
}
