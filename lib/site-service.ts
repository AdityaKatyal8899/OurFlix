import { connectToDatabase } from '@/lib/mongodb'
import { Site, ISite } from '@/models/Site'
import { MEDIA, CAPYBARA_MEDIA } from '@/lib/data'
import { getPresignedUrl } from '@/lib/s3'
import type { MediaItem } from '@/types/media'

export interface SiteData {
  slug: string
  brandName: string
  profileName: string
  profileAvatar: string
  introAudioUrl: string
  creatorPasscode: string
  categories: string[]
  mediaItems: MediaItem[]
  isPaid: boolean
  plan?: 'mini' | 'premier' | 'vip'
  expiresAt?: Date | string
  addonRows?: number
  addonPhotos?: number
  addonVideos?: number
  hasCustomAudioAddon?: boolean
  creatorEmail?: string
  creatorGoogleId?: string
  stripeSessionId?: string
  transactionId?: string
  paidAt?: Date | string
}

// In-memory fallback if MONGODB_URI is not set yet in environment
const inMemorySites = new Map<string, SiteData>()

export function getDefaultSiteData(slug: string): SiteData {
  if (slug === 'capybara') {
    return {
      slug: 'capybara',
      brandName: 'CapybaraFlix',
      profileName: 'Capybara',
      profileAvatar: '/capybara/avatar.jpg',
      introAudioUrl: '/intro.mpeg',
      creatorPasscode: '2233',
      categories: ['🌿 Chill & Vibe', '🍉 Golden Moments'],
      mediaItems: CAPYBARA_MEDIA,
      isPaid: true,
      plan: 'mini',
    }
  }

  return {
    slug,
    brandName: slug === 'rdxthunder' ? 'RDXThunder' : slug.charAt(0).toUpperCase() + slug.slice(1) + 'Flix',
    profileName: slug === 'rdxthunder' ? 'CapyBara' : 'My Love',
    profileAvatar: '/pfp.jpeg',
    introAudioUrl: '/intro.mpeg',
    creatorPasscode: '1234',
    categories: ['💖 HER', '👥 Peeps', '✨ Cute Moments', '🌸 Random Smiles'],
    mediaItems: MEDIA,
    isPaid: true,
    plan: 'premier',
  }
}

export async function getSiteBySlug(rawSlug: string): Promise<SiteData | null> {
  const slug = rawSlug.trim().toLowerCase()

  // Built-in demo streams always serve their pristine default templates
  if (slug === 'rdxthunder' || slug === 'demo' || slug === 'capybara') {
    return getDefaultSiteData(slug)
  }

  const db = await connectToDatabase()

  if (db) {
    try {
      const siteDoc = await Site.findOne({ slug }).lean<ISite>()
      if (siteDoc) {
        return {
          slug: siteDoc.slug,
          brandName: siteDoc.brandName || 'MyFlix',
          profileName: siteDoc.profileName || 'My Love',
          profileAvatar: siteDoc.profileAvatar || '/pfp.jpeg',
          introAudioUrl: siteDoc.introAudioUrl || '/intro.mpeg',
          creatorPasscode: siteDoc.creatorPasscode || (slug === 'capybara' ? '2233' : '1234'),
          categories: siteDoc.categories || (slug === 'capybara' ? ['🌿 Chill & Vibe', '🍉 Golden Moments'] : ['💖 HER', '👥 Peeps', '✨ Cute Moments', '🌸 Random Smiles']),
          mediaItems: siteDoc.mediaItems || [],
          isPaid:
            slug === 'rdxthunder' || slug === 'capybara' || slug === 'demo'
              ? true
              : (siteDoc.isPaid ?? false),
          plan: siteDoc.plan || (slug === 'capybara' ? 'mini' : 'premier'),
          stripeSessionId: siteDoc.stripeSessionId,
          transactionId: siteDoc.transactionId,
          paidAt: siteDoc.paidAt,
        }
      }

      // If rdxthunder, demo, or capybara is requested and not found in DB, seed it
      if (slug === 'rdxthunder' || slug === 'demo' || slug === 'capybara') {
        const defaultData = getDefaultSiteData(slug)
        try {
          await Site.create(defaultData)
        } catch {
          // ignore duplicate race condition
        }
        return defaultData
      }
      return null
    } catch (err) {
      console.error('Error fetching site from MongoDB:', err)
    }
  }

  // Fallback to in-memory store if DB is offline or not configured
  if (inMemorySites.has(slug)) {
    return inMemorySites.get(slug)!
  }

  // If slug is rdxthunder, demo, or capybara, populate in-memory
  if (slug === 'rdxthunder' || slug === 'demo' || slug === 'capybara') {
    const defaultData = getDefaultSiteData(slug)
    inMemorySites.set(slug, defaultData)
    return defaultData
  }

  return null
}

export async function resolveSiteMediaUrls(site: SiteData): Promise<SiteData> {
  const [resolvedAvatar, resolvedAudio, resolvedMedia] = await Promise.all([
    getPresignedUrl(site.profileAvatar),
    getPresignedUrl(site.introAudioUrl),
    Promise.all(
      site.mediaItems.map(async (item) => {
        const [thumbnail, mediaUrl] = await Promise.all([
          getPresignedUrl(item.thumbnail),
          getPresignedUrl(item.mediaUrl),
        ])
        return {
          ...item,
          thumbnail,
          mediaUrl,
        }
      })
    ),
  ])

  return {
    ...site,
    profileAvatar: resolvedAvatar,
    introAudioUrl: resolvedAudio,
    mediaItems: resolvedMedia,
  }
}

