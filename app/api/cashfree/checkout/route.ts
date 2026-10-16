import { NextRequest, NextResponse } from 'next/server'
import {
  createCashfreeOrder,
  CASHFREE_PRICING,
  CASHFREE_ADDONS,
  CashfreePlanKey,
  CashfreeAddonKey,
} from '@/lib/cashfree'
import { getSiteBySlug, saveSiteBySlug, getDefaultSiteData } from '@/lib/site-service'
import { connectToDatabase } from '@/lib/mongodb'
import { Site } from '@/models/Site'
import { getSessionUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      slug: rawSlug,
      plan: rawPlan = 'premier',
      addon: rawAddon,
      brandName,
      profileName,
      creatorPasscode = '1234',
      customerPhone,
      customerEmail,
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

    // Determine host origin for redirect URLs
    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'https://myflix-amber-phi.vercel.app'

    const cleanSlugId = slug.replace(/[^a-zA-Z0-9]/g, '').slice(0, 15)

    // CASE A: IN-STUDIO MICRO-UPGRADE / ADD-ON PURCHASE
    if (rawAddon && rawAddon in CASHFREE_ADDONS) {
      const addonKey = rawAddon as CashfreeAddonKey
      const addon = CASHFREE_ADDONS[addonKey]

      const existingSite = await getSiteBySlug(slug)
      if (!existingSite) {
        return NextResponse.json(
          { error: `Stream "${slug}" was not found.` },
          { status: 404 }
        )
      }

      const orderId = `addon_${cleanSlugId}_${Date.now()}`
      const customerId = `cust_${cleanSlugId}_${Date.now().toString().slice(-4)}`

      const order = await createCashfreeOrder({
        orderId,
        amount: addon.amount,
        customerId,
        customerPhone: customerPhone?.replace(/\D/g, '') || '9999999999',
        customerEmail: customerEmail?.trim() || 'creator@myflix.com',
        customerName: profileName?.trim() || existingSite.profileName || 'MyFlix Creator',
        returnUrl: `${origin}/payment/callback?order_id={order_id}&slug=${encodeURIComponent(slug)}`,
        notifyUrl: `${origin}/api/webhooks/cashfree`,
        orderNote: `MyFlix Addon: ${slug} (${addon.name})`,
        tags: {
          slug,
          orderType: 'addon',
          addonKey,
        },
      })

      return NextResponse.json({
        success: true,
        orderId: order.order_id,
        paymentSessionId: order.payment_session_id,
        cfOrderId: order.cf_order_id,
        type: 'addon',
      })
    }

    // CASE B: BASE STREAM YEARLY PLAN PURCHASE
    // Reserved routes check
    const reserved = [
      'api',
      'admin',
      '_next',
      'static',
      'favicon.ico',
      'placeholder.svg',
      'rdxthunder',
      'capybara',
      'demo',
    ]
    if (reserved.includes(slug)) {
      return NextResponse.json(
        { error: 'This slug name is reserved' },
        { status: 400 }
      )
    }

    const planKey = (['mini', 'premier', 'vip'].includes(rawPlan) ? rawPlan : 'premier') as CashfreePlanKey
    const pricing = CASHFREE_PRICING[planKey]

    // Check if site already exists and has a confirmed transaction
    const existing = await getSiteBySlug(slug)
    if (
      existing &&
      existing.isPaid &&
      existing.transactionId &&
      slug !== 'rdxthunder' &&
      slug !== 'capybara' &&
      slug !== 'demo'
    ) {
      return NextResponse.json(
        { error: `"${slug}" is already claimed by someone. Please choose another slug.` },
        { status: 409 }
      )
    }

    // Read authenticated session user if logged in with Google
    const sessionUser = await getSessionUser()
    const creatorEmail = sessionUser?.email || customerEmail?.trim()?.toLowerCase() || ''
    const creatorGoogleId = sessionUser?.googleId || ''

    // Reserve or update site draft
    const defaultData = getDefaultSiteData(slug)
    const siteDraft = {
      ...defaultData,
      brandName: brandName?.trim() || defaultData.brandName,
      profileName: profileName?.trim() || defaultData.profileName,
      creatorPasscode: creatorPasscode || '1234',
      plan: planKey,
      creatorEmail: creatorEmail || undefined,
      creatorGoogleId: creatorGoogleId || undefined,
      isPaid: false,
    }
    await saveSiteBySlug(slug, siteDraft)

    // Cashfree order IDs must be alphanumeric and max 45 chars
    const orderId = `myflix_${cleanSlugId}_${Date.now()}`
    const customerId = `cust_${cleanSlugId}_${Date.now().toString().slice(-4)}`

    const order = await createCashfreeOrder({
      orderId,
      amount: pricing.amount,
      customerId,
      customerPhone: customerPhone?.replace(/\D/g, '') || '9999999999',
      customerEmail: creatorEmail || 'creator@myflix.com',
      customerName: sessionUser?.name || profileName?.trim() || 'MyFlix Creator',
      returnUrl: `${origin}/payment/callback?order_id={order_id}&slug=${encodeURIComponent(slug)}`,
      notifyUrl: `${origin}/api/webhooks/cashfree`,
      orderNote: `MyFlix: ${slug} (${pricing.name})`,
      tags: {
        slug,
        orderType: 'plan',
        plan: planKey,
      },
    })

    // Store Cashfree session details in MongoDB
    await connectToDatabase()
    await Site.findOneAndUpdate(
      { slug },
      {
        $set: {
          cashfreeOrderId: orderId,
          cashfreePaymentSessionId: order.payment_session_id,
          paymentProvider: 'cashfree',
          creatorEmail: creatorEmail || undefined,
          creatorGoogleId: creatorGoogleId || undefined,
        },
      }
    )

    return NextResponse.json({
      success: true,
      orderId: order.order_id,
      paymentSessionId: order.payment_session_id,
      cfOrderId: order.cf_order_id,
      type: 'plan',
    })
  } catch (error: unknown) {
    console.error('Cashfree checkout error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create Cashfree checkout session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
