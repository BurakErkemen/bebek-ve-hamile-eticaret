import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

function createPgAdapter() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not defined.");
  return new PrismaPg({ connectionString });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter: createPgAdapter() });

// Her ortamda singleton'ı global'e kaydet.
// Serverless / standalone soğuk başlatmalarda her modül yüklemesinde
// yeni PrismaPg/pg.Pool açılmasını önler (bkz. INCELEME 3.4).
globalForPrisma.prisma = globalForPrisma.prisma ?? prisma;
