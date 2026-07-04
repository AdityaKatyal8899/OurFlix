'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, ChevronLeft, ChevronRight, X, Volume2, VolumeX, ZoomIn, ZoomOut } from 'lucide-react'
import type { MediaItem } from '@/types/media'
import Image from 'next/image'

interface SlideshowProps {
  items: MediaItem[]
  startIndex: number
  onClose: () => void
}

export function Slideshow({ items, startIndex, onClose }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentItem = items[currentIndex]

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
    setProgress(0)
    setZoomScale(1) // Reset zoom on transition
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
    setProgress(0)
    setZoomScale(1) // Reset zoom on transition
  }

  // Handle Autoplay for images
  useEffect(() => {
    // Pause autoplay when zoomed in
    if (!isPlaying || currentItem.type === 'video' || zoomScale > 1) {
      setProgress(0)
      return
    }

    const duration = 5000 // 5 seconds per slide
    const intervalTime = 50
    let elapsed = 0

    const timer = setInterval(() => {
      elapsed += intervalTime
      setProgress((elapsed / duration) * 100)
      if (elapsed >= duration) {
        handleNext()
      }
    }, intervalTime)

    return () => {
      clearInterval(timer)
      setProgress(0)
    }
  }, [currentIndex, isPlaying, items.length, currentItem.type, zoomScale])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'Escape') {
        onClose()
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, items.length])

  // Reset progress and handle video play/pause when current item changes
  useEffect(() => {
    if (currentItem.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Fallback if autoplay is blocked
        })
      } else {
        videoRef.current.pause()
      }
    }
  }, [currentIndex, currentItem.type, isPlaying])

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
    if (currentItem.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(() => {})
      }
    }
  }

  const toggleZoom = () => {
    if (currentItem.type === 'video') return
    setZoomScale((prev) => (prev === 1 ? 2.5 : 1))
  }

  const formattedDate = currentItem.date
    ? new Date(currentItem.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  // Ken Burns zoom & pan settings
  // Alternate scale directions and pans based on index for a more organic feel
  const scaleAnimation = currentItem.type === 'image' && isPlaying && zoomScale === 1
    ? {
        scale: currentIndex % 2 === 0 ? [1.02, 1.08] : [1.08, 1.02],
        x: currentIndex % 3 === 0 ? [0, -15] : currentIndex % 3 === 1 ? [0, 15] : [0, 0],
        y: currentIndex % 2 === 0 ? [0, 10] : [0, -10],
      }
    : { scale: 1.02, x: 0, y: 0 }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-black select-none">
      {/* Background Ambient Light Layer (Blurred and Covered) */}
      <div className="absolute inset-0 -z-20 overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 size-full"
          >
            <Image
              src={currentItem.thumbnail}
              alt=""
              fill
              priority
              className="object-cover scale-110 blur-3xl"
            />
          </motion.div>
        </AnimatePresence>
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-radial-gradient-vignette pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/85 pointer-events-none" />
      </div>

      {/* Top Bar: Progress and Close Controls */}
      <div className="relative z-10 w-full p-4 sm:p-6 bg-gradient-to-b from-black/85 to-transparent">
        {/* Progress Bar Indicators (Netflix Style) */}
        <div className="flex gap-1.5 w-full mb-4 px-2">
          {items.map((_, index) => (
            <div
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setProgress(0)
                setZoomScale(1)
              }}
              className="h-1 flex-1 rounded-full bg-white/20 cursor-pointer overflow-hidden transition-all hover:h-1.5"
            >
              {index === currentIndex && (
                <motion.div
                  className="h-full bg-primary"
                  style={{ width: `${currentItem.type === 'video' ? 0 : progress}%` }}
                  layoutId="active-progress"
                />
              )}
              {index < currentIndex && <div className="h-full w-full bg-white/70" />}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-2">
          {/* Index Counter */}
          <span className="text-xs sm:text-sm font-medium tracking-wider text-white/60 uppercase">
            {currentIndex + 1} of {items.length}
          </span>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all hover:scale-105"
          >
            <span className="text-xs font-semibold tracking-wider uppercase hidden sm:inline">Exit Viewer</span>
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area (Nav Arrows and contained Portrait-safe media) */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            drag={zoomScale === 1 ? "x" : false} // Only allow swipe transitions when not zoomed in
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (zoomScale > 1) return
              if (info.offset.x < -80) {
                handleNext()
              } else if (info.offset.x > 80) {
                handlePrev()
              }
            }}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full h-full max-w-[95vw] max-h-[75vh] flex items-center justify-center"
          >
            {currentItem.type === 'video' ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={currentItem.mediaUrl}
                  autoPlay={isPlaying}
                  playsInline
                  muted={isMuted}
                  onEnded={handleNext}
                  className="w-full h-full max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-black/90"
                />
              </div>
            ) : (
              <div 
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
                onDoubleClick={toggleZoom}
              >
                <motion.div
                  drag={zoomScale > 1}
                  dragConstraints={{
                    left: -200 * (zoomScale - 1),
                    right: 200 * (zoomScale - 1),
                    top: -200 * (zoomScale - 1),
                    bottom: 200 * (zoomScale - 1)
                  }}
                  animate={{
                    scale: zoomScale,
                    x: zoomScale === 1 ? 0 : undefined,
                    y: zoomScale === 1 ? 0 : undefined,
                  }}
                  // Active Ken Burns pan/zoom when scale is 1
                  {...(zoomScale === 1 ? { animate: scaleAnimation, transition: { duration: 5, ease: 'linear' } } : {})}
                  className={`relative w-full h-full flex items-center justify-center ${
                    zoomScale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
                  }`}
                >
                  <Image
                    src={currentItem.mediaUrl}
                    alt={currentItem.title}
                    fill
                    priority
                    sizes="95vw"
                    className="object-contain rounded-lg shadow-2xl shadow-black/90 pointer-events-none"
                  />
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Desktop Sidebar Controls (Nav Arrows) */}
        {zoomScale === 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex size-12 items-center justify-center rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/60 transition-all hover:scale-105 pointer-events-auto"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex size-12 items-center justify-center rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/60 transition-all hover:scale-105 pointer-events-auto"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Bar: Caption Info and Playback Controls */}
      <div className="relative z-10 w-full p-6 bg-gradient-to-t from-black/95 to-transparent">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          {/* Media Information */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-xl text-left"
            >
              <span className="inline-block px-2.5 py-0.5 mb-2 text-[10px] font-bold tracking-wider text-primary uppercase rounded bg-primary/10 border border-primary/20">
                {currentItem.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5">
                {currentItem.title}
              </h2>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-white/50 mb-2">
                {formattedDate && <span>{formattedDate}</span>}
                <span>•</span>
                <span className="capitalize">{currentItem.type}</span>
              </div>
              <p className="text-sm text-white/70 line-clamp-2">
                {currentItem.type === 'video'
                  ? 'A moving memory captured in motion. Auto-playing.'
                  : 'A snapshot of a beautiful moment in time. Double-click image to zoom.'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Controls Cluster */}
          <div className="flex items-center gap-3 self-center md:self-end">
            {/* Interactive Zoom Control for Images */}
            {currentItem.type === 'image' && (
              <button
                type="button"
                onClick={toggleZoom}
                className="flex size-10 items-center justify-center rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all mr-1"
                title={zoomScale > 1 ? "Zoom Out" : "Zoom In"}
              >
                {zoomScale > 1 ? <ZoomOut className="size-4" /> : <ZoomIn className="size-4" />}
              </button>
            )}

            {currentItem.type === 'video' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMuted(!isMuted)
                }}
                className="flex size-10 items-center justify-center rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all mr-1"
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
            )}

            <button
              type="button"
              onClick={handlePrev}
              className="flex md:hidden size-10 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex md:hidden size-10 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
