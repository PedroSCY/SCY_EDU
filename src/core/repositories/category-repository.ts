import { Category } from '../entities/category'

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>
  findAll(): Promise<Category[]>
  create(category: Category): Promise<void>
  update(category: Category): Promise<void>
  delete(id: string): Promise<void>
}
