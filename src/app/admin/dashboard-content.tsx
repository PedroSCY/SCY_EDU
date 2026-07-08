import { LinkRepositoryImpl } from '@/infra/supabase/link-repository-impl'
import { CategoryRepositoryImpl } from '@/infra/supabase/category-repository-impl'
import { listLinks } from '@/core/use-cases/list-links'
import { listCategories } from '@/core/use-cases/list-categories'
import { DashboardClient } from './dashboard-client'

const linkRepository = new LinkRepositoryImpl()
const categoryRepository = new CategoryRepositoryImpl()

export async function DashboardContent() {
  const [links, categories] = await Promise.all([
    listLinks(linkRepository),
    listCategories(categoryRepository),
  ])

  const linksWithCategory = links.map((link) => {
    const cat = categories.find((c) => c.id === link.categoryId)
    const json = link.toJSON()
    return {
      id: json.id,
      title: json.title,
      description: json.description,
      url: json.url,
      slug: json.slug,
      categoryId: json.categoryId,
      active: json.active,
      type: json.type,
      createdAt: json.createdAt.toISOString(),
      categoryName: cat?.name ?? null,
      categoryColor: cat?.color ?? null,
    }
  })

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Total de Links
          </p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{links.length}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Categorias
          </p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{categories.length}</p>
        </div>
      </div>

      <DashboardClient
        links={linksWithCategory}
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          color: c.color,
        }))}
      />
    </>
  )
}
