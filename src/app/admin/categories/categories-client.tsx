'use client'

import { useActionState } from 'react'
import { createCategoryAction, deleteCategoryAction } from '../actions'

interface CategoryData {
  id: string
  name: string
  color: string
}

export function CategoriesClient({ categories }: { categories: CategoryData[] }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      try {
        await createCategoryAction(formData)
        return { error: null }
      } catch (e) {
        return { error: e instanceof Error ? e.message : 'Erro ao criar' }
      }
    },
    { error: null as string | null }
  )

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
    await deleteCategoryAction(id)
  }

  return (
    <div>
      <form action={formAction} className="mb-8 flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
            Nova Categoria
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Nome da categoria"
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-zinc-700">
            Cor
          </label>
          <input
            id="color"
            name="color"
            type="color"
            defaultValue="#3B82F6"
            className="mt-1 block w-12 h-9 rounded-lg border border-zinc-300 cursor-pointer"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 transition-colors"
        >
          {pending ? '...' : 'Adicionar'}
        </button>
      </form>

      {state.error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {categories.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-400">Nenhuma categoria cadastrada.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm font-medium text-zinc-900">{cat.name}</span>
              </div>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-xs text-red-600 hover:text-red-800 transition-colors"
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
