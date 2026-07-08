import { CategoryRepositoryImpl } from '@/infra/supabase/category-repository-impl'
import { listCategories } from '@/core/use-cases/list-categories'
import { CategoriesClient } from './categories-client'

const categoryRepository = new CategoryRepositoryImpl()

export async function CategoriesContent() {
  const categories = await listCategories(categoryRepository)

  return (
    <CategoriesClient
      categories={categories.map((c) => ({
        id: c.id,
        name: c.name,
        color: c.color,
      }))}
    />
  )
}
