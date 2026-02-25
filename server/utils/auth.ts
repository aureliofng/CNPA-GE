import { createHash } from 'node:crypto'

export const hashPassword = (value: string) => createHash('sha256').update(value).digest('hex')

export const createSessionToken = (userId: number, secret: string) => {
  const payload = `${userId}:${Date.now()}`
  const signature = createHash('sha256').update(`${payload}:${secret}`).digest('hex')
  return Buffer.from(`${payload}:${signature}`).toString('base64url')
}

export const parseSessionToken = (token: string, secret: string): number | null => {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const [userId, timestamp, signature] = decoded.split(':')
    const expected = createHash('sha256').update(`${userId}:${timestamp}:${secret}`).digest('hex')
    if (signature !== expected) return null
    return Number(userId)
  } catch {
    return null
  }
}
