import { NextResponse } from 'next/server'

const PASSWORD = process.env.APP_PASSWORD || 'shopbuilder2024'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Skip auth for the login page and static files
  if (pathname === '/login' || pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  // Check cookie
  const auth = request.cookies.get('sb_auth')
  if (auth?.value === PASSWORD) {
    return NextResponse.next()
  }

  // Redirect to login
  const loginUrl = new URL('/login', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
