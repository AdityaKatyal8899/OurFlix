import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const region = process.env.AWS_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const bucketName = process.env.AWS_S3_BUCKET_NAME

if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
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
    case '.mpg': return 'video/mpeg'
    default: return 'application/octet-stream'
  }
}

const uploadDirectory = async (dirPath) => {
  try {
    const files = fs.readdirSync(dirPath)
    console.log(`Found ${files.length} files in ${dirPath}. Starting upload...`)

    for (const file of files) {
      const filePath = path.join(dirPath, file)
      const stat = fs.statSync(filePath)

      if (stat.isFile()) {
        const fileStream = fs.createReadStream(filePath)
        const contentType = getContentType(filePath)

        console.log(`Uploading ${file} (${contentType})...`)

        const uploadCommand = new PutObjectCommand({
          Bucket: bucketName,
          Key: file, // Use filename as the key
          Body: fileStream,
          ContentType: contentType,
        })

        await s3Client.send(uploadCommand)
        console.log(`✓ Successfully uploaded ${file}`)
      }
    }
    console.log('\nAll uploads completed successfully!')
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

// Default to uploading the photos folder
const targetFolder = path.resolve('photos')
uploadDirectory(targetFolder)
