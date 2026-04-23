import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'student' | 'advertiser' | 'admin'
    } & DefaultSession['user']
  }

  interface User {
    role?: 'student' | 'advertiser' | 'admin'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'student' | 'advertiser' | 'admin'
  }
}
