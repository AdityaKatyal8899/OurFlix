import crypto from 'crypto'
import { cookies } from 'next/headers'

export interface SessionUser {
  id: string
  googleId: string
  email: string
  name: string
  avatar: string
}

export const SESSION_COOKIE_NAME = 'ourflix_session'
const AUTH_SECRET = process.env.AUTH_SECRET || 'ourflix_auth_secret_session_jwt_key_2026_secured'

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) {
    str += '='
  }
  return Buffer.from(str, 'base64').toString('utf8')
}

export function createSessionToken(user: SessionUser, maxAgeSeconds: number = 30 * 24 * 60 * 60): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const exp = Math.floor(Date.now() / 1000) + maxAgeSeconds
  const payload = {
    ...user,
    exp,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const data = `${encodedHeader}.${encodedPayload}`

  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${data}.${signature}`
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    if (!token || typeof token !== 'string') return null
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [encodedHeader, encodedPayload, signature] = parts
    const data = `${encodedHeader}.${encodedPayload}`

    const expectedSignature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(data)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    // Constant-time compare
    const sigBuf = Buffer.from(signature)
    const expBuf = Buffer.from(expectedSignature)
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload))
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null // Expired
    }

    return {
      id: payload.id,
      googleId: payload.googleId,
      email: payload.email,
      name: payload.name || '',
      avatar: payload.avatar || '',
    }
  } catch (err) {
    return null
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    if (!sessionCookie?.value) return null
    return verifySessionToken(sessionCookie.value)
  } catch (err) {
    return null
  }
}
