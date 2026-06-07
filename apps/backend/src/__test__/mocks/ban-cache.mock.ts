export const createBanCacheMock = () => ({
  setBan: jest.fn(),
  removeBan: jest.fn(),
  isBanned: jest.fn(),
});

export type BanCacheMock = ReturnType<typeof createBanCacheMock>;
