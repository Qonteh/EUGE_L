import { NextResponse } from 'next/server'
import { createAdminUser, getAdminByEmail } from '@/lib/db-queries'
import { hashPassword } from '@/lib/auth'

// Development-only endpoint to seed admin users. Disabled in production.
export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const users = Array.isArray(body) ? body : body?.users || []
    if (!users.length) return NextResponse.json({ error: 'No users provided' }, { status: 400 })

    const created: any[] = []
    for (const u of users) {
      const email = String(u.email).toLowerCase()
      const existing = await getAdminByEmail(email)
      if (existing) continue
      const password_hash = hashPassword(String(u.password))
      const name = u.name || email.split('@')[0]
      const createdUser = await createAdminUser({ email, password_hash, name })
      created.push({ id: createdUser.id, email: createdUser.email })
    }

    return NextResponse.json({ created })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