export async function saveSiteBySlug(
  rawSlug: string,
  update: Partial<SiteData>,
  providedPasscode?: string,
  authorizedEmail?: string
): Promise<{ success: boolean; error?: string; site?: SiteData }> {
  const slug = rawSlug.trim().toLowerCase()
  const isDemoSite = slug === 'rdxthunder' || slug === 'capybara' || slug === 'demo'

  // DEMO PROFILES: Never mutate live database! Changes in demo are strictly client preview sandbox.
  if (isDemoSite) {
    const defaultData = getDefaultSiteData(slug)
    return {
      success: true,
      site: {
        ...defaultData,
        ...update,
        slug,
      },
    }
  }

  const db = await connectToDatabase()

  if (db) {
    try {
      const existing = await Site.findOne({ slug })
      if (existing) {
        // Enforce email authorization if the stream has an owner email
        if (existing.creatorEmail && !isDemoSite) {
          if (!authorizedEmail || authorizedEmail.toLowerCase() !== existing.creatorEmail.toLowerCase()) {
            return {
              success: false,
              error: 'Unauthorized: You are not authorized to edit this stream. Access is linked to the creator email.',
            }
          }
        }

        // Verify passcode if one is set (passcodes are now safely scoped per stream)
        if (
          providedPasscode &&
          existing.creatorPasscode &&
          existing.creatorPasscode !== providedPasscode &&
          !isDemoSite
        ) {
          return { success: false, error: 'Invalid passcode' }
        }

        // Link unassigned stream to current user if authorizedEmail is present
        if (!existing.creatorEmail && authorizedEmail && !isDemoSite) {
          existing.creatorEmail = authorizedEmail.toLowerCase()
        }

        if (update.brandName !== undefined) existing.brandName = update.brandName
        if (update.profileName !== undefined) existing.profileName = update.profileName
        if (update.profileAvatar !== undefined) existing.profileAvatar = update.profileAvatar
        if (update.introAudioUrl !== undefined) existing.introAudioUrl = update.introAudioUrl
        if (update.creatorPasscode !== undefined) existing.creatorPasscode = update.creatorPasscode
        if (update.categories !== undefined) existing.categories = update.categories
        if (update.mediaItems !== undefined) existing.mediaItems = update.mediaItems
        if (update.isPaid !== undefined) existing.isPaid = update.isPaid

        await existing.save()
        return {
          success: true,
          site: {
            slug: existing.slug,
            brandName: existing.brandName,
            profileName: existing.profileName,
            profileAvatar: existing.profileAvatar,
            introAudioUrl: existing.introAudioUrl,
            creatorPasscode: existing.creatorPasscode,
            categories: existing.categories,
            mediaItems: existing.mediaItems,
            isPaid: existing.isPaid,
          },
        }
      } else {
        // Create new site in DB
        const created = await Site.create({
          slug,
          ...update,
        })
        return {
          success: true,
          site: {
            slug: created.slug,
            brandName: created.brandName,
            profileName: created.profileName,
            profileAvatar: created.profileAvatar,
            introAudioUrl: created.introAudioUrl,
            creatorPasscode: created.creatorPasscode,
            categories: created.categories,
            mediaItems: created.mediaItems,
            isPaid: created.isPaid,
          },
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Database error'
      return { success: false, error: errorMsg }
    }
  }

  // In-memory fallback
  const existing = inMemorySites.get(slug) || getDefaultSiteData(slug)
  if (
    providedPasscode &&
    existing.creatorPasscode &&
    existing.creatorPasscode !== providedPasscode
  ) {
    return { success: false, error: 'Invalid passcode' }
  }

  const updated: SiteData = {
    ...existing,
    ...update,
    slug,
  }
  inMemorySites.set(slug, updated)
  return { success: true, site: updated }
}

export async function getSitesByUser(email?: string, googleId?: string): Promise<SiteData[]> {
  if (!email && !googleId) return []

  try {
    const isConnected = await connectToDatabase()
    if (isConnected) {
      const orConditions: Record<string, unknown>[] = []
      if (email) orConditions.push({ creatorEmail: email.toLowerCase().trim() })
      if (googleId) orConditions.push({ creatorGoogleId: googleId })

      const docs = await Site.find({ $or: orConditions }).sort({ updatedAt: -1 }).lean()
      return docs.map((doc: any) => ({
        slug: doc.slug,
        brandName: doc.brandName,
        profileName: doc.profileName,
        profileAvatar: doc.profileAvatar,
        introAudioUrl: doc.introAudioUrl,
        creatorPasscode: doc.creatorPasscode,
        categories: doc.categories,
        mediaItems: doc.mediaItems || [],
        isPaid: doc.isPaid,
        plan: doc.plan,
        expiresAt: doc.expiresAt,
        addonRows: doc.addonRows || 0,
        addonPhotos: doc.addonPhotos || 0,
        addonVideos: doc.addonVideos || 0,
        hasCustomAudioAddon: doc.hasCustomAudioAddon,
        creatorEmail: doc.creatorEmail,
        creatorGoogleId: doc.creatorGoogleId,
        paidAt: doc.paidAt,
      }))
    }
  } catch (err) {
    console.warn('Failed to fetch user sites:', err)
  }

  // Fallback to in-memory check
  const results: SiteData[] = []
  for (const site of inMemorySites.values()) {
    if ((email && site.creatorEmail === email) || (googleId && site.creatorGoogleId === googleId)) {
      results.push(site)
    }
  }
  return results
}
