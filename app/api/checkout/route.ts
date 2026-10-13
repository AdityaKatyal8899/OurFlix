import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLAN_PRICING, PlanKey } from '@/lib/stripe'
import { getSiteBySlug, saveSiteBySlug, getDefaultSiteData } from '@/lib/site-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      slug: rawSlug,
      plan: rawPlan = 'premier',
      brandName,
      profileName,
      creatorPasscode = '1234',
    } = body

    if (!rawSlug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const slug = rawSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')

    if (slug.length < 2) {
      return NextResponse.json(
        { error: 'Slug must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Reserved routes check
    const reserved = ['api', 'admin', '_next', 'static', 'favicon.ico', 'placeholder.svg', 'rdxthunder', 'capybara', 'demo']
    if (reserved.includes(slug)) {
      return NextResponse.json(
        { error: 'This slug name is reserved' },
        { status: 400 }
      )
    }

    const planKey = (['mini', 'premier', 'vip'].includes(rawPlan) ? rawPlan : 'premier') as PlanKey
    const pricing = PLAN_PRICING[planKey]

    // Check if site already exists and is paid
    const existing = await getSiteBySlug(slug)
    if (existing && existing.isPaid && slug !== 'rdxthunder' && slug !== 'capybara') {
      return NextResponse.json(
        { error: `"${slug}" is already claimed by someone. Please choose another slug.` },
        { status: 409 }
      )
    }

    // Create or reserve the site draft
    const defaultData = getDefaultSiteData(slug)
    const siteDraft = {
      ...defaultData,
      brandName: brandName?.trim() || defaultData.brandName,
      profileName: profileName?.trim() || defaultData.profileName,
      creatorPasscode: creatorPasscode || '1234',
      plan: planKey,
      isPaid: false, // Mark unpaid until Stripe confirms
    }

    await saveSiteBySlug(slug, siteDraft)

    // Determine host origin for redirect URLs
    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'https://myflix-amber-phi.vercel.app'

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `MyFlix: ${slug}`,
              description: pricing.name,
              tax_code: 'txcd_10000000',
              images: [`${origin}/mainChar.jpg`],
            },
            unit_amount: pricing.amountInPaise,
          },
          quantity: 1,
        },
      ],
      metadata: {
        slug,
        plan: planKey,
      },
      success_url: `${origin}/${slug}?setup=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?cancelled=true`,
    })

    // Store session ID in site draft
    await saveSiteBySlug(slug, { stripeSessionId: session.id })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create checkout session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
