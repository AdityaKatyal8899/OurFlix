import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const region = process.env.AWS_REGION || 'ap-south-1'
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

if (!region || !accessKeyId || !secretAccessKey) {
  console.warn(
    'AWS S3 configurations are missing in environment variables. Please check your .env file.'
  )
}

export const s3Client = new S3Client({
  region: region || 'ap-south-1',
  credentials: {
    accessKeyId: accessKeyId || 'placeholder-key',
    secretAccessKey: secretAccessKey || 'placeholder-secret',
  },
})

export const BUCKET_NAME = (
  process.env.AWS_BUCKET_NAME ||
  process.env.AWS_S3_BUCKET_NAME ||
  'ourflix-bucket'
).trim()

// In-memory cache for presigned URLs with TTL to avoid re-signing and preserve HTTP caching
const presignedUrlCache = new Map<string, { url: string; expiresAt: number }>()

export async function getPresignedUrl(key: string): Promise<string> {
  if (!key) return ''
  // If the key is already a full remote URL, return as is
  if (key.startsWith('http://') || key.startsWith('https://')) {
    return key
  }

  // If the key is a local static asset (e.g. built-in demo media in /toAdd, pfp, intro audio),
  // serve it directly from Next.js static public storage so Next.js Image Optimization can process it locally
  if (
    key.startsWith('/toAdd/') ||
    key.startsWith('toAdd/') ||
    key.startsWith('/capybara/') ||
    key.startsWith('capybara/') ||
    key.startsWith('/pfp.') ||
    key.startsWith('pfp.') ||
    key.startsWith('/intro.') ||
    key.startsWith('intro.') ||
    key.startsWith('/placeholder') ||
    key.startsWith('placeholder')
  ) {
    return key.startsWith('/') ? key : `/${key}`
  }

  // Strip leading slash if present for proper S3 object key matching
  const cleanKey = key.startsWith('/') ? key.slice(1) : key

  // Check in-memory cache (valid for 20 hours)
  const cached = presignedUrlCache.get(cleanKey)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: cleanKey,
    })
    // Sign URL with 24-hour expiration (86400 seconds)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 86400 })
    presignedUrlCache.set(cleanKey, {
      url: signedUrl,
      expiresAt: Date.now() + 20 * 60 * 60 * 1000, // 20 hours TTL
    })
    return signedUrl
  } catch (error) {
    console.error(`Failed to generate presigned URL for key: ${cleanKey}`, error)
    return `/${cleanKey}` // Graceful fallback to local path
  }
}

export async function getPresignedUploadUrl(
  key: string,
  contentType: string
): Promise<{ uploadUrl: string; key: string }> {
  const cleanKey = key.startsWith('/') ? key.slice(1) : key

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: cleanKey,
    ContentType: contentType,
  })

  // Sign upload URL with 1-hour expiration
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  return { uploadUrl, key: cleanKey }
}

