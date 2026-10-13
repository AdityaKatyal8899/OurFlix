'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import {
  Film,
  Sparkles,
  ArrowRight,
  Play,
  Heart,
  Users,
  Gift,
  Lock,
  CheckCircle2,
  Tv,
  Smartphone,
  ShieldCheck,
  Music,
  ExternalLink,
  Flame,
  Zap,
  Check,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Template {
  id: string
  name: string
  tagline: string
  icon: React.ElementType
  badge: string
  sampleSlug: string
  categories: string[]
  accentColor: string
  demoUrl: string
  previewImage: string
  description: string
}

interface Plan {
  id: 'mini' | 'premier' | 'vip'
  name: string
  price: string
  badge?: string
  popular?: boolean
  description: string
  photoLimit: string
  rowLimit: string
  features: string[]
  ctaText: string
}

const TEMPLATES: Template[] = [
  {
    id: 'romance',
    name: 'The Romance Premiere',
    tagline: 'Crafted for your partner, anniversary, or special confession.',
    icon: Heart,
    badge: 'Most Popular',
    sampleSlug: 'rdxthunder',
    categories: ['💖 HER', '✨ Cute Moments', '🌸 Random Smiles', '💌 Letters to You'],
    accentColor: 'from-rose-600/30 via-red-900/10 to-transparent',
    demoUrl: '/rdxthunder',
    previewImage: '/toAdd/mainChar.jpg',
    description: 'Cinematic hero trailer, emotional slideshow, custom background song, and romantic category rows.',
  },
  {
    id: 'capybara',
    name: 'Zen & Chill Memories',
    tagline: 'Peaceful, lighthearted highlights for pet lovers, summer trips, or chill vibes.',
    icon: Sparkles,
    badge: 'Mini Reel (₹49)',
    sampleSlug: 'capybara',
    categories: ['🌿 Chill & Vibe', '🍉 Golden Moments'],
    accentColor: 'from-emerald-600/30 via-teal-900/10 to-transparent',
    demoUrl: '/capybara',
    previewImage: '/capybara/hero.jpg',
    description: 'Relaxing 2-row layout tailored to the ₹49 Mini plan. Cute cards, zen hero banner, and custom password.',
  },
  {
    id: 'anniversary',
    name: 'Milestone Celebration',
    tagline: 'Celebrate birthdays, graduation, or year-long milestones in style.',
    icon: Gift,
    badge: 'Special Edition',
    sampleSlug: 'birthday-special',
    categories: ['🎂 Year in Review', '🌟 Why You Are Special', '🎬 Blockbuster Moments', '🥂 Cheers to More'],
    accentColor: 'from-amber-600/30 via-yellow-900/10 to-transparent',
    demoUrl: '/rdxthunder',
    previewImage: '/toAdd/IMG_7690.jpg',
    description: 'Chrono-timeline memory reel, congratulatory audio greeting, and keepsake digital archive.',
  },
]

const PLANS: Plan[] = [
  {
    id: 'mini',
    name: 'Mini Reel',
    price: '₹49',
    badge: 'Budget Friendly',
    description: 'Essential highlights for quick gifts, birthdays, and cute memory previews.',
    photoLimit: 'Up to 20 Photos',
    rowLimit: '2 Custom Rows',
    features: [
      'Up to 20 Photos & Clips',
      '2 Custom Category Rows',
      'Private 4-Digit Passcode',
      'Personalized Link (myflix.me/name)',
      '100% Ad-Free Lifetime Stream',
    ],
    ctaText: 'Choose Mini (₹49)',
  },
  {
    id: 'premier',
    name: 'Blockbuster',
    price: '₹99',
    popular: true,
    badge: '🔥 Most Popular (75% Choose This)',
    description: 'The full-blown Netflix experience with hero billboard trailer & background song.',
    photoLimit: 'Up to 60 Photos + 5 Videos',
    rowLimit: 'Up to 5 Custom Rows',
    features: [
      'Up to 60 Photos + 5 Videos',
      'Up to 5 Custom Category Rows',
      '🎵 Background Music / Audio Gateway',
      '🎬 Top Hero Trailer Billboard',
      'Fullscreen Slideshow Overlay',
      'Private 4-Digit Passcode Lock',
      'Direct Shareable Custom Link',
    ],
    ctaText: 'Choose Premier (₹99)',
  },
  {
    id: 'vip',
    name: "Director's Cut",
    price: '₹199',
    badge: 'VIP Keepsake',
    description: 'Unlimited photos, full HD video streaming, and permanent digital archive.',
    photoLimit: 'Unlimited Photos & HD Videos',
    rowLimit: 'Unlimited Rows',
    features: [
      'Unlimited Photos & Full HD Videos',
      'Unlimited Category Rows',
      '🎵 Custom Song & Audio Gateway',
      '🎬 Top Billboard Hero Trailer',
      'Priority Video Streaming Bandwidth',
      'Permanent Keepsake Archive',
      'VIP Direct Support',
    ],
    ctaText: 'Choose VIP (₹199)',
  },
]

