import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { PublicLinksContent } from './public-links-content'

function LinksSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-zinc-200 bg-white p-5 animate-pulse"
        >
          <div className="h-4 bg-zinc-200 rounded w-3/4" />
          <div className="h-3 bg-zinc-200 rounded w-1/2 mt-2" />
          <div className="h-3 bg-zinc-200 rounded w-1/4 mt-3" />
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  cookies()
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          Links Educacionais
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Clique em um link para ser redirecionado
        </p>
      </div>
      <Suspense fallback={<LinksSkeleton />}>
        <PublicLinksContent />
      </Suspense>
    </div>
  )
}
