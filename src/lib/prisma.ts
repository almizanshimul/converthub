import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// The mariadb driver's pool defaults to connectionLimit: 10 when given a
// plain connection string. That's more concurrent connections than this
// app's traffic needs and more resource footprint than constrained shared
// hosting (process/thread limits) can necessarily spare, so it's set
// explicitly low here rather than left at the default.
const dbUrl = new URL(process.env.DATABASE_URL!);
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: dbUrl.port ? Number(dbUrl.port) : 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.replace(/^\//, ""),
  connectionLimit: 3,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
