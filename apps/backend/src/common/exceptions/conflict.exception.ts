import { HttpStatus } from '@nestjs/common';

import { AppException } from './app.exception.js';

export class ConflictException extends AppException {
  constructor(message = 'Resource already exists') {
    super(message, HttpStatus.CONFLICT, 'Conflict');
  }
}
