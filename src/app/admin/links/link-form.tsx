'use client'

import { useActionState, useState } from 'react'
import { createLinkAction, updateLinkAction } from '../actions'
import { LINK_TYPE_CONFIG, LINK_TYPES, type LinkType } from '@/components/link-type-config'

interface CategoryOption {
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
  type: string
}

export function CreateLinkForm({ categories }: { categories: CategoryOption[] }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      return createLinkAction(formData)
    },
    { error: null as string | null }
  )

  return (
    <LinkForm categories={categories} action={formAction} pending={pending} error={state.error} />
  )
}

export function EditLinkForm({
  categories,
  link,
}: {
  categories: CategoryOption[]
  link: LinkData
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      return updateLinkAction(link.id, formData)
    },
    { error: null as string | null }
  )

  return (
    <LinkForm
      categories={categories}
      action={formAction}
      pending={pending}
      error={state.error}
      initialData={link}
    />
  )
}

function LinkForm({
  categories,
  action,
  pending,
  error,
  initialData,
}: {
  categories: CategoryOption[]
  action: (formData: FormData) => void
  pending: boolean
  error: string | null
  initialData?: LinkData
}) {
  const [selectedType, setSelectedType] = useState<string>(initialData?.type ?? 'link')

  return (
    <form action={action} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
          Título *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initialData?.title}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-zinc-700">
          Slug (identificador único) *
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          defaultValue={initialData?.slug}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
        <p className="mt-1 text-xs text-zinc-400">
          Será usado na URL: /r/{'{slug}'}
        </p>
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-zinc-700">
          URL de destino *
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          defaultValue={initialData?.url}
          placeholder="https://..."
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initialData?.description ?? ''}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-zinc-700">
          Categoria
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={initialData?.categoryId ?? ''}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        >
          <option value="">Sem categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2">
        <div className="flex flex-wrap gap-3">
          {LINK_TYPES.map((t) => {
            const cfg = LINK_TYPE_CONFIG[t]
            const checked = selectedType === t
            return (
              <label
                key={t}
                className={`select-none flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                  checked
                    ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={t}
                  checked={checked}
                  onChange={() => setSelectedType(t)}
                  className="sr-only"
                />
                <cfg.icon className="h-4 w-4" style={{ color: cfg.color }} />
                {cfg.label}
              </label>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="select-none rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 transition-colors"
        >
          {pending ? 'Salvando...' : initialData ? 'Atualizar Link' : 'Criar Link'}
        </button>
        <a
          href="/admin"
          className="select-none rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}
