'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { SPANISH_CITIES } from '@/lib/constants'

const typeOptions = [
  { value: 'room', label: 'Habitación' },
  { value: 'apartment', label: 'Piso completo' },
  { value: 'studio', label: 'Estudio' },
  { value: 'shared', label: 'Compartir piso' },
]

const featureOptions = [
  { key: 'wifi', label: 'Wifi' },
  { key: 'heating', label: 'Calefacción' },
  { key: 'airConditioning', label: 'Aire acondicionado' },
  { key: 'balcony', label: 'Balcón' },
  { key: 'terrace', label: 'Terraza' },
  { key: 'elevator', label: 'Ascensor' },
  { key: 'parking', label: 'Parking' },
  { key: 'smoking', label: 'Se permite fumar' },
  { key: 'pets', label: 'Se permiten mascotas' },
  { key: 'couples', label: 'Se permiten parejas' },
  { key: 'desk', label: 'Escritorio' },
  { key: 'wardrobe', label: 'Armario' },
]

export default function EditarAnuncioPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const listingId = params?.id as string

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    city: '',
    province: '',
    neighborhood: '',
    address: '',
    postalCode: '',
    price: '',
    billsIncluded: false,
    deposit: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    furnished: false,
    availableFrom: '',
    availableTo: '',
    minStayMonths: '',
    maxStayMonths: '',
    features: {} as Record<string, boolean>,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated && listingId) {
      fetchListing()
    }
  }, [isAuthenticated, listingId])

  const fetchListing = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/my-listings/${listingId}`)

      if (!response.ok) {
        throw new Error('Error al cargar el anuncio')
      }

      const data = await response.json()
      const listing = data.listing

      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        type: listing.type || '',
        city: listing.city || '',
        province: listing.province || '',
        neighborhood: listing.neighborhood || '',
        address: listing.address || '',
        postalCode: listing.postalCode || '',
        price: listing.price?.toString() || '',
        billsIncluded: listing.billsIncluded || false,
        deposit: listing.deposit?.toString() || '',
        bedrooms: listing.bedrooms?.toString() || '',
        bathrooms: listing.bathrooms?.toString() || '',
        area: listing.area?.toString() || '',
        furnished: listing.furnished || false,
        availableFrom: listing.availableFrom ? new Date(listing.availableFrom).toISOString().split('T')[0] : '',
        availableTo: listing.availableTo ? new Date(listing.availableTo).toISOString().split('T')[0] : '',
        minStayMonths: listing.minStayMonths?.toString() || '',
        maxStayMonths: listing.maxStayMonths?.toString() || '',
        features: (listing.features as Record<string, boolean>) || {},
      })
    } catch (err) {
      setError('Error al cargar el anuncio')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/my-listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          city: formData.city,
          province: formData.province,
          neighborhood: formData.neighborhood || null,
          address: formData.address || null,
          postalCode: formData.postalCode || null,
          price: parseInt(formData.price),
          billsIncluded: formData.billsIncluded,
          deposit: formData.deposit ? parseInt(formData.deposit) : null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          area: formData.area ? parseInt(formData.area) : null,
          furnished: formData.furnished,
          features: formData.features,
          availableFrom: formData.availableFrom,
          availableTo: formData.availableTo || null,
          minStayMonths: formData.minStayMonths ? parseInt(formData.minStayMonths) : null,
          maxStayMonths: formData.maxStayMonths ? parseInt(formData.maxStayMonths) : null,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al guardar los cambios')
      }

      router.push('/dashboard/mis-anuncios')
    } catch (err) {
      setError('Error al guardar los cambios. Inténtalo de nuevo.')
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleFeatureChange = (key: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: { ...prev.features, [key]: checked },
    }))
  }

  if (loading || !isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard/mis-anuncios"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a mis anuncios
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Editar anuncio</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Habitación luminosa cerca de la universidad"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe tu alojamiento..."
                  rows={5}
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo de alojamiento *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Ubicación */}
          <Card>
            <CardHeader>
              <CardTitle>Ubicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="city">Ciudad *</Label>
                <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPANISH_CITIES.map((city) => (
                      <SelectItem key={city.value} value={city.value}>
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="province">Provincia</Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  placeholder="Ej: Madrid"
                />
              </div>

              <div>
                <Label htmlFor="neighborhood">Barrio</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder="Ej: Moncloa"
                />
              </div>

              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ej: Calle Mayor, 123"
                />
              </div>

              <div>
                <Label htmlFor="postalCode">Código postal</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="Ej: 28013"
                />
              </div>
            </CardContent>
          </Card>

          {/* Precio y condiciones */}
          <Card>
            <CardHeader>
              <CardTitle>Precio y condiciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Precio (€/mes) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Ej: 450"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="billsIncluded"
                  checked={formData.billsIncluded}
                  onCheckedChange={(checked) => setFormData({ ...formData, billsIncluded: !!checked })}
                />
                <Label htmlFor="billsIncluded">Facturas incluidas</Label>
              </div>

              <div>
                <Label htmlFor="deposit">Fianza (€)</Label>
                <Input
                  id="deposit"
                  type="number"
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                  placeholder="Ej: 450"
                />
              </div>

              <div>
                <Label htmlFor="availableFrom">Disponible desde *</Label>
                <Input
                  id="availableFrom"
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="availableTo">Disponible hasta</Label>
                <Input
                  id="availableTo"
                  type="date"
                  value={formData.availableTo}
                  onChange={(e) => setFormData({ ...formData, availableTo: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minStay">Estancia mínima (meses)</Label>
                  <Input
                    id="minStay"
                    type="number"
                    value={formData.minStayMonths}
                    onChange={(e) => setFormData({ ...formData, minStayMonths: e.target.value })}
                    placeholder="Ej: 3"
                  />
                </div>
                <div>
                  <Label htmlFor="maxStay">Estancia máxima (meses)</Label>
                  <Input
                    id="maxStay"
                    type="number"
                    value={formData.maxStayMonths}
                    onChange={(e) => setFormData({ ...formData, maxStayMonths: e.target.value })}
                    placeholder="Ej: 12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Características */}
          <Card>
            <CardHeader>
              <CardTitle>Características</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {featureOptions.map((feature) => (
                  <div key={feature.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature.key}
                      checked={formData.features[feature.key] || false}
                      onCheckedChange={(checked) => handleFeatureChange(feature.key, !!checked)}
                    />
                    <Label htmlFor={feature.key} className="text-sm">
                      {feature.label}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="furnished"
                  checked={formData.furnished}
                  onCheckedChange={(checked) => setFormData({ ...formData, furnished: !!checked })}
                />
                <Label htmlFor="furnished">Amueblado</Label>
              </div>
            </CardContent>
          </Card>

          {/* Detalles adicionales */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles adicionales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Habitaciones</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    placeholder="Ej: 2"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Baños</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    placeholder="Ej: 1"
                  />
                </div>
                <div>
                  <Label htmlFor="area">Superficie (m²)</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="Ej: 80"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Guardar cambios
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard/mis-anuncios')}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
