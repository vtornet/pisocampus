'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { SPANISH_CITIES } from '@/lib/constants'
import { useAuth } from '@/hooks/use-auth'
import {
  Search,
  Users,
  MapPin,
  Calendar,
  Euro,
  GraduationCap,
  Plus,
  Filter,
  Heart,
  Home,
  AlertCircle,
} from 'lucide-react'

type PostType = 'seeking' | 'offering'
type TabType = 'all' | PostType

interface BoardPost {
  id: string
  type: PostType
  title: string
  description: string
  name: string
  age?: number
  city: string
  neighborhood?: string
  university?: string
  budgetMin?: number
  budgetMax?: number
  roomType?: 'single' | 'double' | 'shared'
  availableFrom: string
  preferences: {
    smoking?: 'yes' | 'no' | 'any'
    pets?: 'yes' | 'no' | 'any'
    couples?: 'yes' | 'no' | 'any'
    gender?: 'male' | 'female' | 'any'
  }
  createdAt: string
}

const mockPosts: BoardPost[] = [
  {
    id: '1',
    type: 'seeking',
    title: 'Busco habitación cerca de UCM',
    description: 'Estudiante de 3º de Derecho busca habitación tranquila para estudio. Soy ordenado, no fumador y sin mascotas.',
    name: 'Carlos',
    age: 21,
    city: 'Madrid',
    neighborhood: 'Moncloa',
    university: 'UCM',
    budgetMin: 300,
    budgetMax: 450,
    availableFrom: '2025-09-01',
    preferences: { smoking: 'no', pets: 'no', couples: 'any', gender: 'any' },
    createdAt: '2025-04-20',
  },
  {
    id: '2',
    type: 'offering',
    title: 'Ofrezco habitación en piso compartido',
    description: 'Tengo una habitación individual disponible en piso compartido con 2 chicas más. Somos tranquilas y estudiamos Ingeniería.',
    name: 'Laura',
    age: 23,
    city: 'Madrid',
    neighborhood: 'Ciudad Universitaria',
    university: 'UPM',
    roomType: 'single',
    availableFrom: '2025-09-01',
    preferences: { smoking: 'no', pets: 'no', couples: 'no', gender: 'female' },
    createdAt: '2025-04-19',
  },
  {
    id: '3',
    type: 'seeking',
    title: 'Busco compañeros para piso compartido',
    description: 'He alquilado un piso de 3 habitaciones y busco 2 compañeros tranquilos. El piso está amueblado y en zona muy buena.',
    name: 'Miguel',
    age: 24,
    city: 'Barcelona',
    neighborhood: 'Gràcia',
    university: 'UB',
    budgetMin: 350,
    budgetMax: 500,
    availableFrom: '2025-09-01',
    preferences: { smoking: 'any', pets: 'yes', couples: 'any', gender: 'any' },
    createdAt: '2025-04-19',
  },
  {
    id: '4',
    type: 'seeking',
    title: 'Busco habitación cerca de campus',
    description: 'Estudiante de Erasmus de 22 años, italiana, busca habitación con estudiantes españoles para practicar el idioma.',
    name: 'Sofia',
    age: 22,
    city: 'Valencia',
    neighborhood: 'Benimaclet',
    university: 'UV',
    budgetMin: 250,
    budgetMax: 350,
    availableFrom: '2025-02-01',
    preferences: { smoking: 'no', pets: 'no', couples: 'any', gender: 'any' },
    createdAt: '2025-04-18',
  },
  {
    id: '5',
    type: 'offering',
    title: 'Habitación doble para compartir',
    description: 'Busco compañera para compartir habitación doble. El piso es grande y luminoso, en zona muy bien comunicada.',
    name: 'Elena',
    age: 20,
    city: 'Sevilla',
    neighborhood: 'Nervión',
    university: 'US',
    roomType: 'double',
    availableFrom: '2025-09-01',
    preferences: { smoking: 'no', pets: 'no', couples: 'no', gender: 'female' },
    createdAt: '2025-04-18',
  },
  {
    id: '6',
    type: 'seeking',
    title: 'Busco habitación para erasmus',
    description: 'Estudiante de 5º de Medicina busca habitación tranquila. Soy muy estudioso y respetuoso con el espacio de los demás.',
    name: 'Daniel',
    age: 23,
    city: 'Granada',
    neighborhood: 'Centro',
    university: 'UGR',
    budgetMin: 200,
    budgetMax: 350,
    availableFrom: '2025-02-01',
    preferences: { smoking: 'no', pets: 'any', couples: 'no', gender: 'male' },
    createdAt: '2025-04-17',
  },
]

