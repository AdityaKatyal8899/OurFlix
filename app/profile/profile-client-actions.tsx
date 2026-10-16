'use client'

import React, { useState } from 'react'
import { Share2, QrCode } from 'lucide-react'
import { ShareModal } from '@/components/share-modal'

interface ProfileClientActionsProps {
  slug: string
  title?: string
}

export function ProfileClientActions({ slug, title }: ProfileClientActionsProps) {
  const [isShareOpen, setIsShareOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsShareOpen(true)}
        title="Share Stream & QR Code"
        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-all border border-white/10 shrink-0 text-xs font-semibold cursor-pointer group"
      >
        <QrCode className="size-3.5 text-primary group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Share & QR</span>
      </button>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        slug={slug}
        title={title || slug}
      />
    </>
  )
}

export function ProfileShareHeader({
  email,
  firstSlug,
}: {
  email: string
  firstSlug?: string
}) {
  const [isShareOpen, setIsShareOpen] = useState(false)
  const targetSlug = firstSlug || 'rdxthunder'

  return (
    <>
      <button
        type="button"
        onClick={() => setIsShareOpen(true)}
        className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-3.5 py-2.5 border border-white/15 shadow-sm transition-all cursor-pointer"
      >
        <Share2 className="size-4 text-primary" />
        <span>Share Stream & QR</span>
      </button>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        slug={targetSlug}
        title="Your Memory Stream"
      />
    </>
  )
}
