import { S3Client } from '@aws-sdk/client-s3'

const region = process.env.AWS_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

if (!region || !accessKeyId || !secretAccessKey) {
  console.warn(
    'AWS S3 configurations are missing in environment variables. Please check your .env file.'
  )
}

export const s3Client = new S3Client({
  region: region || 'us-east-1',
  credentials: {
    accessKeyId: accessKeyId || 'placeholder-key',
    secretAccessKey: secretAccessKey || 'placeholder-secret',
  },
})

export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'ourflix-memories'

import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function getPresignedUrl(key: string): Promise<string> {
  if (!key) return ''
  // If the key is already a full URL or starts with /, return as is
  if (key.startsWith('http') || key.startsWith('/')) {
    return key
  }
  
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    // Sign URL with 24-hour expiration (86400 seconds)
    return await getSignedUrl(s3Client, command, { expiresIn: 86400 })
  } catch (error) {
    console.error(`Failed to generate presigned URL for key: ${key}`, error)
    if (key.startsWith('Her/')) {
      return `/${key}`
    }
    if (key.startsWith('Featured/')) {
      return `/${key}`
    }
    if (key.startsWith('Peeps/')) {
      return `/${key}`
    }
    if (
      key.startsWith('files') ||
      key.endsWith('Slide.jpg') ||
      key.endsWith('Slide.png')
    ) {
      return `/photos/${key}`
    }
    return `/memories/${key}` // fallback to local assets path
  }
}
