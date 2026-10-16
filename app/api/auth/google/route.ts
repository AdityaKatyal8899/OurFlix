import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const returnUrl = searchParams.get('returnUrl') || searchParams.get('redirect') || '/profile'
  const action = searchParams.get('action') || ''
  const slug = searchParams.get('slug') || ''
  const plan = searchParams.get('plan') || ''

  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.json(
      { error: 'GOOGLE_CLIENT_ID is not configured in environment variables' },
      { status: 500 }
    )
  }

  // Construct origin & redirect URI dynamically
  const host = request.headers.get('host') || 'localhost:3000'
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  const redirectUri = `${proto}://${host}/api/auth/callback/google`

  // State parameter to pass return destination & creation context
  const statePayload = {
    returnUrl,
    action,
    slug,
    plan,
  }
  const state = Buffer.from(JSON.stringify(statePayload)).toString('base64url')

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  googleAuthUrl.searchParams.set('client_id', clientId)
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri)
  googleAuthUrl.searchParams.set('response_type', 'code')
  googleAuthUrl.searchParams.set('scope', 'openid email profile')
  googleAuthUrl.searchParams.set('access_type', 'offline')
  googleAuthUrl.searchParams.set('prompt', 'select_account')
  googleAuthUrl.searchParams.set('state', state)

  return NextResponse.redirect(googleAuthUrl.toString())
}
