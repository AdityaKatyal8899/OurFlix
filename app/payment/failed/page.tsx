'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
  Home,
} from 'lucide-react'

function PaymentFailedContent() {
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug') || ''
  const orderId = searchParams.get('order_id') || searchParams.get('session_id') || ''
  const status = searchParams.get('status') || 'INCOMPLETE'

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-primary selection:text-white overflow-hidden">
      {/* Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu">
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full opacity-50 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(225, 29, 72, 0.22) 0%, rgba(217, 119, 6, 0.08) 50%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      </div>

      {/* Main Failed Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md w-full bg-zinc-950/90 border border-rose-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-rose-950/20 text-center space-y-6"
      >
        {/* Warning Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }}
          className="mx-auto size-20 rounded-3xl bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 shadow-xl shadow-rose-500/20 flex items-center justify-center"
        >
          <div className="size-full bg-zinc-950 rounded-[22px] flex items-center justify-center">
            <AlertTriangle className="size-10 text-rose-400" />
          </div>
        </motion.div>

        {/* Headline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300">
            <ShieldAlert className="size-3.5" />
            <span>Transaction {status.toLowerCase() === 'user_dropped' ? 'Cancelled' : 'Incomplete'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Payment Not Completed
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
            The payment session was cancelled, timed out in UPI, or declined by the bank.
          </p>
        </div>

        {/* Reassurance Box */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/10 text-left space-y-1.5 text-xs text-zinc-300">
          <div className="font-bold text-white flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-400">
            <span>🛡️ Bank Deducted Any Money?</span>
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-400">
            Don&apos;t worry — if any funds were debited, Cashfree automatically reverses it back to your original bank account or UPI app within 2 to 4 hours.
          </p>
        </div>

        {/* Slug Reservation Notice */}
        {slug && (
          <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs text-zinc-300">
            <span>Your desired link </span>
            <code className="text-primary font-bold font-mono">myflix.domain/{slug}</code>
            <span> is still saved for you!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <Link
            href={slug ? `/?slug=${encodeURIComponent(slug)}#create` : '/#create'}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-6 shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 text-sm cursor-pointer"
          >
            <RotateCcw className="size-4" />
            <span>Try Payment Again</span>
            <ArrowRight className="size-4" />
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 transition-colors"
            >
              <MessageSquare className="size-3" />
              <span>Contact Help</span>
            </Link>

            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-400 transition-colors"
            >
              <Home className="size-3" />
              <span>Back Home</span>
            </Link>
          </div>
        </div>

        {/* Reference */}
        {orderId && (
          <div className="pt-2 border-t border-white/10 text-[10px] text-zinc-600 font-mono">
            <span>Order Ref: {orderId}</span>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="animate-spin text-2xl">⏳</div>
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  )
}
