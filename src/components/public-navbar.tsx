'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

export function PublicNavbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-sm font-semibold text-zinc-900 tracking-tight"
          >
            Link Redirect
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(true)}
            className="text-xs text-zinc-400 hover:text-zinc-600"
          >
            Professor
          </Button>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-64 border-l border-zinc-200 bg-white shadow-lg transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 h-14">
          <span className="text-sm font-medium text-zinc-900">Professor</span>
          <button
            onClick={() => setOpen(false)}
            className="select-none rounded-md p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
            aria-label="Fechar"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-zinc-400">
            {isLoggedIn
              ? 'Você está logado. Acesse o painel para gerenciar os links.'
              : 'Acesse o painel para gerenciar os links educacionais.'}
          </p>
          {isLoggedIn ? (
            <Link href="/admin" onClick={() => setOpen(false)}>
              <Button className="w-full" size="sm">
                Ir para o Painel
              </Button>
            </Link>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button className="w-full" size="sm">
                Fazer Login
              </Button>
            </Link>
          )}
          <p className="text-xs text-zinc-300 text-center pt-2">
            Apenas professores autorizados
          </p>
        </div>
      </div>
    </>
  )
}
