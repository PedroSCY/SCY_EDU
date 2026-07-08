import { createServerClient } from '@/infra/supabase/server'
import { PublicNavbar } from '@/components/public-navbar'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <PublicNavbar isLoggedIn={!!user} />
      <main className="flex-1">{children}</main>
    </>
  )
}
