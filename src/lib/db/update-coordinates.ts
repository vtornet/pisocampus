import 'dotenv/config'
import { db } from './index'
import { listings } from './schema'
import { eq } from 'drizzle-orm'

async function updateCoordinates() {
  console.log('📍 Updating listing coordinates...')

  const allListings = await db.query.listings.findMany()

  for (const listing of allListings) {
    let newCoordinates: { lat: number; lng: number } | null = null

    // Assign coordinates based on city
    switch (listing.city.toLowerCase()) {
      case 'madrid':
        // Add slight variation based on neighborhood
        if (listing.neighborhood?.toLowerCase().includes('moncloa')) {
          newCoordinates = { lat: 40.4438, lng: -3.7158 }
        } else if (listing.neighborhood?.toLowerCase().includes('chamberí')) {
          newCoordinates = { lat: 40.4325, lng: -3.7005 }
        } else if (listing.neighborhood?.toLowerCase().includes('lavapiés')) {
          newCoordinates = { lat: 40.4085, lng: -3.7001 }
        } else {
          newCoordinates = { lat: 40.4168 + (Math.random() - 0.5) * 0.05, lng: -3.7038 + (Math.random() - 0.5) * 0.05 }
        }
        break
      case 'barcelona':
        newCoordinates = { lat: 41.3851 + (Math.random() - 0.5) * 0.04, lng: 2.1734 + (Math.random() - 0.5) * 0.04 }
        break
      case 'valencia':
        newCoordinates = { lat: 39.4699 + (Math.random() - 0.5) * 0.03, lng: -0.3763 + (Math.random() - 0.5) * 0.03 }
        break
      case 'sevilla':
        newCoordinates = { lat: 37.3891 + (Math.random() - 0.5) * 0.03, lng: -5.9845 + (Math.random() - 0.5) * 0.03 }
        break
      case 'granada':
        newCoordinates = { lat: 37.1773 + (Math.random() - 0.5) * 0.02, lng: -3.5986 + (Math.random() - 0.5) * 0.02 }
        break
      default:
        // Default coordinates with random offset
        newCoordinates = { lat: 40.4168 + (Math.random() - 0.5) * 0.1, lng: -3.7038 + (Math.random() - 0.5) * 0.1 }
    }

    if (newCoordinates && !listing.coordinates) {
      await db.update(listings)
        .set({ coordinates: newCoordinates })
        .where(eq(listings.id, listing.id))

      console.log(`  ✓ Updated ${listing.id}: ${listing.title}`)
    } else if (listing.coordinates) {
      console.log(`  ⊙ Skipped ${listing.id}: already has coordinates`)
    }
  }

  console.log('\n✅ Coordinates updated!')
  process.exit(0)
}

updateCoordinates().catch(console.error)
