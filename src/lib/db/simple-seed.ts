import 'dotenv/config'
import { db } from './index'
import { users, advertisers, listings, universities, reviews } from './schema'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('🌱 Seeding database...')

  // Crear universidades
  console.log('Creating universities...')
  await db.insert(universities).values({
    id: 'ucm',
    name: 'Universidad Complutense de Madrid',
    acronym: 'UCM',
    city: 'Madrid',
    campuses: [],
  }).onConflictDoNothing()

  await db.insert(universities).values({
    id: 'upm',
    name: 'Universidad Politécnica de Madrid',
    acronym: 'UPM',
    city: 'Madrid',
    campuses: [],
  }).onConflictDoNothing()

  // Crear usuario anunciante
  console.log('Creating user...')
  const hashedPassword = await bcrypt.hash('password123', 10)
  const userId = 'user_test_adv'

  try {
    await db.insert(users).values({
      id: userId,
      name: 'Test Anunciante',
      email: 'test@test.com',
      password: hashedPassword,
      role: 'advertiser',
    })
    console.log('  ✓ User created')
  } catch (e: any) {
    if (e.code === '23505') {
      console.log('  ⊘ User already exists')
    } else {
      throw e
    }
  }

  // Crear anunciante
  console.log('Creating advertiser...')
  const advertiserId = 'adv_test'

  try {
    await db.insert(advertisers).values({
      id: advertiserId,
      userId: userId,
      type: 'individual',
      name: 'Test Anunciante',
      verified: true,
      plan: 'pro',
    })
    console.log('  ✓ Advertiser created')
  } catch (e: any) {
    if (e.code === '23505') {
      console.log('  ⊘ Advertiser already exists')
    } else {
      throw e
    }
  }

  // Crear listings
  console.log('Creating listings...')

  const listingsData = [
    {
      id: 'list_1',
      title: 'Habitación individual cerca de UCM',
      description: 'Bonita habitación individual en piso reformado, muy cerca de la Universidad Complutense.',
      type: 'room',
      advertiserId: advertiserId,
      universityId: 'ucm',
      city: 'Madrid',
      province: 'Madrid',
      neighborhood: 'Moncloa',
      address: 'Calle Isaac Peral, 23',
      price: 450,
      billsIncluded: true,
      deposit: 450,
      bedrooms: 3,
      bathrooms: 1,
      area: 12,
      furnished: true,
      features: { wifi: true, heating: true, elevator: true },
      availableFrom: new Date('2025-09-01'),
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      coordinates: { lat: 40.4438, lng: -3.7158 },
      status: 'active',
      featured: false,
      verified: true,
    },
    {
      id: 'list_2',
      title: 'Estudio en Chamberí',
      description: 'Estudio independiente con baño privado y cocina equipada.',
      type: 'studio',
      advertiserId: advertiserId,
      universityId: 'upm',
      city: 'Madrid',
      province: 'Madrid',
      neighborhood: 'Chamberí',
      address: 'Calle Bravo Murillo, 145',
      price: 750,
      billsIncluded: false,
      deposit: 750,
      bedrooms: 1,
      bathrooms: 1,
      area: 28,
      furnished: true,
      features: { wifi: true, heating: true, airConditioning: true },
      availableFrom: new Date('2025-09-01'),
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      coordinates: { lat: 40.4325, lng: -3.7005 },
      status: 'active',
      featured: true,
      verified: true,
    },
  ]

  for (const listing of listingsData) {
    try {
      await db.insert(listings).values(listing)
      console.log(`  ✓ Listing created: ${listing.title}`)
    } catch (e: any) {
      if (e.code === '23505') {
        console.log(`  ⊘ Listing already exists: ${listing.title}`)
      } else {
        console.error(`  ✗ Error: ${e.message}`)
      }
    }
  }

  console.log('\n✅ Seed completed!')
  console.log('\n📧 Test account:')
  console.log('   test@test.com / password123')
}

seed().catch(console.error)
