'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, ArrowLeft, MapPin, Home, Euro, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { ListingCard } from '@/components/marketplace/listing-card'

interface Favorite {
  id: string
  listingId: string
  createdAt: Date
  listing: {
    id: string
    title: string
    type: string
    city: string
    province: string
    price: number
    billsIncluded: boolean
    coverImage: string
    bedrooms: number | null
    bathrooms: number | null
    area: number | null
    advertiser: {
      id: string
      name: string
    }
  }
}

export default function FavoritosPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchFavorites()
    }
  }, [isAuthenticated, user])

  const fetchFavorites = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/favorites')

      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites || [])
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFavorite = async (listingId: string) => {
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      })

      setFavorites((prev) => prev.filter((f) => f.listingId !== listingId))
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Mis Favoritos</h1>
              <p className="text-gray-600">
                {favorites.length} alojamiento{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Aún no tienes favoritos
              </h3>
              <p className="text-gray-600 mb-6">
                Guarda los alojamientos que te interesen para encontrarlos fácilmente más tarde.
              </p>
              <Link href="/buscar">
                <Button>
                  <Home className="h-4 w-4 mr-2" />
                  Buscar alojamientos
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="relative">
                <button
                  onClick={() => handleRemoveFavorite(favorite.listingId)}
                  className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  title="Eliminar de favoritos"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
                <ListingCard
                  listing={{
                    ...favorite.listing,
                    status: 'active',
                    views: 0,
                    contacts: 0,
                    favorites: 0,
                    featured: false,
                    verified: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }}
                  isFavorite={true}
                  onToggleFavorite={() => handleRemoveFavorite(favorite.listingId)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
