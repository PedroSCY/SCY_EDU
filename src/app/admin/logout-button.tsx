'use client'

import { signOut } from 'next-auth/react'

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="w-full text-left rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
    >
      Sair
    </button>
  )
}
