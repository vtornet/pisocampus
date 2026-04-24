'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Search, LogOut, Settings, User, LayoutDashboard } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export function Navbar() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Evitar hydratación mismatch - mostrar estado por defecto en SSR
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="PisoCampus" className="h-10 w-10 object-contain" />
            <span className="hidden font-bold sm:inline-block">
              <span className="text-blue-600">Piso</span><span className="text-green-600">Campus</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/buscar" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">Buscar</Link>
            <Link href="/tablon" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">Tablón</Link>
            <Link href="/universidades" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">Universidades</Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Link href="/login"><Button variant="ghost" size="sm">Entrar</Button></Link>
            <Link href="/registro"><Button size="sm">Registrarse</Button></Link>
          </div>
        </div>
      </header>
    )
  }

  const userInitials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const isAuthenticated = status === 'authenticated' && session?.user

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="PisoCampus" className="h-10 w-10 object-contain" />
          <span className="hidden font-bold sm:inline-block">
            <span className="text-blue-600">Piso</span><span className="text-green-600">Campus</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/buscar" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">Buscar</Link>
          <Link href="/tablon" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">Tablón</Link>
          <Link href="/universidades" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">Universidades</Link>
        </nav>

        <div className="flex items-center space-x-2">
          <Link href="/buscar">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>
          </Link>

          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={() => router.push('/api/auth/signout')}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link href="/registro">
                <Button size="sm">Registrarse</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
