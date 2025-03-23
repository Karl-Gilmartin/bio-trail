import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Ensure only one Prisma instance exists
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ["query", "info", "warn", "error"], // Helps debugging
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 