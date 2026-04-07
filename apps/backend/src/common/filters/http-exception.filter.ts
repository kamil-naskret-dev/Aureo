import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? exception.getResponse() : null;

    let message: string;
    let error: string;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      error = 'Error';
    } else if (exceptionResponse && typeof exceptionResponse === 'object') {
      const resp = exceptionResponse as Record<string, unknown>;
      // ValidationPipe returns { message: string[] } — join all errors into one string
      message = Array.isArray(resp['message'])
        ? (resp['message'] as string[]).join('; ')
        : ((resp['message'] as string) ?? 'An error occurred');
      error = (resp['error'] as string) ?? 'Error';
    } else {
      message = 'Internal server error';
      error = 'Internal Server Error';
    }

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({ exception }, 'Unhandled exception');
    }

    response.status(statusCode).json({
      statusCode,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
