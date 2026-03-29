// prisma/seed.js — Seed initial template data
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const TEMPLATES = [
  // Hiện đại
  {
    name: 'Rose Garden', slug: 'rose-garden', tier: 'FREE',
    category: 'hien-dai', thumbnail: 'https://res.cloudinary.com/demo/image/upload/wedding1.jpg',
    configJson: { primaryColor: '#f43f5e', font: 'Plus Jakarta Sans', layout: 'classic' },
    sortOrder: 1,
  },
  {
    name: 'Ivory Lace', slug: 'ivory-lace', tier: 'FREE',
    category: 'hien-dai', thumbnail: 'https://res.cloudinary.com/demo/image/upload/wedding2.jpg',
    configJson: { primaryColor: '#fda4af', font: 'Cormorant Garamond', layout: 'elegant' },
    sortOrder: 2,
  },
  {
    name: 'Golden Hour', slug: 'golden-hour', tier: 'BASIC',
    category: 'hien-dai', thumbnail: 'https://res.cloudinary.com/demo/image/upload/wedding3.jpg',
    configJson: { primaryColor: '#f59e0b', font: 'Plus Jakarta Sans', layout: 'modern' },
    sortOrder: 3,
  },
  // Cổ điển
  {
    name: 'Vintage Bloom', slug: 'vintage-bloom', tier: 'BASIC',
    category: 'co-dien', thumbnail: 'https://res.cloudinary.com/demo/image/upload/wedding4.jpg',
    configJson: { primaryColor: '#be123c', font: 'Cormorant Garamond', layout: 'vintage' },
    sortOrder: 4,
  },
  {
    name: 'Crimson Script', slug: 'crimson-script', tier: 'PREMIUM',
    category: 'co-dien', thumbnail: 'https://res.cloudinary.com/demo/image/upload/wedding5.jpg',
    configJson: { primaryColor: '#9f1239', font: 'Cormorant Garamond', layout: 'formal' },
    sortOrder: 5,
  },
  // Tối giản
  {
    name: 'Clean White', slug: 'clean-white', tier: 'FREE',
    category: 'toi-gian', thumbnail: 'https://res.cloudinary.com/demo/image/upload/wedding6.jpg',
    configJson: { primaryColor: '#111827', font: 'Plus Jakarta Sans', layout: 'minimal' },
    sortOrder: 6,
  },
  {
    name: 'Mono Serif', slug: 'mono-serif', tier: 'BASIC',
    category: 'toi-gian', thumbnail: 'https://res.cloudinary.com/demo/image/upload/wedding7.jpg',
    configJson: { primaryColor: '#374151', font: 'Cormorant Garamond', layout: 'minimal' },
    sortOrder: 7,
  },
  {
    name: 'Sakura Dream', slug: 'sakura-dream', tier: 'PREMIUM',
    category: 'hien-dai', thumbnail: 'https://res.cloudinary.com/demo/image/upload/wedding8.jpg',
    configJson: { primaryColor: '#fb7185', font: 'Plus Jakarta Sans', layout: 'cinematic' },
    sortOrder: 8,
  },
]

async function main() {
  console.log('🌱 Seeding templates...')

  for (const template of TEMPLATES) {
    await prisma.template.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    })
    console.log(`✓ ${template.name} (${template.tier})`)
  }

  console.log(`\n✅ Seeded ${TEMPLATES.length} templates`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
