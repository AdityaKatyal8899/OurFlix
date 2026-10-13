'use client'

import React, { useState, useEffect } from 'react'
import { EditModal } from './edit-modal'
import { Film, Check } from 'lucide-react'

interface BrandModalProps {
  isOpen: boolean
  onClose: () => void
  currentBrand: string
  onSave: (newBrand: string) => void
}

export function BrandModal({
  isOpen,
  onClose,
  currentBrand,
  onSave,
}: BrandModalProps) {
  const [brand, setBrand] = useState(currentBrand)

  useEffect(() => {
    setBrand(currentBrand)
  }, [currentBrand, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (brand.trim()) {
      onSave(brand.trim())
      onClose()
    }
  }

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Customize Site Branding"
      subtitle="Change the top-left logo text shown across the header."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Brand Logo Text
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. RDXThunder, FindingYukti, MyFlix"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
        </div>

        {/* Live Preview */}
        <div className="rounded-xl border border-white/5 bg-black/30 p-3.5">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-2">
            Live Preview
          </span>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Film className="size-3.5" />
            </span>
            <span className="font-serif text-lg font-bold tracking-tight text-white">
              {brand.length > 3 ? (
                <>
                  {brand.slice(0, 3)}
                  <span className="text-primary">{brand.slice(3)}</span>
                </>
              ) : (
                brand || 'Brand'
              )}
            </span>
          </div>
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
            Save Branding
          </button>
        </div>
      </form>
    </EditModal>
  )
}
