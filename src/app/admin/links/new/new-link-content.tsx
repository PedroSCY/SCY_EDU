import { CategoryRepositoryImpl } from '@/infra/database/category-repository-impl'
import { listCategories } from '@/core/use-cases/list-categories'
import { CreateLinkForm } from '../link-form'

const categoryRepository = new CategoryRepositoryImpl()

export async function NewLinkContent() {
  const categories = await listCategories(categoryRepository)

  return <CreateLinkForm categories={categories} />
}
