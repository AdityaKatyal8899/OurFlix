import fs from 'fs'
import path from 'path'

const folder = path.resolve('public/Peeps')
const files = fs.readdirSync(folder)

const peepsItems = files.map((file, idx) => {
  const ext = path.extname(file).toLowerCase()
  const title = `Peeps Moment #${idx + 1}`

  const day = String(idx + 1).padStart(2, '0')
  const date = `2026-06-${day}`

  return {
    id: `peeps-${idx}`,
    title,
    type: 'image',
    thumbnail: `Peeps/${file}`,
    mediaUrl: `Peeps/${file}`,
    category: 'Peeps',
    tags: ['peeps', 'friends', 'moments', 'image'],
    favorite: true,
    date,
  }
})

// Read current data.ts
const dataPath = path.resolve('lib/data.ts')
let content = fs.readFileSync(dataPath, 'utf8')

// Format the new items as a string of JS objects
const itemsString = peepsItems.map(item => `  {\n` + Object.entries(item).map(([k, v]) => {
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
console.log('Successfully appended 7 Peeps items to MEDIA array inside lib/data.ts!')
