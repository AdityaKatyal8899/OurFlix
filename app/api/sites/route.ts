import { NextRequest, NextResponse } from 'next/server'
import { getSiteBySlug, saveSiteBySlug, getDefaultSiteData } from '@/lib/site-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug: rawSlug, brandName, profileName, creatorPasscode, plan = 'premier' } = body

    if (!rawSlug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const slug = rawSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')

    if (slug.length < 2) {
      return NextResponse.json({ error: 'Slug must be at least 2 characters' }, { status: 400 })
    }

    // Reserved routes check
    const reserved = ['api', 'admin', '_next', 'static', 'favicon.ico', 'placeholder.svg']
    if (reserved.includes(slug)) {
      return NextResponse.json({ error: 'This slug name is reserved' }, { status: 400 })
    }

    // Check if slug already exists
    const existing = await getSiteBySlug(slug)
    if (existing) {
      return NextResponse.json({ error: 'Slug already taken. Please choose another.' }, { status: 409 })
    }

    const defaultData = getDefaultSiteData(slug)
    const newSiteData = {
      ...defaultData,
      brandName: brandName?.trim() || defaultData.brandName,
      profileName: profileName?.trim() || defaultData.profileName,
      creatorPasscode: creatorPasscode || '1234',
      plan: plan as 'mini' | 'premier' | 'vip',
      categories:
        plan === 'mini'
          ? ['💖 Best Memories', '✨ Special Moments']
          : defaultData.categories,
      mediaItems:
        plan === 'mini'
          ? defaultData.mediaItems.slice(0, 20)
          : defaultData.mediaItems,
    }

    const result = await saveSiteBySlug(slug, newSiteData)
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to create site' }, { status: 500 })
    }

    return NextResponse.json({ success: true, site: result.site }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
