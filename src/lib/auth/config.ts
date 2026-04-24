import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// Solo importar DB si está disponible
let db: any
let users: any
let eq: any

try {
  if (process.env.DATABASE_URL) {
    const dbModule = require('@/lib/db')
    db = dbModule.db
    users = dbModule.users
    const drizzleModule = require('drizzle-orm')
    eq = drizzleModule.eq
  }
} catch (e) {
  console.warn('DB not available for auth')
}

export const authConfig: NextAuthConfig = {
  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),

    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        if (!db || !users || !eq) {
          console.warn('DB not available - auth check skipped')
          return null
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1)

        if (!user[0]) {
          return null
        }

        if (!user[0].password) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user[0].password
        )

        if (!isValid) {
          return null
        }

        return {
          id: user[0].id,
          email: user[0].email,
          name: user[0].name,
          image: user[0].image,
          role: user[0].role,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session }
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'student' | 'advertiser' | 'admin'
      }
      return session
    },
  },
}
