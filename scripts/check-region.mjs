import { S3Client, GetBucketLocationCommand } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

dotenv.config()

const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const bucketName = process.env.AWS_S3_BUCKET_NAME

if (!accessKeyId || !secretAccessKey || !bucketName) {
  console.error('Missing S3 credentials in .env')
  process.exit(1)
}

const findRegion = async () => {
  // S3 client defaults to us-east-1 to query global bucket location
  const client = new S3Client({
    region: 'us-east-1',
    credentials: { accessKeyId, secretAccessKey },
  })

  try {
    console.log(`Checking region for bucket: "${bucketName}"...`)
    const command = new GetBucketLocationCommand({ Bucket: bucketName })
    const response = await client.send(command)
    
    // LocationConstraint is empty string for us-east-1, otherwise holds region name
    const region = response.LocationConstraint || 'us-east-1'
    console.log(`\n🎉 Success! The S3 bucket is actually located in region: "${region}"`)
    console.log(`Please update AWS_REGION=${region} in your .env file.`)
  } catch (error) {
    console.error('Failed to resolve bucket region:', error.message)
    console.log('\nPossible causes:')
    console.log('1. The bucket name is misspelled.')
    console.log('2. The AWS credentials do not have permission to query GetBucketLocation.')
  }
}

findRegion()
