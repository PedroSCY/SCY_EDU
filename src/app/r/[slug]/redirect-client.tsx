'use client'

import { useState } from 'react'

interface RedirectData {
  title: string
  description: string | null
  url: string
  categoryName: string | null
  categoryColor: string | null
}

export default function RedirectClient({ data }: { data: RedirectData }) {
  const [blocked, setBlocked] = useState(false)

  function handleRedirect() {
    const win = window.open(data.url, '_blank', 'noopener,noreferrer')
    if (!win) {
      setBlocked(true)
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <div className="rounded-lg border border-zinc-200 bg-white p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <svg
              className="h-6 w-6 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
          </div>

          <h1 className="mt-4 text-xl font-semibold text-zinc-900">
            {data.title}
          </h1>

          {data.description && (
            <p className="mt-2 text-sm text-zinc-500">{data.description}</p>
          )}

          {data.categoryName && (
            <span
              className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: (data.categoryColor ?? '#3B82F6') + '20',
                color: data.categoryColor ?? '#3B82F6',
              }}
            >
              {data.categoryName}
            </span>
          )}

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
              className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
            >
              Ir para o link
            </button>
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors text-center"
            >
              Abrir diretamente
            </a>
            <a
              href="/links"
              className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Voltar
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
