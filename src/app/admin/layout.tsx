import { auth } from '@/infra/auth/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogoutButton } from './logout-button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="flex flex-1">
      <aside className="w-56 shrink-0 border-r border-zinc-200 bg-white p-4 flex flex-col">
        <div className="mb-6">
          <Link href="/admin" className="text-sm font-semibold text-zinc-900">
            Link Redirect
          </Link>
          <p className="text-xs text-zinc-400 mt-0.5">Painel do Professor</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <Link
            href="/admin"
            className="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/links/new"
            className="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            Novo Link
          </Link>
          <Link
            href="/admin/categories"
            className="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            Categorias
          </Link>
          <Link
            href="/links"
            className="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            Ver página pública
          </Link>
        </nav>

        <div className="border-t border-zinc-200 pt-4">
          <p className="text-xs text-zinc-400 mb-2">{session.user.name}</p>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
