import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const srcDir = path.resolve('toAdd')
const destDir = path.resolve('public/toAdd')

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

const files = fs.readdirSync(srcDir)

console.log(`Found ${files.length} files to process...`)

for (const file of files) {
  const ext = path.extname(file).toLowerCase()
  const baseName = path.basename(file, ext)
  const srcPath = path.join(srcDir, file)

  if (ext === '.heic') {
    const destJpg = path.join(destDir, `${baseName}.jpg`)
    if (fs.existsSync(destJpg)) {
      console.log(`Skipping already converted: ${baseName}.jpg`)
      continue
    }
    console.log(`Converting ${file} -> ${baseName}.jpg...`)
    execSync(`ffmpeg -i "${srcPath}" -q:v 2 -y "${destJpg}"`, { stdio: 'inherit' })
  } else if (ext === '.mov') {
    const destMp4 = path.join(destDir, `${baseName}.mp4`)
    const destThumb = path.join(destDir, `${baseName}-thumb.jpg`)
    if (fs.existsSync(destMp4) && fs.existsSync(destThumb)) {
      console.log(`Skipping already converted: ${baseName}.mp4`)
      continue
    }
    console.log(`Converting video ${file} -> ${baseName}.mp4 & thumbnail...`)
    // Convert video to 1080p 30fps MP4 with 8-bit yuv420p for fast web streaming & playback
    execSync(`ffmpeg -i "${srcPath}" -vf "scale=1080:-2,format=yuv420p" -c:v libx264 -preset veryfast -crf 23 -r 30 -c:a aac -b:a 128k -movflags +faststart -y "${destMp4}"`, { stdio: 'inherit' })
    // Generate thumbnail at 1 second
    execSync(`ffmpeg -ss 00:00:01 -i "${srcPath}" -vframes 1 -q:v 2 -y "${destThumb}"`, { stdio: 'inherit' })
  }
}

console.log('All media processed successfully!')
