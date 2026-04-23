import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { reviews, listings, advertisers, users, conversations, conversationParticipants } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listingId } = await params

    // Verificar si la tabla existe antes de consultar
    // Si no existe, devolver respuesta vacía (sin error)
    try {
      const listingReviews = await db.query.reviews.findMany({
        where: eq(reviews.listingId, listingId),
        orderBy: [desc(reviews.createdAt)],
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })

      // Calculate average rating
      const totalRating = listingReviews.reduce((sum, r) => sum + r.rating, 0)
      const averageRating = listingReviews.length > 0
        ? (totalRating / listingReviews.length).toFixed(1)
        : '0.0'

      // Rating distribution
      const distribution = {
        5: listingReviews.filter(r => r.rating === 5).length,
        4: listingReviews.filter(r => r.rating === 4).length,
        3: listingReviews.filter(r => r.rating === 3).length,
        2: listingReviews.filter(r => r.rating === 2).length,
        1: listingReviews.filter(r => r.rating === 1).length,
      }

      return NextResponse.json({
        reviews: listingReviews,
        averageRating,
        totalReviews: listingReviews.length,
        distribution,
      })
    } catch (dbError: any) {
      // Si la tabla no existe o hay error de BD, devolver vacío sin error 500
      if (dbError.code === '42P01' || dbError.message?.includes('does not exist')) {
        return NextResponse.json({
          reviews: [],
          averageRating: '0.0',
          totalReviews: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        })
      }
      throw dbError
    }

  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
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
    const { rating, title, comment } = body

    if (!rating || !title || !comment) {
      return NextResponse.json(
        { error: 'rating, title, and comment are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if user already reviewed this listing
    const existingReview = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.listingId, listingId),
        eq(reviews.userId, userId)
      ),
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Ya has valorado este anuncio anteriormente' },
        { status: 400 }
      )
    }

    // Check if user has contacted the advertiser (to prevent fake reviews)
    // Find conversations for this listing where user is a participant
    const listingConversations = await db.query.conversations.findMany({
      where: eq(conversations.listingId, listingId),
      with: {
        participants: true,
      },
    })

    // Check if user is participant in any conversation about this listing
    const hasContacted = listingConversations.some(conv =>
      conv.participants.some(p => p.userId === userId)
    )

    if (!hasContacted) {
      return NextResponse.json(
        { error: 'Debes haber contactado con el anunciante antes de poder valorar' },
        { status: 403 }
      )
    }

    // Get listing info to find advertiser
    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, listingId),
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Create review (verified if user has contacted the advertiser)
    const newReview = await db.insert(reviews).values({
      id: nanoid(),
      listingId,
      userId,
      advertiserId: listing.advertiserId,
      rating,
      title,
      comment,
      verified: true, // Verified because user has contacted the advertiser
      createdAt: new Date(),
    }).returning()

    // Update advertiser average rating
    const allReviews = await db.query.reviews.findMany({
      where: eq(reviews.advertiserId, listing.advertiserId),
    })

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0)
    const averageRating = totalRating / allReviews.length

    await db.update(advertisers)
      .set({
        averageRating: averageRating.toFixed(1),
        totalReviews: allReviews.length,
      })
      .where(eq(advertisers.id, listing.advertiserId))

    return NextResponse.json({ review: newReview[0] }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating review:', error)

    // Si la tabla no existe, devolver un error más informativo
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Reviews feature not available yet. Please run database migrations.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
