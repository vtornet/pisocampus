'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { SPANISH_CITIES } from '@/lib/constants'
import {
  Search,
  MapPin,
  GraduationCap,
  Users,
  Building,
  ChevronRight,
} from 'lucide-react'

interface University {
  id: string
  name: string
  acronym: string
  city: string
  campuses: string[]
  students: number
  website?: string
  image: string
}

const universities: University[] = [
  {
    id: 'ucm',
    name: 'Universidad Complutense de Madrid',
    acronym: 'UCM',
    city: 'Madrid',
    campuses: ['Moncloa', 'Somosaguas'],
    students: 60000,
    website: 'https://www.ucm.es',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400',
  },
  {
    id: 'upm',
    name: 'Universidad Politécnica de Madrid',
    acronym: 'UPM',
    city: 'Madrid',
    campuses: ['Ciudad Universitaria', 'Campus Montegancedo', 'Escuela Superior de Ingenieros'],
    students: 40000,
    website: 'https://www.upm.es',
    image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400',
  },
  {
    id: 'uc3m',
    name: 'Universidad Carlos III de Madrid',
    acronym: 'UC3M',
    city: 'Madrid',
    campuses: ['Getafe', 'Leganés', 'Colmenarejo'],
    students: 20000,
    website: 'https://www.uc3m.es',
    image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=400',
  },
  {
    id: 'uam',
    name: 'Universidad Autónoma de Madrid',
    acronym: 'UAM',
    city: 'Madrid',
    campuses: ['Cantoblanco'],
    students: 35000,
    website: 'https://www.uam.es',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400',
  },
  {
    id: 'ub',
    name: 'Universidad de Barcelona',
    acronym: 'UB',
    city: 'Barcelona',
    campuses: ['Humanities', 'Bellvitge', 'Mundet'],
    students: 65000,
    website: 'https://www.ub.edu',
    image: 'https://images.unsplash.com/photo-1580537659466-5a8c105f5f82?w=400',
  },
  {
    id: 'upc',
    name: 'Universidad Politécnica de Cataluña',
    acronym: 'UPC',
    city: 'Barcelona',
    campuses: ['Norte', 'Sur', 'Diagonal', 'Castelldefels'],
    students: 30000,
    website: 'https://www.upc.edu',
    image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=400',
  },
  {
    id: 'uv',
    name: 'Universidad de Valencia',
    acronym: 'UV',
    city: 'Valencia',
    campuses: ['Blasco Ibañez', 'Burjassot'],
    students: 45000,
    website: 'https://www.uv.es',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  },
  {
    id: 'upv',
    name: 'Universitat Politècnica de València',
    acronym: 'UPV',
    city: 'Valencia',
    campuses: ['Vera', 'Gandia'],
    students: 35000,
    website: 'https://www.upv.es',
    image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400',
  },
  {
    id: 'us',
    name: 'Universidad de Sevilla',
    acronym: 'US',
    city: 'Sevilla',
    campuses: ['Reina Mercedes', 'Los Remedios'],
    students: 50000,
    website: 'https://www.us.es',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400',
  },
  {
    id: 'ugr',
    name: 'Universidad de Granada',
    acronym: 'UGR',
    city: 'Granada',
    campuses: ['Fuentenueva', 'Cartuja', 'Aynadamar', 'Centro', 'Ceuta', 'Melilla'],
    students: 55000,
    website: 'https://www.ugr.es',
    image: 'https://images.unsplash.com/photo-1580537659466-5a8c105f5f82?w=400',
  },
  {
    id: 'uma',
    name: 'Universidad de Málaga',
    acronym: 'UMA',
    city: 'Málaga',
    campuses: ['Teatinos', 'El Ejido'],
    students: 35000,
    website: 'https://www.uma.es',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400',
  },
  {
    id: 'unizar',
    name: 'Universidad de Zaragoza',
    acronym: 'Unizar',
    city: 'Zaragoza',
    campuses: ['Plaza San Francisco', 'Río Ebro'],
    students: 30000,
    website: 'https://www.unizar.es',
    image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=400',
  },
  {
    id: 'deusto',
    name: 'Universidad de Deusto',
    acronym: 'Deusto',
    city: 'Bilbao',
    campuses: ['Bilbao', 'San Sebastián'],
    students: 12000,
    website: 'https://www.deusto.es',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  },
  {
    id: 'usal',
    name: 'Universidad de Salamanca',
    acronym: 'USAL',
    city: 'Salamanca',
    campuses: ['Salamanca', 'Ávila', 'Zamora'],
    students: 28000,
    website: 'https://www.usal.es',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400',
  },
  {
    id: 'ua',
    name: 'Universidad de Alicante',
    acronym: 'UA',
    city: 'Alicante',
    campuses: ['San Vicente'],
    students: 30000,
    website: 'https://www.ua.es',
    image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=400',
  },
  {
    id: 'umu',
    name: 'Universidad de Murcia',
    acronym: 'UMU',
    city: 'Murcia',
    campuses: ['Espinardo'],
    students: 30000,
    website: 'https://www.um.es',
    image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400',
  },
]

