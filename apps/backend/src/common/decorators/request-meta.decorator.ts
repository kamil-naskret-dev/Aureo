import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const RequestMeta = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();

    return {
      userAgent: req.headers['user-agent'] ?? 'unknown',
      ipAddress: req.ip ?? req.socket?.remoteAddress ?? 'unknown',
    };
  },
);
