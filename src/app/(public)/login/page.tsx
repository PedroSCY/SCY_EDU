'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loginAction } from './actions'

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const [error, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      formData.set('callbackUrl', callbackUrl)
      return loginAction(formData)
    },
    null
  )

  return (
    <form action={formAction} className="mt-8 space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="select-none w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 transition-colors"
      >
        {pending ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}

import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-zinc-900">
          Acesso do Professor
        </h1>
        <p className="mt-2 text-sm text-center text-zinc-500">
          Entre com suas credenciais para gerenciar os links
        </p>
        <Suspense fallback={
          <div className="mt-8 text-center text-sm text-zinc-400">Carregando...</div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
