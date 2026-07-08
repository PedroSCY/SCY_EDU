import { Link } from '@/core/entities/link'
import { LinkRepository, FindManyParams } from '@/core/repositories/link-repository'
import { prisma } from './prisma/prisma-service'

export class LinkRepositoryImpl implements LinkRepository {
  async findById(id: string): Promise<Link | null> {
    const raw = await prisma.link.findUnique({ where: { id } })
    return raw ? this.toDomain(raw) : null
  }

  async findBySlug(slug: string): Promise<Link | null> {
    const raw = await prisma.link.findUnique({ where: { slug } })
    return raw ? this.toDomain(raw) : null
  }

  async findMany(params?: FindManyParams): Promise<Link[]> {
    const where: Record<string, unknown> = {}

    if (params?.categoryId) {
      where.categoryId = params.categoryId
    }

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ]
    }

    const rawList = await prisma.link.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return rawList.map((raw) => this.toDomain(raw))
  }

  async create(link: Link): Promise<void> {
    const data = link.toJSON()
    await prisma.link.create({ data })
  }

  async update(link: Link): Promise<void> {
    const data = link.toJSON()
    await prisma.link.update({ where: { id: data.id }, data })
  }

  async delete(id: string): Promise<void> {
    await prisma.link.delete({ where: { id } })
  }

  private toDomain(raw: {
    id: string
    title: string
    description: string | null
    url: string
    slug: string
    categoryId: string | null
    createdById: string
    createdAt: Date
    updatedAt: Date
  }): Link {
    return Link.restore(raw)
  }
}
