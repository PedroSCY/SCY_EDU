'use server'

import { createServerClient } from '@/infra/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData): Promise<string | null> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return 'Email e senha são obrigatórios'

  const supabase = await createServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return 'Email ou senha inválidos'

  const callbackUrl = (formData.get('callbackUrl') as string) || '/admin'
  redirect(callbackUrl)
}
