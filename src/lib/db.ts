import { PrismaClient } from '@prisma/client';

// Prevent multiple instances in development (hot reload)
// Prisma client regenerated: 2026-07-10 (added CheckoutSession model)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Alias for convenience
export const db = prisma;
