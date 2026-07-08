'use client'

import { useState } from 'react'
import { LINK_TYPE_CONFIG, type LinkType } from '@/components/link-type-config'

interface RedirectData {
  title: string
  description: string | null
  url: string
  type: string
  categoryName: string | null
  categoryColor: string | null
}

export default function RedirectClient({ data }: { data: RedirectData }) {
  const [blocked, setBlocked] = useState(false)
  const typeCfg = LINK_TYPE_CONFIG[data.type as LinkType] ?? LINK_TYPE_CONFIG.link
  const Icon = typeCfg.icon

  function handleRedirect() {
    const win = window.open(data.url, '_blank', 'noopener,noreferrer')
    if (!win) {
      setBlocked(true)
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <div
          className="rounded-lg border bg-white p-8"
          style={{ borderColor: typeCfg.color + '30' }}
        >
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ backgroundColor: typeCfg.bg, color: typeCfg.color }}
          >
            <Icon className="h-7 w-7" />
          </div>

          <h1 className="mt-4 text-xl font-semibold text-zinc-900">
            {data.title}
          </h1>

          {data.description && (
            <p className="mt-2 text-sm text-zinc-500">{data.description}</p>
          )}

          <div className="mt-3 flex items-center justify-center gap-2">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: typeCfg.bg, color: typeCfg.color }}
            >
              <Icon className="h-3 w-3" />
              {typeCfg.label}
            </span>
            {data.categoryName && (
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: (data.categoryColor ?? '#3B82F6') + '20',
                  color: data.categoryColor ?? '#3B82F6',
                }}
              >
                {data.categoryName}
              </span>
            )}
          </div>

          <div className="mt-6 rounded-lg bg-zinc-50 border border-zinc-200 p-3 text-left">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Destino
            </p>
            <p className="mt-1 text-sm text-zinc-700 break-all">{data.url}</p>
          </div>

          <p className="mt-4 text-sm text-zinc-500">
            Você será redirecionado para um link externo. Deseja continuar?
          </p>

          {blocked && (
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs text-amber-700">
                O navegador bloqueou a abertura automática. Clique no link direto abaixo:
              </p>
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-sm font-medium text-amber-700 underline break-all"
              >
                {data.url}
              </a>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleRedirect}
              className="select-none w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: typeCfg.color }}
            >
              Ir para o link
            </button>
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="select-none w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors text-center"
            >
              Abrir diretamente
            </a>
            <a
              href="/"
              className="select-none text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Voltar
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
