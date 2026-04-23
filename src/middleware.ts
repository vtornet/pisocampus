import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const isAuth = !!session?.user

  const isAuthPage = request.nextUrl.pathname.startsWith('/login')
  const isRegisterPage = request.nextUrl.pathname.startsWith('/registro')
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

  // Si está autenticado y trata de ir a login o registro, redirigir al dashboard
  if (isAuth && (isAuthPage || isRegisterPage)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Si no está autenticado y trata de ir al dashboard, redirigir a login
  if (!isAuth && isDashboardPage) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/registro', '/dashboard/:path*'],
}
