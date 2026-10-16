'use client'

import React, { Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Film,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  UserCheck,
  Mail,
  ChevronLeft,
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function GoogleIcon() {
  return (
    <svg className="size-5 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

function LoginContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || searchParams.get('returnUrl') || '/profile'
  const action = searchParams.get('action') || ''
  const slug = searchParams.get('slug') || ''
  const plan = searchParams.get('plan') || ''
  const error = searchParams.get('error')

  const [isLoading, setIsLoading] = useState(false)

  // Construct Google OAuth trigger URL
  const googleAuthUrl = `/api/auth/google?returnUrl=${encodeURIComponent(
    redirect
  )}&action=${encodeURIComponent(action)}&slug=${encodeURIComponent(slug)}&plan=${encodeURIComponent(
    plan
  )}`

  const handleGoogleClick = () => {
    setIsLoading(true)
    window.location.href = googleAuthUrl
  }

  const isCreating = action === 'create' || !!slug

  return (
    <div className="min-h-screen w-full bg-[#141414] text-white selection:bg-primary selection:text-white flex flex-col justify-between font-sans relative overflow-x-hidden">
      {/* Background Cinematic Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu">
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[500px] rounded-full opacity-60 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(229, 9, 20, 0.28) 0%, rgba(229, 9, 20, 0.08) 50%, transparent 72%)',
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full opacity-40 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(185, 28, 28, 0.2) 0%, transparent 68%)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-5 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-9 rounded-xl bg-gradient-to-tr from-primary to-red-600 flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            <Film className="size-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              My<span className="text-primary">Flix</span>
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase -mt-1 hidden sm:block">
              OAuth Verification
            </span>
          </div>
        </Link>

        <Link
          href="/#plans"
          id="explore-plans-header-btn"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl transition-all"
        >
          <ChevronLeft className="size-4 text-zinc-400" />
          <span>Explore Plans Without Login</span>
        </Link>
      </header>

      {/* Main Center OAuth Consent Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-[480px] rounded-3xl border border-white/15 bg-zinc-950/85 p-6 sm:p-9 shadow-2xl shadow-black/80 backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Subtle Top Red Edge Glow */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Context Intent Banner */}
          {isCreating ? (
            <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
              <Sparkles className="size-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-xs sm:text-sm">
                  Ready to create stream: {slug ? <span className="text-primary">/{slug}</span> : 'New Stream'}
                </p>
                <p className="text-zinc-300 text-[11px] mt-0.5 leading-relaxed">
                  Sign in with Google to associate your stream link with your account and unlock the creator studio.
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded-2xl border border-primary/25 bg-primary/10 p-3.5 text-xs text-zinc-200 flex items-start gap-2.5">
              <UserCheck className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-xs sm:text-sm">Account Verification</p>
                <p className="text-zinc-300 text-[11px] mt-0.5 leading-relaxed">
                  Sign in with Google to view your profile, manage active streams, and inspect hosting status.
                </p>
              </div>
            </div>
          )}

          {/* Error Notice if returned from OAuth failure */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="size-4 text-red-400 shrink-0" />
              <span>
                {error === 'oauth_cancelled'
                  ? 'Google sign-in was cancelled. Please try again.'
                  : 'Authentication failed. Please verify and try again.'}
              </span>
            </div>
          )}

          {/* Title & Subheading */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-zinc-300 mb-1">
              <Lock className="size-3 text-emerald-400" />
              <span>Official Google OAuth 2.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Connect to <span className="text-primary">OurFlix</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Sign in with your Google account to create your personal stream or view your saved profiles.
            </p>
          </div>

          {/* Google Consent Permissions Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3.5 mb-6 text-left">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Access permissions requested:
            </p>

            <div className="flex items-start gap-3">
              <div className="size-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                <CheckCircle2 className="size-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">Google Profile Information</p>
                <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                  Your name and avatar to personalize your stream banner & director avatar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="size-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                <Mail className="size-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">Verified Email Address</p>
                <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                  To securely identify and link your streams so you can edit and access them anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Primary Action Button: Sign in with Google */}
          <div className="space-y-3.5">
            <button
              type="button"
              id="google-signin-submit-btn"
              onClick={handleGoogleClick}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-extrabold text-sm sm:text-base py-3.5 px-4 shadow-xl shadow-white/10 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group border border-white"
            >
              {isLoading ? (
                <div className="size-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              <ArrowRight className="size-4 text-zinc-500 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Privacy & Guarantee Note */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              <span>We never access your Google Drive or sensitive data.</span>
            </div>
          </div>

          {/* Bottom Divider & Transparent Exploration Callout */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-zinc-300">
              <p className="font-medium text-white mb-1">Exploring plans doesn&apos;t require login</p>
              <p className="text-[11px] text-zinc-400 leading-relaxed mb-2.5">
                You can browse pricing plans, preview interactive live demo streams, and test usernames freely without signing in.
              </p>
              <Link
                href="/#plans"
                id="explore-plans-card-link"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-red-400 transition-colors"
              >
                <span>View All Plans & Features</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-4 text-center text-[11px] text-zinc-400 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} OurFlix Studio. All rights reserved.</span>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/#plans" className="hover:text-white transition-colors">
              Pricing Plans
            </Link>
            <Link href="/rdxthunder" className="hover:text-white transition-colors">
              Live Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#141414] flex items-center justify-center text-white">
          <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
