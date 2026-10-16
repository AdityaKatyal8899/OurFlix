'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Film,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Lock,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug') || ''
  const orderId = searchParams.get('order_id') || searchParams.get('session_id') || ''
  const amount = searchParams.get('amount') || '99'
  const addon = searchParams.get('addon') || ''
  const [copied, setCopied] = useState(false)

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://myflix-amber-phi.vercel.app'
  const streamUrl = slug ? `${origin}/${slug}` : origin

  const handleCopy = () => {
    if (!slug) return
    navigator.clipboard.writeText(streamUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-primary selection:text-white overflow-hidden">
      {/* Ambient Cinema Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu">
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-60 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.25) 0%, rgba(229, 9, 20, 0.1) 45%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      </div>

      {/* Main Success Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-lg w-full bg-zinc-950/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-emerald-950/30 text-center space-y-6"
      >
        {/* Animated Celebration Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }}
          className="mx-auto size-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/30 flex items-center justify-center"
        >
          <div className="size-full bg-zinc-950 rounded-[22px] flex items-center justify-center">
            <CheckCircle2 className="size-10 text-emerald-400" />
          </div>
        </motion.div>

        {/* Headline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <Sparkles className="size-3.5" />
            <span>{addon ? `Upgrade Verified • ₹${amount}` : `Payment Verified • ₹${amount}`}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {addon ? `${addon} Unlocked!` : 'Your Memory Stream is Ready!'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
            {addon
              ? `Your studio capacity for "${slug}" has been expanded immediately.`
              : 'Your personalized Netflix streaming portal has been created with 1-Year cloud hosting included.'}
          </p>
        </div>

        {/* Claimed URL Box */}
        {slug && (
          <div className="p-3.5 rounded-2xl bg-black/70 border border-white/10 text-left space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
              <span>Your Shareable Memory Link</span>
              <span className="text-emerald-400 font-mono text-[10px]">Instant Access</span>
            </div>
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-900/90 border border-white/10">
              <span className="text-xs sm:text-sm font-mono text-white truncate pl-1">
                {streamUrl}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-200 transition-colors"
              >
                {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Passcode Security Banner */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900/50 border border-white/10 text-left text-xs">
          <div className="size-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
            <Lock className="size-4" />
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-white flex items-center gap-2">
              <span>Creator Passcode:</span>
              <code className="px-2 py-0.5 rounded bg-primary/20 text-red-300 font-mono font-bold text-xs border border-primary/30">
                1234
              </code>
            </div>
            <p className="text-[11px] text-zinc-400">
              Only you have edit rights. You can customize photos and change this PIN anytime via the top navigation bar.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <Link
            href={`/${slug}?setup=true`}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-6 shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 text-sm cursor-pointer"
          >
            <span>Open Creator Studio & Customize</span>
            <ArrowRight className="size-4" />
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/${slug}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 transition-colors"
            >
              <span>View As Guest</span>
              <ExternalLink className="size-3" />
            </Link>

            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-400 transition-colors"
            >
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Footer Receipt Note */}
        {orderId && (
          <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-mono">
            <ShieldCheck className="size-3 text-emerald-400" />
            <span className="truncate">Ref: {orderId}</span>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="animate-spin text-2xl">⏳</div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}
