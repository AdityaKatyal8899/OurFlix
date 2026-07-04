import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const bucketName = process.env.AWS_S3_BUCKET_NAME
const region = process.env.AWS_REGION || 'us-east-1'

if (!accessKeyId || !secretAccessKey || !bucketName) {
  console.error('Error: AWS credentials or bucket name not found in .env')
  process.exit(1)
}

const s3Client = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
})

const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.png') return 'image/png'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.mpeg' || ext === '.mp3') return 'audio/mpeg'
  if (ext === '.mp4') return 'video/mp4'
  return 'application/octet-stream'
}

async function uploadBhavyaFolder() {
  const folderPath = path.resolve('Bhavya')
  
  if (!fs.existsSync(folderPath)) {
    console.error(`Folder "${folderPath}" does not exist.`)
    process.exit(1)
  }

  try {
    const files = fs.readdirSync(folderPath)
    console.log(`Found ${files.length} files in ${folderPath}. Starting upload to S3...`)

    for (const file of files) {
      const filePath = path.join(folderPath, file)
      const stat = fs.statSync(filePath)

      if (stat.isFile()) {
        const fileStream = fs.createReadStream(filePath)
        const contentType = getContentType(filePath)
        const s3Key = `Bhavya/${file}` // Keep folder prefix

        console.log(`Uploading ${file} to S3 key "${s3Key}" (${contentType})...`)

        const uploadCommand = new PutObjectCommand({
          Bucket: bucketName,
          Key: s3Key,
          Body: fileStream,
          ContentType: contentType,
        })

        await s3Client.send(uploadCommand)
        console.log(`✓ Successfully uploaded ${file} as "${s3Key}"`)
      }
    }
    console.log('\nAll files from Bhavya directory uploaded successfully!')
  } catch (error) {
    console.error('Bhavya folder upload failed:', error)
  }
}

uploadBhavyaFolder()
