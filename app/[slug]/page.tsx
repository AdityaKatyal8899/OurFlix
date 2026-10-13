import ReactDOM from 'react-dom'
import { MemoryFlix } from '@/components/memory-flix'
import { getSiteBySlug, resolveSiteMediaUrls } from '@/lib/site-service'
import Link from 'next/link'
import { Film, Sparkles, ArrowRight, Lock } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params
  const site = await getSiteBySlug(slug)

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
              href={`/rdxthunder?setup=true&claim=${encodeURIComponent(slug)}`}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Claim &quot;{slug}&quot; for ₹99</span>
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

  const resolved = await resolveSiteMediaUrls(site)

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
    />
  )
}
