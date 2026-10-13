'use client'

import React, { useState, useEffect, useRef } from 'react'
import { EditModal } from './edit-modal'
import { Upload, Check, Trash2, Video, Image as ImageIcon } from 'lucide-react'
import type { MediaItem, MediaType } from '@/types/media'
import Image from 'next/image'

interface MediaModalProps {
  isOpen: boolean
  onClose: () => void
  item?: MediaItem | null
  defaultCategory?: string
  availableCategories: string[]
  onSave: (savedItem: MediaItem) => void
  onDelete?: (id: string) => void
}

export function MediaModal({
  isOpen,
  onClose,
  item,
  defaultCategory,
  availableCategories,
  onSave,
  onDelete,
}: MediaModalProps) {
  const isEditing = !!item

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState<MediaType>('image')
  const [thumbnail, setThumbnail] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [date, setDate] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (item) {
      setTitle(item.title)
      setCategory(item.category)
      setType(item.type)
      setThumbnail(item.thumbnail)
      setMediaUrl(item.mediaUrl)
      setDate(item.date ? item.date.slice(0, 10) : new Date().toISOString().slice(0, 10))
    } else {
      setTitle('')
      setCategory(defaultCategory || availableCategories[0] || 'Memories')
      setType('image')
      setThumbnail('/placeholder.svg')
      setMediaUrl('/placeholder.svg')
      setDate(new Date().toISOString().slice(0, 10))
    }
  }, [item, defaultCategory, availableCategories, isOpen])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const isVideo = file.type.startsWith('video/')
      const previewUrl = URL.createObjectURL(file)
      setType(isVideo ? 'video' : 'image')
      setThumbnail(previewUrl)
      setMediaUrl(previewUrl)
      if (!title) {
        // Default title from filename without extension
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        setTitle(cleanName)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newItem: MediaItem = {
      id: item ? item.id : `user-${Date.now()}`,
      title: title.trim(),
      category: category || 'Memories',
      type,
      thumbnail: thumbnail || '/placeholder.svg',
      mediaUrl: mediaUrl || thumbnail || '/placeholder.svg',
      tags: [category.toLowerCase(), type],
      favorite: item ? item.favorite : true,
      date: date || new Date().toISOString().slice(0, 10),
    }

    onSave(newItem)
    onClose()
  }

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Memory Card' : 'Add New Memory'}
      subtitle={isEditing ? 'Update memory details or replace media.' : 'Upload a photo or video to your memory stream.'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Media Preview Box */}
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-inner group">
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
              alt={title || 'Preview'}
              fill
              className="object-cover size-full"
            />
          )}

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-lg bg-white/90 px-3.5 py-2 text-xs font-semibold text-black shadow-lg hover:bg-white transition-all active:scale-95"
            >
              <Upload className="size-4" />
              {isEditing ? 'Replace File' : 'Choose Photo / Video'}
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

        {/* Memory Title */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Memory Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sunset in Manali, Late Night Talk"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        {/* Category & Date in a 2-col Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Category Row
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#222] px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Memory Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          {isEditing && onDelete ? (
            <button
              type="button"
              onClick={() => {
                if (item?.id) {
                  onDelete(item.id)
                  onClose()
                }
              }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="size-3.5" />
              Delete Memory
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
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
              {isEditing ? 'Save Changes' : 'Add to Stream'}
            </button>
          </div>
        </div>
      </form>
    </EditModal>
  )
}
