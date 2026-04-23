import 'dotenv/config'
import { db } from './index'
import { listings } from './schema'
import { eq } from 'drizzle-orm'

const validPlaceholders = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
]

async function fixImages() {
  console.log('🔧 Fixing listing images...')

  const allListings = await db.query.listings.findMany()

  for (const listing of allListings) {
    const currentImage = listing.coverImage || ''
    console.log(`Checking ${listing.id}: ${currentImage.substring(0, 60)}...`)

    // Check if URL is valid (must start with correct Unsplash pattern)
    const isValid = currentImage.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+/)

    if (!isValid) {
      const randomImage = validPlaceholders[Math.floor(Math.random() * validPlaceholders.length)]

      console.log(`  ❌ Invalid! Fixing to: ${randomImage.substring(0, 60)}...`)

      await db.update(listings)
        .set({
          coverImage: randomImage,
          images: [randomImage],
        })
        .where(eq(listings.id, listing.id))

      console.log(`  ✓ Fixed`)
    } else {
      console.log(`  ✓ OK`)
    }
  }

  console.log('\n✅ Fix completed!')
  process.exit(0)
}

fixImages().catch(console.error)
