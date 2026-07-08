import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL não configurada. Defina a variável de ambiente DATABASE_URL ' +
        'com a connection string do PostgreSQL (ex: do Supabase).'
    )
  }
  return url
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg(getDatabaseUrl())
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
