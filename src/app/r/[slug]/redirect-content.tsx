import { notFound } from 'next/navigation'
import { LinkRepositoryImpl } from '@/infra/database/link-repository-impl'
import { getLinkBySlug } from '@/core/use-cases/get-link-by-slug'
import { CategoryRepositoryImpl } from '@/infra/database/category-repository-impl'
import RedirectClient from './redirect-client'

const linkRepository = new LinkRepositoryImpl()
const categoryRepository = new CategoryRepositoryImpl()

interface Props {
  params: Promise<{ slug: string }>
}

export async function RedirectContent({ params }: Props) {
  const { slug } = await params
  const link = await getLinkBySlug(linkRepository, slug)

  if (!link) {
    notFound()
  }

  const cat = link.categoryId
    ? await categoryRepository.findById(link.categoryId)
    : null

  const data = {
    title: link.title,
    description: link.description,
    url: link.url,
    categoryName: cat?.name ?? null,
    categoryColor: cat?.color ?? null,
  }

  return <RedirectClient data={data} />
}
