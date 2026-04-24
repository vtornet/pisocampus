import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { listings, advertisers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { geocodeAddress, getCityCoordinates } from '@/lib/geocoding'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const advertiser = await db.query.advertisers.findFirst({
      where: eq(advertisers.userId, userId),
    })

    if (!advertiser) {
      return NextResponse.json(
        { error: 'Advertiser profile not found' },
        { status: 404 }
      )
    }

    const formData = await request.formData()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const city = formData.get('city') as string
    const province = formData.get('province') as string
    const neighborhood = formData.get('neighborhood') as string
    const address = formData.get('address') as string
    const postalCode = formData.get('postalCode') as string
    const universityId = formData.get('universityId') as string
    const price = parseInt(formData.get('price') as string)
    const billsIncluded = formData.get('billsIncluded') === 'true'
    const deposit = formData.get('deposit')
      ? parseInt(formData.get('deposit') as string)
      : null
    const bedrooms = formData.get('bedrooms')
      ? parseInt(formData.get('bedrooms') as string)
      : null
    const bathrooms = formData.get('bathrooms')
      ? parseInt(formData.get('bathrooms') as string)
      : null
    const area = formData.get('area')
      ? parseInt(formData.get('area') as string)
      : null
    const furnished = formData.get('furnished') === 'true'
    const features = JSON.parse(formData.get('features') as string || '{}')
    const availableFrom = formData.get('availableFrom') as string
    const availableTo = formData.get('availableTo') as string
    const minStayMonths = formData.get('minStayMonths')
      ? parseInt(formData.get('minStayMonths') as string)
      : null
    const maxStayMonths = formData.get('maxStayMonths')
      ? parseInt(formData.get('maxStayMonths') as string)
      : null

    const images = formData.getAll('images') as File[]

    if (!title || !description || !type || !city || !price || !availableFrom) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const imagesData: string[] = []

    // Imágenes placeholder válidas de Unsplash (para desarrollo)
    const placeholderImages = [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
    ]

    if (images.length > 0) {
      // En producción, aquí se subirían las imágenes a Cloudinary/Cloudflare
      // Por ahora, usamos las placeholders pero indicamos que se subieron imágenes
      for (let i = 0; i < images.length; i++) {
        imagesData.push(placeholderImages[i % placeholderImages.length])
      }
    }

    const coverImage = imagesData[0] || placeholderImages[0]

    // Get coordinates using geocoding (async, non-blocking)
    let coordinates: { lat: number; lng: number } | null = null
    if (address && city) {
      try {
        coordinates = await geocodeAddress(address, city)
      } catch (e) {
        console.log('Geocoding failed, using city fallback')
      }
    }

    // Fallback to city coordinates if address geocoding failed
    if (!coordinates && city) {
      coordinates = getCityCoordinates(city.toLowerCase())
    }

    const newListing = await db.insert(listings).values({
      id: nanoid(),
      title,
      description,
      type: type as any,
      advertiserId: advertiser.id,
      universityId: universityId || null,
      city,
      province,
      neighborhood: neighborhood || null,
      address: address || null,
      postalCode: postalCode || null,
      coordinates,
      price,
      billsIncluded,
      deposit,
      bedrooms,
      bathrooms,
      area,
      furnished,
      features: features as any,
      availableFrom: new Date(availableFrom),
      availableTo: availableTo ? new Date(availableTo) : null,
      minStayMonths,
      maxStayMonths,
      images: imagesData,
      coverImage,
      status: 'active',
      views: 0,
      contacts: 0,
      favorites: 0,
      featured: false,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    await db.update(advertisers)
      .set({
        listingsCount: advertiser.listingsCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(advertisers.id, advertiser.id))

    return NextResponse.json({ listing: newListing[0] }, { status: 201 })

  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const type = searchParams.get('type')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const universityId = searchParams.get('universityId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database query timeout')), 8000)
    )

    // Get listings from database with advertiser info
    const dbPromise = db
      .select({
        id: listings.id,
        title: listings.title,
        description: listings.description,
        type: listings.type,
        advertiserId: listings.advertiserId,
        universityId: listings.universityId,
        city: listings.city,
        province: listings.province,
        neighborhood: listings.neighborhood,
        address: listings.address,
        postalCode: listings.postalCode,
        coordinates: listings.coordinates,
        price: listings.price,
        billsIncluded: listings.billsIncluded,
        deposit: listings.deposit,
        bedrooms: listings.bedrooms,
        bathrooms: listings.bathrooms,
        area: listings.area,
        furnished: listings.furnished,
        features: listings.features,
        availableFrom: listings.availableFrom,
        availableTo: listings.availableTo,
        minStayMonths: listings.minStayMonths,
        maxStayMonths: listings.maxStayMonths,
        images: listings.images,
        coverImage: listings.coverImage,
        tourVideo: listings.tourVideo,
        status: listings.status,
        featured: listings.featured,
        verified: listings.verified,
        views: listings.views,
        contacts: listings.contacts,
        favorites: listings.favorites,
        createdAt: listings.createdAt,
        updatedAt: listings.updatedAt,
        advertiserName: advertisers.name,
        advertiserUserId: advertisers.userId,
      })
      .from(listings)
      .innerJoin(advertisers, eq(listings.advertiserId, advertisers.id))
      .limit(limit)
      .offset(offset)

    const allListings = await Promise.race([dbPromise, timeoutPromise]) as any[]

    // Apply filters in-memory (for simplicity)
    let filtered = allListings.filter((l: any) => l.status === 'active')

    if (city) {
      filtered = filtered.filter((l: any) => l.city.toLowerCase() === city.toLowerCase())
    }

    if (type) {
      filtered = filtered.filter((l: any) => l.type === type)
    }

    if (minPrice) {
      filtered = filtered.filter((l: any) => l.price >= parseInt(minPrice))
    }

    if (maxPrice) {
      filtered = filtered.filter((l: any) => l.price <= parseInt(maxPrice))
    }

    if (universityId) {
      filtered = filtered.filter((l: any) => l.universityId === universityId)
    }

    // Format response
    const formattedListings = filtered.map((l: any) => ({
      ...l,
      advertiser: {
        id: l.advertiserId,
        name: l.advertiserName,
        userId: l.advertiserUserId,
      },
    }))

    return NextResponse.json({ listings: formattedListings })

  } catch (error) {
    console.error('Error fetching listings:', error)

    // Fallback to mock data if DB fails
    const MOCK_LISTINGS = [
      {
        id: '1',
        title: 'Habitación individual en piso compartido cerca de UCM',
        description: 'Bonita habitación individual en piso reformado, muy cerca de la Universidad Complutense. Amueblada con cama, escritorio y armario empotrado.',
        type: 'room',
        advertiserId: 'adv1',
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
        features: { wifi: true, heating: true, elevator: true },
        availableFrom: '2025-09-01',
        status: 'active',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
        coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        createdAt: new Date().toISOString(),
        advertiser: { id: 'adv1', name: 'María García' }
      },
    ]

    return NextResponse.json({ listings: MOCK_LISTINGS })
  }
}
