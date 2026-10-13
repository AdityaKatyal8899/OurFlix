'use client'

import React, { useState, useEffect } from 'react'
import { EditModal } from './edit-modal'
import { Check, Trash2 } from 'lucide-react'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  initialName?: string
  isNew?: boolean
  onSave: (newName: string) => void
  onDelete?: () => void
}

export function CategoryModal({
  isOpen,
  onClose,
  initialName = '',
  isNew = false,
  onSave,
  onDelete,
}: CategoryModalProps) {
  const [name, setName] = useState(initialName)

  useEffect(() => {
    setName(initialName)
  }, [initialName, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSave(name.trim())
      onClose()
    }
  }

  const SUGGESTED_EMOJIS = ['💖', '✨', '🌸', '👥', '🏖️', '✈️', '🎉', '🍕', '🚗', '🏔️']

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title={isNew ? 'Add Category Row' : 'Edit Category Title'}
      subtitle={isNew ? 'Create a new stream row for special memories.' : 'Rename or customize this category row.'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Row Title
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. 🏖️ Summer Trip 2026, 🍕 Late Night Food"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
            required
          />
        </div>

        {/* Quick Emoji Suggestions */}
        <div>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-2">
            Quick Emojis
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setName((prev) => `${emoji} ${prev.replace(/^[^\w\s]+/, '').trim()}`)}
                className="flex size-8 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-base hover:bg-white/15 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          {!isNew && onDelete ? (
            <button
              type="button"
              onClick={() => {
                onDelete()
                onClose()
              }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="size-3.5" />
              Delete Row
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
              {isNew ? 'Create Row' : 'Save Title'}
            </button>
          </div>
        </div>
      </form>
    </EditModal>
  )
}
