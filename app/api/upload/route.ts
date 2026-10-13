import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUploadUrl } from '@/lib/s3'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filename, contentType, slug } = body

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'filename and contentType are required' },
        { status: 400 }
      )
    }

    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const key = `uploads/${slug || 'general'}/${Date.now()}-${cleanFilename}`

    const { uploadUrl, key: finalKey } = await getPresignedUploadUrl(key, contentType)

    return NextResponse.json({
      uploadUrl,
      key: finalKey,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate upload URL'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
