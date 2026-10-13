'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, Play, ChevronLeft, ChevronRight, Pencil, Camera } from 'lucide-react'
import Image from 'next/image'
import { BackgroundGradient } from './background-gradient'
import type { MediaItem } from '@/types/media'

interface HeroBannerProps {
  items: MediaItem[]
  onPlay: (item: MediaItem) => void
  isEditMode?: boolean
  onEditSlide?: (item: MediaItem) => void
}

export function HeroBanner({ items, onPlay, isEditMode = false, onEditSlide }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const currentItem = items[currentIndex] || items[0]

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  // Observe visibility to pause auto-rotation when scrolled out of viewport
  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Set up the 7-second timer for rotating the photos, only when banner is in view
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (!isVisible || items.length <= 1) return

    timerRef.current = setInterval(() => {
      handleNext()
    }, 7000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentIndex, items.length, isVisible])

  if (!currentItem) return null

  const description = currentItem.description || (currentItem.type === 'video'
    ? `Relive this cinematic video memory: "${currentItem.title}". Captured in stunning resolution and saved forever.`
    : `A beautiful snapshot of "${currentItem.title}" taken on ${new Date(currentItem.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`)

  return (
    <section ref={sectionRef} className="relative h-[70vh] min-h-[520px] w-full overflow-hidden bg-black select-none">
      {/* Background media with smooth cross-fade */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-y-0 -inset-x-2 size-full"
          >
            <Image
              src={currentItem.thumbnail}
              alt={currentItem.title}
              fill
              priority={currentIndex === 0}
              sizes="100vw"
              className="object-cover size-full"
            />
          </motion.div>
        </AnimatePresence>
      </div>


      {/* Top-Right Quick Edit Pill */}
      {isEditMode && onEditSlide && (
        <button
          type="button"
          onClick={() => onEditSlide(currentItem)}
          className="absolute top-20 right-6 z-30 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-xl hover:bg-black/80 hover:border-primary transition-all active:scale-95"
          title="Replace Photo / Video or change captions for this slide"
        >
          <Camera className="size-3.5 text-primary" />
          <span>Edit Slide Media</span>
          <Pencil className="size-3 text-white/70" />
        </button>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-6 sm:px-8 sm:pb-10">
        <div className="max-w-xl text-left">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary backdrop-blur-sm">
              {currentItem.type === 'video' ? 'Featured Video Clip' : 'Featured Memory'}
            </span>

            {isEditMode && onEditSlide && (
              <button
                type="button"
                onClick={() => onEditSlide(currentItem)}
                title="Edit Headline & Story"
                className="flex size-6 items-center justify-center rounded-full bg-primary/20 border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Pencil className="size-3" />
              </button>
            )}
          </div>
          
          <div className="relative mt-2 group/title flex items-start gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-balance font-serif text-3xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl drop-shadow-md">
                  {currentItem.title}
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative mt-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <p className="max-w-md text-pretty text-sm leading-relaxed text-white sm:text-base line-clamp-3 font-medium drop-shadow-sm">
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
            
            {isEditMode && onEditSlide && (
              <button
                type="button"
                onClick={() => onEditSlide(currentItem)}
                className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-medium text-primary backdrop-blur-sm hover:bg-primary/20 transition-colors"
              >
                <Pencil className="size-3.5" />
                <span>Customize</span>
              </button>
            )}
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
