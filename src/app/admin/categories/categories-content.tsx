import { CategoryRepositoryImpl } from '@/infra/database/category-repository-impl'
import { listCategories } from '@/core/use-cases/list-categories'
import { CategoriesClient } from './categories-client'

const categoryRepository = new CategoryRepositoryImpl()

export async function CategoriesContent() {
  const categories = await listCategories(categoryRepository)

  return <CategoriesClient categories={categories} />
}
