import fs from 'fs'
import path from 'path'

const herFolder = path.resolve('public/Her')
const files = fs.readdirSync(herFolder)

const herItems = files.map((file, idx) => {
  const ext = path.extname(file).toLowerCase()
  const type = ext === '.mp4' ? 'video' : 'image'
  
  // Use Y.jpg or files.jpg as thumbnail for videos, otherwise use the image itself
  const thumbnail = type === 'video' ? 'Her/Y.jpg' : `Her/${file}`
  const title = `HER Moment #${idx + 1}`

  const day = String(idx + 1).padStart(2, '0')
  const date = `2026-07-${day}`

  return {
    id: `her-${idx}`,
    title,
    type,
    thumbnail,
    mediaUrl: `Her/${file}`,
    category: 'HER',
    tags: ['her', 'love', 'moments', type],
    favorite: true, // Mark them as favorite so they also show in favorites
    date,
  }
})

// Read current data.ts
const dataPath = path.resolve('lib/data.ts')
let content = fs.readFileSync(dataPath, 'utf8')

// Format the new items as a string of JS objects
const itemsString = herItems.map(item => `  {\n` + Object.entries(item).map(([k, v]) => {
  if (k === 'tags') return `    tags: ${JSON.stringify(v)},`
  if (typeof v === 'boolean') return `    ${k}: ${v},`
  return `    ${k}: '${v}',`
}).join('\n') + `\n  },`).join('\n')

// Split at export function getFavorites()
const splitTerm = 'export function getFavorites()'
const parts = content.split(splitTerm)

if (parts.length < 2) {
  console.error('Could not find getFavorites function in data.ts')
  process.exit(1)
}

// Remove trailing spaces/brackets from first part, append items, then close the bracket
let firstPart = parts[0].trim()
if (firstPart.endsWith(']')) {
  firstPart = firstPart.slice(0, -1).trim()
}

const newContent = `${firstPart},\n${itemsString}\n]\n\n${splitTerm}${parts[1]}`

fs.writeFileSync(dataPath, newContent)
console.log('Successfully appended 19 HER items to MEDIA array inside lib/data.ts!')
