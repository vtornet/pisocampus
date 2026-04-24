import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a inicio
          </Link>
          <h1 className="text-3xl font-bold">Política de Cookies</h1>
          <p className="text-gray-600 mt-2">
            Última actualización: Abril 2026
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardContent className="p-8 prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. ¿Qué son las Cookies?</h2>
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador,
                tablet o móvil) cuando visita una página web. Permiten recordar sus preferencias y mejorar
                su experiencia de navegación.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Tipos de Cookies Utilizadas</h2>

              <h3 className="text-xl font-medium mt-6 mb-2">2.1. Según su entidad</h3>
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Cookies propias:</strong> Enviadas por Pio Campus</li>
                <li><strong>Cookies de terceros:</strong> Enviadas por servicios externos (Google Analytics, etc.)</li>
              </ul>

              <h3 className="text-xl font-medium mt-6 mb-2">2.2. Según su finalidad</h3>
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Cookies técnicas:</strong> Necesarias para el funcionamiento de la plataforma</li>
                <li><strong>Cookies de análisis:</strong> Recopilan información sobre el uso de la plataforma</li>
                <li><strong>Cookies de preferencias:</strong> Recuerdan sus configuraciones (idioma, filtros, etc.)</li>
                <li><strong>Cookies de publicidad:</strong> Muestran anuncios personalizados (en su caso)</li>
              </ul>

              <h3 className="text-xl font-medium mt-6 mb-2">2.3. Según su duración</h3>
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Cookies de sesión:</strong> Se eliminan al cerrar el navegador</li>
                <li><strong>Cookies persistentes:</strong> Permanecen en su dispositivo durante un periodo determinado</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Cookies Utilizadas en la Plataforma</h2>

              <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Nombre</th>
                    <th className="border border-gray-300 p-2 text-left">Tipo</th>
                    <th className="border border-gray-300 p-2 text-left">Duración</th>
                    <th className="border border-gray-300 p-2 text-left">Finalidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">next-auth.session-token</td>
                    <td className="border border-gray-300 p-2">Técnica / Propia</td>
                    <td className="border border-gray-300 p-2">Sesión</td>
                    <td className="border border-gray-300 p-2">Mantiene la sesión de usuario iniciada</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">next-auth.csrf-token</td>
                    <td className="border border-gray-300 p-2">Técnica / Propia</td>
                    <td className="border border-gray-300 p-2">Sesión</td>
                    <td className="border border-gray-300 p-2">Protección contra ataques CSRF</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">next-auth.callback-url</td>
                    <td className="border border-gray-300 p-2">Técnica / Propia</td>
                    <td className="border border-gray-300 p-2">Sesión</td>
                    <td className="border border-gray-300 p-2">Gestiona la redirección tras login</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">_ga, _gid</td>
                    <td className="border border-gray-300 p-2">Análisis / Terceros (Google)</td>
                    <td className="border border-gray-300 p-2">2 años / 24 horas</td>
                    <td className="border border-gray-300 p-2">Análisis de uso y tráfico</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">user_preferences</td>
                    <td className="border border-gray-300 p-2">Preferencias / Propia</td>
                    <td className="border border-gray-300 p-2">1 año</td>
                    <td className="border border-gray-300 p-2">Guarda filtros y configuraciones</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">cookie_consent</td>
                    <td className="border border-gray-300 p-2">Técnica / Propia</td>
                    <td className="border border-gray-300 p-2">1 año</td>
                    <td className="border border-gray-300 p-2">Recuerda su aceptación de cookies</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Gestión de Cookies</h2>
              <p>
                Puede configurar su navegador para aceptar, rechazar o eliminar cookies. Tenga en cuenta que
                la desactivación de cookies técnicas puede afectar al funcionamiento de la plataforma.
              </p>

              <h3 className="text-xl font-medium mt-6 mb-2">Configuración por navegador</h3>
              <ul className="list-disc pl-6 mt-2">
                <li>
                  <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios
                </li>
                <li>
                  <strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos de sitios
                </li>
                <li>
                  <strong>Safari:</strong> Preferencias → Privacidad → Gestión de datos de sitios web
                </li>
                <li>
                  <strong>Edge:</strong> Configuración → Cookies y permisos de sitio → Administrar cookies
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Cookies de Terceros</h2>
              <p>
                La plataforma puede utilizar servicios de terceros que instalan cookies. Puede consultar las
                políticas de privacidad de estos servicios:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>
                  <strong>Google Analytics:</strong>{' '}
                  <a href="https://policies.google.com/technologies/cookies" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    policies.google.com/technologies/cookies
                  </a>
                </li>
                <li>
                  <strong>Vercel Analytics:</strong>{' '}
                  <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    vercel.com/legal/privacy-policy
                  </a>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Base Legal</h2>
              <p>
                El uso de cookies se fundamenta en el consentimiento del usuario, salvo las cookies técnicas
                que son necesarias para la prestación del servicio solicitado.
              </p>
              <p className="mt-2">
                Esta política cumple con lo establecido en:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Reglamento (UE) 2016/679 (RGPD)</li>
                <li>Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información (LSSI)</li>
                <li>Real Decreto-ley 13/2012, de 30 de marzo</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Actualizaciones</h2>
              <p>
                Esta Política de Cookies puede actualizarse para reflejar cambios en los servicios ofrecidos
                o en la legislación vigente. Le recomendamos revisarla periódicamente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Contacto</h2>
              <p>
                Para cualquier pregunta sobre el uso de cookies en esta plataforma, puede contactarnos en:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> contact@appstracta.app<br />
                <strong>Sitio web:</strong>{' '}
                <Link href="/" className="text-blue-600 hover:underline">
                  www.pio campus.com
                </Link>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Más Información</h2>
              <p>
                Para más información sobre el tratamiento de sus datos personales, consulte nuestra{' '}
                <Link href="/privacidad" className="text-blue-600 hover:underline">
                  Política de Privacidad
                </Link>{' '}
                y nuestros{' '}
                <Link href="/terminos" className="text-blue-600 hover:underline">
                  Términos y Condiciones
                </Link>.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
