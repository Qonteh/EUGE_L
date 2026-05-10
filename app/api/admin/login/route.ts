import { NextResponse } from 'next/server'
import { getAdminByEmail, updateAdminLastLogin } from '@/lib/db-queries'
import { verifyPassword, signToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body || {}
    if (!email || !password) return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })

    const admin = await getAdminByEmail(String(email).toLowerCase())
    if (!admin) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const ok = verifyPassword(String(password), admin.password_hash)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    await updateAdminLastLogin(admin.id)

    const token = signToken({ id: admin.id, email: admin.email })

    const res = NextResponse.json({ ok: true })
    res.cookies.set('euge_admin', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    })
    return res
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
