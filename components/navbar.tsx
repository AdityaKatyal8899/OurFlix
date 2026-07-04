'use client'

import { motion } from 'framer-motion'
import { Film } from 'lucide-react'
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
}

export function Navbar({
  search,
  onSearchChange,
  activeLink = 'Home',
  onLinkClick,
  profileUrl = '/pfp.jpeg',
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
        <div className="flex items-center gap-8">
          {/* Brand */}
          <a href="#top" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Film className="size-4" />
            </span>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">
              Finding<span className="text-primary">Yukti</span>
            </span>
          </a>

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
          <SearchBar value={search} onChange={onSearchChange} />
          <button
            type="button"
            aria-label="Your profile"
            className="size-9 overflow-hidden rounded-full border border-border transition-transform hover:scale-105"
          >
            <Image
              src={profileUrl}
              alt="Your profile"
              width={36}
              height={36}
              className="size-full object-cover"
            />
          </button>
        </div>
      </nav>
    </motion.header>
  )
}
