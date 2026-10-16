'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  Tv,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Film,
  Play,
  CheckCircle2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface VisitProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VisitProfileModal({ isOpen, onClose }: VisitProfileModalProps) {
  const router = useRouter()
  const [inputUrl, setInputUrl] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  // Helper to extract clean slug from any pasted link or input
  const extractSlug = (val: string): string => {
    let cleaned = val.trim()
    // Strip query params and hashes
    cleaned = cleaned.split('?')[0].split('#')[0]
    // Strip protocol and domain
    cleaned = cleaned.replace(/^https?:\/\//i, '')
    cleaned = cleaned.replace(/^(localhost:\d+|127\.0\.0\.1:\d+)\//i, '')
    cleaned = cleaned.replace(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\//i, '')
    // Strip leading/trailing slashes
    cleaned = cleaned.replace(/^\/+|\/+$/g, '')
    // Keep only valid slug characters
    cleaned = cleaned.toLowerCase().replace(/[^a-z0-9-]/g, '')
    return cleaned
  }

  const cleanSlug = extractSlug(inputUrl)

  const handleVisit = (slugToVisit?: string) => {
    const target = slugToVisit || cleanSlug
    if (!target) {
      setErrorMsg('Please enter a stream name or paste a link')
      return
    }

    onClose()
    // Always navigate with ?viewer=true to ensure pure viewer mode
    router.push(`/${target}?viewer=true`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleVisit()
  }

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
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-7 shadow-2xl text-white z-10 overflow-hidden"
        >
          {/* Top Subtle Red Aura */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                <Tv className="size-4.5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Visit A Stream</h3>
                <p className="text-xs text-zinc-400">Watch as a guest viewer</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              id="close-visit-modal-btn"
              className="size-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="space-y-1.5 text-left">
              <label htmlFor="stream-url-input" className="text-xs font-semibold text-zinc-300">
                Paste Stream Link or Name
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-2xl border border-white/15 bg-black/60 focus-within:border-primary transition-all">
                <Search className="size-4 text-zinc-400 shrink-0 ml-1" />
                <input
                  id="stream-url-input"
                  type="text"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value)
                    if (errorMsg) setErrorMsg('')
                  }}
                  placeholder="e.g. rdxthunder or ourflix.in/rdxthunder"
                  className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                  autoFocus
                />
              </div>

              {cleanSlug && cleanSlug !== inputUrl.trim() && (
                <p className="text-[11px] text-zinc-400 pl-1">
                  Visiting: <span className="font-mono text-primary font-semibold">/{cleanSlug}</span> (Viewer Mode)
                </p>
              )}

              {errorMsg && <p className="text-xs text-rose-400 pl-1">{errorMsg}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!cleanSlug}
              id="submit-visit-stream-btn"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-4 shadow-xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-95 text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="size-4 fill-current shrink-0" />
              <span>Watch Stream As Viewer</span>
              <ArrowRight className="size-4" />
            </button>
          </form>

          {/* Popular / Demo Quick Shortcuts */}
          <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5 text-left">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <Sparkles className="size-3 text-amber-400" />
              <span>Instant Viewer Demos</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleVisit('rdxthunder')}
                className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-all text-left cursor-pointer group"
              >
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                    RDXThunder
                  </p>
                  <p className="text-[10px] text-zinc-400">Romance Premiere</p>
                </div>
                <Play className="size-3 text-zinc-500 group-hover:text-white shrink-0 fill-current" />
              </button>

              <button
                type="button"
                onClick={() => handleVisit('capybara')}
                className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-all text-left cursor-pointer group"
              >
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                    Capybara
                  </p>
                  <p className="text-[10px] text-zinc-400">Zen & Chill Mini</p>
                </div>
                <Play className="size-3 text-zinc-500 group-hover:text-white shrink-0 fill-current" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
