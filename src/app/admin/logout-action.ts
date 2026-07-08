'use server'

import { createServerClient } from '@/infra/supabase/server'
import { redirect } from 'next/navigation'

export async function logoutAction() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect('/')
}
