'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Lock, User, GraduationCap, Home, CheckCircle, AlertCircle } from 'lucide-react'

type UserRole = 'student' | 'advertiser'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<'role' | 'form'>('role')
  const [role, setRole] = useState<UserRole>('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole)
    setStep('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Ha ocurrido un error al registrarse')
        setIsLoading(false)
        return
      }

      // Registro exitoso, redirigir a login o dashboard
      router.push('/login?registered=true')
    } catch (error) {
      setError('Ha ocurrido un error. Inténtalo de nuevo.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <img
            src="/logo.png"
            alt="PisoCampus"
            className="h-12 w-12 object-contain"
          />
          <span className="text-2xl font-bold">
            <span className="text-blue-600">Piso</span><span className="text-green-600">Campus</span>
          </span>
        </Link>

        <Card>
          {step === 'role' ? (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                  ¿Cómo quieres registrarte?
                </CardTitle>
                <CardDescription className="text-center">
                  Selecciona el tipo de cuenta que necesitas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Estudiante */}
                <button
                  onClick={() => handleRoleSelect('student')}
                  className="w-full p-6 rounded-lg border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Soy Estudiante</h3>
                      <p className="text-sm text-gray-600">
                        Busco alojamiento, compañeros de piso o quiero publicar en el tablón
                      </p>
                      <p className="text-sm text-green-600 mt-2 font-medium">
                        100% Gratis
                      </p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </button>

                {/* Anunciante */}
                <button
                  onClick={() => handleRoleSelect('advertiser')}
                  className="w-full p-6 rounded-lg border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <Home className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Tengo Alojamiento</h3>
                      <p className="text-sm text-gray-600">
                        Quiero publicar anuncios y alquilar a estudiantes
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Planes desde 0€/mes
                      </p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </button>

                {/* Login Link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login" className="text-blue-600 font-medium hover:underline">
                    Inicia sesión
                  </Link>
                </p>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                  Crear Cuenta {role === 'student' ? 'de Estudiante' : 'de Anunciante'}
                </CardTitle>
                <CardDescription className="text-center">
                  Completa el formulario para registrarte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-700 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Role Badge */}
                  <div className="flex items-center justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                      role === 'student'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {role === 'student' ? (
                        <>
                          <GraduationCap className="h-4 w-4" />
                          Estudiante
                        </>
                      ) : (
                        <>
                          <Home className="h-4 w-4" />
                          Anunciante
                        </>
                      )}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Juan Pérez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Repite tu contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      Acepto los{' '}
                      <Link href="/legal/terminos" className="text-blue-600 hover:underline">
                        términos de uso
                      </Link>{' '}
                      y la{' '}
                      <Link href="/legal/privacidad" className="text-blue-600 hover:underline">
                        política de privacidad
                      </Link>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>

                  {/* Back Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setStep('role')}
                  >
                    ← Volver
                  </Button>

                  {/* Login Link */}
                  <p className="text-center text-sm text-gray-600">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" className="text-blue-600 font-medium hover:underline">
                      Inicia sesión
                    </Link>
                  </p>
                </form>
              </CardContent>
            </>
          )}
        </Card>

        {/* Back to home */}
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}
