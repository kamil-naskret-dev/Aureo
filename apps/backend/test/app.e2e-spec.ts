import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication({ bufferLogs: true });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health', () => {
    it('GET /api/health returns health check shape', async () => {
      const res = await request(app.getHttpServer()).get('/api/health');
      // Accept 200 (healthy) or 503 (DB not running in CI) — both are valid Terminus responses.
      expect([200, 503]).toContain(res.status);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('status');
    });
  });

  describe('Error handling', () => {
    it('unknown route returns consistent 404 shape', async () => {
      const res = await request(app.getHttpServer()).get('/api/nonexistent');
      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        statusCode: 404,
        error: expect.any(String),
        message: expect.any(String),
        timestamp: expect.any(String),
        path: '/api/nonexistent',
      });
    });
  });

  describe('Bookmarks — auth protection', () => {
    const BOOKMARK_ID = 'non-existent-id';

    const protectedEndpoints: Array<{
      method: 'get' | 'post' | 'patch' | 'delete';
      path: string;
    }> = [
      { method: 'get', path: '/api/bookmarks' },
      { method: 'post', path: '/api/bookmarks' },
      { method: 'get', path: '/api/bookmarks/tags' },
      { method: 'get', path: `/api/bookmarks/${BOOKMARK_ID}` },
      { method: 'patch', path: `/api/bookmarks/${BOOKMARK_ID}` },
      { method: 'delete', path: `/api/bookmarks/${BOOKMARK_ID}` },
      { method: 'patch', path: `/api/bookmarks/${BOOKMARK_ID}/pin` },
      { method: 'patch', path: `/api/bookmarks/${BOOKMARK_ID}/archive` },
      { method: 'post', path: `/api/bookmarks/${BOOKMARK_ID}/view` },
    ];

    it.each(protectedEndpoints)(
      '$method $path returns 401 without token',
      async ({ method, path }) => {
        const res = await request(app.getHttpServer())[method](path);
        expect(res.status).toBe(401);
        expect(res.body).toMatchObject({
          statusCode: 401,
          error: expect.any(String),
          message: expect.any(String),
          timestamp: expect.any(String),
          path,
        });
      },
    );

    it('returns 401 with malformed Authorization header', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/bookmarks')
        .set('Authorization', 'InvalidToken');
      expect(res.status).toBe(401);
    });

    it('returns 401 with expired/invalid Bearer token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/bookmarks')
        .set('Authorization', 'Bearer invalid.jwt.token');
      expect(res.status).toBe(401);
    });
  });
});
