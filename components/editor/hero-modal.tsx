'use client'

import React, { useState, useEffect, useRef } from 'react'
import { EditModal } from './edit-modal'
import { Upload, Check, Video, Image as ImageIcon } from 'lucide-react'
import type { MediaItem, MediaType } from '@/types/media'
import Image from 'next/image'

interface HeroModalProps {
  isOpen: boolean
  onClose: () => void
  currentItem: MediaItem
  onSave: (updatedItem: MediaItem) => void
}

export function HeroModal({
  isOpen,
  onClose,
  currentItem,
  onSave,
}: HeroModalProps) {
  const [title, setTitle] = useState(currentItem.title)
  const [description, setDescription] = useState(currentItem.description || '')
  const [thumbnail, setThumbnail] = useState(currentItem.thumbnail)
  const [mediaUrl, setMediaUrl] = useState(currentItem.mediaUrl)
  const [type, setType] = useState<MediaType>(currentItem.type)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTitle(currentItem.title)
    setDescription(currentItem.description || '')
    setThumbnail(currentItem.thumbnail)
    setMediaUrl(currentItem.mediaUrl)
    setType(currentItem.type)
  }, [currentItem, isOpen])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const isVideo = file.type.startsWith('video/')
      const previewUrl = URL.createObjectURL(file)
      setType(isVideo ? 'video' : 'image')
      setThumbnail(previewUrl)
      setMediaUrl(previewUrl)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSave({
        ...currentItem,
        title: title.trim(),
        description: description.trim(),
        thumbnail,
        mediaUrl,
        type,
      })
      onClose()
    }
  }

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Customize Featured Slide"
      subtitle="Edit headline, caption, or replace the showcase photo/video."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Media Preview & Uploader */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-inner group">
          {type === 'video' ? (
            <video
              src={mediaUrl}
              poster={thumbnail}
              preload="metadata"
              className="size-full object-cover"
              controls
            />
          ) : (
            <Image
              src={thumbnail || '/placeholder.svg'}
              alt={title}
              fill
              className="object-cover size-full"
            />
          )}

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-lg bg-white/90 px-3.5 py-2 text-xs font-semibold text-black shadow-lg hover:bg-white transition-all active:scale-95"
            >
              <Upload className="size-4" />
              Replace Media
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Media Type Switcher */}
        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 p-2.5">
          <span className="text-xs text-muted-foreground">Media Type</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setType('image')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                type === 'image'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white/5 text-muted-foreground hover:text-white'
              }`}
            >
              <ImageIcon className="size-3" />
              Image
            </button>
            <button
              type="button"
              onClick={() => setType('video')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                type === 'video'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white/5 text-muted-foreground hover:text-white'
              }`}
            >
              <Video className="size-3" />
              Video Clip
            </button>
          </div>
        </div>

        {/* Headline */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Headline Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. THE MAIN CHARACTER, MOMENTS IN MOTION"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Caption Description */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Description / Romantic Note
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a sweet memory note or custom subtitle..."
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
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
            Save Slide
          </button>
        </div>
      </form>
    </EditModal>
  )
}
