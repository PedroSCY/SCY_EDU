import { User } from '@/core/entities/user'
import { UserRepository } from '@/core/repositories/user-repository'
import { prisma } from './prisma/prisma-service'

export class UserRepositoryImpl implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const raw = await prisma.user.findUnique({ where: { id } })
    return raw ? this.toDomain(raw) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const raw = await prisma.user.findUnique({ where: { email } })
    return raw ? this.toDomain(raw) : null
  }

  async create(user: User): Promise<void> {
    await prisma.user.create({ data: user.toJSON() as never })
  }

  private toDomain(raw: {
    id: string
    name: string
    email: string
    password: string
    role: 'ADMIN'
    createdAt: Date
    updatedAt: Date
  }): User {
    return User.restore(raw)
  }
}