export default function UniversidadesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [cityFilter, setCityFilter] = useState('')

  // Get unique cities from universities
  const cities = Array.from(new Set(universities.map(u => u.city))).sort()

  // Filter universities
  const filteredUniversities = universities.filter((uni) => {
    if (cityFilter && uni.city !== cityFilter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!uni.name.toLowerCase().includes(query) &&
          !uni.acronym.toLowerCase().includes(query) &&
          !uni.city.toLowerCase().includes(query)) {
        return false
      }
    }
    return true
  })

  // Group universities by city
  const groupedUniversities = filteredUniversities.reduce((acc, uni) => {
    if (!acc[uni.city]) {
      acc[uni.city] = []
    }
    acc[uni.city].push(uni)
    return acc
  }, {} as Record<string, University[]>)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 text-center">
          <GraduationCap className="h-16 w-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-4xl font-bold mb-4">Directorio de Universidades</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra alojamiento cerca de tu universidad. Busca por campus y descubre las opciones disponibles.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre o siglas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="h-12 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm md:w-48"
            >
              <option value="">Todas las ciudades</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{universities.length}</div>
              <div className="text-sm text-gray-600">Universidades</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {universities.reduce((sum, u) => sum + u.students, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Estudiantes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">{cities.length}</div>
              <div className="text-sm text-gray-600">Ciudades</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {universities.reduce((sum, u) => sum + u.campuses.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Campus</div>
            </div>
          </div>
        </div>
      </div>

      {/* Universities List */}
      <div className="container mx-auto px-4 py-12">
        {filteredUniversities.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No se encontraron universidades
              </h3>
              <p className="text-gray-600">
                Prueba con otros filtros de búsqueda
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedUniversities).map(([city, cityUniversities]) => (
              <div key={city}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  {city}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cityUniversities.map((uni) => (
                    <Card key={uni.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="aspect-[16/10] bg-gray-200 overflow-hidden">
                          <img
                            src={uni.image}
                            alt={uni.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg line-clamp-1">
                                {uni.name}
                              </h3>
                              <p className="text-sm text-gray-600">{uni.acronym}</p>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              <span>
                                {uni.campuses.length} {uni.campuses.length === 1 ? 'campus' : 'campus'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{uni.students.toLocaleString()} estudiantes</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {uni.campuses.slice(0, 2).map((campus) => (
                              <span key={campus} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                {campus}
                              </span>
                            ))}
                            {uni.campuses.length > 2 && (
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                +{uni.campuses.length - 2} más
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/buscar?university=${uni.id}`}
                            className="block"
                          >
                            <Button variant="outline" className="w-full">
                              Ver alojamiento cerca
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿No encuentras tu universidad?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Estamos constantemente añadiendo nuevas universidades. Si la tuya no está en la lista, contáctanos y la añadiremos.
          </p>
          <Button size="lg" variant="secondary">
            Sugerir universidad
          </Button>
        </div>
      </div>
    </div>
  )
}
