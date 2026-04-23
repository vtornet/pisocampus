import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { listings, advertisers } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { id: listingId } = await params

    const advertiser = await db.query.advertisers.findFirst({
      where: eq(advertisers.userId, userId),
    })

    if (!advertiser) {
      return NextResponse.json(
        { error: 'Advertiser profile not found' },
        { status: 404 }
      )
    }

    const listing = await db.query.listings.findFirst({
      where: and(
        eq(listings.id, listingId),
        eq(listings.advertiserId, advertiser.id)
      ),
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ listing })

  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { id: listingId } = await params
    const body = await request.json()

    const advertiser = await db.query.advertisers.findFirst({
      where: eq(advertisers.userId, userId),
    })

    if (!advertiser) {
      return NextResponse.json(
        { error: 'Advertiser profile not found' },
        { status: 404 }
      )
    }

    const existingListing = await db.query.listings.findFirst({
      where: and(
        eq(listings.id, listingId),
        eq(listings.advertiserId, advertiser.id)
      ),
    })

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    const allowedUpdates = [
      'title', 'description', 'type', 'city', 'province', 'neighborhood',
      'address', 'postalCode', 'price', 'billsIncluded', 'deposit',
      'bedrooms', 'bathrooms', 'area', 'furnished', 'features',
      'availableFrom', 'availableTo', 'minStayMonths', 'maxStayMonths',
      'status', 'images', 'coverImage'
    ]

    const updates: Record<string, any> = {}
    for (const key of allowedUpdates) {
      if (key in body) {
        if (key === 'availableFrom' || key === 'availableTo') {
          updates[key] = body[key] ? new Date(body[key]) : null
        } else {
          updates[key] = body[key]
        }
      }
    }

    updates.updatedAt = new Date()

    const updatedListing = await db.update(listings)
      .set(updates)
      .where(eq(listings.id, listingId))
      .returning()

    return NextResponse.json({ listing: updatedListing[0] })

  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { id: listingId } = await params

    const advertiser = await db.query.advertisers.findFirst({
      where: eq(advertisers.userId, userId),
    })

    if (!advertiser) {
      return NextResponse.json(
        { error: 'Advertiser profile not found' },
        { status: 404 }
      )
    }

    const existingListing = await db.query.listings.findFirst({
      where: and(
        eq(listings.id, listingId),
        eq(listings.advertiserId, advertiser.id)
      ),
    })

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    await db.delete(listings)
      .where(eq(listings.id, listingId))

    await db.update(advertisers)
      .set({
        listingsCount: Math.max(0, advertiser.listingsCount - 1),
        updatedAt: new Date(),
      })
      .where(eq(advertisers.id, advertiser.id))

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
