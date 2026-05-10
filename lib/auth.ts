import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'crypto'

const SCRYPT_KEYLEN = 64
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || process.env.JWT_SECRET || 'dev-secret'

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex')
  return `${salt}:${derived}`
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(':')
    if (!salt || !hash) return false
    const derived = scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex')
    return timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(hash, 'hex'))
  } catch (err) {
    return false
  }
}

export function signToken(payload: Record<string, any>, expiresInSeconds = 60 * 60 * 8): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds
  const data = { ...payload, exp }
  const json = JSON.stringify(data)
  const b64 = Buffer.from(json).toString('base64url')
  const sig = createHmac('sha256', TOKEN_SECRET).update(b64).digest('base64url')
  return `${b64}.${sig}`
}

export function verifyToken(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null
    const [b64, sig] = parts
    const expected = createHmac('sha256', TOKEN_SECRET).update(b64).digest('base64url')
    if (expected.length !== sig.length) return null
    if (!timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null
    const data = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'))
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) return null
    return data
  } catch (err) {
    return null
  }
}
