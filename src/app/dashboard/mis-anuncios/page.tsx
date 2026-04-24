'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  MessageSquare,
  Heart,
  Edit,
  Trash2,
  Pause,
  Play,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Listing {
  id: string
  title: string
  type: string
  city: string
  province: string
  price: number
  status: 'active' | 'inactive' | 'rented'
  coverImage: string
  views: number
  contacts: number
  favorites: number
  createdAt: Date
  updatedAt: Date
}

export default function MisAnunciosPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [listings, setListings] = useState<Listing[]>([])
  const [filtered, setFiltered] = useState<Listing[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'rented'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchListings()
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    let result = listings

    if (searchQuery) {
      result = result.filter((l) =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter)
    }

    setFiltered(result)
  }, [searchQuery, statusFilter, listings])

  const fetchListings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/my-listings')

      if (response.ok) {
        const data = await response.json()
        setListings(data.listings || [])
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/my-listings/${deleteId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setListings((prev) => prev.filter((l) => l.id !== deleteId))
      } else {
        alert('Error al eliminar el anuncio')
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert('Error al eliminar el anuncio')
    } finally {
      setDeleteId(null)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const response = await fetch(`/api/my-listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setListings((prev) =>
          prev.map((l) =>
            l.id === id ? { ...l, status: newStatus as any } : l
          )
        )
      }
    } catch (error) {
      console.error('Error updating status:', error)
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

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { label: 'Activo', className: 'bg-green-100 text-green-700' },
      inactive: { label: 'Pausado', className: 'bg-gray-100 text-gray-700' },
      rented: { label: 'Alquilado', className: 'bg-blue-100 text-blue-700' },
    }
    return badges[status as keyof typeof badges] || badges.active
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      room: 'Habitación',
      apartment: 'Piso completo',
      studio: 'Estudio',
      shared: 'Compartir piso',
    }
    return types[type] || type
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Mis Anuncios</h1>
              <p className="text-gray-600">
                Gestiona tus {listings.length} anuncio{listings.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Link href="/dashboard/crear-anuncio">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear anuncio
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por título o ciudad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-12 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm md:w-48"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Pausados</option>
            <option value="rented">Alquilados</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery || statusFilter !== 'all'
                  ? 'No se encontraron anuncios'
                  : 'Aún no tienes anuncios publicados'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'Prueba con otros filtros de búsqueda'
                  : 'Publica tu primer anuncio para empezar a recibir contactos de estudiantes.'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Link href="/dashboard/crear-anuncio">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear primer anuncio
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((listing) => {
              const statusBadge = getStatusBadge(listing.status)
              return (
                <Card key={listing.id} className="overflow-hidden">
                  <div className="flex">
                    <Link
                      href={`/anuncio/${listing.id}`}
                      className="w-32 h-32 flex-shrink-0 bg-gray-200"
                    >
                      <img
                        src={listing.coverImage}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusBadge.className}`}>
                              {statusBadge.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {getTypeLabel(listing.type)}
                            </span>
                          </div>
                          <Link
                            href={`/anuncio/${listing.id}`}
                            className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1"
                          >
                            {listing.title}
                          </Link>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/mis-anuncios/${listing.id}/editar`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(listing.id, listing.status)}>
                              {listing.status === 'active' ? (
                                <>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pausar
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Activar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteId(listing.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {listing.city}, {listing.province} · {listing.price}€/mes
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {listing.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {listing.contacts}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {listing.favorites}
                          </span>
                        </div>
                        <span className="text-xs">
                          {formatDistanceToNow(new Date(listing.updatedAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este anuncio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El anuncio se eliminará permanentemente
              y dejará de estar visible para los estudiantes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
