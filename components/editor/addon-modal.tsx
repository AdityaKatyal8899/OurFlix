'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Zap,
  Film,
  Camera,
  Layers,
  Music,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { CASHFREE_ADDONS, CashfreeAddonKey } from '@/lib/cashfree'

interface AddonModalProps {
  isOpen: boolean
  onClose: () => void
  slug: string
  currentPlan?: 'mini' | 'premier' | 'vip'
  photoCount: number
  videoCount: number
  rowCount: number
  maxPhotos: number
  maxVideos: number
  maxRows: number
  expiresAt?: Date | string
  defaultSelected?: CashfreeAddonKey
}

export function AddonModal({
  isOpen,
  onClose,
  slug,
  currentPlan = 'premier',
  photoCount,
  videoCount,
  rowCount,
  maxPhotos,
  maxVideos,
  maxRows,
  expiresAt,
  defaultSelected = 'addon_row_19',
}: AddonModalProps) {
  const [selectedAddon, setSelectedAddon] = useState<CashfreeAddonKey>(defaultSelected)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const calculateDaysLeft = () => {
    if (!expiresAt) return null
    const diff = new Date(expiresAt).getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const daysLeft = calculateDaysLeft()

  const handleBuyAddon = async () => {
    setIsProcessing(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/cashfree/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          addon: selectedAddon,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to start payment session.')
        setIsProcessing(false)
        return
      }

      if (data.paymentSessionId) {
        const { load } = await import('@cashfreepayments/cashfree-js')
        const mode = process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production' ? 'production' : 'sandbox'
        const cashfree = await load({ mode })
        await cashfree.checkout({
          paymentSessionId: data.paymentSessionId,
          redirectTarget: '_self',
        })
      }
    } catch (err: unknown) {
      console.error(err)
      setErrorMsg('Something went wrong. Please try again.')
      setIsProcessing(false)
    }
  }

  const ADDON_LIST: Array<{
    key: CashfreeAddonKey
    icon: React.ElementType
    badge: string
    title: string
    price: string
    desc: string
  }> = [
    {
      key: 'addon_row_19',
      icon: Layers,
      badge: 'Most Popular',
      title: '+1 Movie Row',
      price: '₹19',
      desc: 'Add 1 additional category row to your stream.',
    },
    {
      key: 'addon_photos_29',
      icon: Camera,
      badge: 'Photo Boost',
      title: '+10 Photos Pack',
      price: '₹29',
      desc: 'Capacity for 10 more high-res photo memories.',
    },
    {
      key: 'addon_videos_39',
      icon: Film,
      badge: 'Video Boost',
      title: '+3 Video Clips',
      price: '₹39',
      desc: 'Capacity for 3 moving video highlight moments.',
    },
    {
      key: 'addon_audio_29',
      icon: Music,
      badge: 'Audio Unlock',
      title: 'Soundtrack & Chime',
      price: '₹29',
      desc: 'Add custom background music and chime intro.',
    },
    {
      key: 'addon_photos_59',
      icon: Camera,
      badge: 'Super Pack',
      title: '+25 Super Photos',
      price: '₹59',
      desc: 'Ideal for large albums and trips (+25 photos).',
    },
    {
      key: 'addon_videos_79',
      icon: Film,
      badge: 'Director Pack',
      title: '+8 Video Pack',
      price: '₹79',
      desc: '8 video clips for mini movie compilations.',
    },
    {
      key: 'renew_hosting_49',
      icon: Clock,
      badge: 'Cloud Validity',
      title: 'Extend 1 Year Hosting',
      price: '₹49/yr',
      desc: 'Extends private cloud streaming by 365 days.',
    },
  ]

  const activeOption = CASHFREE_ADDONS[selectedAddon]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-xl rounded-3xl border border-white/15 bg-zinc-950 p-5 sm:p-7 shadow-2xl text-white space-y-5 my-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[10px] sm:text-xs font-semibold text-red-300">
                <Sparkles className="size-3 text-amber-400" />
                <span>In-Studio Micro-Upgrades</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                Expand Studio Capacity
              </h3>
              <p className="text-xs text-zinc-400">
                Unlock extra rows, photos, or clips instantly with 1-tap UPI.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-500 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          {/* Current Capacity Meters */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] text-zinc-400 uppercase font-bold">Rows</span>
              <p className="font-extrabold text-white text-sm">
                {rowCount} / {maxRows}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] text-zinc-400 uppercase font-bold">Photos</span>
              <p className="font-extrabold text-white text-sm">
                {photoCount} / {maxPhotos}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] text-zinc-400 uppercase font-bold">Videos</span>
              <p className="font-extrabold text-white text-sm">
                {videoCount} / {maxVideos}
              </p>
            </div>
            {daysLeft !== null && (
              <div className="col-span-3 sm:col-span-1 p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                <span className="text-[10px] text-zinc-400 uppercase font-bold">Hosting</span>
                <p className="font-extrabold text-emerald-400 text-xs">
                  {daysLeft}d left
                </p>
              </div>
            )}
          </div>

          {/* Add-ons Selection Grid */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-400 block">
              Select Upgrade to Unlock:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {ADDON_LIST.map((item) => {
                const Icon = item.icon
                const isSelected = selectedAddon === item.key

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedAddon(item.key)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-primary text-white'
                            : 'bg-white/10 text-zinc-300'
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-zinc-400 line-clamp-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-emerald-400 font-mono">
                        {item.price}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p className="text-xs text-rose-400 font-medium text-center">
              {errorMsg}
            </p>
          )}

          {/* Action Footer */}
          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <ShieldCheck className="size-3.5 text-emerald-400 shrink-0" />
              <span>Instant UPI Activation via Cashfree</span>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleBuyAddon}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 text-xs sm:text-sm cursor-pointer shrink-0"
            >
              {isProcessing ? (
                <span className="inline-block animate-spin mr-1">⏳</span>
              ) : (
                <Zap className="size-4" />
              )}
              <span>Pay {activeOption.priceFormatted} & Unlock</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
