'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Pencil,
  Eye,
  Plus,
  Save,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react'

interface EditorToolbarProps {
  isEditMode: boolean
  isDemoSandbox?: boolean
  onToggleEditMode: () => void
  onAddCategoryRow: () => void
  onSave: () => void
  onReset: () => void
  onLock?: () => void
  onOpenAddons?: () => void
}

export function EditorToolbar({
  isEditMode,
  isDemoSandbox = false,
  onToggleEditMode,
  onAddCategoryRow,
  onSave,
  onReset,
  onLock,
  onOpenAddons,
}: EditorToolbarProps) {
  const [saveToast, setSaveToast] = useState(false)

  const handleSaveClick = () => {
    onSave()
    setSaveToast(true)
    setTimeout(() => setSaveToast(false), 3000)
  }

  return (
    <>
      {/* Floating Toolbar Pill (Bottom Center) */}
      <motion.aside
        aria-label="Site Editor"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/15 bg-black/85 px-3 py-2 shadow-2xl shadow-black/90 backdrop-blur-xl select-none max-w-[95vw] overflow-x-auto"
      >
        {/* Mode Toggle Button */}
        <button
          type="button"
          onClick={onToggleEditMode}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
            isEditMode
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          title={isEditMode ? 'Currently editing with pencil icons' : 'Viewing as your recipient will see it'}
        >
          {isEditMode ? (
            <>
              <Pencil className="size-3.5 animate-pulse" />
              <span>Editing Active</span>
            </>
          ) : (
            <>
              <Eye className="size-3.5" />
              <span>Preview Mode</span>
            </>
          )}
        </button>

        <div className="h-4 w-px bg-white/15" />

        {/* Add Row Button (in Edit Mode) */}
        {isEditMode && (
          <>
            <button
              type="button"
              onClick={onAddCategoryRow}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Plus className="size-3.5 text-primary" />
              <span className="hidden sm:inline">Add Row</span>
            </button>

            {onOpenAddons && (
              <button
                type="button"
                onClick={onOpenAddons}
                className="flex items-center gap-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 text-[11px] font-semibold text-amber-300 transition-colors"
                title="Expand photo/row capacity with micro-upgrades"
              >
                <Sparkles className="size-3 text-amber-400" />
                <span>Capacity</span>
              </button>
            )}
          </>
        )}

        {isDemoSandbox && (
          <span className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-[10px] font-bold text-amber-300 uppercase tracking-wider shrink-0 select-none">
            <Sparkles className="size-3 text-amber-400" />
            <span>Sandbox Preview</span>
          </span>
        )}

        {/* Save Changes Button */}
        <button
          type="button"
          onClick={handleSaveClick}
          className="flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition-all active:scale-95 shrink-0"
          title={isDemoSandbox ? 'Test preview saving in local sandbox (does not touch live database)' : 'Save changes to cloud database'}
        >
          <Save className="size-3.5" />
          <span>{isDemoSandbox ? 'Save Preview' : 'Save Draft'}</span>
        </button>

        {/* Lock & Exit to Viewer Mode */}
        {onLock && (
          <button
            type="button"
            onClick={onLock}
            className="flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/15 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-white transition-colors shrink-0"
            title="Lock creator session and return to clean public viewing mode"
          >
            <span>Lock</span>
          </button>
        )}

        {/* Reset / Undo Button */}
        <button
          type="button"
          onClick={() => {
            if (confirm(isDemoSandbox ? 'Reset sandbox memories back to default demo?' : 'Reset all customized memories back to default?')) {
              onReset()
            }
          }}
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-white/10 hover:text-white transition-colors shrink-0"
          title={isDemoSandbox ? 'Reset to original demo template' : 'Reset to original defaults'}
        >
          <RotateCcw className="size-3.5" />
        </button>
      </motion.aside>

      {/* Floating Save Toast */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium shadow-xl backdrop-blur-md ${
              isDemoSandbox
                ? 'border-amber-500/40 bg-amber-950/95 text-amber-200'
                : 'border-emerald-500/30 bg-emerald-950/90 text-emerald-200'
            }`}
          >
            {isDemoSandbox ? (
              <>
                <Sparkles className="size-4 text-amber-400" />
                <span>Sandbox updated! Changes are local to this preview and never alter live streams.</span>
              </>
            ) : (
              <>
                <Check className="size-4 text-emerald-400" />
                <span>Changes saved to local draft! Ready for your client.</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
