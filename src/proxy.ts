import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error(
      'AUTH_SECRET não configurada. Gere uma com: openssl rand -base64 32'
    )
  }
  return new TextEncoder().encode(secret)
}

function getToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get('__Secure-next-auth.session-token')?.value ??
    req.cookies.get('next-auth.session-token')?.value
  )
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL('/login', req.url)
  loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export default async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const token = getToken(req)
  if (!token) {
    return redirectToLogin(req)
  }

  try {
    await jwtVerify(token, getSecret())
    return NextResponse.next()
  } catch {
    return redirectToLogin(req)
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
