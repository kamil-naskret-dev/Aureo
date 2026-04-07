import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep, MockProxy } from 'jest-mock-extended';

import appConfig from '../../src/config/app.config';
import { validationSchema } from '../../src/config/config.validation';
import databaseConfig from '../../src/config/database.config';
import { PrismaService } from '../../src/prisma/prisma.service';

export type PrismaMock = MockProxy<PrismaService>;

/**
 * Creates a NestJS TestingModule pre-configured with:
 * - ConfigModule loaded from .env.test (via setupFiles)
 * - PrismaService replaced with a deep mock (jest-mock-extended)
 *
 * Usage:
 *   const { module, prismaMock } = await createTestingModule({
 *     providers: [BookmarksService],
 *   });
 *   prismaMock.bookmark.findMany.mockResolvedValue([]);
 */
export async function createTestingModule(
  metadata: ModuleMetadata,
): Promise<{ module: TestingModule; prismaMock: PrismaMock }> {
  const prismaMock = mockDeep<PrismaService>();

  const module = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [appConfig, databaseConfig],
        validationSchema,
      }),
      ...(metadata.imports ?? []),
    ],
    controllers: metadata.controllers ?? [],
    providers: [
      ...(metadata.providers ?? []),
      { provide: PrismaService, useValue: prismaMock },
    ],
  }).compile();

  return { module, prismaMock };
}
