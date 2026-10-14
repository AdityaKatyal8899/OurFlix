/**
 * Lightweight, zero-dependency Bloom Filter for fast slug/username availability checks.
 * Uses a compact Uint8Array bitset and 3 fast FNV-1a hash variants.
 * 
 * Guarantee:
 * - If has(slug) is FALSE => Slug definitely does NOT exist (100% certain, 0 false negatives).
 * - If has(slug) is TRUE  => Slug might exist (check DB to confirm).
 */

export class BloomFilter {
  private size: number
  private bitArray: Uint8Array

  // Default: 8,192 bits = 1,024 bytes (1 KB in memory).
  // Can comfortably hold hundreds of slugs with < 1% false positive rate.
  constructor(sizeInBits: number = 8192) {
    this.size = sizeInBits
    this.bitArray = new Uint8Array(Math.ceil(sizeInBits / 8))
  }

  // 3 fast, independent hash functions using FNV-1a variants with different seeds
  private hash1(str: string): number {
    let hash = 2166136261
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i)
      hash = Math.imul(hash, 16777619)
    }
    return Math.abs(hash) % this.size
  }

  private hash2(str: string): number {
    let hash = 1000000007
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i)
      hash |= 0 // Convert to 32bit integer
    }
    return Math.abs(hash) % this.size
  }

  private hash3(str: string): number {
    let hash = 5381
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) ^ str.charCodeAt(i)
    }
    return Math.abs(hash) % this.size
  }

  public add(item: string): void {
    const clean = item.toLowerCase().trim()
    if (!clean) return

    const indices = [this.hash1(clean), this.hash2(clean), this.hash3(clean)]
    for (const index of indices) {
      const byteIndex = Math.floor(index / 8)
      const bitOffset = index % 8
      this.bitArray[byteIndex] |= 1 << bitOffset
    }
  }

  public has(item: string): boolean {
    const clean = item.toLowerCase().trim()
    if (!clean) return false

    const indices = [this.hash1(clean), this.hash2(clean), this.hash3(clean)]
    for (const index of indices) {
      const byteIndex = Math.floor(index / 8)
      const bitOffset = index % 8
      if ((this.bitArray[byteIndex] & (1 << bitOffset)) === 0) {
        return false // Guaranteed not in filter
      }
    }
    return true // Probably in filter
  }

  public preload(items: string[]): void {
    for (const item of items) {
      this.add(item)
    }
  }

  public clear(): void {
    this.bitArray.fill(0)
  }
}

// System-wide reserved words that cannot be claimed as slugs
export const RESERVED_SLUGS = [
  'admin',
  'api',
  '_next',
  'static',
  'favicon.ico',
  'placeholder.svg',
  'terms',
  'privacy',
  'refund',
  'contact',
  'payment',
  'order',
  'checkout',
  'login',
  'signup',
  'settings',
  'demo',
  'rdxthunder',
  'capybara',
]

// Global singleton instance preserved across serverless warm requests
declare global {
  // eslint-disable-next-line no-var
  var __myflixBloomFilter: BloomFilter | undefined
  // eslint-disable-next-line no-var
  var __myflixBloomFilterInitialized: boolean | undefined
}

export const slugBloomFilter = global.__myflixBloomFilter || new BloomFilter(8192)
if (!global.__myflixBloomFilter) {
  slugBloomFilter.preload(RESERVED_SLUGS)
  global.__myflixBloomFilter = slugBloomFilter
}