export function LandingPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(TEMPLATES[0])
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[1]) // Blockbuster Premier default
  const [customSlug, setCustomSlug] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 45% Scroll Tracking & Smooth Top Progress
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })
  const [passed45Percent, setPassed45Percent] = useState(false)

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setPassed45Percent(latest >= 0.45)
    })
  }, [scrollYProgress])

  // Unlock modal state for returning creators
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false)
  const [unlockSlug, setUnlockSlug] = useState('')
  const [unlockError, setUnlockError] = useState('')

  const cleanSlug = customSlug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  const handleCreateSite = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const targetSlug = cleanSlug || selectedTemplate.sampleSlug

    setIsCreating(true)
    setErrorMessage('')

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: targetSlug,
          brandName: selectedTemplate.name.split(' ')[1] ? `${selectedTemplate.name.split(' ')[1]}Flix` : 'MyFlix',
          profileName: targetSlug.charAt(0).toUpperCase() + targetSlug.slice(1),
          creatorPasscode: '1234',
          plan: selectedPlan.id,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          router.push(`/${targetSlug}?setup=true`)
          return
        }
        setErrorMessage(data.error || 'Failed to create site')
        setIsCreating(false)
        return
      }

      router.push(`/${targetSlug}?setup=true`)
    } catch (err: unknown) {
      console.error(err)
      setErrorMessage('Something went wrong. Please try again.')
      setIsCreating(false)
    }
  }

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan)
    const el = document.getElementById('create')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleUnlockExisting = (e: React.FormEvent) => {
    e.preventDefault()
    if (!unlockSlug.trim()) {
      setUnlockError('Please enter your stream slug')
      return
    }
    const slug = unlockSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
    router.push(`/${slug}?creator=true`)
  }

  return (
    <div className="min-h-screen w-full max-w-full bg-[#141414] text-white selection:bg-primary selection:text-white overflow-x-hidden font-sans relative">
      {/* Top Scroll Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-primary to-amber-500 origin-left z-50 shadow-sm shadow-primary/60 pointer-events-none"
      />

      {/* Floating 45% Scroll Quick-Build Pill */}
      <AnimatePresence>
        {passed45Percent && (
          <motion.div
            initial={{ y: 70, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 70, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('create')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-red-600 hover:from-primary/95 hover:to-red-500 text-white font-extrabold text-xs sm:text-sm px-4.5 py-2.5 sm:px-5 sm:py-3 shadow-2xl shadow-primary/60 border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
            >
              <Sparkles className="size-3.5 sm:size-4 text-amber-300 animate-spin" />
              <span>Create MyFlix ({selectedPlan.price})</span>
              <ArrowRight className="size-3.5 sm:size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hardware-Accelerated Ambient Glow (Zero Blur Lag) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu">
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] max-w-full h-[450px] sm:h-[600px] rounded-full opacity-70 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(229, 9, 20, 0.22) 0%, rgba(229, 9, 20, 0.06) 50%, transparent 72%)',
          }}
        />
        <div
          className="absolute top-[35%] right-[-10%] w-[350px] sm:w-[550px] max-w-full h-[350px] sm:h-[550px] rounded-full opacity-60 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(185, 28, 28, 0.16) 0%, transparent 68%)',
          }}
        />
        <div
          className="absolute bottom-[-5%] left-[-10%] w-[400px] sm:w-[600px] max-w-full h-[400px] sm:h-[600px] rounded-full opacity-50 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(217, 119, 6, 0.12) 0%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      </div>

      {/* Top Navigation */}
      <header className="relative z-30 sticky top-0 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="size-8 rounded-xl bg-gradient-to-tr from-primary to-red-500 flex items-center justify-center text-white shadow-md shadow-primary/30 group-hover:scale-105 transition-transform">
              <Film className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                My<span className="text-primary">Flix</span>
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-zinc-400 uppercase -mt-1 hidden sm:block">
                Personal Stream Studio
              </span>
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
            <a href="#plans" className="hover:text-white transition-colors">
              Pricing Plans
            </a>
            <a href="#templates" className="hover:text-white transition-colors">
              Example Templates
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <Link
              href="/rdxthunder"
              className="flex items-center gap-1.5 text-zinc-300 hover:text-primary transition-colors font-medium"
            >
              <Sparkles className="size-3.5 text-amber-400" />
              <span>Live Demo</span>
            </Link>
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsUnlockModalOpen(true)}
              className="flex items-center gap-1 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-xl transition-all"
            >
              <Lock className="size-3.5 text-zinc-400 shrink-0" />
              <span>Login</span>
            </button>

            <a
              href="#plans"
              className="flex items-center gap-1 text-xs sm:text-sm font-bold bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-xl shadow-md shadow-primary/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Plans</span>
              <ArrowRight className="size-3.5 hidden sm:inline" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-6 pb-12 sm:pt-16 sm:pb-24 px-3 sm:px-6 max-w-7xl mx-auto w-full min-w-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full min-w-0 max-w-full">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left w-full min-w-0 max-w-full">
            {/* Top Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] sm:text-xs font-semibold text-red-300 shadow-sm max-w-full"
            >
              <Sparkles className="size-3 shrink-0 text-amber-400 animate-pulse" />
              <span className="truncate">The #1 Personalized Streaming Memory Gift</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white w-full max-w-full break-words"
            >
              <span className="block">Give Them Their Own</span>
              <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent inline-block">
                Netflix.
              </span>
              <span className="block mt-1 sm:mt-2 text-zinc-100 text-lg sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-snug">
                Streaming Only Your Memories.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs sm:text-base lg:text-lg text-zinc-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed px-1 sm:px-0 w-full break-words"
            >
              Turn your photos, video clips, and special moments into a full-scale Netflix streaming portal. Complete with custom trailers, movie rows, background music, and your unique shareable link.
            </motion.p>

            {/* Live Custom Slug Input Form */}
            <motion.div
              id="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-1 w-full max-w-xl mx-auto lg:mx-0 min-w-0"
            >
              {/* Selected Plan Indicator Banner */}
              <div className="mb-2 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs w-full min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 truncate">
                  <span className="text-zinc-400 shrink-0 text-[11px] sm:text-xs">Selected Plan:</span>
                  <span className="font-bold text-primary truncate text-[11px] sm:text-xs">{selectedPlan.name} ({selectedPlan.price})</span>
                </div>
                <a href="#plans" className="text-primary hover:underline font-semibold text-[11px] shrink-0 whitespace-nowrap">
                  Change Plan
                </a>
              </div>

              <form
                onSubmit={handleCreateSite}
                className="p-1.5 sm:p-2 rounded-2xl bg-zinc-900/90 border border-white/15 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row gap-2 w-full max-w-full min-w-0"
              >
                <div className="flex-1 min-w-0 flex items-center px-2.5 sm:px-3 py-2.5 sm:py-0 bg-black/60 rounded-xl border border-white/5 focus-within:border-primary/60 transition-colors w-full">
                  <span className="text-zinc-500 font-mono text-[11px] sm:text-sm select-none shrink-0">
                    myflix.domain/
                  </span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="your-name-here"
                    className="w-full min-w-0 bg-transparent font-semibold text-xs sm:text-base text-white placeholder-zinc-600 focus:outline-none pl-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold py-2.5 sm:py-3.5 px-4 sm:px-6 shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 text-xs sm:text-sm whitespace-nowrap cursor-pointer shrink-0"
                >
                  {isCreating ? (
                    <span className="inline-block animate-spin mr-1">⏳</span>
                  ) : (
                    <Zap className="size-4 shrink-0" />
                  )}
                  <span>Create For {selectedPlan.price}</span>
                  <ArrowRight className="size-4 shrink-0" />
                </button>
              </form>

              {errorMessage && (
                <p className="text-xs text-rose-400 mt-2 font-medium px-2 text-left">
                  {errorMessage}
                </p>
              )}

              {/* Trust Badges */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center lg:justify-start gap-x-2.5 sm:gap-x-3.5 gap-y-1.5 text-[10px] sm:text-xs text-zinc-400 font-medium w-full min-w-0">
                <span className="inline-flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
                  <span>Instant Setup</span>
                </span>
                <span className="inline-flex items-center gap-1 shrink-0">
                  <ShieldCheck className="size-3 text-emerald-400 shrink-0" />
                  <span>Passcode Locked</span>
                </span>
                <span className="inline-flex items-center gap-1 shrink-0">
                  <Tv className="size-3 text-emerald-400 shrink-0" />
                  <span>Mobile, Tablet & TV</span>
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Cinema Player Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative w-full min-w-0 max-w-full"
          >
            <div className="relative mx-auto max-w-sm sm:max-w-md w-full rounded-2xl border border-white/20 bg-zinc-950/80 p-2 sm:p-3 shadow-2xl shadow-primary/20 backdrop-blur-md overflow-hidden group">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-2 sm:pb-2.5 px-1 sm:px-2 border-b border-white/10 gap-2 w-full min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 overflow-hidden flex-1">
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="size-2 rounded-full bg-red-500" />
                    <div className="size-2 rounded-full bg-yellow-500" />
                    <div className="size-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 truncate max-w-[120px] sm:max-w-none">
                    myflix.domain/{cleanSlug || selectedTemplate.sampleSlug}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold shrink-0">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Live Ready</span>
                </div>
              </div>

              {/* Player Image */}
              <div className="relative aspect-[16/10] w-full mt-2.5 rounded-xl overflow-hidden bg-zinc-900 border border-white/10">
                <Image
                  src={selectedTemplate.previewImage}
                  alt={selectedTemplate.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/20 px-1.5 py-0.5 rounded border border-primary/30">
                      Now Streaming
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-white drop-shadow-md">
                      {selectedTemplate.name}
                    </h3>
                    <p className="text-[10px] text-zinc-300 drop-shadow line-clamp-1">
                      {selectedTemplate.tagline}
                    </p>
                  </div>

                  <Link
                    href={selectedTemplate.demoUrl}
                    className="size-8 rounded-full bg-white text-black hover:bg-primary hover:text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 shrink-0"
                    title="Experience this live demo"
                  >
                    <Play className="size-3.5 fill-current ml-0.5" />
                  </Link>
                </div>
              </div>

              {/* Bottom Categories Bar */}
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2 min-w-0 overflow-hidden">
                <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none text-[10px] font-medium text-zinc-300 min-w-0 flex-1">
                  {selectedTemplate.categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 whitespace-nowrap shrink-0"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <Link
                  href={selectedTemplate.demoUrl}
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 shrink-0 ml-1"
                >
                  <span>Preview</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRICING PLANS SECTION (Scroll Reveal Triggered at 45% Viewport) */}
      <section id="plans" className="relative z-10 py-12 sm:py-20 border-t border-white/10 bg-black/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-center max-w-2xl mx-auto space-y-2 mb-10 sm:mb-14"
          >
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-primary">
              Simple, Flat Pricing
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Choose Your Memory Stream Plan
            </h2>
            <p className="text-xs sm:text-base text-zinc-400 px-2 sm:px-0">
              One-time payment. Zero recurring monthly fees. You keep your personalized stream forever.
            </p>
          </motion.div>

          {/* Pricing Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch w-full min-w-0"
          >
            {PLANS.map((plan) => {
              const isCurrentSelected = selectedPlan.id === plan.id

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border p-5 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                    plan.popular
                      ? 'border-primary bg-gradient-to-b from-red-950/30 via-zinc-950 to-zinc-950 shadow-2xl shadow-primary/20 scale-[1.01] sm:scale-105 z-10'
                      : 'border-white/10 bg-zinc-950/60 hover:border-white/25'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="mb-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          plan.popular
                            ? 'bg-primary text-white border-primary/50 shadow-md shadow-primary/30'
                            : 'bg-white/10 text-zinc-300 border-white/15'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price Tag */}
                    <div className="pt-2 pb-1 border-b border-white/10">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                          {plan.price}
                        </span>
                        <span className="text-xs text-zinc-400 font-medium">one-time flat</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-zinc-300 font-semibold">
                        <span className="text-primary">{plan.photoLimit}</span>
                        <span>•</span>
                        <span>{plan.rowLimit}</span>
                      </div>
                    </div>

                    {/* Feature Checklist */}
                    <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-zinc-300">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Plan CTA Button */}
                  <div className="pt-6 mt-6 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isCurrentSelected || plan.popular
                          ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {isCurrentSelected && <Check className="size-4" />}
                      <span>{isCurrentSelected ? `Selected (${plan.price})` : plan.ctaText}</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Example Templates Section (Scroll Reveal at 45%) */}
      <section id="templates" className="relative z-10 py-12 sm:py-24 border-t border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-center max-w-2xl mx-auto space-y-2 mb-8 sm:mb-12"
          >
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-primary">
              Pre-Engineered Inspiration
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Choose An Example Template
            </h2>
            <p className="text-xs sm:text-base text-zinc-400 px-2 sm:px-0">
              Pick a baseline that fits your story. Every template can be completely customized with your own pictures, titles, songs, and colors.
            </p>
          </motion.div>

          {/* Template Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0"
          >
            {TEMPLATES.map((tmpl) => {
              const Icon = tmpl.icon
              const isSelected = selectedTemplate.id === tmpl.id

              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`relative cursor-pointer rounded-2xl border transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-zinc-950/90 shadow-2xl shadow-primary/20 scale-[1.01] sm:scale-[1.02]'
                      : 'border-white/10 bg-zinc-950/40 hover:border-white/25 hover:bg-zinc-950/70'
                  }`}
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                        <Icon className="size-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/20 text-red-300 border border-primary/30">
                        {tmpl.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        {tmpl.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {tmpl.tagline}
                      </p>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                        Included Rows
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tmpl.categories.map((c, i) => (
                          <span
                            key={i}
                            className="text-[11px] sm:text-xs px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                    <Link
                      href={tmpl.demoUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <span>Live Preview</span>
                      <ExternalLink className="size-3" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTemplate(tmpl)
                        const el = document.getElementById('create')
                        el?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-primary text-white shadow-md shadow-primary/30'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {isSelected ? 'Active' : 'Use Template'}
                    </button>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase Grid (Scroll Reveal at 45%) */}
      <section id="features" className="relative z-10 py-12 sm:py-24 max-w-7xl mx-auto px-3.5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center max-w-2xl mx-auto space-y-2 mb-10 sm:mb-14"
        >
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-primary">
            Built For Unforgettable Reactions
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Every Feature You Need To Wow Them
          </h2>
          <p className="text-xs sm:text-base text-zinc-400 px-2 sm:px-0">
            A real full-featured web app that mimics Netflix down to the sound effects, hero banners, and carousel physics.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0"
        >
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 sm:p-6 space-y-2.5 hover:border-white/20 transition-colors">
            <div className="size-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <Film className="size-4.5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold">Netflix Cinematic Trailer</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Auto-rotating featured hero carousel with high-resolution stills, video highlights, and dramatic synopsis.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 sm:p-6 space-y-2.5 hover:border-white/20 transition-colors">
            <div className="size-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Music className="size-4.5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold">Soundtrack & Audio Intro</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Plays your personal background song or intro chime the moment they tap into their profile gateway.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 sm:p-6 space-y-2.5 hover:border-white/20 transition-colors">
            <div className="size-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="size-4.5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold">4-Digit Passcode Lock</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Anyone with the link enjoys a 100% clean view-only stream. Only you have the PIN to enter creator edit mode.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 sm:p-6 space-y-2.5 hover:border-white/20 transition-colors">
            <div className="size-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="size-4.5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold">In-Place Visual Pencil Studio</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Click the pencil directly over any title, picture, or category to edit, rearrange, or delete instantly.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 sm:p-6 space-y-2.5 hover:border-white/20 transition-colors">
            <div className="size-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Smartphone className="size-4.5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold">Native Mobile & Fullscreen</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Smooth horizontal touch swiping, fullscreen slideshow overlays, and byte-range video streaming.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 sm:p-6 space-y-2.5 hover:border-white/20 transition-colors">
            <div className="size-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Heart className="size-4.5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold">Personalized URL Slug</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Share a clean, memorable address like <code className="text-red-300 font-mono text-xs">myflix.domain/raj-simran</code> that lasts forever.
            </p>
          </div>
        </motion.div>
      </section>

      {/* How It Works (Scroll Reveal at 45%) */}
      <section id="how-it-works" className="relative z-10 py-12 sm:py-24 border-t border-white/10 bg-zinc-950/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-center max-w-2xl mx-auto space-y-2 mb-10 sm:mb-14"
          >
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-primary">
              Zero Tech Skills Needed
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready in Under 5 Minutes
            </h2>
            <p className="text-xs sm:text-base text-zinc-400 px-2 sm:px-0">
              Creating an unforgettable memory stream is as easy as filling in your favorite photos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 relative w-full min-w-0"
          >
            <div className="rounded-2xl border border-white/10 bg-black/60 p-6 sm:p-8 space-y-3 relative">
              <span className="text-3xl sm:text-4xl font-black text-primary/40 font-mono">01</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">Pick Your Slug & Plan</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Choose a unique address and select your desired memory plan starting from just ₹49.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/60 p-6 sm:p-8 space-y-3 relative">
              <span className="text-3xl sm:text-4xl font-black text-primary/40 font-mono">02</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">Set PIN & Customize</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Choose your secret 4-digit PIN. Tap pencil icons on the screen to upload pictures, edit category names, and write captions.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/60 p-6 sm:p-8 space-y-3 relative">
              <span className="text-3xl sm:text-4xl font-black text-primary/40 font-mono">03</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">Send The Link & Enjoy</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Send the link to your special someone. They get an interactive, ad-free cinema stream dedicated entirely to them!
              </p>
            </div>
          </motion.div>

          {/* Bottom CTA Banner (Scroll Reveal at 45%) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 35 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mt-12 sm:mt-16 rounded-2xl sm:rounded-3xl border border-primary/30 bg-gradient-to-r from-red-950/40 via-zinc-950 to-red-950/40 p-6 sm:p-12 text-center space-y-4 sm:space-y-6 shadow-2xl"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-[11px] sm:text-xs font-semibold text-red-300">
              <Flame className="size-3.5 text-primary" />
              <span>Limited First-Edition Launch</span>
            </div>

            <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-white max-w-xl mx-auto leading-snug">
              Ready to create something they will remember forever?
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('create')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold py-3 sm:py-3.5 px-6 sm:px-8 shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm cursor-pointer"
              >
                <span>Claim Your Custom Link</span>
                <ArrowRight className="size-4" />
              </button>

              <Link
                href="/rdxthunder"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold py-3 sm:py-3.5 px-5 sm:px-6 transition-all text-xs sm:text-sm"
              >
                <Play className="size-4 fill-current" />
                <span>See Live Demo</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10 px-3 sm:px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-zinc-500 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2">
            <Film className="size-4 text-primary" />
            <span className="font-bold text-zinc-300 uppercase tracking-wider">
              My<span className="text-primary">Flix</span>
            </span>
            <span>&copy; {new Date().getFullYear()} MyFlix Studio.</span>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Link href="/rdxthunder" className="hover:text-zinc-300 transition-colors">
              Live Demo
            </Link>
            <button
              type="button"
              onClick={() => setIsUnlockModalOpen(true)}
              className="hover:text-zinc-300 transition-colors"
            >
              Creator Login
            </button>
            <a href="#plans" className="text-primary hover:underline font-medium">
              View Plans
            </a>
          </div>
        </div>
      </footer>

      {/* Creator Unlock Modal */}
      <AnimatePresence>
        {isUnlockModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUnlockModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-sm rounded-2xl border border-white/15 bg-zinc-950 p-6 shadow-2xl text-white space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                    <Lock className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold">Creator Access</h4>
                    <p className="text-[11px] text-zinc-400">Open your stream editor</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUnlockModalOpen(false)}
                  className="text-zinc-500 hover:text-white text-lg font-bold px-2 py-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUnlockExisting} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Your Stream Slug
                  </label>
                  <div className="flex items-center px-3 py-2 bg-black/60 rounded-xl border border-white/10 text-sm">
                    <span className="text-zinc-500 text-xs font-mono select-none">myflix.domain/</span>
                    <input
                      type="text"
                      value={unlockSlug}
                      onChange={(e) => setUnlockSlug(e.target.value)}
                      placeholder="rdxthunder"
                      className="w-full bg-transparent font-medium text-white focus:outline-none pl-1 text-sm"
                      autoFocus
                    />
                  </div>
                </div>

                {unlockError && (
                  <p className="text-xs text-rose-400 font-medium">{unlockError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Enter Studio
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
