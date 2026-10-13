'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Upload, Lock, ShieldCheck, ArrowRight, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (profileName: string, avatarUrl: string, passcode: string) => void
  initialProfileName?: string
  initialAvatar?: string
}

export function OnboardingModal({
  isOpen,
  onClose,
  onComplete,
  initialProfileName = 'CapyBara',
  initialAvatar = '/pfp.jpeg',
}: OnboardingModalProps) {
  const [profileName, setProfileName] = useState(initialProfileName)
  const [avatar, setAvatar] = useState(initialAvatar)
  const [passcode, setPasscode] = useState('')
  const [confirmPasscode, setConfirmPasscode] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setAvatar(previewUrl)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!profileName.trim()) {
      setError('Please choose a profile name.')
      return
    }

    if (passcode.length < 4) {
      setError('Passcode must be at least 4 digits.')
      return
    }

    if (passcode !== confirmPasscode) {
      setError('Passcodes do not match. Please re-enter.')
      return
    }

    onComplete(profileName.trim(), avatar, passcode)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 select-none font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-[#141414] p-6 sm:p-8 text-foreground shadow-2xl shadow-primary/20 max-h-[95vh] overflow-y-auto no-scrollbar"
          >
            {/* Header Badge */}
            <div className="flex flex-col items-center text-center mb-6">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                Payment Confirmed • Welcome Creator
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Set Up Your Private Access
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-sm">
                Set your profile details and a secret PIN. Anyone you share the link with will only see the viewer mode unless they have this PIN.
              </p>
            </div>

            {/* Setup Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Avatar Uploader */}
              <div className="flex flex-col items-center gap-2 py-1">
                <div className="relative size-24 sm:size-28 overflow-hidden rounded-2xl border-2 border-primary/60 bg-black/60 shadow-xl group">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt="Profile Preview"
                      fill
                      className="object-cover size-full"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="size-8" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] font-semibold text-white underline"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/90 hover:bg-white/10 transition-colors"
                >
                  <Upload className="size-3" />
                  Upload Avatar
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Profile Name */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                  Who&apos;s Watching? (Profile Name)
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g. CapyBara, My Love, Yukti"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              {/* Secret Passcode Inputs */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Creator Passcode
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={6}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 1234"
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary tracking-widest"
                      required
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Confirm Passcode
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={6}
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 1234"
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary tracking-widest"
                      required
                    />
                    <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <p className="text-xs font-medium text-red-400 bg-red-950/40 border border-red-800/40 rounded-lg p-2.5 text-center">
                  {error}
                </p>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-95 active:scale-[0.98] transition-all"
                >
                  <span>Enter Customization Studio</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
