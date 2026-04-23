import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a inicio
          </Link>
          <h1 className="text-3xl font-bold">Términos y Condiciones de Uso</h1>
          <p className="text-gray-600 mt-2">
            Última actualización: Abril 2026
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardContent className="p-8 prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
              <p>
                Bienvenido a <strong>PisoCampu</strong>, una plataforma digital que facilita
                la búsqueda y publicación de alojamientos para estudiantes universitarios en España.
                Al acceder o utilizar esta plataforma, aceptas estar vinculado por los presentes Términos
                y Condiciones de Uso.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Objeto de la Plataforma</h2>
              <p>
                PisoCampu es un marketplace que conecta a estudiantes universitarios con
                anunciantes de alojamientos (particulares, agencias inmobiliarias y residencias estudiantiles).
                La plataforma actúa como intermediario en la comunicación entre ambas partes.
              </p>
              <p className="mt-2">
                Los servicios ofrecidos incluyen:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Búsqueda y filtrado de alojamientos</li>
                <li>Publicación de anuncios por parte de anunciantes</li>
                <li>Sistema de mensajería entre usuarios</li>
                <li>Tablón de búsqueda de compañeros de piso</li>
                <li>Directorio de universidades y campus</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Registro y Responsabilidades del Usuario</h2>
              <h3 className="text-xl font-medium mb-2">3.1. Registro</h3>
              <p>
                Para utilizar determinados servicios, es necesario registrarse proporcionando información
                veraz y actualizada. El usuario se compromete a:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Facilitar datos de identificación auténticos y precisos</li>
                <li>Mantener actualizada su información de registro</li>
                <li>Guardar la confidencialidad de sus credenciales de acceso</li>
                <li>No suplantar la identidad de terceros</li>
              </ul>

              <h3 className="text-xl font-medium mt-6 mb-2">3.2. Estudiantes</h3>
              <p>
                Los estudiantes pueden utilizar la plataforma de forma gratuita para buscar alojamiento,
                contactar con anunciantes y publicar en el tablón de compañeros.
              </p>

              <h3 className="text-xl font-medium mt-6 mb-2">3.3. Anunciantes</h3>
              <p>
                Los anunciantes pueden publicar anuncios de alojamiento mediante suscripción de pago.
                Se comprometen a:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Publicar información veraz sobre los alojamientos</li>
                <li>Actualizar la disponibilidad de sus anuncios</li>
                <li>Responder a las consultas de los estudiantes en un plazo razonable</li>
                <li>Cumplir con la legislación vigente en materia de arrendamientos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Obligaciones de los Usuarios</h2>
              <p>Los usuarios se comprometen a:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>No publicar contenido falso, engañoso o fraudulento</li>
                <li>No utilizar la plataforma para fines ilegales o no autorizados</li>
                <li>No realizar spam ni enviar comunicaciones comerciales no solicitadas</li>
                <li>No recopilar datos de otros usuarios sin su consentimiento</li>
                <li>No vulnerar los derechos de propiedad intelectual de terceros</li>
                <li>No interferir con el funcionamiento de la plataforma</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Contenido de los Anuncios</h2>
              <p>
                Los anunciantes son responsables del contenido que publican. La plataforma se reserva el
                derecho de moderar, suspender o eliminar anuncios que:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Contengan información falsa o engañosa</li>
                <li>Violen la legislación vigente</li>
                <li>Resulten ofensivos o inapropiados</li>
                <li>Infrinjan derechos de terceros</li>
              </ul>
              <p className="mt-2">
                La plataforma no garantiza la veracidad de los anuncios ni se hace responsable de las
                transacciones realizadas entre usuarios.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Servicios de Pago</h2>
              <p>
                Los planes de suscripción para anunciantes se renovarán automáticamente hasta que se cancele
                la suscripción. Los precios pueden ser modificados con un preaviso mínimo de 30 días.
              </p>
              <p className="mt-2">
                No se devolverán los importes abonados por suscripciones ya iniciadas, salvo en casos de
                interrupción del servicio por causas imputables a la plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Protección de Datos</h2>
              <p>
                El tratamiento de los datos personales se ajusta a lo dispuesto en el Reglamento General
                de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos y Garantía de los
                Derechos Digitales (LOPD-GDD). Para más información, consulta nuestra{' '}
                <Link href="/privacidad" className="text-blue-600 hover:underline">
                  Política de Privacidad
                </Link>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Propiedad Intelectual</h2>
              <p>
                Todos los elementos de la plataforma (diseño, textos, gráficos, logos, software, bases de
                datos) son propiedad de PisoCampu o de terceros que han autorizado su uso.
              </p>
              <p className="mt-2">
                Queda prohibida la reproducción, modificación, distribución o transmisión de cualquier
                elemento de la plataforma sin autorización expresa.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Responsabilidad</h2>
              <p>
                PisoCampu actúa como intermediario y no participa en las transacciones
                arrendaticias que se formalicen entre usuarios. La plataforma no se hace responsable de:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>La veracidad de la información publicada por los usuarios</li>
                <li>El cumplimiento de las obligaciones arrendaticias</li>
                <li>Daños o perjuicios derivados de la relación entre usuarios</li>
                <li>Incumplimientos de la legislación aplicable por parte de los usuarios</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Resolución de Conflictos</h2>
              <p>
                Cualquier controversia derivada del uso de la plataforma se someterá a los Juzgados y
                Tribunales de Madrid, renunciando las partes a cualquier otro fuero que pudiera corresponderles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Modificación de los Términos</h2>
              <p>
                PisoCampu se reserva el derecho de modificar estos términos en cualquier momento.
                Los cambios serán notificados a los usuarios con al menos 15 días de antelación a su entrada en vigor.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contacto</h2>
              <p>
                Para cualquier consulta relacionada con estos Términos y Condiciones, puedes contactarnos en:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> legal@alojamiento-estudiantes.es<br />
                <strong>Dirección:</strong> Madrid, España
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
