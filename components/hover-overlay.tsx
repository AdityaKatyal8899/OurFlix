'use client'

import { motion } from 'framer-motion'
import { Calendar, Heart, Play } from 'lucide-react'
import type { MediaItem } from '@/types/media'

interface HoverOverlayProps {
  item: MediaItem
}

/**
 * Premium detail layer revealed on card hover — title, meta, quick actions.
 */
export function HoverOverlay({ item }: HoverOverlayProps) {
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background via-background/60 to-transparent p-4"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105">
          <Play className="size-4 fill-current" />
        </span>
        <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card/60 text-foreground backdrop-blur-sm transition-colors hover:border-primary">
          <Heart
            className={`size-4 ${item.favorite ? 'fill-primary text-primary' : ''}`}
          />
        </span>
      </div>

      <h3 className="mt-3 text-pretty text-sm font-semibold leading-tight text-foreground">
        {item.title}
      </h3>

      <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="uppercase tracking-wide text-primary">{item.type}</span>
        <span className="flex items-center gap-1">
          <Calendar className="size-3" />
          {formattedDate}
        </span>
      </div>
    </motion.div>
  )
}
