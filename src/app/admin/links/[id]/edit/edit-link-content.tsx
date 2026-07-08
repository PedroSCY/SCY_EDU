import { notFound } from 'next/navigation'
import { LinkRepositoryImpl } from '@/infra/database/link-repository-impl'
import { CategoryRepositoryImpl } from '@/infra/database/category-repository-impl'
import { listCategories } from '@/core/use-cases/list-categories'
import { EditLinkForm } from '../../link-form'

const linkRepository = new LinkRepositoryImpl()
const categoryRepository = new CategoryRepositoryImpl()

interface Props {
  params: Promise<{ id: string }>
}

export async function EditLinkContent({ params }: Props) {
  const { id } = await params
  const [link, categories] = await Promise.all([
    linkRepository.findById(id),
    listCategories(categoryRepository),
  ])

  if (!link) {
    notFound()
  }

  return (
    <EditLinkForm
      categories={categories}
      link={{
        id: link.id,
        title: link.title,
        description: link.description,
        url: link.url,
        slug: link.slug,
        categoryId: link.categoryId,
      }}
    />
  )
}
