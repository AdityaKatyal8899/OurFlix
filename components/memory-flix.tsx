'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { SearchX, Plus, Sparkles } from 'lucide-react'
import { useMemo, useState, useEffect, useRef } from 'react'
import { MEDIA } from '@/lib/data'
import type { MediaItem } from '@/types/media'
import { HeroBanner } from './hero-banner'
import { MediaCard } from './media-card'
import { MediaCarousel } from './media-carousel'
import { Navbar } from './navbar'
import { SectionTitle } from './section-title'
import { ProfileSelection } from './profile-selection'
import { Slideshow } from './slideshow'

// Editor components & modals
import { EditorToolbar } from './editor/editor-toolbar'
import { BrandModal } from './editor/brand-modal'
import { ProfileModal } from './editor/profile-modal'
import { HeroModal } from './editor/hero-modal'
import { MediaModal } from './editor/media-modal'
import { CategoryModal } from './editor/category-modal'
import { OnboardingModal } from './editor/onboarding-modal'
import { PasscodeModal } from './editor/passcode-modal'
import { AddonModal } from './editor/addon-modal'
import { ShareModal } from './share-modal'
import { CASHFREE_PRICING, CashfreeAddonKey } from '@/lib/cashfree'

interface MemoryFlixProps {
  slug?: string
  initialMedia?: MediaItem[]
  profileUrl?: string
  introAudioUrl?: string
  initialBrandName?: string
  initialProfileName?: string
  initialCategories?: string[]
  initialPasscode?: string
  initialPlan?: 'mini' | 'premier' | 'vip'
  expiresAt?: Date | string
  addonRows?: number
  addonPhotos?: number
  addonVideos?: number
  hasCustomAudioAddon?: boolean
}

const STORAGE_KEY_MEDIA = 'ourflix_media_items'
const STORAGE_KEY_BRAND = 'ourflix_brand_name'
const STORAGE_KEY_PROFILE = 'ourflix_profile_name'
const STORAGE_KEY_AVATAR = 'ourflix_profile_avatar'
const STORAGE_KEY_CATEGORIES = 'ourflix_categories'
const STORAGE_KEY_PASSCODE = 'ourflix_creator_passcode'
const STORAGE_KEY_AUTH = 'ourflix_creator_auth'

const DEFAULT_CATEGORIES = ['💖 HER', '👥 Peeps', '✨ Cute Moments', '🌸 Random Smiles']

