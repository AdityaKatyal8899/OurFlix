'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Play, Pencil } from 'lucide-react'
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
  isEditMode?: boolean
  onEdit?: (item: MediaItem) => void
}

export function MediaCard({ item, className, onSelect, isEditMode = false, onEdit }: MediaCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={cn(
        'group relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-xl bg-card text-left shadow-lg shadow-black/40 outline-none ring-primary/60 focus-visible:ring-2 cursor-pointer transform-gpu transition-all duration-300 hover:scale-[1.045] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/70',
        className,
      )}
      onClick={() => onSelect?.(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={item.thumbnail || '/placeholder.svg'}
        alt={item.title}
        fill
        loading="lazy"
        sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 300px"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Subtle resting gradient so the title chip stays readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none"
      />

      {/* Video badge */}
      {item.type === 'video' && (
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground backdrop-blur-sm pointer-events-none z-10">
          <Play className="size-2.5 fill-current" />
          Clip
        </span>
      )}

      {/* Edit Pencil Button (Top Right) */}
      {isEditMode && onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(item)
          }}
          title="Edit Photo / Video"
          className="absolute right-2 top-2 z-30 flex size-7 items-center justify-center rounded-full bg-black/70 border border-white/20 text-white shadow-lg backdrop-blur-md hover:bg-primary hover:border-primary hover:scale-110 active:scale-95 transition-all"
        >
          <Pencil className="size-3.5" />
        </button>
      )}

      {/* Resting title */}
      {!hovered && (
        <span className="absolute inset-x-0 bottom-0 truncate px-3 pb-2.5 text-xs font-medium text-foreground/90 pointer-events-none">
          {item.title}
        </span>
      )}

      <AnimatePresence>{hovered && <HoverOverlay item={item} />}</AnimatePresence>
    </div>
  )
}
