import ReactDOM from 'react-dom'
import { MemoryFlix } from '@/components/memory-flix'
import { getSiteBySlug, resolveSiteMediaUrls } from '@/lib/site-service'
import { stripe } from '@/lib/stripe'
import { getCashfreeOrder } from '@/lib/cashfree'
import { connectToDatabase } from '@/lib/mongodb'
import { Site } from '@/models/Site'
import { getSessionUser } from '@/lib/auth'
import Link from 'next/link'
import { Film, Sparkles, ArrowRight, Lock, CreditCard } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SlugPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sParams = (await searchParams) || {}
  const sessionId = typeof sParams.session_id === 'string' ? sParams.session_id : undefined
  const orderId = typeof sParams.order_id === 'string' ? sParams.order_id : undefined

  let site = await getSiteBySlug(slug)

  // 1. Direct Cashfree checkout return verification
  if (orderId) {
    try {
      const cfOrder = await getCashfreeOrder(orderId)
      if (
        cfOrder.order_status === 'PAID' &&
        cfOrder.order_tags?.slug?.toLowerCase() === slug.toLowerCase()
      ) {
        const transactionId = cfOrder.cf_order_id || cfOrder.order_id
        const plan = (cfOrder.order_tags?.plan as 'mini' | 'premier' | 'vip') || 'premier'

        await connectToDatabase()
        await Site.findOneAndUpdate(
          { slug: slug.toLowerCase() },
          {
            $set: {
              isPaid: true,
              plan,
              transactionId,
              cashfreeOrderId: cfOrder.order_id,
              paidAt: new Date(),
              paymentProvider: 'cashfree',
            },
          },
          { new: true }
        )
        // Refresh site data after confirming payment
        site = await getSiteBySlug(slug)
      }
    } catch (err) {
      console.error('Error verifying Cashfree order on page load:', err)
    }
  }

  // 2. Direct Stripe checkout return verification
  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      if (
        session.payment_status === 'paid' &&
        session.metadata?.slug?.toLowerCase() === slug.toLowerCase()
      ) {
        const transactionId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.id
        const plan = (session.metadata?.plan as 'mini' | 'premier' | 'vip') || 'premier'

        await connectToDatabase()
        await Site.findOneAndUpdate(
          { slug: slug.toLowerCase() },
          {
            $set: {
              isPaid: true,
              plan,
              transactionId,
              stripeSessionId: session.id,
              paidAt: new Date(),
              paymentProvider: 'stripe',
            },
          },
          { new: true }
        )
        // Refresh site data after confirming payment
        site = await getSiteBySlug(slug)
      }
    } catch (err) {
      console.error('Error verifying Stripe session on page load:', err)
    }
  }

  // If site not found
  if (!site) {
    return (
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-primary selection:text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-black to-black pointer-events-none" />

        <div className="relative z-10 max-w-md w-full text-center space-y-6 bg-zinc-950/80 border border-white/10 rounded-2xl p-8 backdrop-blur-2xl shadow-2xl">
          <div className="mx-auto size-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            <Film className="size-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              myflix.domain/<span className="text-primary">{slug}</span>
            </h1>
            <p className="text-sm text-zinc-400">
              This personalized stream hasn&apos;t been claimed yet! You can claim this custom slug and build a Netflix-style memory experience for your favorite person.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href={`/?slug=${encodeURIComponent(slug)}#create`}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Claim &quot;{slug}&quot; from ₹49</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/rdxthunder"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-medium py-2.5 px-4 transition-colors text-sm"
            >
              <Sparkles className="size-4 text-amber-400" />
              <span>Explore Demo Stream (RDXThunder)</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Paywall: If site exists but is unpaid
  const isDemoSite = slug === 'rdxthunder' || slug === 'capybara' || slug === 'demo'
  if (!site.isPaid && !isDemoSite) {
    const planName = site.plan === 'mini' ? 'Mini Reel (₹49)' : site.plan === 'vip' ? 'VIP Box Set (₹199)' : 'Premier Blockbuster (₹99)'
    return (
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-primary selection:text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-black to-black pointer-events-none" />

        <div className="relative z-10 max-w-md w-full text-center space-y-6 bg-zinc-950/80 border border-white/10 rounded-2xl p-8 backdrop-blur-2xl shadow-2xl">
          <div className="mx-auto size-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
            <Lock className="size-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight">
              Activation Required
            </h1>
            <p className="text-sm text-zinc-400">
              <span className="font-semibold text-white">myflix.domain/{slug}</span> is reserved. Complete payment for the <span className="text-primary font-bold">{planName}</span> to unlock your creator portal and media upload.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href={`/?slug=${encodeURIComponent(slug)}#create`}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <CreditCard className="size-4" />
              <span>Complete Payment</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-medium py-2.5 px-4 transition-colors text-sm"
            >
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const resolved = await resolveSiteMediaUrls(site)
  const sessionUser = await getSessionUser()
  const isViewerMode = sParams.viewer === 'true'
  // Demo stream studio sandbox is only active if explicitly requested via ?demo=studio or ?creator=true
  const isDemoStudio = isDemoSite && (sParams.demo === 'studio' || sParams.creator === 'true')
  const isRealStreamCreator =
    !isDemoSite &&
    !!sessionUser?.email &&
    !!site.creatorEmail &&
    sessionUser.email.toLowerCase() === site.creatorEmail.toLowerCase()

  const isAuthorizedCreator = !isViewerMode && (isDemoStudio || isRealStreamCreator)

  // Pre-warm SSR headers: preload the featured hero thumbnail & audio chime
  const heroSlide =
    resolved.mediaItems.find((m) => m.category.toLowerCase() === 'featured') ||
    resolved.mediaItems[0]

  if (heroSlide?.thumbnail) {
    ReactDOM.preload(heroSlide.thumbnail, { as: 'image' })
  }
  if (resolved.introAudioUrl) {
    ReactDOM.preload(resolved.introAudioUrl, { as: 'audio' })
  }

  return (
    <MemoryFlix
      slug={resolved.slug}
      initialMedia={resolved.mediaItems}
      profileUrl={resolved.profileAvatar}
      introAudioUrl={resolved.introAudioUrl}
      initialBrandName={resolved.brandName}
      initialProfileName={resolved.profileName}
      initialCategories={resolved.categories}
      initialPasscode={resolved.creatorPasscode}
      initialPlan={resolved.plan || 'premier'}
      expiresAt={resolved.expiresAt}
      addonRows={resolved.addonRows || 0}
      addonPhotos={resolved.addonPhotos || 0}
      addonVideos={resolved.addonVideos || 0}
      hasCustomAudioAddon={resolved.hasCustomAudioAddon || false}
      isAuthorizedCreator={isAuthorizedCreator}
      creatorEmail={site.creatorEmail}
    />
  )
}
