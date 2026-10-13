'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, KeyRound, X, Check, AlertCircle } from 'lucide-react'

interface PasscodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  correctPasscode: string
}

export function PasscodeModal({
  isOpen,
  onClose,
  onSuccess,
  correctPasscode,
}: PasscodeModalProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setPin('')
      setError(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
    setPin(val)
    setError(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === correctPasscode) {
      onSuccess()
      onClose()
    } else {
      setError(true)
      setPin('')
      inputRef.current?.focus()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 select-none font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: error ? [-10, 10, -10, 10, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{
              type: 'spring',
              duration: error ? 0.4 : 0.25,
            }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#171717] p-6 text-foreground shadow-2xl shadow-black/90 flex flex-col items-center text-center"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 flex size-7 items-center justify-center rounded-full bg-white/5 text-muted-foreground hover:bg-white/15 hover:text-white transition-colors"
            >
              <X className="size-3.5" />
            </button>

            {/* Icon */}
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/20 text-primary border border-primary/30 mb-4 shadow-lg shadow-primary/20">
              <KeyRound className="size-6" />
            </div>

            <h3 className="text-xl font-bold tracking-tight text-white">
              Creator Passcode
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
              Enter your secret PIN to unlock the live customization editor.
            </p>

            <form onSubmit={handleSubmit} className="w-full mt-5 space-y-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="• • • •"
                  className="w-full text-center tracking-[0.5em] text-2xl font-bold rounded-xl border border-white/10 bg-black/50 py-3 text-white placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  autoComplete="off"
                />
              </div>

              {error ? (
                <div className="flex flex-col items-center gap-1 text-xs text-rose-400">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="size-3.5" />
                    <span>Incorrect passcode.</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    Try default{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setPin('1234')
                        setError(false)
                      }}
                      className="text-primary hover:underline font-bold"
                    >
                      1234
                    </button>{' '}
                    if you haven&apos;t set a custom PIN yet.
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-zinc-400">
                  Default PIN is{' '}
                  <button
                    type="button"
                    onClick={() => setPin('1234')}
                    className="text-primary hover:underline font-bold"
                  >
                    1234
                  </button>{' '}
                  unless customized.
                </p>
              )}

              <button
                type="submit"
                disabled={pin.length < 4}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 active:scale-95 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <Check className="size-4" />
                <span>Unlock Customization</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
