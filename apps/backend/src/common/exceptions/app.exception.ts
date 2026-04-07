import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(message: string, statusCode: HttpStatus, error: string) {
    super({ statusCode, error, message }, statusCode);
  }
}
