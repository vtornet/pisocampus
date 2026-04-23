'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReviewCard } from '@/components/reviews/review-card'
import { ReviewSummary } from '@/components/reviews/review-summary'
import { ReviewForm } from '@/components/reviews/review-form'
import { ListingMap } from '@/components/maps/listing-map'
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Check,
  Heart,
  Share2,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

interface Listing {
  id: string
  title: string
  type: 'room' | 'apartment' | 'studio' | 'shared'
  price: number
  city: string
  province?: string
  neighborhood?: string
  address?: string
  postalCode?: string
  bedrooms?: number | null
  bathrooms?: number | null
  area?: number | null
  description: string
  images: string[]
  coverImage: string
  features?: {
    wifi?: boolean
    heating?: boolean
    airConditioning?: boolean
    balcony?: boolean
    terrace?: boolean
    elevator?: boolean
    parking?: boolean
    smoking?: boolean
    pets?: boolean
    couples?: boolean
    desk?: boolean
    wardrobe?: boolean
  }
  billsIncluded?: boolean
  furnished?: boolean
  availableFrom: Date
  availableTo?: Date | null
  minStayMonths?: number | null
  maxStayMonths?: number | null
  universityId?: string | null
  status: 'active' | 'inactive' | 'rented'
  verified?: boolean
  featured?: boolean
  views: number
  contacts: number
  favorites: number
  createdAt: Date
  updatedAt: Date
  advertiser?: {
    id: string
    userId: string
    name: string
    type: string
    verified: boolean
    averageRating?: string
    totalReviews?: number
  }
}

interface Review {
  id: string
  rating: number
  title: string
  comment: string
  verified: boolean
  createdAt: Date
  user: {
    id: string
    name: string
    image?: string | null
  }
}

const typeLabels = {
  room: 'Habitación',
  apartment: 'Piso completo',
  studio: 'Estudio',
  shared: 'Compartir piso',
}

const featureLabels: Record<string, string> = {
  wifi: 'Wifi',
  heating: 'Calefacción',
  airConditioning: 'Aire acondicionado',
  balcony: 'Balcón',
  terrace: 'Terraza',
  elevator: 'Ascensor',
  parking: 'Parking',
  smoking: 'Se permite fumar',
  pets: 'Se permiten mascotas',
  couples: 'Se permiten parejas',
  desk: 'Escritorio',
  wardrobe: 'Armario',
}

