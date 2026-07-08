import { LinkRepositoryImpl } from '@/infra/database/link-repository-impl'
import { CategoryRepositoryImpl } from '@/infra/database/category-repository-impl'
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
    return {
      ...link.toJSON(),
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

      <DashboardClient links={linksWithCategory} categories={categories} />
    </>
  )
}
