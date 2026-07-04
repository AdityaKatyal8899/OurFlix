'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { BackgroundGradient } from './background-gradient'
import type { MediaItem } from '@/types/media'

interface HeroBannerProps {
  items: MediaItem[]
  onPlay: (item: MediaItem) => void
}

export function HeroBanner({ items, onPlay }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentItem = items[currentIndex] || items[0]

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  // Set up the 7-second timer for rotating the photos
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      handleNext()
    }, 7000) // 7 seconds

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentIndex, items.length])

  if (!currentItem) return null

  // Description fallbacks based on item data
  const description = currentItem.type === 'video'
    ? `Relive this cinematic video memory: "${currentItem.title}". Captured in stunning resolution and saved forever.`
    : `A beautiful snapshot of "${currentItem.title}" taken on ${new Date(currentItem.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`

  return (
    <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden bg-black select-none">
      {/* Background media with smooth cross-fade */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.03 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="absolute inset-y-0 -inset-x-2 size-full"
          >
            <Image
              src={currentItem.thumbnail}
              alt={currentItem.title}
              fill
              priority
              loading="eager"
              sizes="100vw"
              className="object-cover size-full"
            />
          </motion.div>
        </AnimatePresence>
      </div>


      {/* Content Overlay */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-16 sm:px-8 sm:pb-20">
        <div className="max-w-xl text-left">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary backdrop-blur-sm">
            Featured Memory
          </span>
          
          <div className="h-[120px] sm:h-[150px] overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col justify-end"
              >
                <h1 className="text-balance font-serif text-3xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
                  {currentItem.title}
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="h-[60px] overflow-hidden relative mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="absolute inset-0"
              >
                <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base line-clamp-2">
                  {description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Row */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onPlay(currentItem)}
              className="flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.03] active:scale-95"
            >
              <Play className="size-4 fill-current" />
              Play Memory
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 rounded-lg border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-card/80"
            >
              <ChevronRight className="size-4" />
              Next Memory
            </button>
          </div>
        </div>
      </div>

      {/* Side Manual Nav Controls */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous Featured Memory"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex size-10 items-center justify-center rounded-full bg-black/45 border border-white/5 text-white/80 hover:bg-black/60 hover:text-white transition-all hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={handleNext}
        aria-label="Next Featured Memory"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex size-10 items-center justify-center rounded-full bg-black/45 border border-white/5 text-white/80 hover:bg-black/60 hover:text-white transition-all hover:scale-105 active:scale-95"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Progress Indicators/Ticks at the Bottom */}
      <div className="absolute bottom-4 right-8 z-20 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
