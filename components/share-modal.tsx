'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Copy,
  Check,
  Download,
  Share2,
  QrCode,
  Sparkles,
  Smartphone,
  ExternalLink,
  MessageCircle,
} from 'lucide-react'
import QRCode from 'qrcode'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  slug: string
  title?: string
  subtitle?: string
}

export function ShareModal({
  isOpen,
  onClose,
  slug,
  title,
  subtitle,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [origin, setOrigin] = useState<string>('')

  const streamTitle = title || slug || 'Memory Stream'
  const displaySlug = slug.replace(/^\//, '')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }
  }, [])

  const fullUrl = origin ? `${origin}/${displaySlug}` : `https://ourflix.in/${displaySlug}`

  // Generate QR code whenever modal opens
  useEffect(() => {
    if (!isOpen || !fullUrl) return

    QRCode.toDataURL(fullUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#141414',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err))
  }, [isOpen, fullUrl])

  if (!isOpen) return null

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch (err) {
      console.warn('Copy failed', err)
    }
  }

  const handleDownloadQr = () => {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.download = `OurFlix_${displaySlug}_QR.png`
    link.href = qrDataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${streamTitle} | OurFlix`,
          text: `🎬 Watch our memory stream on OurFlix:`,
          url: fullUrl,
        })
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink()
    }
  }

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🎬 Watch our personalized memory stream on OurFlix!\n\n🍿 Link: ${fullUrl}`
  )}`

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
          className="relative w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-5 sm:p-7 shadow-2xl text-white z-10 overflow-hidden"
        >
          {/* Top Subtle Red Aura */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                <QrCode className="size-4.5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Share Stream</h3>
                <p className="text-xs text-zinc-400">Scan QR or share direct link</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              id="close-share-modal-btn"
              className="size-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* QR Code Presentation Card */}
          <div className="my-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-[11px] font-semibold text-primary">
              <Sparkles className="size-3" />
              <span>{streamTitle}</span>
            </div>

            {/* QR Code Container */}
            <div className="mx-auto size-48 sm:size-52 rounded-2xl bg-white p-3 shadow-xl flex items-center justify-center">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${fullUrl}`}
                  className="size-full object-contain rounded-lg"
                />
              ) : (
                <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
              <Smartphone className="size-3.5 text-emerald-400" />
              <span>Scan with phone camera to launch stream instantly</span>
            </div>
          </div>

          {/* Copyable Link Input Box */}
          <div className="space-y-2 mb-4">
            <label className="text-xs font-semibold text-zinc-300">Stream Link</label>
            <div className="flex items-center gap-2 p-1.5 rounded-xl border border-white/10 bg-black/60 focus-within:border-primary/50 transition-colors">
              <span className="text-xs font-mono text-zinc-300 truncate pl-2 flex-1">
                {fullUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                id="copy-stream-link-btn"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-primary hover:bg-primary/90 text-white'
                }`}
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons: Download QR & WhatsApp & Share */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={handleDownloadQr}
              id="download-qr-btn"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
            >
              <Download className="size-3.5 text-zinc-400" />
              <span>Download QR</span>
            </button>

            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="whatsapp-share-btn"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition-all cursor-pointer"
            >
              <MessageCircle className="size-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Native Web Share button (if supported) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleNativeShare}
              id="native-share-btn"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all cursor-pointer"
            >
              <Share2 className="size-3.5 text-primary" />
              <span>Share via Apps / AirDrop</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
