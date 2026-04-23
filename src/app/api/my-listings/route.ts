import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { listings, advertisers, messages } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
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

    const advertiserListings = await db.query.listings.findMany({
      where: eq(listings.advertiserId, advertiser.id),
      orderBy: [desc(listings.createdAt)],
      with: {
        advertiser: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    })

    const listingsWithStats = await Promise.all(
      advertiserListings.map(async (listing) => {
        const unreadMessages = await db.query.messages.findMany({
          where: eq(messages.conversationId, listing.id),
        })

        return {
          ...listing,
          unreadMessages: unreadMessages.filter((m) => !m.read).length,
        }
      })
    )

    return NextResponse.json({ listings: listingsWithStats })

  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
