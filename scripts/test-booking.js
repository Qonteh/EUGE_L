// Automated test: create application (qualified) and booking, then verify in Postgres
// Usage: node scripts/test-booking.js

const fetch = global.fetch || require('node-fetch')
const { Pool } = require('pg')

async function main() {
  const base = process.env.BASE_URL || 'http://localhost:3000'

  // 1) Create a qualified application (investment >= 1000)
  const appPayload = {
    firstName: 'Test',
    lastName: 'User',
    email: `test+${Date.now()}@example.com`,
    phone: '1234567890',
    country: 'US',
    timezone: 'UTC',
    experience: 'none',
    investment: '5000',
    goals: 'Testing booking flow',
    challenges: 'None',
    source: 'automated-test'
  }

  console.log('[test] Posting application...')
  const appRes = await fetch(`${base}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appPayload),
  })

  const appJson = await appRes.json().catch(() => null)
  console.log('[test] Application response:', appJson)

  const appId = appJson?.data?.id
  const qualified = appJson?.data?.qualified

  if (!appId || appId.startsWith('temp-')) {
    console.error('[test] Application did not persist to DB (fallback id). Aborting test.')
    process.exit(1)
  }

  if (!qualified) {
    console.error('[test] Application marked unqualified. Aborting booking test.')
    process.exit(1)
  }

  // 2) Create booking for the application
  const date = new Date()
  date.setDate(date.getDate() + 1)
  const bookingPayload = {
    applicationId: appId,
    name: `${appPayload.firstName} ${appPayload.lastName}`,
    email: appPayload.email,
    phone: appPayload.phone,
    timezone: appPayload.timezone,
    date: date.toISOString().split('T')[0],
    time: '10:00',
    message: 'Automated test booking'
  }

  console.log('[test] Posting booking...')
  const bookRes = await fetch(`${base}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingPayload),
  })
  const bookJson = await bookRes.json().catch(() => null)
  console.log('[test] Booking response:', bookJson)

  const bookingId = bookJson?.data?.id
  if (!bookingId || String(bookingId).startsWith('booking-')) {
    console.error('[test] Booking fell back to temporary id or failed. Check server logs.')
    process.exit(1)
  }

  // 3) Verify booking exists in Postgres
  const pool = new Pool({ host: 'localhost', port: 5432, database: 'euge_trading', user: 'postgres' })
  try {
    const r = await pool.query('SELECT * FROM bookings WHERE id = $1', [bookingId])
    if (r.rowCount === 0) {
      console.error('[test] Booking not found in DB')
      process.exit(1)
    }
    console.log('[test] Booking found in DB:', r.rows[0])
    console.log('[test] SUCCESS: booking persisted to DB')
  } catch (err) {
    console.error('[test] DB verification error:', err.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main().catch((err) => { console.error('[test] Unexpected error:', err); process.exit(1) })
