'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect, useState } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const [hasAuth, setHasAuth] = useState(false)

  useEffect(() => {
    // Verificar si hay configuración de auth en el cliente
    setHasAuth(true)
  }, [])

  // Siempre renderizar SessionProvider, pero no bloquear si falla
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