export function MemoryFlix({
  slug = 'rdxthunder',
  initialMedia = MEDIA,
  profileUrl = '/pfp.jpeg',
  introAudioUrl = '/intro.mpeg',
  initialBrandName = 'RDXThunder',
  initialProfileName = 'CapyBara',
  initialCategories = DEFAULT_CATEGORIES,
  initialPasscode = '1234',
  initialPlan = 'premier',
  expiresAt,
  addonRows = 0,
  addonPhotos = 0,
  addonVideos = 0,
  hasCustomAudioAddon = false,
}: MemoryFlixProps) {
  // App navigation & viewer state
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [activeSlideshow, setActiveSlideshow] = useState<{
    items: MediaItem[]
    startIndex: number
  } | null>(null)
  const [search, setSearch] = useState('')
  const [activeLink, setActiveLink] = useState('Home')

  // Visual in-place editor & Access control state
  const [isCreatorAuthenticated, setIsCreatorAuthenticated] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [creatorPasscode, setCreatorPasscode] = useState(initialPasscode)

  // Customizable content state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMedia)
  const [brandName, setBrandName] = useState(initialBrandName)
  const [profileName, setProfileName] = useState(initialProfileName)
  const [avatarUrl, setAvatarUrl] = useState(profileUrl)
  const [categories, setCategories] = useState<string[]>(initialCategories)

  // Editor Modal states
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false)
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [editingHeroSlide, setEditingHeroSlide] = useState<MediaItem | null>(null)
  const [editingCard, setEditingCard] = useState<MediaItem | null>(null)
  const [addingCardCategory, setAddingCardCategory] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [addonDefaultTab, setAddonDefaultTab] = useState<CashfreeAddonKey>('addon_row_19')

  // Capacity Limits & Addon Calculations
  const isDemoSite = slug === 'rdxthunder' || slug === 'capybara' || slug === 'demo'
  const basePlan = CASHFREE_PRICING[initialPlan as 'mini' | 'premier' | 'vip'] || CASHFREE_PRICING.premier
  const maxRows = isDemoSite ? 20 : basePlan.rowLimit + addonRows
  const maxPhotos = isDemoSite ? 200 : basePlan.photoLimit + addonPhotos
  const maxVideos = isDemoSite ? 50 : basePlan.videoLimit + addonVideos

  const photoCount = useMemo(() => mediaItems.filter((m) => m.type !== 'video').length, [mediaItems])
  const videoCount = useMemo(() => mediaItems.filter((m) => m.type === 'video').length, [mediaItems])
  const rowCount = categories.length

  const handleRequestAddCategory = () => {
    if (!isDemoSite && rowCount >= maxRows) {
      setAddonDefaultTab('addon_row_19')
      setIsAddonModalOpen(true)
      return
    }
    setIsAddingCategory(true)
  }

  const handleRequestAddCard = (categoryName: string) => {
    if (!isDemoSite && photoCount >= maxPhotos && videoCount >= maxVideos) {
      setAddonDefaultTab('addon_photos_29')
      setIsAddonModalOpen(true)
      return
    }
    setAddingCardCategory(categoryName)
  }

  const slugSuffix = slug ? `_${slug}` : ''

  // Load customizations and auth from localStorage on initial mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const hasSetupParam = params.get('setup') === 'true'
      const hasCreatorParam = params.get('creator') === 'true'
      const hasAuthSession = sessionStorage.getItem(`${STORAGE_KEY_AUTH}${slugSuffix}`) === 'true'

      if (hasSetupParam) {
        setIsOnboardingOpen(true)
      } else if (hasCreatorParam || hasAuthSession) {
        setIsCreatorAuthenticated(true)
        setIsEditMode(true)

        // Only restore uncommitted client draft if creator is actively editing
        const savedMedia = localStorage.getItem(`${STORAGE_KEY_MEDIA}${slugSuffix}`)
        if (savedMedia) {
          try {
            setMediaItems(JSON.parse(savedMedia))
          } catch {}
        }
        const savedBrand = localStorage.getItem(`${STORAGE_KEY_BRAND}${slugSuffix}`)
        if (savedBrand) setBrandName(savedBrand)

        const savedProfile = localStorage.getItem(`${STORAGE_KEY_PROFILE}${slugSuffix}`)
        if (savedProfile) setProfileName(savedProfile)

        const savedAvatar = localStorage.getItem(`${STORAGE_KEY_AVATAR}${slugSuffix}`)
        if (savedAvatar) setAvatarUrl(savedAvatar)

        const savedCats = localStorage.getItem(`${STORAGE_KEY_CATEGORIES}${slugSuffix}`)
        if (savedCats) {
          try {
            setCategories(JSON.parse(savedCats))
          } catch {}
        }
      }

      const savedPasscode = localStorage.getItem(`${STORAGE_KEY_PASSCODE}${slugSuffix}`)
      if (savedPasscode) setCreatorPasscode(savedPasscode)
    } catch (err) {
      console.warn('Failed to load local storage draft:', err)
    }
  }, [slugSuffix])

  // Lock creator mode
  const handleLockCreatorMode = () => {
    setIsCreatorAuthenticated(false)
    setIsEditMode(false)
    try {
      sessionStorage.removeItem(`${STORAGE_KEY_AUTH}${slugSuffix}`)
    } catch (e) {
      console.warn(e)
    }
  }

  // Complete onboarding (right after payment)
  const handleCompleteOnboarding = async (newName: string, newAvatar: string, newPasscode: string) => {
    setProfileName(newName)
    setAvatarUrl(newAvatar)
    setCreatorPasscode(newPasscode)
    setIsCreatorAuthenticated(true)
    setIsEditMode(true)

    try {
      localStorage.setItem(`${STORAGE_KEY_PROFILE}${slugSuffix}`, newName)
      localStorage.setItem(`${STORAGE_KEY_AVATAR}${slugSuffix}`, newAvatar)
      localStorage.setItem(`${STORAGE_KEY_PASSCODE}${slugSuffix}`, newPasscode)
      sessionStorage.setItem(`${STORAGE_KEY_AUTH}${slugSuffix}`, 'true')

      // Save to database
      if (slug) {
        await fetch(`/api/sites/${slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            passcode: newPasscode,
            update: {
              profileName: newName,
              profileAvatar: newAvatar,
              creatorPasscode: newPasscode,
            },
          }),
        })
      }
    } catch (err) {
      console.warn(err)
    }
  }

  // Passcode unlock success
  const handlePasscodeSuccess = () => {
    setIsCreatorAuthenticated(true)
    setIsEditMode(true)
    try {
      sessionStorage.setItem(`${STORAGE_KEY_AUTH}${slugSuffix}`, 'true')
    } catch (err) {
      console.warn(err)
    }
  }

  // Save changes to localStorage & Cloud Database
  const handleSaveDraft = async () => {
    try {
      localStorage.setItem(`${STORAGE_KEY_MEDIA}${slugSuffix}`, JSON.stringify(mediaItems))
      localStorage.setItem(`${STORAGE_KEY_BRAND}${slugSuffix}`, brandName)
      localStorage.setItem(`${STORAGE_KEY_PROFILE}${slugSuffix}`, profileName)
      localStorage.setItem(`${STORAGE_KEY_AVATAR}${slugSuffix}`, avatarUrl)
      localStorage.setItem(`${STORAGE_KEY_CATEGORIES}${slugSuffix}`, JSON.stringify(categories))

      // Persist to MongoDB API endpoint
      if (slug) {
        await fetch(`/api/sites/${slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            passcode: creatorPasscode,
            update: {
              brandName,
              profileName,
              profileAvatar: avatarUrl,
              categories,
              mediaItems,
              creatorPasscode,
            },
          }),
        })
      }
    } catch (err) {
      console.warn('Failed to save draft:', err)
    }
  }

  // Reset customizations to defaults
  const handleResetDraft = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY_MEDIA}${slugSuffix}`)
      localStorage.removeItem(`${STORAGE_KEY_BRAND}${slugSuffix}`)
      localStorage.removeItem(`${STORAGE_KEY_PROFILE}${slugSuffix}`)
      localStorage.removeItem(`${STORAGE_KEY_AVATAR}${slugSuffix}`)
      localStorage.removeItem(`${STORAGE_KEY_CATEGORIES}${slugSuffix}`)
      setMediaItems(initialMedia)
      setBrandName(initialBrandName)
      setProfileName(initialProfileName)
      setAvatarUrl(profileUrl)
      setCategories(initialCategories)
    } catch (err) {
      console.warn('Failed to reset draft:', err)
    }
  }

  // Row generation according to categories
  const rows = useMemo(() => {
    return categories.map((catTitle) => {
      // Strip emojis from category title if items are categorized by raw name
      const cleanCat = catTitle.replace(/^[^\w\s]+/, '').trim()
      const items = mediaItems.filter(
        (m) =>
          m.category.toLowerCase() === catTitle.toLowerCase() ||
          m.category.toLowerCase() === cleanCat.toLowerCase() ||
          catTitle.toLowerCase().includes(m.category.toLowerCase())
      )
      return {
        title: catTitle,
        items,
      }
    })
  }, [mediaItems, categories])

  const query = search.trim().toLowerCase()

  const results = useMemo(() => {
    if (!query) return []
    return mediaItems.filter((m) => {
      const haystack = [m.title, m.category, m.type, ...m.tags]
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [query, mediaItems])

  // Featured slides for HeroBanner (items in category 'Featured' or recent items)
  const featuredSlides = useMemo(() => {
    const featured = mediaItems.filter((m) => m.category.toLowerCase() === 'featured')
    if (featured.length > 0) return featured
    return [...mediaItems]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
  }, [mediaItems])

  const preloadedAudioRef = useRef<HTMLAudioElement | null>(null)

  // Pre-buffer intro audio chime on component mount for zero-latency audio playback
  useEffect(() => {
    if (typeof window === 'undefined' || !introAudioUrl) return
    try {
      const audio = new Audio(introAudioUrl)
      audio.preload = 'auto'
      preloadedAudioRef.current = audio
    } catch (e) {
      console.warn('Audio pre-warm error:', e)
    }
  }, [introAudioUrl])

  // Method 1: Pre-warm Hero Banner & Row 1 thumbnails while user is on the Profile Selection Gate
  useEffect(() => {
    if (typeof window === 'undefined' || selectedProfile) return

    // 1. Pre-warm Hero Banner thumbnail
    const heroThumb = featuredSlides[0]?.thumbnail
    if (heroThumb) {
      const img = new window.Image()
      img.src = heroThumb
    }

    // 2. Pre-warm top 6 carousel card thumbnails
    const topRowItems = (rows[0]?.items || mediaItems).slice(0, 6)
    topRowItems.forEach((card) => {
      if (card.thumbnail && card.thumbnail !== heroThumb) {
        const img = new window.Image()
        img.src = card.thumbnail
      }
    })
  }, [selectedProfile, featuredSlides, rows, mediaItems])

  // Profile audio playback on gateway selection (instant 0ms trigger from pre-buffered audio)
  const handleSelectProfile = (pName: string) => {
    setSelectedProfile(pName)
    if (preloadedAudioRef.current) {
      preloadedAudioRef.current.currentTime = 0
      preloadedAudioRef.current.play().catch((err) => {
        console.warn('Intro audio playback failed:', err)
      })
    } else {
      const audio = new Audio(introAudioUrl)
      audio.play().catch((err) => {
        console.warn('Intro audio playback failed:', err)
      })
    }
  }

  // --- CRUD Handlers ---

  const handleSaveBrand = (newBrand: string) => {
    setBrandName(newBrand)
  }

  const handleSaveProfile = (newName: string, newAvatar: string, newPasscode?: string) => {
    setProfileName(newName)
    setAvatarUrl(newAvatar)
    if (newPasscode) {
      setCreatorPasscode(newPasscode)
      try {
        localStorage.setItem(`${STORAGE_KEY_PASSCODE}${slugSuffix}`, newPasscode)
      } catch {}
    }
  }

  const handleSaveHeroSlide = (updatedItem: MediaItem) => {
    setMediaItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    )
  }

  const handleSaveCard = (savedItem: MediaItem) => {
    const isNew = !mediaItems.some((x) => x.id === savedItem.id)

    if (isNew && !isDemoSite) {
      if (savedItem.type === 'video' && videoCount >= maxVideos) {
        setAddonDefaultTab('addon_videos_39')
        setIsAddonModalOpen(true)
        return
      }
      if (savedItem.type !== 'video' && photoCount >= maxPhotos) {
        setAddonDefaultTab('addon_photos_29')
        setIsAddonModalOpen(true)
        return
      }
    }

    setMediaItems((prev) => {
      const exists = prev.some((x) => x.id === savedItem.id)
      if (exists) {
        return prev.map((x) => (x.id === savedItem.id ? savedItem : x))
      }
      return [savedItem, ...prev]
    })
  }

  const handleDeleteCard = (id: string) => {
    setMediaItems((prev) => prev.filter((x) => x.id !== id))
  }

  const handleSaveCategory = (newName: string) => {
    if (!editingCategory) return
    const oldName = editingCategory
    // Update categories array
    setCategories((prev) => prev.map((cat) => (cat === oldName ? newName : cat)))
    // Update matching items
    setMediaItems((prev) =>
      prev.map((item) =>
        item.category === oldName ? { ...item, category: newName } : item
      )
    )
    setEditingCategory(null)
  }

  const handleDeleteCategory = () => {
    if (!editingCategory) return
    const catToDelete = editingCategory
    setCategories((prev) => prev.filter((cat) => cat !== catToDelete))
    setEditingCategory(null)
  }

  const handleAddCategory = (newCat: string) => {
    if (!isDemoSite && rowCount >= maxRows) {
      setAddonDefaultTab('addon_row_19')
      setIsAddonModalOpen(true)
      setIsAddingCategory(false)
      return
    }
    if (!categories.includes(newCat)) {
      setCategories((prev) => [...prev, newCat])
    }
    setIsAddingCategory(false)
  }

  return (
    <div id="top" className="min-h-screen bg-background relative pb-16">
      <AnimatePresence mode="wait">
        {!selectedProfile ? (
          <motion.div
            key="profile-selection"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProfileSelection
              onSelectProfile={handleSelectProfile}
              avatarPath={avatarUrl}
              profileName={profileName}
            />
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
              profileUrl={avatarUrl}
              brandName={brandName}
              isEditMode={isCreatorAuthenticated && isEditMode}
              isCreatorUnlocked={isCreatorAuthenticated}
              onEditBrand={() => setIsBrandModalOpen(true)}
              onEditProfile={() => setIsProfileModalOpen(true)}
              onUnlockCreator={() => setIsPasscodeModalOpen(true)}
              onOpenShare={() => setIsShareModalOpen(true)}
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
                          isEditMode={isCreatorAuthenticated && isEditMode}
                          onEdit={(card) => setEditingCard(card)}
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
                  items={featuredSlides}
                  isEditMode={isCreatorAuthenticated && isEditMode}
                  onEditSlide={(slide) => setEditingHeroSlide(slide)}
                  onPlay={(item) => {
                    const index = featuredSlides.findIndex((x) => x.id === item.id)
                    setActiveSlideshow({
                      items: featuredSlides,
                      startIndex: index >= 0 ? index : 0,
                    })
                  }}
                />

                <div className="relative z-10 mt-8 space-y-8 pb-12 sm:mt-12 sm:space-y-10">
                  {rows.map((row) => (
                    <MediaCarousel
                      key={row.title}
                      title={row.title}
                      items={row.items}
                      isEditMode={isCreatorAuthenticated && isEditMode}
                      onEditCard={(card) => setEditingCard(card)}
                      onAddCard={(cat) => handleRequestAddCard(cat)}
                      onEditCategory={(cat) => setEditingCategory(cat)}
                      onSelect={(item) => {
                        const index = row.items.findIndex((x) => x.id === item.id)
                        setActiveSlideshow({
                          items: row.items,
                          startIndex: index >= 0 ? index : 0,
                        })
                      }}
                    />
                  ))}

                  {/* Add New Category Row Button (Visible only to authenticated creator in Edit Mode) */}
                  {isCreatorAuthenticated && isEditMode && (
                    <div className="px-4 sm:px-8 max-w-[1600px] mx-auto pt-4">
                      <button
                        type="button"
                        onClick={handleRequestAddCategory}
                        className="group flex w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] py-6 text-sm font-semibold text-white/80 transition-all hover:border-primary hover:bg-white/[0.05] hover:text-white"
                      >
                        <div className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                          <Plus className="size-4" />
                        </div>
                        <span>Add New Category Row</span>
                      </button>
                    </div>
                  )}
                </div>
              </main>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Visual Editor Toolbar (Rendered ONLY when Creator is Authenticated) */}
      {isCreatorAuthenticated && (
        <EditorToolbar
          isEditMode={isEditMode}
          onToggleEditMode={() => setIsEditMode((prev) => !prev)}
          onAddCategoryRow={handleRequestAddCategory}
          onSave={handleSaveDraft}
          onReset={handleResetDraft}
          onLock={handleLockCreatorMode}
          onOpenAddons={() => {
            setAddonDefaultTab('addon_row_19')
            setIsAddonModalOpen(true)
          }}
        />
      )}

      {/* --- ALL EDIT MODALS --- */}

      {/* 1. Brand Logo Name Modal */}
      <BrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        currentBrand={brandName}
        onSave={handleSaveBrand}
      />

      {/* 2. Profile & Avatar Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentName={profileName}
        currentAvatar={avatarUrl}
        currentPasscode={creatorPasscode}
        onSave={handleSaveProfile}
      />

      {/* 3. Hero Slide Modal */}
      {editingHeroSlide && (
        <HeroModal
          isOpen={!!editingHeroSlide}
          onClose={() => setEditingHeroSlide(null)}
          currentItem={editingHeroSlide}
          onSave={handleSaveHeroSlide}
        />
      )}

      {/* 4. Edit Existing Card Modal */}
      {editingCard && (
        <MediaModal
          isOpen={!!editingCard}
          onClose={() => setEditingCard(null)}
          item={editingCard}
          availableCategories={categories}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
        />
      )}

      {/* 5. Add New Memory Card Modal */}
      {addingCardCategory && (
        <MediaModal
          isOpen={!!addingCardCategory}
          onClose={() => setAddingCardCategory(null)}
          defaultCategory={addingCardCategory}
          availableCategories={categories}
          onSave={handleSaveCard}
        />
      )}

      {/* 6. Rename / Delete Category Modal */}
      {editingCategory && (
        <CategoryModal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          initialName={editingCategory}
          onSave={handleSaveCategory}
          onDelete={handleDeleteCategory}
        />
      )}

      {/* 7. Add New Category Row Modal */}
      {isAddingCategory && (
        <CategoryModal
          isOpen={isAddingCategory}
          onClose={() => setIsAddingCategory(false)}
          isNew
          onSave={handleAddCategory}
        />
      )}

      {/* 8. Post-Payment Creator Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialProfileName={profileName}
        initialAvatar={avatarUrl}
        onComplete={handleCompleteOnboarding}
      />

      {/* 9. Creator Passcode Unlock Modal */}
      <PasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
        correctPasscode={creatorPasscode}
        onSuccess={handlePasscodeSuccess}
      />

      {/* 10. In-Studio Micro-Upgrades & Capacity Modal */}
      <AddonModal
        isOpen={isAddonModalOpen}
        onClose={() => setIsAddonModalOpen(false)}
        slug={slug}
        currentPlan={initialPlan}
        photoCount={photoCount}
        videoCount={videoCount}
        rowCount={rowCount}
        maxPhotos={maxPhotos}
        maxVideos={maxVideos}
        maxRows={maxRows}
        expiresAt={expiresAt}
        defaultSelected={addonDefaultTab}
      />

      {/* 11. Stream Sharing & QR Code Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        slug={slug}
        title={brandName || slug}
      />

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
