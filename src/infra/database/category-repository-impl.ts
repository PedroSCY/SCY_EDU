import { Category } from '@/core/entities/category'
import { CategoryRepository } from '@/core/repositories/category-repository'
import { prisma } from './prisma/prisma-service'

export class CategoryRepositoryImpl implements CategoryRepository {
  async findById(id: string): Promise<Category | null> {
    const raw = await prisma.category.findUnique({ where: { id } })
    return raw ? this.toDomain(raw) : null
  }

  async findAll(): Promise<Category[]> {
    const rawList = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    return rawList.map((raw) => this.toDomain(raw))
  }

  async create(category: Category): Promise<void> {
    await prisma.category.create({ data: category.toJSON() })
  }

  async update(category: Category): Promise<void> {
    await prisma.category.update({
      where: { id: category.id },
      data: category.toJSON(),
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } })
  }

  private toDomain(raw: {
    id: string
    name: string
    color: string
    createdAt: Date
    updatedAt: Date
  }): Category {
    return Category.restore(raw)
  }
}
