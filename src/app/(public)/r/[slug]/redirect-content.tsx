import { notFound } from 'next/navigation'
import { LinkRepositoryImpl } from '@/infra/supabase/link-repository-impl'
import { getLinkBySlug } from '@/core/use-cases/get-link-by-slug'
import { CategoryRepositoryImpl } from '@/infra/supabase/category-repository-impl'
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

  if (!link.active) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <h1 className="text-xl font-bold text-zinc-900">Link Desativado</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Este link foi desativado pelo professor. Entre em contato para mais informações.
          </p>
        </div>
      </div>
    )
  }

  const cat = link.categoryId
    ? await categoryRepository.findById(link.categoryId)
    : null

  const data = {
    title: link.title,
    description: link.description,
    url: link.url,
    type: link.type,
    categoryName: cat?.name ?? null,
    categoryColor: cat?.color ?? null,
  }

  return <RedirectClient data={data} />
}
