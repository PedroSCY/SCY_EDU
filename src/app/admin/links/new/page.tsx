import { Suspense } from 'react'
import { NewLinkContent } from './new-link-content'

export default function NewLinkPage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-zinc-900 mb-8">Novo Link</h1>
      <Suspense fallback={
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-3 bg-zinc-200 rounded w-20 mb-1" />
              <div className="h-9 bg-zinc-200 rounded" />
            </div>
          ))}
        </div>
      }>
        <NewLinkContent />
      </Suspense>
    </div>
  )
}
