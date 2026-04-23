'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save, Bell, Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function ConfiguracionPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()

  const [formData, setFormData] = useState({
    emailNotifications: true,
    pushNotifications: false,
    messageAlerts: true,
    listingAlerts: true,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  const handleSave = async () => {
    setIsSaving(true)
    setMessage('')

    // Simular guardado
    setTimeout(() => {
      setIsSaving(false)
      setMessage('Configuración guardada correctamente')
      setTimeout(() => setMessage(''), 3000)
    }, 500)
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
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Configuración</h1>

        <div className="space-y-6">
          {/* Notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificaciones por email</p>
                  <p className="text-sm text-gray-500">Recibe actualizaciones en tu correo</p>
                </div>
                <Switch
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alertas de nuevos mensajes</p>
                  <p className="text-sm text-gray-500">Notificaciones cuando recibas mensajes</p>
                </div>
                <Switch
                  checked={formData.messageAlerts}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, messageAlerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alertas de nuevos anuncios</p>
                  <p className="text-sm text-gray-500">Cuando se publiquen anuncios de tu interés</p>
                </div>
                <Switch
                  checked={formData.listingAlerts}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, listingAlerts: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacidad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Privacidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Tu perfil es visible para otros usuarios según tu rol. Puedes ajustar tu visibilidad en tu perfil.
                </p>
                <Link href="/perfil" className="text-blue-600 hover:underline text-sm">
                  Editar perfil de privacidad →
                </Link>
              </div>
            </CardContent>
          </Card>

          {message && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md">
              {message}
            </div>
          )}

          <Button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </div>
  )
}
