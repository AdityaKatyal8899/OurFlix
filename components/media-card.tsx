'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { MediaItem } from '@/types/media'
import { HoverOverlay } from './hover-overlay'

interface MediaCardProps {
  item: MediaItem
  /** Cards use a wide 16:9 poster by default. */
  className?: string
  onSelect?: (item: MediaItem) => void
}

export function MediaCard({ item, className, onSelect }: MediaCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      type="button"
      onClick={() => onSelect?.(item)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      whileHover={{ scale: 1.045, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={cn(
        'group relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-xl bg-card text-left shadow-lg shadow-black/40 outline-none ring-primary/60 focus-visible:ring-2',
        className,
      )}
    >
      <Image
        src={item.thumbnail || '/placeholder.svg'}
        alt={item.title}
        fill
        sizes="(max-width: 640px) 38vw, (max-width: 1024px) 20vw, 12vw"
        className="object-cover transition-transform duration-500 group-hover:scale-115"
      />

      {/* Subtle resting gradient so the title chip stays readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
      />

      {/* Video badge */}
      {item.type === 'video' && (
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground backdrop-blur-sm">
          <Play className="size-2.5 fill-current" />
          Clip
        </span>
      )}

      {/* Resting title */}
      {!hovered && (
        <span className="absolute inset-x-0 bottom-0 truncate px-3 pb-2.5 text-xs font-medium text-foreground/90">
          {item.title}
        </span>
      )}

      <AnimatePresence>{hovered && <HoverOverlay item={item} />}</AnimatePresence>
    </motion.button>
  )
}
