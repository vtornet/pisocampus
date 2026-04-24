import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL || ''

// Skip DB connection during build
if (!connectionString && typeof window === 'undefined') {
  console.warn('DATABASE_URL not set - DB operations will fail')
}

// Client para queries - aumentado max para permitir múltiples conexiones simultáneas
const queryClient = connectionString ? postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
}) : null as any

export const db = queryClient ? drizzle(queryClient, { schema }) : null as any
