import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { favorites, listings } from '@/lib/db/schema'
import { eq, and, desc, sql } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const userFavorites = await db.query.favorites.findMany({
      where: eq(favorites.userId, userId),
      orderBy: [desc(favorites.createdAt)],
      with: {
        listing: {
          with: {
            advertiser: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ favorites: userFavorites })

  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { listingId } = body

    if (!listingId) {
      return NextResponse.json(
        { error: 'listingId is required' },
        { status: 400 }
      )
    }

    const existingFavorite = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, userId),
        eq(favorites.listingId, listingId)
      ),
    })

    if (existingFavorite) {
      await db.delete(favorites)
        .where(eq(favorites.id, existingFavorite.id))

      await db.update(listings)
        .set({
          favorites: sql`${listings.favorites} - 1`,
        })
        .where(eq(listings.id, listingId))

      return NextResponse.json({ favorited: false })
    }

    await db.insert(favorites).values({
      id: nanoid(),
      userId,
      listingId,
      createdAt: new Date(),
    })

    await db.update(listings)
      .set({
        favorites: sql`${listings.favorites} + 1`,
      })
      .where(eq(listings.id, listingId))

    return NextResponse.json({ favorited: true }, { status: 201 })

  } catch (error) {
    console.error('Error toggling favorite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
