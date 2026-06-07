export const createPrismaMock = () => ({
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  token: {
    create: jest.fn(),
    findUnique: jest.fn(),
    deleteMany: jest.fn(),
    update: jest.fn(),
  },
  bookmark: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  ban: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn(),
});

export type PrismaMock = ReturnType<typeof createPrismaMock>;
