import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a inicio
          </Link>
          <h1 className="text-3xl font-bold">Política de Privacidad</h1>
          <p className="text-gray-600 mt-2">
            Última actualización: Abril 2026
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardContent className="p-8 prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Responsable del Tratamiento</h2>
              <p>
                <strong>Pio Campus</strong> (en adelante, el "Responsable") es responsable del
                tratamiento de los datos personales recogidos a través de la plataforma y se compromete a
                su protección y confidencialidad.
              </p>
              <p className="mt-2">
                Datos de contacto:<br />
                Email: <strong>contact@appstracta.app</strong><br />
                Dirección: <strong>Madrid, España</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Datos Personales Recogidos</h2>
              <p>El Responsable puede recoger los siguientes datos personales:</p>

              <h3 className="text-xl font-medium mt-6 mb-2">2.1. Datos de identificación</h3>
              <ul className="list-disc pl-6 mt-2">
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Fotografía de perfil (opcional)</li>
              </ul>

              <h3 className="text-xl font-medium mt-6 mb-2">2.2. Datos académicos (estudiantes)</h3>
              <ul className="list-disc pl-6 mt-2">
                <li>Universidad de estudios</li>
                <li>Campus</li>
                <li>Año académico</li>
              </ul>

              <h3 className="text-xl font-medium mt-6 mb-2">2.3. Datos profesionales (anunciantes)</h3>
              <ul className="list-disc pl-6 mt-2">
                <li>Nombre comercial/empresa</li>
                <li>NIF/CIF</li>
                <li>Dirección fiscal</li>
                <li>Número de licencia (agencias inmobiliarias)</li>
              </ul>

              <h3 className="text-xl font-medium mt-6 mb-2">2.4. Datos de uso</h3>
              <ul className="list-disc pl-6 mt-2">
                <li>Historial de búsqueda</li>
                <li>Anuncios guardados como favoritos</li>
                <li>Mensajes enviados a través de la plataforma</li>
                <li>Dirección IP y datos de navegación</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Finalidad del Tratamiento</h2>
              <p>Los datos personales serán tratados para las siguientes finalidades:</p>
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Gestión de la cuenta de usuario:</strong> Registro, autenticación y gestión del perfil</li>
                <li><strong>Prestación de servicios:</strong> Búsqueda de alojamiento, publicación de anuncios, mensajería</li>
                <li><strong>Gestión de pagos:</strong> Procesamiento de suscripciones y facturación</li>
                <li><strong>Comunicaciones:</strong> Envío de notificaciones y alertas relevantes para el usuario</li>
                <li><strong>Mejora del servicio:</strong> Análisis de uso y optimización de la plataforma</li>
                <li><strong>Cumplimiento legal:</strong> Verificación de identidad y prevención de fraudes</li>
              </ul>

              <h3 className="text-xl font-medium mt-6 mb-2">Base legal</h3>
              <p>
                El tratamiento de los datos se fundamenta en el consentimiento del usuario, la ejecución de
                un contrato, el cumplimiento de obligaciones legales y el interés legítimo del Responsable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Destinatarios de los Datos</h2>
              <p>Los datos personales podrán ser comunicados a:</p>
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Otros usuarios:</strong> Para facilitar la comunicación entre estudiantes y anunciantes</li>
                <li><strong>Prestatarios de servicios:</strong> Servicios de hosting, pasarela de pagos, servicios de mensajería</li>
                <li><strong>Administraciones públicas:</strong> Cuando exista una obligación legal</li>
                <li><strong>Tribunales:</strong> En caso de litigio</li>
              </ul>
              <p className="mt-2">
                No se realizarán transferencias internacionales de datos fuera del Espacio Económico Europeo
                sin las garantías adecuadas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Conservación de los Datos</h2>
              <p>
                Los datos personales se conservarán mientras exista una relación comercial con el usuario o
                mientras sea necesario para las finalidades descritas. Una vez finalizada la relación, los
                datos serán bloqueados y eliminados en los plazos legalmente establecidos:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Datos de facturación:</strong> 4 años (obligaciones fiscales)</li>
                <li><strong>Datos de transacciones:</strong> 5 años (prevención de blanqueo de capitales)</li>
                <li><strong>Resto de datos:</strong> Eliminación tras cancelación de cuenta</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Derechos del Usuario</h2>
              <p>El usuario tiene derecho a:</p>
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Acceso:</strong> Conocer qué datos se tratan y para qué</li>
                <li><strong>Rectificación:</strong> Modificar datos inexactos o incompletos</li>
                <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos ("derecho al olvido")</li>
                <li><strong>Limitación:</strong> Solicitar que se limite el tratamiento de sus datos</li>
                <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado</li>
                <li><strong>Oposición:</strong> Oponerse al tratamiento basado en interés legítimo</li>
                <li><strong>Revocación:</strong> Retirar el consentimiento en cualquier momento</li>
              </ul>
              <p className="mt-2">
                Para ejercer estos derechos, el usuario puede enviar un correo electrónico a
                <strong>contact@appstracta.app</strong> adjuntando copia de su DNI/NIE.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Medidas de Seguridad</h2>
              <p>
                El Responsable ha implementado medidas técnicas y organizativas adecuadas para garantizar
                la seguridad de los datos personales y protegerlos contra tratamiento no autorizado,
                pérdida, destrucción o daño accidental, incluyendo:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Encriptación de datos en tránsito y en reposo</li>
                <li>Autenticación de usuarios mediante credenciales seguras</li>
                <li>Control de accesos basado en roles</li>
                <li>Copias de seguridad periódicas</li>
                <li>Auditorías de seguridad periódicas</li>
              </ul>
              <p className="mt-2">
                No obstante, el usuario debe ser consciente de que las medidas de seguridad en Internet
                no son infalibles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Cookies y Tecnologías Similares</h2>
              <p>
                La plataforma utiliza cookies para mejorar la experiencia de usuario y recopilar información
                de navegación. Para más información, consulta nuestra{' '}
                <Link href="/cookies" className="text-blue-600 hover:underline">
                  Política de Cookies
                </Link>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Menores de Edad</h2>
              <p>
                La plataforma está dirigida a mayores de 18 años. En caso de que un menor acceda a la
                plataforma, se requerirá el consentimiento de sus padres o tutores legales.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Modificaciones</h2>
              <p>
                El Responsable se reserva el derecho de modificar esta Política de Privacidad. Los cambios
                serán comunicados a los usuarios con al menos 15 días de antelación.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Reclamaciones</h2>
              <p>
                Si considera que sus derechos han sido vulnerados, puede presentar una reclamación ante
                la Agencia Española de Protección de Datos (AEPD) a través de su sede electrónica:
                <a href="https://www.aepd.es" className="text-blue-600 hover:underline ml-2" target="_blank" rel="noopener noreferrer">
                  www.aepd.es
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
