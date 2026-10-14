import { NextRequest, NextResponse } from 'next/server'
import { slugBloomFilter, RESERVED_SLUGS } from '@/lib/bloom-filter'
import { connectToDatabase } from '@/lib/mongodb'
import { Site } from '@/models/Site'

// Lazy-load existing paid slugs into the Bloom filter once on startup
async function ensureBloomFilterWarm() {
  if (global.__myflixBloomFilterInitialized) return
  try {
    await connectToDatabase()
    const paidSites = await Site.find({ isPaid: true }).select('slug').lean()
    const slugs = paidSites.map((s) => s.slug).filter(Boolean)
    slugBloomFilter.preload(slugs)
    global.__myflixBloomFilterInitialized = true
  } catch (err) {
    console.error('Failed to pre-warm Bloom filter from database:', err)
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawSlug = searchParams.get('slug') || ''
    const cleanSlug = rawSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')

    if (!cleanSlug || cleanSlug.length < 2) {
      return NextResponse.json({
        available: false,
        reason: 'Must be at least 2 characters',
      })
    }

    if (cleanSlug.length > 32) {
      return NextResponse.json({
        available: false,
        reason: 'Maximum 32 characters allowed',
      })
    }

    // 1. Reserved slugs check
    if (RESERVED_SLUGS.includes(cleanSlug)) {
      const isDemo = ['rdxthunder', 'capybara', 'demo'].includes(cleanSlug)
      return NextResponse.json({
        available: false,
        isDemo,
        isReserved: true,
        reason: isDemo ? 'Showcase demo stream' : 'Reserved system handle',
        suggestions: [
          `${cleanSlug}-${new Date().getFullYear()}`,
          `${cleanSlug}-flix`,
          `my-${cleanSlug}`,
        ],
      })
    }

    // Ensure Bloom filter is populated with existing claimed slugs
    await ensureBloomFilterWarm()

    // 2. Fast Path: Bloom Filter Test (Zero DB query if absent)
    const mightExist = slugBloomFilter.has(cleanSlug)

    if (!mightExist) {
      // 100% Guaranteed NOT in the database!
      return NextResponse.json({
        available: true,
        slug: cleanSlug,
        source: 'bloom_filter',
      })
    }

    // 3. Verification Path: Filter returned true (could be taken or a rare false positive)
    await connectToDatabase()
    const existing = await Site.findOne({
      slug: cleanSlug,
      isPaid: true,
      transactionId: { $exists: true },
    })
      .select('slug')
      .lean()

    if (existing) {
      const suggestions = [
        `${cleanSlug}-${new Date().getFullYear()}`,
        `${cleanSlug}-flix`,
        `${cleanSlug}-box`,
      ]

      return NextResponse.json({
        available: false,
        slug: cleanSlug,
        reason: 'Already claimed by another creator',
        suggestions,
        source: 'database_verified',
      })
    }

    // It was a false positive from the Bloom filter; the slug is actually free!
    return NextResponse.json({
      available: true,
      slug: cleanSlug,
      source: 'database_confirmed',
    })
  } catch (err: unknown) {
    console.error('Error in slug check API:', err)
    return NextResponse.json(
      { error: 'Failed to verify slug availability' },
      { status: 500 }
    )
  }
}
