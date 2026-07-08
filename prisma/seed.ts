import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL nao configurada')
  }
  return url
}

const adapter = new PrismaPg(getDatabaseUrl())
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Iniciando seed...')

  const adminEmail = 'admin@escola.com'
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })

  if (existingAdmin) {
    console.log('Admin ja existe, pulando criacao.')
    return
  }

  const bcrypt = await import('bcryptjs')
  const password = await bcrypt.hash('admin123', 10)

  await prisma.user.create({
    data: {
      name: 'Administrador',
      email: adminEmail,
      password,
      role: 'ADMIN',
    },
  })

  console.log('Admin criado: admin@escola.com / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
