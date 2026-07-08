import { Link } from '../entities/link'

export interface FindManyParams {
  categoryId?: string
  search?: string
}

export interface LinkRepository {
  findById(id: string): Promise<Link | null>
  findBySlug(slug: string): Promise<Link | null>
  findMany(params?: FindManyParams): Promise<Link[]>
  create(link: Link): Promise<void>
  update(link: Link): Promise<void>
  delete(id: string): Promise<void>
}
