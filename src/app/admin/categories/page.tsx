import { Suspense } from 'react'
import { CategoriesContent } from './categories-content'

export default function CategoriesPage() {
  return (
    <div className="max-w-lg">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Categorias</h1>
          <p className="text-sm text-zinc-500 mt-1">Gerencie as categorias dos links</p>
        </div>
      </div>
      <Suspense fallback={
        <div className="animate-pulse space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="h-4 bg-zinc-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      }>
        <CategoriesContent />
      </Suspense>
    </div>
  )
}
