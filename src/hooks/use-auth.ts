'use client'

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import type { User } from '@/types'

export function useAuth() {
  const { data: session, status, update } = useSession()

  const user: User | null = useMemo(() => {
    if (!session?.user) return null

    return {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.name || '',
      role: session.user.role,
      avatar: session.user.image || undefined,
      verified: false,
      createdAt: session.user.createdAt || new Date(),
      updatedAt: session.user.updatedAt || new Date(),
    }
  }, [session])

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Error updating profile')
      }

      await update({ ...session?.user, ...data })
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  return {
    user,
    loading: status === 'loading',
    isAuthenticated: !!user,
    role: user?.role,
    updateProfile,
  }
}