export default function AnuncioPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  const [listing, setListing] = useState<Listing | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewData, setReviewData] = useState<{
    averageRating: string
    totalReviews: number
    distribution: { 5: number; 4: number; 3: number; 2: number; 1: number }
  } | null>(null)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchListing()
      fetchReviews()
    }
  }, [params.id])

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/listings?limit=100`)
      if (response.ok) {
        const data = await response.json()
        const found = data.listings?.find((l: Listing) => l.id === params.id)
        if (found) {
          setListing(found)
        } else {
          setListing(null)
        }
      }
    } catch (error) {
      console.error('Error fetching listing:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/listings/${params.id}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
        setReviewData({
          averageRating: data.averageRating || '0.0',
          totalReviews: data.totalReviews || 0,
          distribution: data.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        })
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: params.id }),
      })
      setIsFavorited(!isFavorited)
      if (listing) {
        setListing({
          ...listing,
          favorites: isFavorited ? listing.favorites - 1 : listing.favorites + 1,
        })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Create conversation and send message
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: listing?.advertiser?.userId,
          listingId: params.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/dashboard/mensajes/${data.conversation.id}`)
      } else {
        alert('Error al iniciar conversación')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">Anuncio no encontrado</p>
            <Link href="/buscar">
              <Button>Volver a la búsqueda</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const images = listing.images?.length > 0 ? listing.images : [listing.coverImage]
  const features = listing.features || {}

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/buscar"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la búsqueda
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-[16/10] bg-gray-200 overflow-hidden">
                    <img
                      src={images[currentImageIndex]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  <div className="absolute top-4 left-4 flex gap-2">
                    {listing.verified && (
                      <Badge className="bg-green-600">Verificado</Badge>
                    )}
                    <Badge>{typeLabels[listing.type]}</Badge>
                  </div>

                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={handleToggleFavorite}
                      className="p-2 bg-white/90 hover:bg-white rounded-full shadow transition-colors"
                    >
                      <Heart
                        className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                      />
                    </button>
                    <button className="p-2 bg-white/90 hover:bg-white rounded-full shadow transition-colors">
                      <Share2 className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex ? 'border-blue-600' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${listing.title} - Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Title & Location */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {listing.city}
                          {listing.neighborhood && `, ${listing.neighborhood}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {listing.price}€
                    </div>
                    <div className="text-sm text-gray-500">/mes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Características</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {listing.bedrooms !== null && listing.bedrooms !== undefined && (
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-gray-500" />
                      <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'habitación' : 'habitaciones'}</span>
                    </div>
                  )}
                  {listing.bathrooms !== null && listing.bathrooms !== undefined && (
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-gray-500" />
                      <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'baño' : 'baños'}</span>
                    </div>
                  )}
                  {listing.area && (
                    <div className="flex items-center gap-2">
                      <Square className="h-5 w-5 text-gray-500" />
                      <span>{listing.area}m²</span>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold mb-3">Servicios y características</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(features).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      {value ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="h-4 w-4 border border-gray-300 rounded-sm" />
                      )}
                      <span className="text-sm">{featureLabels[key]}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {listing.billsIncluded && (
                    <Badge variant="outline" className="text-sm">
                      Facturas incluidas
                    </Badge>
                  )}
                  {listing.furnished && (
                    <Badge variant="outline" className="text-sm">
                      Amueblado
                    </Badge>
                  )}
                  {listing.minStayMonths && (
                    <Badge variant="outline" className="text-sm">
                      Mín. {listing.minStayMonths} meses
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Disponibilidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Disponible desde el{' '}
                  <strong>
                    {new Date(listing.availableFrom).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </strong>
                </p>
                {listing.availableTo && (
                  <p className="text-gray-700 mt-1">
                    Hasta el{' '}
                    <strong>
                      {new Date(listing.availableTo).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </strong>
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                {listing.address && (
                  <p className="text-gray-700 mb-4">{listing.address}</p>
                )}
                <div className="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
                  <ListingMap
                    center={{ lat: 40.4168, lng: -3.7038 }}
                    zoom={15}
                    className="h-full w-full"
                    markers={[
                      {
                        id: listing.id,
                        title: listing.title,
                        price: listing.price,
                        type: listing.type,
                        coordinates: { lat: 40.4168, lng: -3.7038 },
                        coverImage: listing.coverImage,
                      },
                    ]}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Ubicación aproximada - La dirección exacta se muestra tras contactar
                </p>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Valoraciones</h2>
                {isAuthenticated && !showReviewForm && (
                  <Button onClick={() => setShowReviewForm(true)}>
                    Escribir valoración
                  </Button>
                )}
              </div>

              {reviewData && reviewData.totalReviews > 0 && (
                <ReviewSummary
                  averageRating={reviewData.averageRating}
                  totalReviews={reviewData.totalReviews}
                  distribution={reviewData.distribution}
                />
              )}

              {showReviewForm ? (
                <ReviewForm
                  listingId={listing.id}
                  onSubmitSuccess={() => {
                    setShowReviewForm(false)
                    fetchReviews()
                  }}
                />
              ) : (
                <>
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.slice(0, 5).map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                      {reviews.length > 5 && (
                        <Button variant="outline" className="w-full">
                          Ver {reviews.length - 5} valoraciones más
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center text-gray-500">
                        <p>Aún no hay valoraciones para este alojamiento.</p>
                        <p className="text-sm mt-1">Sé el primero en dejar tu opinión.</p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Contactar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {listing.advertiser && (
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                      {listing.advertiser.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{listing.advertiser.name}</h3>
                      {listing.advertiser.verified && (
                        <Badge variant="outline" className="text-xs mt-1">
                          ✓ Verificado
                        </Badge>
                      )}
                      {listing.advertiser.averageRating && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-sm font-medium">
                            {listing.advertiser.averageRating} ★
                          </span>
                          {listing.advertiser.totalReviews && (
                            <span className="text-sm text-gray-500">
                              ({listing.advertiser.totalReviews} opiniones)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {formSubmitted ? (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">
                    <Check className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-medium">¡Mensaje enviado!</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    {!isAuthenticated && (
                      <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
                        Inicia sesión para contactar con el anfitrión
                      </p>
                    )}
                    <Button type="submit" className="w-full" disabled={!isAuthenticated}>
                      <Mail className="h-4 w-4 mr-2" />
                      {isAuthenticated ? 'Enviar mensaje' : 'Iniciar sesión'}
                    </Button>
                  </form>
                )}

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Vistas</span>
                    <span>{listing.views}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Contactos</span>
                    <span>{listing.contacts}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Favoritos</span>
                    <span>{listing.favorites}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  Consejos de seguridad
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Verifica el alojamiento antes de pagar</li>
                  <li>• No envíes dinero sin ver el piso</li>
                  <li>• Comunícate a través de la plataforma</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
