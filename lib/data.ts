import type { MediaItem } from '@/types/media'

/**
 * Central mock dataset. In the future this can be swapped for a fetch from
 * Cloudinary, AWS S3, Supabase Storage, Firebase, or local uploads without
 * changing any UI components — they only depend on the MediaItem shape.
 */
export const MEDIA: MediaItem[] = [
  {
    id: 'f0-1',
    title: 'Jai Shree ram',
    type: 'image',
    thumbnail: 'fristSlide.jpg',
    mediaUrl: 'fristSlide.jpg',
    category: 'Cute Moments',
    tags: ['featured', 'intro', 'first'],
    favorite: true,
    date: '2026-07-09',
  },
  {
    id: 'f0-2',
    title: 'Second Slide',
    type: 'image',
    thumbnail: 'secondSlide.png',
    mediaUrl: 'secondSlide.png',
    category: 'Cute Moments',
    tags: ['featured', 'intro', 'second'],
    favorite: true,
    date: '2026-07-08',
  },
  {
    id: 'f0-3',
    title: 'Third Slide',
    type: 'image',
    thumbnail: 'thirdSlide.png',
    mediaUrl: 'thirdSlide.png',
    category: 'Cute Moments',
    tags: ['featured', 'intro', 'third'],
    favorite: true,
    date: '2026-07-07',
  },
  {
    id: 'f0-4',
    title: 'Fourth Slide',
    type: 'image',
    thumbnail: 'fourthSlide.png',
    mediaUrl: 'fourthSlide.png',
    category: 'Cute Moments',
    tags: ['featured', 'intro', 'fourth'],
    favorite: true,
    date: '2026-07-06',
  },
  {
    id: 'f1',
    title: 'Serene View',
    type: 'image',
    thumbnail: 'files.jpg',
    mediaUrl: 'files.jpg',
    category: 'Cute Moments',
    tags: ['featured', 'photos', 'landscape'],
    favorite: true,
    date: '2026-07-05',
  },
  {
    id: 'f2',
    title: 'Warm Sunlight',
    type: 'image',
    thumbnail: 'files (1).jpg',
    mediaUrl: 'files (1).jpg',
    category: 'Cute Moments',
    tags: ['featured', 'photos', 'light'],
    favorite: true,
    date: '2026-07-04',
  },
  {
    id: 'f3',
    title: 'Golden Reflections',
    type: 'image',
    thumbnail: 'files (3).jpg',
    mediaUrl: 'files (3).jpg',
    category: 'Cute Moments',
    tags: ['featured', 'photos', 'gold'],
    favorite: true,
    date: '2026-07-03',
  },
  {
    id: 'f4',
    title: 'Mountain Retreat',
    type: 'image',
    thumbnail: 'files (4).jpg',
    mediaUrl: 'files (4).jpg',
    category: 'Random Smiles',
    tags: ['featured', 'photos', 'mountains'],
    favorite: true,
    date: '2026-07-02',
  },
  {
    id: 'f5',
    title: 'Quiet Horizon',
    type: 'image',
    thumbnail: 'files (5).jpg',
    mediaUrl: 'files (5).jpg',
    category: 'Random Smiles',
    tags: ['featured', 'photos', 'sky'],
    favorite: true,
    date: '2026-07-01',
  },
  {
    id: 'f6',
    title: 'Sunlit Valley',
    type: 'image',
    thumbnail: 'files (6).jpg',
    mediaUrl: 'files (6).jpg',
    category: 'Random Smiles',
    tags: ['featured', 'photos', 'valley'],
    favorite: true,
    date: '2026-06-30',
  },
  {
    id: 'f7',
    title: 'Majestic Peaks',
    type: 'image',
    thumbnail: 'files (7).jpg',
    mediaUrl: 'files (7).jpg',
    category: 'Random Smiles',
    tags: ['featured', 'photos', 'peaks'],
    favorite: true,
    date: '2026-06-29',
  },
]


export function getFavorites() {
  return MEDIA.filter((m) => m.favorite)
}

export function getByCategory(category: string) {
  return MEDIA.filter((m) => m.category === category)
}

export function getByType(type: 'image' | 'video') {
  return MEDIA.filter((m) => m.type === type)
}

export function getRecent() {
  return [...MEDIA].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}
