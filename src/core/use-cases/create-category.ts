import { Category } from '../entities/category'
import { CategoryRepository } from '../repositories/category-repository'

interface CreateCategoryInput {
  name: string
  color?: string
}

export async function createCategory(
  repository: CategoryRepository,
  input: CreateCategoryInput
): Promise<Category> {
  const category = Category.create({
    name: input.name,
    color: input.color ?? '#3B82F6',
  })

  await repository.create(category)
  return category
}
