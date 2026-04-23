import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { alerts } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const userAlerts = await db.query.alerts.findMany({
      where: eq(alerts.userId, userId),
      orderBy: [desc(alerts.createdAt)],
    })

    return NextResponse.json({ alerts: userAlerts })

  } catch (error) {
    console.error('Error fetching alerts:', error)
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
    const { name, filters, frequency = 'instant' } = body

    if (!name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      )
    }

    if (!filters || typeof filters !== 'object') {
      return NextResponse.json(
        { error: 'filters is required' },
        { status: 400 }
      )
    }

    const newAlert = await db.insert(alerts).values({
      id: nanoid(),
      userId,
      name,
      filters,
      frequency,
      active: true,
      createdAt: new Date(),
    }).returning()

    return NextResponse.json({ alert: newAlert[0] }, { status: 201 })

  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
