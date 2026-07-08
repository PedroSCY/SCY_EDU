'use client'

import { useCallback, useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { toggleLinkAction } from './actions'
import { LINK_TYPE_CONFIG, type LinkType } from '@/components/link-type-config'
import { ConfirmDialog } from '@/components/confirm-dialog'

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
  active: boolean
  type: string
  categoryName: string | null
  categoryColor: string | null
  createdAt: string
}

export function DashboardClient({
  links,
  categories,
}: {
  links: LinkData[]
  categories: CategoryData[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const handleDelete = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/admin/links/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Link excluído com sucesso')
        router.refresh()
      } else {
        toast.error('Erro ao excluir link')
      }
    },
    [router]
  )

  const handleToggle = useCallback(
    async (id: string, currentActive: boolean) => {
      startTransition(async () => {
        await toggleLinkAction(id)
        toast.success(currentActive ? 'Link desativado' : 'Link ativado')
        router.refresh()
      })
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
          {links.map((link) => {
            const typeCfg = LINK_TYPE_CONFIG[link.type as LinkType] ?? LINK_TYPE_CONFIG.link
            const Icon = typeCfg.icon

            return (
              <div
                key={link.id}
                className={`rounded-lg border p-4 flex items-center justify-between gap-4 transition-opacity ${
                  pending ? 'opacity-60' : ''
                } ${
                  link.active === false
                    ? 'border-zinc-100 bg-zinc-50'
                    : 'bg-white'
                }`}
                style={link.active !== false ? { borderColor: typeCfg.color + '30' } : undefined}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md"
                      style={{ backgroundColor: typeCfg.bg, color: typeCfg.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3
                      className={`text-sm font-medium truncate ${
                        link.active === false
                          ? 'text-zinc-400 line-through'
                          : 'text-zinc-900'
                      }`}
                    >
                      {link.title}
                    </h3>
                    <span
                      className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                      style={{ backgroundColor: typeCfg.bg, color: typeCfg.color }}
                    >
                      <Icon className="h-3 w-3" />
                      {typeCfg.label}
                    </span>
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
                  <button
                    onClick={() => handleToggle(link.id, link.active !== false)}
                    disabled={pending}
                    className={`select-none rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                      link.active === false
                        ? 'text-emerald-600 hover:bg-emerald-50'
                        : 'text-zinc-500 hover:bg-zinc-100'
                    }`}
                    title={link.active === false ? 'Ativar' : 'Desativar'}
                  >
                    {link.active === false ? 'Ativar' : 'Desativar'}
                  </button>
                  <a
                    href={`/admin/links/${link.id}/edit`}
                    className="select-none rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                  >
                    Editar
                  </a>
                  <button
                    onClick={() => setDeleteTarget(link.id)}
                    className="select-none rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Excluir link"
        description="Tem certeza que deseja excluir este link? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        variant="destructive"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </div>
  )
}
