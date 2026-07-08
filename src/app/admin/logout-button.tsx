'use client'

import { useRouter } from 'next/navigation'
import { logoutAction } from './logout-action'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await logoutAction()
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="select-none w-full text-left rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
    >
      Sair
    </button>
  )
}
