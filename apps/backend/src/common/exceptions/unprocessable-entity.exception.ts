import { HttpStatus } from '@nestjs/common';

import { AppException } from './app.exception.js';

export class UnprocessableEntityException extends AppException {
  constructor(message = 'Validation failed') {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, 'Unprocessable Entity');
  }
}
