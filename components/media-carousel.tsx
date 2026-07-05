'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { MediaItem } from '@/types/media'
import { MediaCard } from './media-card'
import { SectionTitle } from './section-title'

interface MediaCarouselProps {
  title: string
  items: MediaItem[]
  onSelect?: (item: MediaItem) => void
}

export function MediaCarousel({ title, items, onSelect }: MediaCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  useEffect(() => {
    updateArrows()
    const el = scrollerRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [updateArrows, items])

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  if (items.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group/row relative"
    >
      <div className="mb-3 px-4 sm:px-8">
        <SectionTitle count={items.length}>{title}</SectionTitle>
      </div>

      <div className="relative">
        {/* Left control */}
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          className={`absolute left-1 top-0 z-20 hidden h-full w-10 items-center justify-center rounded-r-xl bg-gradient-to-r from-background/90 to-transparent text-foreground opacity-0 transition-opacity group-hover/row:opacity-100 md:flex ${
            canLeft ? '' : 'pointer-events-none !opacity-0'
          }`}
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground">
            <ChevronLeft className="size-5" />
          </span>
        </button>

        {/* Right control */}
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          className={`absolute right-1 top-0 z-20 hidden h-full w-10 items-center justify-center rounded-l-xl bg-gradient-to-l from-background/90 to-transparent text-foreground opacity-0 transition-opacity group-hover/row:opacity-100 md:flex ${
            canRight ? '' : 'pointer-events-none !opacity-0'
          }`}
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground">
            <ChevronRight className="size-5" />
          </span>
        </button>

        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2 sm:gap-4 sm:px-8"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="w-[38vw] shrink-0 snap-start sm:w-[24vw] md:w-[18vw] lg:w-[14vw] xl:w-[11.5vw]"
            >
              <MediaCard item={item} onSelect={onSelect} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
