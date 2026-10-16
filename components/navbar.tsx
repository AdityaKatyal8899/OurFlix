'use client'

import { motion } from 'framer-motion'
import { Film, Pencil, Lock, KeyRound, QrCode } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useScrolled } from '@/hooks/use-scrolled'
import { SearchBar } from './search-bar'

const NAV_LINKS = ['Home', 'Memories', 'Videos', 'Favorites'] as const

interface NavbarProps {
  search: string
  onSearchChange: (value: string) => void
  activeLink?: string
  onLinkClick?: (link: string) => void
  profileUrl?: string
  brandName?: string
  isEditMode?: boolean
  isCreatorUnlocked?: boolean
  onEditBrand?: () => void
  onEditProfile?: () => void
  onUnlockCreator?: () => void
  onOpenShare?: () => void
}

export function Navbar({
  search,
  onSearchChange,
  activeLink = 'Home',
  onLinkClick,
  profileUrl = '/pfp.jpeg',
  brandName = 'RDXThunder',
  isEditMode = false,
  isCreatorUnlocked = false,
  onEditBrand,
  onEditProfile,
  onUnlockCreator,
  onOpenShare,
}: NavbarProps) {
  const scrolled = useScrolled(32)

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled
          ? 'border-b border-border bg-background/85 backdrop-blur-xl'
          : 'bg-gradient-to-b from-background/80 to-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-8">
        <div className="flex items-center gap-6 sm:gap-8">
          {/* Brand with Edit Pencil */}
          <div className="relative group flex items-center gap-2">
            <a href="#top" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-md shadow-primary/20">
                <Film className="size-4" />
              </span>
              <span className="font-serif text-xl font-bold tracking-tight text-foreground">
                {brandName.length > 3 ? (
                  <>
                    {brandName.slice(0, 3)}
                    <span className="text-primary">{brandName.slice(3)}</span>
                  </>
                ) : (
                  brandName
                )}
              </span>
            </a>

            {isEditMode && onEditBrand && (
              <button
                type="button"
                onClick={onEditBrand}
                title="Edit Site Brand Name"
                className="flex size-6 items-center justify-center rounded-full bg-primary/20 border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all ml-1 shadow-sm"
              >
                <Pencil className="size-3" />
              </button>
            )}
          </div>

          {/* Links */}
          <ul className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <button
                  type="button"
                  onClick={() => onLinkClick?.(link)}
                  className={cn(
                    'text-sm transition-colors hover:text-foreground',
                    activeLink === link
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Subtle Creator Unlock trigger for paying clients */}
          {!isCreatorUnlocked && onUnlockCreator && (
            <button
              type="button"
              onClick={onUnlockCreator}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-white/10 hover:text-white transition-all shadow-sm"
              title="Creator Login (Enter PIN to customize)"
            >
              <Lock className="size-3 text-primary" />
              <span className="hidden sm:inline">Creator</span>
            </button>
          )}

          {isCreatorUnlocked && onEditProfile && (
            <button
              type="button"
              onClick={onEditProfile}
              className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-all shadow-sm cursor-pointer"
              title="Edit Creator Passcode & Profile"
            >
              <KeyRound className="size-3" />
              <span className="hidden sm:inline">Edit PIN</span>
            </button>
          )}

          {onOpenShare && (
            <button
              type="button"
              onClick={onOpenShare}
              title="Share Stream Link & QR Code"
              className="flex items-center gap-1.5 rounded-full border border-border bg-white/5 hover:bg-white/10 px-2.5 py-1 text-xs font-semibold text-zinc-300 hover:text-white transition-all shadow-sm cursor-pointer"
            >
              <QrCode className="size-3.5 text-primary" />
              <span className="hidden sm:inline">Share & QR</span>
            </button>
          )}

          <SearchBar value={search} onChange={onSearchChange} />
          
          {/* Profile Button with Pencil indicator */}
          <div className="relative group">
            <button
              type="button"
              onClick={isEditMode && onEditProfile ? onEditProfile : undefined}
              aria-label="Your profile"
              className={cn(
                "relative size-9 overflow-hidden rounded-full border border-border transition-transform hover:scale-105",
                isEditMode && "ring-2 ring-primary/60 cursor-pointer"
              )}
            >
              <Image
                src={profileUrl}
                alt="Your profile"
                width={36}
                height={36}
                className="size-full object-cover"
              />
              {isEditMode && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="size-3.5 text-primary" />
                </div>
              )}
            </button>

            {isEditMode && onEditProfile && (
              <button
                type="button"
                onClick={onEditProfile}
                title="Edit Profile"
                className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
              >
                <Pencil className="size-2.5" />
              </button>
            )}
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
