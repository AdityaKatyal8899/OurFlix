import { getPresignedUrl } from '../lib/s3.ts'
import dotenv from 'dotenv'

dotenv.config()

async function testUrl() {
  const testKey = 'Featured/slide1.jpg'
  try {
    console.log(`Generating presigned URL for key: "${testKey}"...`)
    const url = await getPresignedUrl(testKey)
    console.log(`\nGenerated URL:\n${url}\n`)

    console.log('Sending request to verify S3 response...')
    const response = await fetch(url)
    console.log(`HTTP Status Code: ${response.status} ${response.statusText}`)

    if (response.ok) {
      console.log('🎉 Success! The S3 image fetched successfully!')
    } else {
      const text = await response.text()
      console.log('❌ Error Response from S3:')
      console.log(text)
    }
  } catch (error) {
    console.error('Test script failed:', error)
  }
}

testUrl()
