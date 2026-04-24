import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authConfig: NextAuthConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Import estático
          const { db } = require('@/lib/db')
          const { users } = require('@/lib/db/schema')
          const { eq } = require('drizzle-orm')

          if (!db) {
            console.error('Auth: DB not available')
            return null
          }

          const result = await db
            .select({
              id: users.id,
              email: users.email,
              name: users.name,
              image: users.image,
              password: users.password,
              role: users.role,
            })
            .from(users)
            .where(eq(users.email, credentials.email as string))
            .limit(1)

          const user = result[0]
          if (!user) {
            return null
          }

          if (!user.password) {
            return null
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          console.error('Auth authorize error:', error)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'student' | 'advertiser' | 'admin'
      }
      return session
    },
  },

  debug: process.env.NODE_ENV === 'development',
}
