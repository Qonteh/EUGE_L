import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return NextResponse.next()
  }

  if (pathname === '/admin' || pathname === '/admin/') {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    loginUrl.search = ''
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === '/admin/dashboard' || pathname.startsWith('/admin/dashboard/')) {
    const token = request.cookies.get('euge_admin')?.value

    if (!token) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.search = ''
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  const token = request.cookies.get('euge_admin')?.value

  if (!token) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    loginUrl.search = ''
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
