import { Category } from '../entities/category'
import { CategoryRepository } from '../repositories/category-repository'

export async function listCategories(
  repository: CategoryRepository
): Promise<Category[]> {
  return repository.findAll()
}
