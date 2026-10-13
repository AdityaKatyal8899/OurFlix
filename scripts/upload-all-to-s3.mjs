import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const region = process.env.AWS_REGION || 'ap-south-1'
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const bucketName = (process.env.AWS_BUCKET_NAME || process.env.AWS_S3_BUCKET_NAME || 'ourflix-bucket').trim()

if (!accessKeyId || !secretAccessKey || !bucketName) {
  console.error('Error: Missing S3 environment variables in .env')
  process.exit(1)
}

const s3Client = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
})

const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case '.png': return 'image/png'
    case '.jpg':
    case '.jpeg': return 'image/jpeg'
    case '.gif': return 'image/gif'
    case '.webp': return 'image/webp'
    case '.mp4': return 'video/mp4'
    case '.mpeg':
    case '.mpg':
    case '.mp3': return 'audio/mpeg'
    default: return 'application/octet-stream'
  }
}

async function uploadFile(localPath, s3Key) {
  const fileContent = fs.readFileSync(localPath)
  const contentType = getContentType(localPath)
  console.log(`Uploading ${s3Key} (${contentType}, ${(fileContent.length / (1024 * 1024)).toFixed(2)} MB)...`)

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    Body: fileContent,
    ContentType: contentType,
  })

  await s3Client.send(command)
  console.log(`✓ Uploaded ${s3Key}`)
}

async function uploadAll() {
  try {
    const toAddDir = path.resolve('public/toAdd')
    const files = fs.readdirSync(toAddDir)

    console.log(`\n--- Uploading ${files.length} items from public/toAdd to S3 ---`)
    for (const file of files) {
      const localPath = path.join(toAddDir, file)
      const stat = fs.statSync(localPath)
      if (stat.isFile()) {
        await uploadFile(localPath, `toAdd/${file}`)
      }
    }

    // Also upload pfp.jpeg and intro.mpeg
    const pfpPath = path.resolve('public/pfp.jpeg')
    if (fs.existsSync(pfpPath)) {
      await uploadFile(pfpPath, 'pfp.jpeg')
    }

    const introPath = path.resolve('public/intro.mpeg')
    if (fs.existsSync(introPath)) {
      await uploadFile(introPath, 'intro.mpeg')
    }

    console.log('\n========================================')
    console.log('🎉 ALL MEDIA ASSETS UPLOADED TO S3!')
    console.log('========================================\n')
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

uploadAll()
