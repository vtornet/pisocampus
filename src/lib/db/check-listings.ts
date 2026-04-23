import 'dotenv/config'
import { db } from './index'
import { listings } from './schema'

async function checkListings() {
  console.log('🔍 Checking listings in database...')

  const allListings = await db.query.listings.findMany()

  console.log(`\nFound ${allListings.length} listings:\n`)

  for (const listing of allListings) {
    console.log('---')
    console.log(`ID: ${listing.id}`)
    console.log(`Title: ${listing.title}`)
    console.log(`CoverImage: ${listing.coverImage}`)
    console.log(`Images:`, listing.images)
    console.log(`Images type: ${typeof listing.images}`)
    console.log(`Images length: ${Array.isArray(listing.images) ? listing.images.length : 'N/A'}`)
  }

  process.exit(0)
}

checkListings().catch(console.error)
