import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { alerts } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

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
    const { id: alertId } = await params
    const body = await request.json()

    const existingAlert = await db.query.alerts.findFirst({
      where: and(
        eq(alerts.id, alertId),
        eq(alerts.userId, userId)
      ),
    })

    if (!existingAlert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      )
    }

    const allowedUpdates = ['active', 'name', 'filters', 'frequency']

    const updates: Record<string, any> = {}
    for (const key of allowedUpdates) {
      if (key in body) {
        updates[key] = body[key]
      }
    }

    const updatedAlert = await db.update(alerts)
      .set(updates)
      .where(eq(alerts.id, alertId))
      .returning()

    return NextResponse.json({ alert: updatedAlert[0] })

  } catch (error) {
    console.error('Error updating alert:', error)
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
    const { id: alertId } = await params

    const existingAlert = await db.query.alerts.findFirst({
      where: and(
        eq(alerts.id, alertId),
        eq(alerts.userId, userId)
      ),
    })

    if (!existingAlert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      )
    }

    await db.delete(alerts)
      .where(eq(alerts.id, alertId))

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting alert:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
