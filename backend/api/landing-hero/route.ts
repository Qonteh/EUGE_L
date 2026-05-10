import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const res = await query('SELECT * FROM landing_hero WHERE is_active = true ORDER BY created_at DESC LIMIT 1')
    const row = res.rows[0] || null
    return NextResponse.json({ success: true, data: row })
  } catch (err) {
    console.error('[landing-hero] GET error', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await query(
      `INSERT INTO landing_hero (
        pre_headline, headline, sub_headline, description,
        hero_initials, mentor_name, mentor_title, cta_text, cta_link, video_id, is_active
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        body.pre_headline || null,
        body.headline || null,
        body.sub_headline || null,
        body.description || null,
        body.hero_initials || null,
        body.mentor_name || null,
        body.mentor_title || null,
        body.cta_text || null,
        body.cta_link || null,
        body.video_id || null,
        body.is_active === false ? false : true,
      ]
    )

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('[landing-hero] POST error', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const id = body.id
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    }

    const result = await query(
      `UPDATE landing_hero SET
        pre_headline = COALESCE($1, pre_headline),
        headline = COALESCE($2, headline),
        sub_headline = COALESCE($3, sub_headline),
        description = COALESCE($4, description),
        hero_initials = COALESCE($5, hero_initials),
        mentor_name = COALESCE($6, mentor_name),
        mentor_title = COALESCE($7, mentor_title),
        cta_text = COALESCE($8, cta_text),
        cta_link = COALESCE($9, cta_link),
        video_id = COALESCE($10, video_id),
        is_active = COALESCE($11, is_active)
      WHERE id = $12 RETURNING *`,
      [
        body.pre_headline,
        body.headline,
        body.sub_headline,
        body.description,
        body.hero_initials,
        body.mentor_name,
        body.mentor_title,
        body.cta_text,
        body.cta_link,
        body.video_id,
        body.is_active,
        id,
      ]
    )

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('[landing-hero] PATCH error', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    }

    await query('UPDATE landing_hero SET is_active = false WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[landing-hero] DELETE error', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
