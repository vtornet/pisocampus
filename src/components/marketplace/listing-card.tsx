'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, MapPin, Home, Bed, Bath, Square } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

export interface Listing {
  id: string
  title: string
  type: 'room' | 'apartment' | 'studio' | 'shared'
  price: number
  city: string
  province?: string
  neighborhood?: string
  address?: string
  coordinates?: { lat: number; lng: number } | null
  bedrooms?: number | null
  bathrooms?: number | null
  area?: number | null
  images: string[]
  coverImage: string
  featured?: boolean
  verified?: boolean
  billsIncluded?: boolean
  furnished?: boolean
  features?: Record<string, boolean>
  status: 'active' | 'inactive' | 'rented'
  views: number
  contacts: number
  favorites: number
  createdAt: Date
  updatedAt: Date
}

interface ListingCardProps {
  listing: Listing
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

const typeLabels = {
  room: 'Habitación',
  apartment: 'Piso completo',
  studio: 'Estudio',
  shared: 'Compartir',
}

export function ListingCard({ listing, isFavorite = false, onToggleFavorite }: ListingCardProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [favoriteState, setFavoriteState] = useState(isFavorite)
  const [isLoading, setIsLoading] = useState(false)

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (onToggleFavorite) {
      onToggleFavorite()
      return
    }

    if (isLoading) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id }),
      })

      if (response.ok) {
        const data = await response.json()
        setFavoriteState(data.favorited)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const images = listing.images?.length > 0 ? listing.images : [listing.coverImage]

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
        listing.featured ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => router.push(`/anuncio/${listing.id}`)}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[0]}
            alt={listing.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {listing.featured && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              Destacado
            </span>
          )}
          {listing.verified && (
            <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
              ✓ Verificado
            </span>
          )}
          {listing.status === 'rented' && (
            <span className="px-2 py-1 bg-gray-600 text-white text-xs font-medium rounded-full">
              Alquilado
            </span>
          )}
          <span className="px-2 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded-full">
            {typeLabels[listing.type]}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow transition-colors z-10 disabled:opacity-50"
          title={favoriteState ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart
            className={`h-5 w-5 ${favoriteState ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
      </div>

      {/* Content */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg line-clamp-1 hover:text-blue-600 transition-colors">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="line-clamp-1">
                {listing.city}
                {listing.neighborhood && `, ${listing.neighborhood}`}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xl font-bold text-blue-600">
              {listing.price}€
            </div>
            <div className="text-xs text-gray-500">/mes</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Features */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          {listing.bedrooms !== undefined && listing.bedrooms !== null && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'hab' : 'habs'}</span>
            </div>
          )}
          {listing.bathrooms !== undefined && listing.bathrooms !== null && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'baño' : 'baños'}</span>
            </div>
          )}
          {listing.area && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{listing.area}m²</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-2 mt-3">
          {listing.furnished && (
            <span className="px-2 py-1 border border-gray-200 text-gray-600 text-xs rounded-full">
              Amueblado
            </span>
          )}
          {listing.billsIncluded && (
            <span className="px-2 py-1 border border-gray-200 text-gray-600 text-xs rounded-full">
              Facturas incluidas
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full">
          Ver detalles
        </Button>
      </CardFooter>
    </Card>
  )
}
