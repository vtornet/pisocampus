'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ListingCard, Listing } from '@/components/marketplace/listing-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { SPANISH_CITIES, LISTING_TYPES, PRICE_RANGES, LISTING_FEATURES } from '@/lib/constants'

const ListingMap = dynamic(() => import('@/components/maps/listing-map').then(mod => ({ default: mod.ListingMap })), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-200 animate-pulse" />
})

import {
  Search,
  SlidersHorizontal,
  MapPin,
  GraduationCap,
  Euro,
  Home,
  X,
  ChevronDown,
  ChevronUp,
  List,
} from 'lucide-react'

export function BuscarContent() {
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(true)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  const [city, setCity] = useState('')
  const [university, setUniversity] = useState('')
  const [type, setType] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [bedrooms, setBedrooms] = useState('')
  const [billsIncluded, setBillsIncluded] = useState(false)
  const [furnished, setFurnished] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, boolean>>({})

  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const universityParam = searchParams.get('university')
    if (universityParam) {
      setUniversity(universityParam)
    }
    fetchListings(universityParam)
  }, [searchParams])

  const fetchListings = async (universityId?: string | null) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (city) params.append('city', city)
      if (type) params.append('type', type)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      if (universityId || university) params.append('universityId', universityId || university)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(`/api/listings?${params.toString()}`, {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        setListings(data.listings || [])
      } else {
        setListings([])
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
      setListings([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredListings = listings.filter((listing) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!listing.title.toLowerCase().includes(query) &&
          !listing.city.toLowerCase().includes(query) &&
          !listing.neighborhood?.toLowerCase().includes(query)) {
        return false
      }
    }

    if (bedrooms && listing.bedrooms !== parseInt(bedrooms)) return false
    if (billsIncluded && !listing.billsIncluded) return false
    if (furnished && !listing.furnished) return false

    if (Object.keys(selectedFeatures).some(k => selectedFeatures[k])) {
      const listingFeatures = listing.features as Record<string, boolean> | undefined
      for (const [feature, enabled] of Object.entries(selectedFeatures)) {
        if (enabled && (!listingFeatures || !listingFeatures[feature])) {
          return false
        }
      }
    }

    return true
  })

  const activeFilters = [
    city && { label: SPANISH_CITIES.find(c => c.value === city)?.label || city, value: 'city', onRemove: () => setCity('') },
    type && { label: LISTING_TYPES.find(t => t.value === type)?.label, value: 'type', onRemove: () => setType('') },
    minPrice && { label: `Desde ${minPrice}€`, value: 'minPrice', onRemove: () => setMinPrice('') },
    maxPrice && { label: `Hasta ${maxPrice}€`, value: 'maxPrice', onRemove: () => setMaxPrice('') },
    bedrooms && { label: `${bedrooms} hab.`, value: 'bedrooms', onRemove: () => setBedrooms('') },
    billsIncluded && { label: 'Facturas incluidas', value: 'billsIncluded', onRemove: () => setBillsIncluded(false) },
    furnished && { label: 'Amueblado', value: 'furnished', onRemove: () => setFurnished(false) },
  ].filter(Boolean) as Array<{ label: string; value: string; onRemove: () => void }>

  const clearAllFilters = () => {
    setCity('')
    setUniversity('')
    setType('')
    setMinPrice('')
    setMaxPrice('')
    setSearchQuery('')
    setBedrooms('')
    setBillsIncluded(false)
    setFurnished(false)
    setSelectedFeatures({})
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature],
    }))
  }

  const activeFeatureCount = Object.values(selectedFeatures).filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Buscar Alojamiento</h1>
              <p className="text-gray-600">
                {filteredListings.length} {filteredListings.length === 1 ? 'resultado' : 'resultados'}
                {activeFilters.length > 0 && ` para tu búsqueda`}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por ciudad, barrio o palabras clave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Filtros activos:</span>
              {activeFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={filter.onRemove}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                >
                  {filter.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
              {activeFeatureCount > 0 && (
                <span className="text-xs text-gray-500">
                  +{activeFeatureCount} característica{activeFeatureCount !== 1 ? 's' : ''}
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:underline"
              >
                Limpiar todos
              </button>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              Lista
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Mapa
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-80 flex-shrink-0`}>
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filtros
                  </h2>
                  {activeFilters.length > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Ciudad
                  </Label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Todas las ciudades</option>
                    {SPANISH_CITIES.map((cityOption) => (
                      <option key={cityOption.value} value={cityOption.value}>
                        {cityOption.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Universidad
                  </Label>
                  <Input
                    type="text"
                    placeholder="Ej: UCM, UPC, UGR..."
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Tipo de alojamiento
                  </Label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Todos</option>
                    {LISTING_TYPES.map((typeOption) => (
                      <option key={typeOption.value} value={typeOption.value}>
                        {typeOption.icon} {typeOption.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    Precio mensual (€)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Mín"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      min="0"
                    />
                    <Input
                      type="number"
                      placeholder="Máx"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {PRICE_RANGES.slice(0, 4).map((range) => (
                      <button
                        key={range.value}
                        onClick={() => {
                          setMinPrice(range.min.toString())
                          setMaxPrice(range.max?.toString() || '')
                        }}
                        className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Habitaciones</Label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Cualquiera</option>
                    <option value="1">1 habitación</option>
                    <option value="2">2 habitaciones</option>
                    <option value="3">3 habitaciones</option>
                    <option value="4">4+ habitaciones</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Características</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={billsIncluded}
                        onChange={(e) => setBillsIncluded(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">Facturas incluidas</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={furnished}
                        onChange={(e) => setFurnished(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">Amueblado</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 py-2 border-t border-gray-200"
                >
                  <span>Más filtros</span>
                  {showAdvancedFilters ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {showAdvancedFilters && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <Label className="text-sm font-medium">Servicios y equipamiento</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {LISTING_FEATURES.map((feature) => (
                        <button
                          key={feature.key}
                          onClick={() => toggleFeature(feature.key)}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs transition-colors ${
                            selectedFeatures[feature.key]
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span>{feature.icon}</span>
                          <span>{feature.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={() => fetchListings()} className="w-full">
                  Aplicar filtros
                </Button>
              </CardContent>
            </Card>
          </aside>

          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredListings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No se encontraron resultados
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Intenta ajustar los filtros de búsqueda
                  </p>
                  <Button onClick={clearAllFilters}>
                    Limpiar filtros
                  </Button>
                </CardContent>
              </Card>
            ) : viewMode === 'map' ? (
              <Card className="overflow-hidden">
                <div className="h-[600px]">
                  <ListingMap
                    center={{ lat: 40.4168, lng: -3.7038 }}
                    zoom={13}
                    className="h-full w-full"
                    markers={filteredListings
                      .filter((l) => l.coordinates)
                      .map((listing) => ({
                        id: listing.id,
                        title: listing.title,
                        price: listing.price,
                        type: listing.type,
                        coordinates: listing.coordinates || { lat: 40.4168, lng: -3.7038 },
                        coverImage: listing.coverImage || listing.images?.[0] || '',
                      }))}
                    onMarkerClick={(listingId) => {
                      document.getElementById(`listing-${listingId}`)?.scrollIntoView({ behavior: 'smooth' })
                      setViewMode('list')
                    }}
                  />
                </div>
                <div className="p-4 border-t">
                  <p className="text-sm text-gray-600">
                    {filteredListings.length} alojamiento{filteredListings.length !== 1 ? 's' : ''} en el mapa
                  </p>
                </div>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <div key={listing.id} id={`listing-${listing.id}`}>
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>

                {filteredListings.length >= 12 && (
                  <div className="mt-8 text-center">
                    <Button variant="outline" size="lg">
                      Cargar más resultados
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
