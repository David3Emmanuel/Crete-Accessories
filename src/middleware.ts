import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/request'

export function middleware(request: NextRequest) {
  const jwt = request.cookies.get('jwt')?.value
  const { pathname } = request.nextUrl

  // Protected routes
  if (pathname.startsWith('/account/orders')) {
    if (!jwt) {
      return NextResponse.redirect(new URL('/account/login', request.url))
    }
  }

  // Redirect if already logged in
  if (pathname === '/account/login' || pathname === '/account/register') {
    if (jwt) {
      return NextResponse.redirect(new URL('/account/orders', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*'],
}
