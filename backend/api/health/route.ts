import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const res = await query('SELECT 1 as ok')
    if (res.rows && res.rows.length > 0) {
      return NextResponse.json({ success: true, db: true })
    }
    return NextResponse.json({ success: false, db: false }, { status: 500 })
  } catch (err) {
    console.error('[health] DB check failed', err)
    return NextResponse.json({ success: false, db: false }, { status: 500 })
  }
}
