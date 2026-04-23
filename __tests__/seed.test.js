jest.mock("../db/database", () => ({
  db: {
    select: jest.fn(() => ({
      from: jest.fn(() => Promise.resolve([])),
    })),
    insert: jest.fn(() => ({
      values: jest.fn(() => Promise.resolve()),
    })),
  },
}));

jest.mock("expo-sqlite", () => ({
  openDatabaseSync: jest.fn(() => ({
    execAsync: jest.fn(() => Promise.resolve()),
  })),
}));

jest.mock("drizzle-orm/expo-sqlite", () => ({
  drizzle: jest.fn(() => ({})),
}));

describe("seedDatabase", () => {
  it("inserts data into all core tables without errors", async () => {
    const { seedDatabase } = require("../db/seed");
    await expect(seedDatabase()).resolves.not.toThrow();
  });
});