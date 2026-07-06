export type MediaType = 'image' | 'video'

export interface MediaItem {
  id: string
  title: string
  type: MediaType
  /** Poster / thumbnail image path. Source-agnostic — can later point to Cloudinary, S3, Supabase, etc. */
  thumbnail: string
  /** Full media URL (image or video). Kept separate so the UI never depends on where media lives. */
  mediaUrl: string
  category: string
  tags: string[]
  favorite: boolean
  /** ISO date string */
  date: string
  description?: string
}

export interface MediaRow {
  id: string
  title: string
  items: MediaItem[]
}
