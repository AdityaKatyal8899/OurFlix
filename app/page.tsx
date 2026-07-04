import { MemoryFlix } from '@/components/memory-flix'
import { MEDIA } from '@/lib/data'
import { getPresignedUrl } from '@/lib/s3'

export default async function Page() {
  const resolvedMedia = await Promise.all(
    MEDIA.map(async (item) => {
      const [thumbnailUrl, mediaUrl] = await Promise.all([
        getPresignedUrl(item.thumbnail),
        getPresignedUrl(item.mediaUrl),
      ])
      return {
        ...item,
        thumbnail: thumbnailUrl,
        mediaUrl: mediaUrl,
      }
    })
  )

  const [profileUrl, introAudioUrl] = await Promise.all([
    getPresignedUrl('pfp.jpeg'),
    getPresignedUrl('intro.mpeg'),
  ])

  return (
    <MemoryFlix
      initialMedia={resolvedMedia}
      profileUrl={profileUrl}
      introAudioUrl={introAudioUrl}
    />
  )
}
