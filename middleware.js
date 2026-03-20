import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (
    pathname === '/login' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth-login') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  const auth = request.cookies.get('sb_auth')
  const password = process.env.APP_PASSWORD || 'shopbuilder2024'

  if (auth?.value === password) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
