import { notFound } from 'next/navigation'
import { LinkRepositoryImpl } from '@/infra/supabase/link-repository-impl'
import { CategoryRepositoryImpl } from '@/infra/supabase/category-repository-impl'
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
      categories={categories.map((c) => ({
        id: c.id,
        name: c.name,
        color: c.color,
      }))}
      link={{
        id: link.id,
        title: link.title,
        description: link.description,
        url: link.url,
        slug: link.slug,
        categoryId: link.categoryId,
        type: link.type,
      }}
    />
  )
}
