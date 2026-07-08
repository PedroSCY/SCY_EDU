import { createServerClient as createClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type SupabaseClient = ReturnType<typeof createClient>

function getSupabaseUrl(): string {
  const url = process.env.SUPABASE_URL
  if (!url) throw new Error('SUPABASE_URL não configurada')
  return url
}

function getSupabaseKey(): string {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY
  if (!key) throw new Error('SUPABASE_PUBLISHABLE_KEY não configurada')
  return key
}

export function createMiddlewareClient(req: NextRequest): {
  supabase: SupabaseClient
  res: NextResponse
} {
  const res = NextResponse.next()

  const supabase = createClient(getSupabaseUrl(), getSupabaseKey(), {
    cookies: {
      getAll() {
        return req.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          req.cookies.set(name, value)
          res.cookies.set(name, value)
        })
      },
    },
  })

  return { supabase, res }
}
