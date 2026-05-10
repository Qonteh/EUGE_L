import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getAdminByEmail, updateAdmin } from '@/lib/db-queries'
import { verifyPassword, hashPassword } from '@/lib/auth'
import { signToken } from '@/lib/auth'

function readCookie(req: Request, name: string) {
  const cookieHeader = req.headers.get('cookie') || ''
  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))

  if (!cookie) return null

  return cookie.slice(name.length + 1)
}

export async function PATCH(req: Request) {
  try {
    const token = readCookie(req, 'euge_admin')
    if (!token) return NextResponse.json({ success: false, error: 'missing_cookie' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload || !payload.email) return NextResponse.json({ success: false, error: 'invalid_token' }, { status: 401 })

    const admin = await getAdminByEmail(String(payload.email))
    if (!admin) return NextResponse.json({ success: false, error: 'admin_not_found' }, { status: 404 })

    const body = await req.json()
    const { email, currentPassword, newPassword } = body || {}

    const updates: any = {}

    // If changing email
    if (email && email !== admin.email) {
      // Ensure no other admin uses this email
      const existing = await getAdminByEmail(String(email))
      if (existing) {
        return NextResponse.json({ success: false, error: 'email_in_use' }, { status: 400 })
      }
      updates.email = String(email)
    }

    // If changing password, require currentPassword
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, error: 'missing_current_password' }, { status: 400 })
      }
      const valid = verifyPassword(String(currentPassword), admin.password_hash)
      if (!valid) return NextResponse.json({ success: false, error: 'invalid_current_password' }, { status: 401 })

      updates.password_hash = hashPassword(String(newPassword))
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: 'nothing_to_update' }, { status: 400 })
    }

    await updateAdmin(admin.id, updates)

    // Refresh session token if the email changed so user remains authenticated
    const newEmail = updates.email || admin.email
    const newToken = signToken({ email: newEmail })
    const isProd = process.env.NODE_ENV === 'production'
    const cookieParts = [`euge_admin=${newToken}`, 'Path=/', 'HttpOnly', 'SameSite=Strict']
    if (isProd) cookieParts.push('Secure')
    const cookieHeader = cookieParts.join('; ')

    return NextResponse.json({ success: true, message: 'Profile updated' }, { headers: { 'Set-Cookie': cookieHeader } })
  } catch (err: any) {
    console.error('[admin:update] error', err)
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 })
  }
}
