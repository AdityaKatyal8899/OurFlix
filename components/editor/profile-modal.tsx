'use client'

import React, { useState, useEffect, useRef } from 'react'
import { EditModal } from './edit-modal'
import { Upload, Check, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentName: string
  currentAvatar: string
  onSave: (newName: string, newAvatar: string) => void
}

export function ProfileModal({
  isOpen,
  onClose,
  currentName,
  currentAvatar,
  onSave,
}: ProfileModalProps) {
  const [name, setName] = useState(currentName)
  const [avatar, setAvatar] = useState(currentAvatar)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setName(currentName)
    setAvatar(currentAvatar)
  }, [currentName, currentAvatar, isOpen])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setAvatar(previewUrl)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSave(name.trim(), avatar)
      onClose()
    }
  }

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Customize Profile"
      subtitle="Update the user name and avatar shown on the gateway & navigation bar."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Avatar Selector */}
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="relative size-24 sm:size-28 overflow-hidden rounded-lg border-2 border-primary shadow-lg bg-black/50">
            {avatar ? (
              <Image
                src={avatar}
                alt="Profile Avatar"
                fill
                className="object-cover size-full"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <ImageIcon className="size-8" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <Upload className="size-3.5" />
              Upload Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Profile Name */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Profile Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. CapyBara, My Love, Aditya"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Avatar Image URL input (optional fallback) */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Or Paste Image URL
          </label>
          <input
            type="text"
            value={avatar.startsWith('blob:') ? '' : avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://... or /photos/..."
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white/80 placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 active:scale-95 transition-all"
          >
            <Check className="size-4" />
            Save Profile
          </button>
        </div>
      </form>
    </EditModal>
  )
}
