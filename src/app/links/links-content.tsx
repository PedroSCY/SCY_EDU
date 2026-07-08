import { LinkRepositoryImpl } from '@/infra/database/link-repository-impl'
import { CategoryRepositoryImpl } from '@/infra/database/category-repository-impl'
import { listLinks } from '@/core/use-cases/list-links'
import { listCategories } from '@/core/use-cases/list-categories'
import Link from 'next/link'

const linkRepository = new LinkRepositoryImpl()
const categoryRepository = new CategoryRepositoryImpl()

export async function LinksContent() {
  const [links, categories] = await Promise.all([
    listLinks(linkRepository),
    listCategories(categoryRepository),
  ])

  const linksWithCategory = links.map((link) => {
    const category = categories.find((c) => c.id === link.categoryId)
    return {
      ...link.toJSON(),
      categoryName: category?.name ?? null,
      categoryColor: category?.color ?? null,
    }
  })

  return (
    <>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: cat.color + '20', color: cat.color }}
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}

      {linksWithCategory.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-400">Nenhum link disponível no momento.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {linksWithCategory.map((link) => (
            <Link
              key={link.id}
              href={`/r/${link.slug}`}
              className="block rounded-lg border border-zinc-200 bg-white p-4 hover:border-zinc-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="font-medium text-zinc-900 truncate">
                    {link.title}
                  </h2>
                  {link.description && (
                    <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                      {link.description}
                    </p>
                  )}
                </div>
                {link.categoryName && (
                  <span
                    className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: (link.categoryColor ?? '#3B82F6') + '20', color: link.categoryColor ?? '#3B82F6' }}
                  >
                    {link.categoryName}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
