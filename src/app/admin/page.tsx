import { Suspense } from 'react'
import { auth } from '@/infra/auth/auth'
import { DashboardContent } from './dashboard-content'

export default async function AdminDashboard() {
  const session = await auth()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Bem-vindo, {session?.user?.name}
          </p>
        </div>
        <a
          href="/admin/links/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
        >
          Novo Link
        </a>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-3 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="h-3 bg-zinc-200 rounded w-20" />
            <div className="h-8 bg-zinc-200 rounded w-12 mt-2" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="h-4 bg-zinc-200 rounded w-3/4" />
            <div className="h-3 bg-zinc-200 rounded w-1/2 mt-2" />
          </div>
        ))}
      </div>
    </div>
  )
}
