import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SPANISH_CITIES, LISTING_TYPES } from '@/lib/constants'
import { Search, MapPin, Users, GraduationCap, Shield, Clock } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Encuentra tu alojamiento ideal cerca de la universidad
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            La plataforma gratuita para estudiantes en España. Conecta con anunciantes verificados y encuentra compañeros de piso.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <Card className="shadow-xl max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Busca alojamiento
            </CardTitle>
            <CardDescription>
              Filtra por ciudad, universidad o tipo de alojamiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">Ciudad</label>
                <select className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                  <option value="">Todas las ciudades</option>
                  {SPANISH_CITIES.slice(0, 10).map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">Universidad</label>
                <select className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                  <option value="">Todas</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                  <option value="">Todos</option>
                  {LISTING_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1 flex items-end">
                <Link href="/buscar" className="w-full">
                  <Button className="w-full" size="lg">
                    Buscar
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Por qué usar <span className="text-blue-600">Piso</span><span className="text-green-600">Campus</span>?</h2>
          <p className="text-gray-600 text-lg">
            Todo lo que necesitas para encontrar tu piso ideal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <GraduationCap className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Por universidad</CardTitle>
              <CardDescription>
                Busca alojamiento cerca de tu campus o universidad específica
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Tablón de compañeros</CardTitle>
              <CardDescription>
                Encuentra roommates compatibles con tus preferencias y estilo de vida
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Anuncios verificados</CardTitle>
              <CardDescription>
                Todos los anuncios son revisados para garantizar su veracidad
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Ubicación precisa</CardTitle>
              <CardDescription>
                Mapas integrados para ver exactamente dónde está el alojamiento
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Alertas instantáneas</CardTitle>
              <CardDescription>
                Recibe notificaciones cuando se publique algo que te interesa
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-10 w-10 text-blue-600 mb-2 text-2xl">💰</div>
              <CardTitle>100% Gratuito</CardTitle>
              <CardDescription>
                Para estudiantes. Sin comisiones ni gastos ocultos
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Tienes un alojamiento para estudiantes?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Únete a cientos de anunciantes que ya confían en nosotros. Publica tu anuncio y llega a miles de estudiantes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/anunciantes/planes">
                <Button size="lg" variant="default">
                  Ver planes para anunciantes
                </Button>
              </Link>
              <Link href="/anunciantes/registro">
                <Button size="lg" variant="outline">
                  Publicar anuncio gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">1.5M+</div>
            <div className="text-gray-600">Estudiantes en España</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Universidades</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
            <div className="text-gray-600">Ciudades</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Soporte</div>
          </div>
        </div>
      </section>
    </div>
  )
}
