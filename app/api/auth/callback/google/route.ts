import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const stateParam = searchParams.get('state')
    const error = searchParams.get('error')

    const host = request.headers.get('host') || 'localhost:3000'
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
    const origin = `${proto}://${host}`
    const redirectUri = `${origin}/api/auth/callback/google`

    let returnUrl = '/profile'
    let stateData: any = {}

    if (stateParam) {
      try {
        const decoded = Buffer.from(stateParam, 'base64url').toString('utf8')
        stateData = JSON.parse(decoded)
        if (stateData.returnUrl) returnUrl = stateData.returnUrl
      } catch (err) {
        console.warn('Could not parse OAuth state:', err)
      }
    }

    if (error || !code) {
      console.error('Google OAuth error or code missing:', error)
      return NextResponse.redirect(`${origin}/login?error=oauth_cancelled`)
    }

    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.error('Missing Google OAuth client credentials in environment')
      return NextResponse.redirect(`${origin}/login?error=missing_credentials`)
    }

    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenResponse.json()
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Token exchange failed:', tokenData)
      return NextResponse.redirect(`${origin}/login?error=token_exchange_failed`)
    }

    // 2. Fetch user profile from Google UserInfo endpoint
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const googleUser = await userinfoResponse.json()
    if (!userinfoResponse.ok || !googleUser.sub || !googleUser.email) {
      console.error('Failed to fetch userinfo:', googleUser)
      return NextResponse.redirect(`${origin}/login?error=userinfo_failed`)
    }

    // 3. Persist or update user in MongoDB
    let userId = googleUser.sub
    try {
      const isConnected = await connectToDatabase()
      if (isConnected) {
        const userDoc = await User.findOneAndUpdate(
          { googleId: googleUser.sub },
          {
            email: googleUser.email.toLowerCase(),
            name: googleUser.name || googleUser.email.split('@')[0],
            avatar: googleUser.picture || '',
            lastLoginAt: new Date(),
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
        if (userDoc) {
          userId = userDoc._id.toString()
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB User save warning:', dbErr)
    }

    // 4. Create signed session token
    const sessionToken = createSessionToken({
      id: userId,
      googleId: googleUser.sub,
      email: googleUser.email.toLowerCase(),
      name: googleUser.name || googleUser.email.split('@')[0],
      avatar: googleUser.picture || '',
    })

    // 5. Construct final destination URL
    let finalDestination = returnUrl
    if (stateData.action === 'create' && stateData.slug) {
      finalDestination = `/#create?slug=${encodeURIComponent(stateData.slug)}&plan=${encodeURIComponent(
        stateData.plan || 'premier'
      )}`
    }

    const redirectResponse = NextResponse.redirect(new URL(finalDestination, origin))

    // 6. Set HTTP-only, secure session cookie
    redirectResponse.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return redirectResponse
  } catch (err) {
    console.error('Google OAuth callback error:', err)
    const host = request.headers.get('host') || 'localhost:3000'
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
    return NextResponse.redirect(`${proto}://${host}/login?error=internal_auth_error`)
  }
}