export default function TablonPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<PostType | ''>('')

  // Filter posts
  const filteredPosts = mockPosts.filter((post) => {
    if (activeTab !== 'all' && post.type !== activeTab) return false
    if (cityFilter && post.city.toLowerCase() !== cityFilter.toLowerCase()) return false
    if (typeFilter && post.type !== typeFilter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!post.title.toLowerCase().includes(query) &&
          !post.description.toLowerCase().includes(query) &&
          !post.city.toLowerCase().includes(query)) {
        return false
      }
    }
    return true
  })

  const seekingCount = mockPosts.filter(p => p.type === 'seeking').length
  const offeringCount = mockPosts.filter(p => p.type === 'offering').length

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  // Show access denied if not a student
  if (!loading && isAuthenticated && user?.role !== 'student') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Acceso Restringido</h2>
            <p className="text-gray-600 mb-6">
              El tablón de compañeros es exclusivo para estudiantes. Si eres anunciante, utiliza el buscador de alojamientos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={() => router.push('/buscar')} className="flex-1">
                Ir al Buscador
              </Button>
              <Button onClick={() => router.push('/dashboard')} className="flex-1">
                Ir a mi Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading while checking auth
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Tablón de Compañeros</h1>
              <p className="text-gray-600">
                Busca o ofrece alojamiento compartido con otros estudiantes
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Publicar anuncio
            </Button>
          </div>

          {/* Search */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por ciudad, universidad o palabras clave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex gap-2 py-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos ({mockPosts.length})
              </button>
              <button
                onClick={() => setActiveTab('seeking')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'seeking'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="h-4 w-4" />
                Busco alojamiento ({seekingCount})
              </button>
              <button
                onClick={() => setActiveTab('offering')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'offering'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Home className="h-4 w-4" />
                Ofrezco alojamiento ({offeringCount})
              </button>
            </div>

            {/* City Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">Todas las ciudades</option>
                {SPANISH_CITIES.slice(0, 10).map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No hay publicaciones con estos filtros
              </h3>
              <p className="text-gray-600 mb-4">
                Prueba con otros filtros o sé el primero en publicar
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant={post.type === 'seeking' ? 'default' : 'secondary'}
                      className={post.type === 'seeking' ? 'bg-orange-600' : 'bg-green-600'}
                    >
                      {post.type === 'seeking' ? 'Busco' : 'Ofrezco'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {post.description}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                      {post.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{post.name}</p>
                      {post.age && <p className="text-xs text-gray-500">{post.age} años</p>}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>
                      {post.city}
                      {post.neighborhood && `, ${post.neighborhood}`}
                    </span>
                  </div>

                  {/* University */}
                  {post.university && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <GraduationCap className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{post.university}</span>
                    </div>
                  )}

                  {/* Budget */}
                  {post.budgetMin && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Euro className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>
                        {post.budgetMin}€
                        {post.budgetMax && ` - ${post.budgetMax}€`}
                        /mes
                      </span>
                    </div>
                  )}

                  {/* Room Type */}
                  {post.roomType && (
                    <Badge variant="outline" className="text-xs">
                      {post.roomType === 'single' && 'Habitación individual'}
                      {post.roomType === 'double' && 'Habitación doble'}
                      {post.roomType === 'shared' && 'Compartir habitación'}
                    </Badge>
                  )}

                  {/* Availability */}
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>
                      Desde {new Date(post.availableFrom).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full">
                    Ver más detalles
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 pb-12">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-blue-100 mb-6">
              Publica un anuncio en el tablón y deja que los compañeros te encuentren
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Plus className="h-4 w-4 mr-2" />
                Busco alojamiento
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Home className="h-4 w-4 mr-2" />
                Ofrezco alojamiento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
