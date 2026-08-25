import { PrismaClient } from "@prisma/client";

declare global {
  // Evita múltiplas instâncias em desenvolvimento
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}