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

async function fixListing() {
  const listingId = 'YBzxI-f5evOU8QuvuP9aY'

  console.log(`🔧 Fixing listing ${listingId}...`)

  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, listingId),
  })

  if (!listing) {
    console.log('❌ Listing not found')
    process.exit(1)
  }

  console.log(`Current coverImage: ${listing.coverImage}`)

  // Check if the URL pattern looks wrong (Unsplash IDs have numbers followed by dash)
  const hasValidPattern = listing.coverImage.match(/photo-\d{10,}-/)

  if (!hasValidPattern) {
    const newImage = validPlaceholders[0]

    await db.update(listings)
      .set({
        coverImage: newImage,
        images: [newImage],
      })
      .where(eq(listings.id, listingId))

    console.log(`✓ Fixed to: ${newImage}`)
  } else {
    console.log(`✓ Already valid, no fix needed`)
  }

  // Verify
  const updated = await db.query.listings.findFirst({
    where: eq(listings.id, listingId),
  })
  console.log(`\nNew coverImage: ${updated?.coverImage}`)

  process.exit(0)
}

fixListing().catch(console.error)
