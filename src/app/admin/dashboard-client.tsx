'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface CategoryData {
  id: string
  name: string
  color: string
}

interface LinkData {
  id: string
  title: string
  description: string | null
  url: string
  slug: string
  categoryId: string | null
  categoryName: string | null
  categoryColor: string | null
  createdAt: Date
}

export function DashboardClient({
  links,
  categories,
}: {
  links: LinkData[]
  categories: CategoryData[]
}) {
  const router = useRouter()

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Tem certeza que deseja excluir este link?')) return

      const res = await fetch(`/api/admin/links/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      }
    },
    [router]
  )

  return (
    <div>
      {categories.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-zinc-700 mb-3">Categorias</h2>
          <div className="flex flex-wrap gap-2">
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
        </div>
      )}

      <h2 className="text-sm font-medium text-zinc-700 mb-3">Links</h2>

      {links.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-400">
            Nenhum link cadastrado. Crie o primeiro link!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-zinc-900 truncate">
                    {link.title}
                  </h3>
                  {link.categoryName && (
                    <span
                      className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: (link.categoryColor ?? '#3B82F6') + '20',
                        color: link.categoryColor ?? '#3B82F6',
                      }}
                    >
                      {link.categoryName}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{link.url}</p>
                <p className="text-xs text-zinc-400">
                  slug: /r/{link.slug}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`/admin/links/${link.id}/edit`}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  Editar
                </a>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
