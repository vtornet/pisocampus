import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { messages, conversationParticipants, conversations } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { nanoid } from 'nanoid'

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
    const { id: conversationId } = await params

    const participant = await db.query.conversationParticipants.findFirst({
      where: and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      ),
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Not a participant of this conversation' },
        { status: 403 }
      )
    }

    const conversationMessages = await db.query.messages.findMany({
      where: eq(messages.conversationId, conversationId),
      orderBy: [desc(messages.createdAt)],
      with: {
        sender: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ messages: conversationMessages.reverse() })

  } catch (error) {
    console.error('Error fetching messages:', error)
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
    const { id: conversationId } = await params
    const body = await request.json()
    const { content } = body

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const participant = await db.query.conversationParticipants.findFirst({
      where: and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      ),
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Not a participant of this conversation' },
        { status: 403 }
      )
    }

    const newMessage = await db.insert(messages).values({
      id: nanoid(),
      conversationId,
      senderId: userId,
      content: content.trim(),
      read: false,
      createdAt: new Date(),
    }).returning()

    await db.update(conversations)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, conversationId))

    await db.update(conversationParticipants)
      .set({
        lastReadAt: new Date(),
      })
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, userId)
        )
      )

    const messageWithSender = await db.query.messages.findFirst({
      where: eq(messages.id, newMessage[0].id),
      with: {
        sender: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ message: messageWithSender }, { status: 201 })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
