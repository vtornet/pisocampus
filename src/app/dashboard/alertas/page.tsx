'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Bell, Plus, Trash2, Search } from 'lucide-react'
import { cities, typeLabels } from '@/lib/constants'

interface Alert {
  id: string
  name: string
  filters: {
    city?: string
    type?: string
    minPrice?: number
    maxPrice?: number
    universityId?: string
  }
  frequency: 'instant' | 'daily' | 'weekly'
  active: boolean
  createdAt: Date
}

export default function AlertasPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    frequency: 'instant' as 'instant' | 'daily' | 'weekly',
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAlerts()
    }
  }, [isAuthenticated, user])

  const fetchAlerts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/alerts')

      if (response.ok) {
        const data = await response.json()
        setAlerts(data.alerts || [])
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          filters: {
            city: formData.city || undefined,
            type: formData.type || undefined,
            minPrice: formData.minPrice ? parseInt(formData.minPrice) : undefined,
            maxPrice: formData.maxPrice ? parseInt(formData.maxPrice) : undefined,
          },
          frequency: formData.frequency,
        }),
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({
          name: '',
          city: '',
          type: '',
          minPrice: '',
          maxPrice: '',
          frequency: 'instant',
        })
        fetchAlerts()
      }
    } catch (error) {
      console.error('Error creating alert:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/alerts/${id}`, { method: 'DELETE' })
      setAlerts((prev) => prev.filter((a) => a.id !== id))
    } catch (error) {
      console.error('Error deleting alert:', error)
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
      })
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, active: !active } : a))
      )
    } catch (error) {
      console.error('Error toggling alert:', error)
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Mis Alertas</h1>
                <p className="text-gray-600">
                  {alerts.filter(a => a.active).length} alerta{alerts.filter(a => a.active).length !== 1 ? 's' : ''} activa{alerts.filter(a => a.active).length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva alerta
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Crear nueva alerta</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre de la alerta *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Piso barato en Madrid centro"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cualquier ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Cualquier ciudad</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Tipo de alojamiento</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cualquier tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Cualquier tipo</SelectItem>
                      {typeLabels.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minPrice">Precio mínimo (€)</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      value={formData.minPrice}
                      onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                      placeholder="Ej: 200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPrice">Precio máximo (€)</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      value={formData.maxPrice}
                      onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                      placeholder="Ej: 600"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="frequency">Frecuencia de notificación</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value: any) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Inmediata (cuando se publique)</SelectItem>
                      <SelectItem value="daily">Resumen diario</SelectItem>
                      <SelectItem value="weekly">Resumen semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Crear alerta</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : alerts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Aún no tienes alertas configuradas
              </h3>
              <p className="text-gray-600 mb-6">
                Crea alertas personalizadas y recibe notificaciones cuando se publiquen alojamientos que coincidan con tus criterios.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear primera alerta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className={!alert.active ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{alert.name}</h3>
                        {!alert.active && (
                          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                            Inactiva
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        {alert.filters.city && (
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {cities.find(c => c.value === alert.filters.city)?.label || alert.filters.city}
                          </span>
                        )}
                        {alert.filters.type && (
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {typeLabels.find(t => t.value === alert.filters.type)?.label || alert.filters.type}
                          </span>
                        )}
                        {alert.filters.minPrice && (
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            Desde {alert.filters.minPrice}€
                          </span>
                        )}
                        {alert.filters.maxPrice && (
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            Hasta {alert.filters.maxPrice}€
                          </span>
                        )}
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {alert.frequency === 'instant' ? 'Inmediata' : alert.frequency === 'daily' ? 'Diaria' : 'Semanal'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(alert.id, alert.active)}
                      >
                        {alert.active ? 'Pausar' : 'Activar'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(alert.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
