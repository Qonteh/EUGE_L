const { randomBytes, scryptSync } = require('crypto')
const { writeFileSync, readFileSync, mkdirSync } = require('fs')

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derived}`
}

const admins = [
  { email: 'eugene@gmail.com', password: 'eugene051@', name: 'Eugene L' },
  { email: 'abdulyusuph051@gmail.com', password: 'Qontetina051@', name: 'Abdulyusuph' },
]
;

(function seed() {
  try {
    mkdirSync('data', { recursive: true })
    const path = 'data/admin_users.json'
    let existing = []
    try {
      const content = readFileSync(path, 'utf-8')
      existing = JSON.parse(content)
    } catch (e) { existing = [] }

    for (const a of admins) {
      const found = existing.find(e => String(e.email).toLowerCase() === String(a.email).toLowerCase())
      if (found) continue
      existing.push({
        id: require('crypto').randomUUID(),
        email: a.email,
        password_hash: hashPassword(a.password),
        name: a.name,
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
      })
    }


    writeFileSync(path, JSON.stringify(existing, null, 2))
    console.log('Seeded admin users to', path)
  } catch (err) {
    console.error('Seeding failed', err)
    process.exit(1)
  }
})()


