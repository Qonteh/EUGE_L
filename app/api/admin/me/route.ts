import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getAdminByEmail } from '@/lib/db-queries'

function readCookie(req: Request, name: string) {
  const cookieHeader = req.headers.get('cookie') || ''
  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))

  if (!cookie) return null

  return cookie.slice(name.length + 1)
}

export async function GET(req: Request) {
  try {
    const token = readCookie(req, 'euge_admin')
    if (!token) return NextResponse.json({ authenticated: false, reason: 'missing_cookie' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload || !payload.email) return NextResponse.json({ authenticated: false, reason: 'invalid_token' }, { status: 401 })

    const admin = await getAdminByEmail(String(payload.email))
    if (!admin) return NextResponse.json({ authenticated: false, reason: 'admin_not_found' }, { status: 401 })

    return NextResponse.json({ authenticated: true, admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } })
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err?.message || 'Server error' }, { status: 500 })
  }
}
