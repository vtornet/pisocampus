import { db } from './index'
import { users, advertisers, listings, universities } from './schema'
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'
import { eq, or } from 'drizzle-orm'

async function seed() {
  console.log('🌱 Seeding database...')

  // Limpiar datos de prueba existentes (en orden inverso por foreign keys)
  console.log('Cleaning existing test data...')
  const testUserIds = ['user_maria_garcia', 'user_carlos_ruiz', 'user_student_home', 'user_juan_perez', 'user_ana_lopez']
  const testAdvIds = ['adv_maria_garcia', 'adv_carlos_ruiz', 'adv_student_home']

  // Primero eliminar listings de los anunciantes de prueba
  for (const advId of testAdvIds) {
    await db.delete(listings).where(eq(listings.advertiserId, advId))
  }

  // Luego eliminar anunciantes de prueba
  for (const advId of testAdvIds) {
    await db.delete(advertisers).where(eq(advertisers.id, advId))
  }

  // Finalmente eliminar usuarios de prueba
  for (const userId of testUserIds) {
    await db.delete(users).where(eq(users.id, userId))
  }

  // Crear universidades
  console.log('Creating universities...')
  const uniData = [
    { id: 'ucm', name: 'Universidad Complutense de Madrid', acronym: 'UCM', city: 'Madrid' },
    { id: 'upm', name: 'Universidad Politécnica de Madrid', acronym: 'UPM', city: 'Madrid' },
    { id: 'uc3m', name: 'Universidad Carlos III de Madrid', acronym: 'UC3M', city: 'Madrid' },
    { id: 'ub', name: 'Universidad de Barcelona', acronym: 'UB', city: 'Barcelona' },
    { id: 'uv', name: 'Universitat de València', acronym: 'UV', city: 'Valencia' },
    { id: 'us', name: 'Universidad de Sevilla', acronym: 'US', city: 'Sevilla' },
    { id: 'ugr', name: 'Universidad de Granada', acronym: 'UGR', city: 'Granada' },
    { id: 'upv', name: 'Universitat Politècnica de València', acronym: 'UPV', city: 'Valencia' },
  ]

  for (const uni of uniData) {
    await db.insert(universities).values({
      id: uni.id,
      name: uni.name,
      acronym: uni.acronym,
      city: uni.city,
      campuses: [],
    }).onConflictDoNothing()
  }

  // Crear usuarios
  console.log('Creating users...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  const mariaId = 'user_maria_garcia'
  const carlosId = 'user_carlos_ruiz'
  const inmoId = 'user_student_home'
  const juanId = 'user_juan_perez'
  const anaId = 'user_ana_lopez'

  const userData = [
    {
      id: mariaId,
      name: 'María García',
      email: 'maria@test.com',
      password: hashedPassword,
      role: 'advertiser',
    },
    {
      id: carlosId,
      name: 'Carlos Ruiz',
      email: 'carlos@test.com',
      password: hashedPassword,
      role: 'advertiser',
    },
    {
      id: inmoId,
      name: 'Inmobiliaria Student',
      email: 'info@studenthome.com',
      password: hashedPassword,
      role: 'advertiser',
    },
    {
      id: juanId,
      name: 'Juan Pérez',
      email: 'juan@test.com',
      password: hashedPassword,
      role: 'student',
    },
    {
      id: anaId,
      name: 'Ana López',
      email: 'ana@test.com',
      password: hashedPassword,
      role: 'student',
    },
  ]

  for (const user of userData) {
    try {
      await db.insert(users).values(user)
      console.log(`  ✓ User created: ${user.email}`)
    } catch (error: any) {
      if (error.code === '23505') { // Unique violation
        console.log(`  ⊘ User already exists: ${user.email}`)
      } else {
        console.error(`  ✗ Error creating user ${user.email}:`, error.message)
        throw error
      }
    }
  }

  // Crear anunciantes
  console.log('Creating advertisers...')

  const mariaAdvId = 'adv_maria_garcia'
  const carlosAdvId = 'adv_carlos_ruiz'
  const inmoAdvId = 'adv_student_home'

  const advertiserData = [
    {
      id: mariaAdvId,
      userId: mariaId,
      type: 'individual',
      name: 'María García',
      verified: true,
      plan: 'pro',
    },
    {
      id: carlosAdvId,
      userId: carlosId,
      type: 'individual',
      name: 'Carlos Ruiz',
      verified: false,
      plan: 'free',
    },
    {
      id: inmoAdvId,
      userId: inmoId,
      type: 'agency',
      name: 'StudentHome Inmobiliaria',
      verified: true,
      plan: 'premium',
      listingsLimit: 50,
      imagesLimit: 20,
    },
  ]

  for (const advertiser of advertiserData) {
    try {
      await db.insert(advertisers).values(advertiser)
      console.log(`  ✓ Advertiser created: ${advertiser.name}`)
    } catch (error: any) {
      if (error.code === '23505') { // Unique violation
        console.log(`  ⊘ Advertiser already exists: ${advertiser.name}`)
      } else {
        console.error(`  ✗ Error creating advertiser ${advertiser.name}:`, error.message)
        throw error
      }
    }
  }

  // Crear anuncios
  console.log('Creating listings...')
  const mariaAdv = advertiserData.find(a => a.name === 'María García')!
  const carlosAdv = advertiserData.find(a => a.name === 'Carlos Ruiz')!
  const inmoAdv = advertiserData.find(a => a.name === 'StudentHome Inmobiliaria')!

  const listingsData = [
    // María's listings (UCM area)
    {
      id: nanoid(),
      title: 'Habitación individual en piso compartido cerca de UCM',
      description: 'Bonita habitación individual en piso reformado, muy cerca de la Universidad Complutense. Amueblada con cama, escritorio y armario empotrado. Piso muy luminoso con balcones a la calle. Compartes cocina y baño con otros 2 estudiantes.',
      type: 'room',
      advertiserId: mariaAdv.id,
      universityId: 'ucm',
      city: 'Madrid',
      province: 'Madrid',
      neighborhood: 'Moncloa',
      address: 'Calle Isaac Peral, 23',
      postalCode: '28015',
      coordinates: { lat: 40.4438, lng: -3.7158 },
      price: 450,
      billsIncluded: true,
      deposit: 450,
      bedrooms: 3,
      bathrooms: 1,
      area: 12,
      furnished: true,
      features: { wifi: true, heating: true, elevator: true, balcony: true },
      availableFrom: new Date('2026-09-01'),
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      status: 'active',
      featured: false,
      verified: true,
    },
    {
      id: nanoid(),
      title: 'Habitación doble con balcón - Ciudad Universitaria',
      description: 'Habitación doble ideal para dos amigos. Con balcón exterior y mucha luz natural. Edificio con ascensor y portería. Muy bien comunicada con metro y autobús.',
      type: 'room',
      advertiserId: mariaAdv.id,
      universityId: 'ucm',
      city: 'Madrid',
      province: 'Madrid',
      neighborhood: 'Ciudad Universitaria',
      address: 'Avenida Séneca, 15',
      postalCode: '28040',
      coordinates: { lat: 40.4512, lng: -3.7269 },
      price: 380,
      billsIncluded: false,
      deposit: 380,
      bedrooms: 2,
      bathrooms: 1,
      area: 16,
      furnished: true,
      features: { wifi: true, heating: true, elevator: true, balcony: true },
      availableFrom: new Date('2026-09-01'),
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
      coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      status: 'active',
      featured: false,
      verified: true,
    },
    // Carlos's listings
    {
      id: nanoid(),
      title: 'Habitación en Lavapiés - zona muy animada',
      description: 'Habitación en piso céntrico, zona de Lavapiés. Mucha vida, restaurantes y opciones de ocio. Ideal para estudiantes que quieren vivir en el corazón de Madrid.',
      type: 'room',
      advertiserId: carlosAdv.id,
      universityId: 'uc3m',
      city: 'Madrid',
      province: 'Madrid',
      neighborhood: 'Lavapiés',
      address: 'Calle Argumosa, 8',
      postalCode: '28012',
      coordinates: { lat: 40.4086, lng: -3.7001 },
      price: 420,
      billsIncluded: true,
      deposit: 420,
      bedrooms: 3,
      bathrooms: 1,
      area: 14,
      furnished: true,
      features: { wifi: true, heating: true, balcony: false },
      availableFrom: new Date('2026-10-01'),
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      status: 'active',
      featured: false,
      verified: false,
    },
    // Inmobiliaria listings
    {
      id: nanoid(),
      title: 'Estudio completo con baño privado - Chamberí',
      description: 'Estudio independiente con baño privado y cocina equipada. Ideal para estudiantes que buscan privacidad y comodidad. Zona tranquila y bien comunicada.',
      type: 'studio',
      advertiserId: inmoAdv.id,
      universityId: 'upm',
      city: 'Madrid',
      province: 'Madrid',
      neighborhood: 'Chamberí',
      address: 'Calle Santa Engracia, 45',
      postalCode: '28010',
      coordinates: { lat: 40.4326, lng: -3.7009 },
      price: 750,
      billsIncluded: false,
      deposit: 750,
      bedrooms: 1,
      bathrooms: 1,
      area: 28,
      furnished: true,
      features: { wifi: true, heating: true, airConditioning: true, elevator: true },
      availableFrom: new Date('2026-09-01'),
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      status: 'active',
      featured: true,
      verified: true,
    },
    {
      id: nanoid(),
      title: 'Piso completo 4 habitaciones - ideal para grupo',
      description: 'Piso completo con 4 habitaciones individuales, salón comedor, cocina equipada y 2 baños. Perfecto para grupo de amigos que quieren vivir juntos.',
      type: 'apartment',
      advertiserId: inmoAdv.id,
      universityId: 'ucm',
      city: 'Madrid',
      province: 'Madrid',
      neighborhood: 'Ciudad Universitaria',
      address: 'Avenida Séneca, 12',
      postalCode: '28040',
      coordinates: { lat: 40.4512, lng: -3.7269 },
      price: 2200,
      billsIncluded: false,
      deposit: 2200,
      bedrooms: 4,
      bathrooms: 2,
      area: 95,
      furnished: true,
      features: { wifi: true, heating: true, airConditioning: true, elevator: true },
      availableFrom: new Date('2026-09-01'),
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      status: 'active',
      featured: true,
      verified: true,
    },
    {
      id: nanoid(),
      title: 'Piso exterior en Salamanca - zona premium',
      description: 'Habitación exterior muy luminosa con balcón en el barrio de Salamanca. Zona de alta gama, muy segura y tranquila. Cerca de paradas de metro y autobús.',
      type: 'room',
      advertiserId: inmoAdv.id,
      universityId: 'ucm',
      city: 'Madrid',
      province: 'Madrid',
      neighborhood: 'Salamanca',
      address: 'Calle Claudio Coello, 89',
      postalCode: '28006',
      coordinates: { lat: 40.4269, lng: -3.6788 },
      price: 950,
      billsIncluded: false,
      deposit: 950,
      bedrooms: 3,
      bathrooms: 2,
      area: 18,
      furnished: true,
      features: { wifi: true, heating: true, airConditioning: true, elevator: true, balcony: true },
      availableFrom: new Date('2026-09-15'),
      images: ['https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800'],
      coverImage: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
      status: 'active',
      featured: true,
      verified: true,
    },
    // Barcelona listing
    {
      id: nanoid(),
      title: 'Habitación en Gràcia - cerca de UB',
      description: 'Bonita habitación en piso compartido en el barrio de Gràcia. Muy cerca de la Universidad de Barcelona. Zona bohemía con muchos bares y restaurantes.',
      type: 'room',
      advertiserId: inmoAdv.id,
      universityId: 'ub',
      city: 'Barcelona',
      province: 'Barcelona',
      neighborhood: 'Gràcia',
      address: 'Calle Gran de Gràcia, 45',
      postalCode: '08006',
      coordinates: { lat: 41.4021, lng: 2.1564 },
      price: 550,
      billsIncluded: true,
      deposit: 550,
      bedrooms: 3,
      bathrooms: 1,
      area: 12,
      furnished: true,
      features: { wifi: true, heating: true, elevator: false, balcony: true },
      availableFrom: new Date('2026-09-01'),
      images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
      coverImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      status: 'active',
      featured: false,
      verified: true,
    },
    // Valencia listing
    {
      id: nanoid(),
      title: 'Habitación doble en Ruzafa - UV',
      description: 'Habitación doble en el trendy barrio de Ruzafa. Muy cerca de la Universitat de València. Piso reformado con mucho encanto.',
      type: 'room',
      advertiserId: inmoAdv.id,
      universityId: 'uv',
      city: 'Valencia',
      province: 'Valencia',
      neighborhood: 'Ruzafa',
      address: 'Calle Cádiz, 23',
      postalCode: '46004',
      coordinates: { lat: 39.4688, lng: -0.3767 },
      price: 400,
      billsIncluded: true,
      deposit: 400,
      bedrooms: 2,
      bathrooms: 1,
      area: 14,
      furnished: true,
      features: { wifi: true, heating: true, airConditioning: true, elevator: true },
      availableFrom: new Date('2026-09-01'),
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      status: 'active',
      featured: false,
      verified: true,
    },
  ]

  for (const listing of listingsData) {
    await db.insert(listings).values(listing).onConflictDoNothing()
  }

  console.log(`✅ Seed completed! Created:`)
  console.log(`   - ${uniData.length} universities`)
  console.log(`   - ${userData.length} users`)
  console.log(`   - ${advertiserData.length} advertisers`)
  console.log(`   - ${listingsData.length} listings`)
  console.log('\n📧 Test accounts:')
  console.log('   maria@test.com / password123 (Anunciante)')
  console.log('   juan@test.com / password123 (Estudiante)')
}

seed().catch(console.error)
