import { handlers } from '@/lib/auth'
import { NextRequest } from 'next/server'

// Wrapper para manejar errores y evitar 500
export const GET = async (req: NextRequest) => {
  try {
    return await handlers.GET(req)
  } catch (error) {
    console.error('Auth handler error:', error)
    // Devolver una sesión vacía en lugar de error 500
    return new Response(JSON.stringify({ session: null, user: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    return await handlers.POST(req)
  } catch (error) {
    console.error('Auth handler error:', error)
    return new Response(JSON.stringify({ error: 'Auth configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
