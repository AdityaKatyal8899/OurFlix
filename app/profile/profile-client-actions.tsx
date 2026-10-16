'use client'

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function ProfileClientActions({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      const origin = window.location.origin
      await navigator.clipboard.writeText(`${origin}/${slug}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.warn('Copy failed', err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy Stream Link"
      className="size-9 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all border border-white/10 shrink-0"
    >
      {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
    </button>
  )
}
