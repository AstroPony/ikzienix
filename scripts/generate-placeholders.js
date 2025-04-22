const fs = require('fs')
const path = require('path')
const { createCanvas } = require('canvas')

const products = [
  'classic-black',
  'retro-gold',
  'sport-red',
  'aviator-silver',
  'round-brown',
  'cat-eye-black'
]

const collections = [
  'classic-collection',
  'retro-collection',
  'sport-collection',
  'aviator-collection',
  'round-collection',
  'cat-eye-collection'
]

const colors = {
  'classic-black': '#000000',
  'retro-gold': '#FFD700',
  'sport-red': '#FF0000',
  'aviator-silver': '#C0C0C0',
  'round-brown': '#8B4513',
  'cat-eye-black': '#000000'
}

function generateImage(name, width = 800, height = 600) {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#f3f4f6'
  ctx.fillRect(0, 0, width, height)

  // Frame
  ctx.strokeStyle = colors[name] || '#000000'
  ctx.lineWidth = 10
  ctx.strokeRect(50, 50, width - 100, height - 100)

  // Text
  ctx.fillStyle = '#000000'
  ctx.font = 'bold 48px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(name.replace(/-/g, ' ').toUpperCase(), width / 2, height / 2)

  // Save image
  const buffer = canvas.toBuffer('image/png')
  const outputPath = path.join(__dirname, '../public/images', `${name}.jpg`)
  fs.writeFileSync(outputPath, buffer)
}

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images')
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

// Generate product images
products.forEach(product => generateImage(product))

// Generate collection images
collections.forEach(collection => generateImage(collection)) 