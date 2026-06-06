import { Injectable } from '@nestjs/common';
import type { Response, Request } from 'express';

import { REFRESH_TOKEN_TTL_MS } from '../token/token.constants';

const REFRESH_TOKEN_COOKIE = 'refreshToken';

@Injectable()
export class CookieService {
  setRefreshToken(res: Response, token: string) {
    res.cookie(REFRESH_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_TTL_MS,
      path: '/',
    });
  }

  getRefreshToken(req: Request): string | undefined {
    const cookies = req.cookies as Record<string, unknown>;

    const token = cookies?.[REFRESH_TOKEN_COOKIE];

    return typeof token === 'string' ? token : undefined;
  }

  clearRefreshToken(res: Response) {
    res.clearCookie(REFRESH_TOKEN_COOKIE, {
      path: '/',
    });
  }
}
