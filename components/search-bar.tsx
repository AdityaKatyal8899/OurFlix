'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const close = () => {
    setOpen(false)
    onChange('')
  }

  return (
    <div className="flex items-center">
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="field"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex items-center gap-2 overflow-hidden rounded-full border border-border bg-card/70 px-3 py-1.5 backdrop-blur-md"
          >
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') close()
              }}
              placeholder="Search memories, trips, tags…"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Search memories"
            />
            <button
              type="button"
              onClick={close}
              aria-label="Close search"
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="icon"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-card"
          >
            <Search className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
