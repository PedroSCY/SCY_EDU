import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { LinksContent } from './links-content'

function LinksSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border border-zinc-200 bg-white p-4 animate-pulse">
          <div className="h-4 bg-zinc-200 rounded w-3/4" />
          <div className="h-3 bg-zinc-200 rounded w-1/2 mt-2" />
        </div>
      ))}
    </div>
  )
}

export default function LinksPage() {
  cookies()
  return (
    <div className="flex-1 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Links Disponíveis</h1>
          <p className="mt-2 text-zinc-500">
            Clique em um link para ser redirecionado
          </p>
        </div>
        <Suspense fallback={<LinksSkeleton />}>
          <LinksContent />
        </Suspense>
      </div>
    </div>
  )
}
