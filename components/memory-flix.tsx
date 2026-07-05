'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { SearchX } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  getByCategory,
  getByType,
  getFavorites,
  getRecent,
  MEDIA,
} from '@/lib/data'
import type { MediaItem } from '@/types/media'
import { HeroBanner } from './hero-banner'
import { MediaCard } from './media-card'
import { MediaCarousel } from './media-carousel'
import { Navbar } from './navbar'
import { SectionTitle } from './section-title'
import { ProfileSelection } from './profile-selection'
import { Slideshow } from './slideshow'

interface MemoryFlixProps {
  initialMedia?: MediaItem[]
  profileUrl?: string
  introAudioUrl?: string
}

export function MemoryFlix({
  initialMedia = MEDIA,
  profileUrl = '/pfp.jpeg',
  introAudioUrl = '/intro.mpeg',
}: MemoryFlixProps) {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [activeSlideshow, setActiveSlideshow] = useState<{
    items: MediaItem[]
    startIndex: number
  } | null>(null)
  const [search, setSearch] = useState('')
  const [activeLink, setActiveLink] = useState('Home')

  const query = search.trim().toLowerCase()

  const rows = useMemo(() => {
    const getFavorites = () => initialMedia.filter((m) => m.favorite)
    const getByType = (type: 'image' | 'video') => initialMedia.filter((m) => m.type === type)
    const getByCategory = (category: string) => initialMedia.filter((m) => m.category === category)
    
    return [
      { title: '💖 HER', items: getByCategory('HER') },
      { title: '👥 Peeps', items: getByCategory('Peeps') },
      { title: '✨ Cute Moments', items: getByCategory('Cute Moments') },
      { title: '🌸 Random Smiles', items: getByCategory('Random Smiles') },
    ]
  }, [initialMedia])

  const results = useMemo(() => {
    if (!query) return []
    return initialMedia.filter((m) => {
      const haystack = [m.title, m.category, m.type, ...m.tags]
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [query, initialMedia])

  const recentMedia = useMemo(() => {
    return [...initialMedia].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }, [initialMedia])

  const handleSelectProfile = (profileName: string) => {
    setSelectedProfile(profileName)
    const audio = new Audio(introAudioUrl)
    audio.play().catch((err) => {
      console.warn('Intro audio playback failed:', err)
    })
  }

  return (
    <div id="top" className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!selectedProfile ? (
          <motion.div
            key="profile-selection"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProfileSelection onSelectProfile={handleSelectProfile} avatarPath={profileUrl} />
          </motion.div>
        ) : (
          <motion.div
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Navbar
              search={search}
              onSearchChange={setSearch}
              activeLink={activeLink}
              onLinkClick={setActiveLink}
              profileUrl={profileUrl}
            />

            {query ? (
              <main className="px-4 pb-20 pt-24 sm:px-8">
                <div className="mx-auto max-w-[1600px]">
                  <div className="mb-6">
                    <SectionTitle count={results.length}>
                      Results for &ldquo;{search.trim()}&rdquo;
                    </SectionTitle>
                  </div>

                  {results.length > 0 ? (
                    <motion.div
                      layout
                      className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
                    >
                      {results.map((item, idx) => (
                        <MediaCard
                          key={item.id}
                          item={item}
                          onSelect={() =>
                            setActiveSlideshow({ items: results, startIndex: idx })
                          }
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                      <SearchX className="size-10 text-muted-foreground" />
                      <p className="text-lg font-medium text-foreground">No memories found</p>
                      <p className="max-w-sm text-sm text-muted-foreground">
                        Try a different title, tag, or category — like &ldquo;beach&rdquo;,
                        &ldquo;trips&rdquo;, or &ldquo;video&rdquo;.
                      </p>
                    </div>
                  )}
                </div>
              </main>
            ) : (
              <main>
                <HeroBanner
                  items={recentMedia.slice(0, 6)}
                  onPlay={(item) => {
                    const index = recentMedia.findIndex((x) => x.id === item.id)
                    setActiveSlideshow({
                      items: recentMedia.slice(0, 6),
                      startIndex: index >= 0 ? index : 0,
                    })
                  }}
                />

                <div className="relative z-10 mt-8 space-y-8 pb-20 sm:mt-12 sm:space-y-10">
                  {rows.map((row) => (
                    <MediaCarousel
                      key={row.title}
                      title={row.title}
                      items={row.items}
                      onSelect={(item) => {
                        const index = row.items.findIndex((x) => x.id === item.id)
                        setActiveSlideshow({
                          items: row.items,
                          startIndex: index >= 0 ? index : 0,
                        })
                      }}
                    />
                  ))}
                </div>
              </main>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Fullscreen Slideshow Overlay */}
      {activeSlideshow && (
        <Slideshow
          items={activeSlideshow.items}
          startIndex={activeSlideshow.startIndex}
          onClose={() => setActiveSlideshow(null)}
        />
      )}
    </div>
  )
}
