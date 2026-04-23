import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { conversations, conversationParticipants, users, messages, listings } from '@/lib/db/schema'
import { eq, and, desc, or } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const userConversations = await db.query.conversations.findMany({
      where: or(
        eq(conversationParticipants.userId, userId)
      ),
      orderBy: [desc(conversations.updatedAt)],
      with: {
        messages: {
          orderBy: [desc(messages.createdAt)],
          limit: 1,
          with: {
            sender: {
              columns: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    const conversationsWithParticipants = await Promise.all(
      userConversations.map(async (conv) => {
        const participants = await db.query.conversationParticipants.findMany({
          where: eq(conversationParticipants.conversationId, conv.id),
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                image: true,
                email: true,
              },
            },
          },
        })

        const otherUser = participants.find(p => p.user.id !== userId)
        const lastRead = participants.find(p => p.user.id === userId)?.lastReadAt

        const unreadCount = await db
          .select({ count: messages.id })
          .from(messages)
          .where(
            and(
              eq(messages.conversationId, conv.id),
              eq(messages.read, false),
              eq(messages.senderId, otherUser?.user.id || '')
            )
          )
          .then((result) => result.length)

        let listing = null
        if (conv.listingId) {
          listing = await db.query.listings.findFirst({
            where: eq(listings.id, conv.listingId),
            columns: {
              id: true,
              title: true,
              city: true,
              type: true,
              price: true,
              coverImage: true,
            },
          })
        }

        return {
          ...conv,
          otherUser: otherUser?.user || null,
          lastReadAt: lastRead || null,
          unreadCount,
          listing,
        }
      })
    )

    return NextResponse.json({ conversations: conversationsWithParticipants })

  } catch (error) {
    console.error('Error fetching conversations:', error)
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
    const { recipientId, listingId } = body

    if (!recipientId) {
      return NextResponse.json(
        { error: 'recipientId is required' },
        { status: 400 }
      )
    }

    const existingConversation = await db.query.conversationParticipants.findFirst({
      where: eq(conversationParticipants.userId, userId),
    })

    const otherParticipant = await db.query.conversationParticipants.findFirst({
      where: eq(conversationParticipants.userId, recipientId),
    })

    let conversationId = nanoid()

    if (existingConversation && otherParticipant) {
      const allParticipants = await db.query.conversationParticipants.findMany()
      const userConvs = allParticipants.filter(p => p.userId === userId).map(p => p.conversationId)
      const recipientConvs = allParticipants.filter(p => p.userId === recipientId).map(p => p.conversationId)

      const commonConv = userConvs.filter(id => recipientConvs.includes(id))[0]

      if (commonConv) {
        const conversation = await db.query.conversations.findFirst({
          where: eq(conversations.id, commonConv),
        })

        return NextResponse.json({ conversation }, { status: 200 })
      }
    }

    await db.insert(conversations).values({
      id: conversationId,
      listingId: listingId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await db.insert(conversationParticipants).values([
      {
        conversationId,
        userId: userId,
        lastReadAt: new Date(),
      },
      {
        conversationId,
        userId: recipientId,
      },
    ])

    const newConversation = await db.query.conversations.findFirst({
      where: eq(conversations.id, conversationId),
    })

    return NextResponse.json({ conversation: newConversation }, { status: 201 })

  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
