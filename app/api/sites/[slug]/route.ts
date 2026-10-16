import { NextRequest, NextResponse } from 'next/server'
import { getSiteBySlug, resolveSiteMediaUrls, saveSiteBySlug } from '@/lib/site-service'
import { getSessionUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const site = await getSiteBySlug(slug)

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    const sessionUser = await getSessionUser()
    const isDemoSite = slug === 'rdxthunder' || slug === 'capybara' || slug === 'demo'
    const isAuthorizedCreator =
      isDemoSite ||
      (!!sessionUser?.email &&
        !!site.creatorEmail &&
        sessionUser.email.toLowerCase() === site.creatorEmail.toLowerCase())

    const resolved = await resolveSiteMediaUrls(site)
    // Don't expose creator passcode to public viewer
    const safeResponse = {
      ...resolved,
      creatorPasscode: isAuthorizedCreator ? site.creatorPasscode : undefined,
      hasPasscode: Boolean(site.creatorPasscode),
      isAuthorizedCreator,
    }

    return NextResponse.json(safeResponse)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { passcode, update } = body

    if (!update) {
      return NextResponse.json({ error: 'Missing update payload' }, { status: 400 })
    }

    const sessionUser = await getSessionUser()
    const authorizedEmail = sessionUser?.email

    const result = await saveSiteBySlug(slug, update, passcode, authorizedEmail)

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to save' }, { status: 403 })
    }

    return NextResponse.json({ success: true, site: result.site })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
