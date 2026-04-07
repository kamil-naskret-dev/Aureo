import { HttpStatus } from '@nestjs/common';

import { AppException } from './app.exception.js';

export class NotFoundException extends AppException {
  constructor(message = 'Resource not found') {
    super(message, HttpStatus.NOT_FOUND, 'Not Found');
  }
}
