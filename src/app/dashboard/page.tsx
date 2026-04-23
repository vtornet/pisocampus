'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Home,
  Search,
  MessageSquare,
  Heart,
  Settings,
  Plus,
  TrendingUp,
  Users,
  FileText,
  GraduationCap,
  LogOut,
  Bell,
} from 'lucide-react'

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isAdvertiser = user.role === 'advertiser'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bienvenido, {user.name}
              </h1>
              <p className="text-gray-600">
                {isAdvertiser
                  ? 'Gestiona tus anuncios y contacta con estudiantes'
                  : 'Busca alojamiento y encuentra compañeros de piso'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                isAdvertiser
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {isAdvertiser ? (
                  <>
                    <Home className="h-4 w-4" />
                    Anunciante
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-4 w-4" />
                    Estudiante
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Menú</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {isAdvertiser ? (
                    <>
                      <Link
                        href="/dashboard/mis-anuncios"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Home className="h-5 w-5" />
                        <span>Mis Anuncios</span>
                      </Link>
                      <Link
                        href="/dashboard/crear-anuncio"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                        <span>Crear Anuncio</span>
                      </Link>
                      <Link
                        href="/dashboard/mensajes"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <MessageSquare className="h-5 w-5" />
                        <span>Mensajes</span>
                      </Link>
                      <Link
                        href="/dashboard/estadisticas"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <TrendingUp className="h-5 w-5" />
                        <span>Estadísticas</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/buscar"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Search className="h-5 w-5" />
                        <span>Buscar Alojamiento</span>
                      </Link>
                      <Link
                        href="/tablon"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <FileText className="h-5 w-5" />
                        <span>Tablón de Compañeros</span>
                      </Link>
                      <Link
                        href="/dashboard/favoritos"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Heart className="h-5 w-5" />
                        <span>Favoritos</span>
                      </Link>
                      <Link
                        href="/dashboard/alertas"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Bell className="h-5 w-5" />
                        <span>Alertas</span>
                      </Link>
                      <Link
                        href="/dashboard/mensajes"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <MessageSquare className="h-5 w-5" />
                        <span>Mensajes</span>
                      </Link>
                      <Link
                        href="/dashboard/mis-publicaciones"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <FileText className="h-5 w-5" />
                        <span>Mis Publicaciones</span>
                      </Link>
                    </>
                  )}
                  <div className="border-t border-gray-200 my-2" />
                  <Link
                    href="/perfil"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    <span>Mi Perfil</span>
                  </Link>
                  <Link
                    href="/configuracion"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Configuración</span>
                  </Link>
                  <Link
                    href="/api/auth/signout"
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Cerrar Sesión</span>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {isAdvertiser ? (
                <>
                  <Link href="/dashboard/crear-anuncio">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <Plus className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Crear Anuncio</h3>
                            <p className="text-sm text-gray-600">Publica nuevo alojamiento</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/dashboard/mensajes">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                            <MessageSquare className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Mensajes</h3>
                            <p className="text-sm text-gray-600">0 nuevos mensajes</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/dashboard/estadisticas">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                            <TrendingUp className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Estadísticas</h3>
                            <p className="text-sm text-gray-600">Vista general</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/buscar">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <Search className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Buscar Alojamiento</h3>
                            <p className="text-sm text-gray-600">Encuentra tu piso ideal</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/tablon">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Tablón</h3>
                            <p className="text-sm text-gray-600">Busca compañeros</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/dashboard/favoritos">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
                            <Heart className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Favoritos</h3>
                            <p className="text-sm text-gray-600">0 guardados</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </>
              )}
            </div>

            {/* Welcome Card */}
            <Card>
              <CardHeader>
                <CardTitle>Comienza ahora</CardTitle>
                <CardDescription>
                  {isAdvertiser
                    ? 'Publica tu primer anuncio para empezar a recibir contactos de estudiantes interesados en tu alojamiento.'
                    : 'Explora los alojamientos disponibles o publica en el tablón para encontrar compañeros de piso.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  {isAdvertiser ? (
                    <Link href="/dashboard/crear-anuncio" className="flex-1">
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Primer Anuncio
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/buscar" className="flex-1">
                        <Button className="w-full">
                          <Search className="h-4 w-4 mr-2" />
                          Buscar Alojamiento
                        </Button>
                      </Link>
                      <Link href="/tablon" className="flex-1">
                        <Button variant="outline" className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          Ver Tablón
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Consejos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  {isAdvertiser ? (
                    <>
                      <li>• Completa tu perfil con fotos y descripciones detalladas</li>
                      <li>• Responde rápidamente a los mensajes de los estudiantes</li>
                      <li>• Mantén tus anuncios actualizados con disponibilidad real</li>
                    </>
                  ) : (
                    <>
                      <li>• Usa los filtros de búsqueda para encontrar alojamiento cerca de tu universidad</li>
                      <li>• Verifica las opiniones de otros estudiantes antes de decidir</li>
                      <li>• Usa el tablón para encontrar compañeros compatibles</li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
