'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SPANISH_CITIES, LISTING_TYPES, LISTING_FEATURES } from '@/lib/constants'
import { useAuth } from '@/hooks/use-auth'
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Check,
  Home,
  MapPin,
  Euro,
  Calendar,
  Settings as SettingsIcon,
  Image as ImageIcon,
} from 'lucide-react'

type Step = 'basic' | 'location' | 'pricing' | 'features' | 'availability' | 'photos'

interface FormData {
  title: string
  description: string
  type: string
  city: string
  province: string
  neighborhood: string
  address: string
  postalCode: string
  universityId: string
  price: string
  billsIncluded: boolean
  deposit: string
  bedrooms: string
  bathrooms: string
  area: string
  furnished: boolean
  features: Record<string, boolean>
  availableFrom: string
  availableTo: string
  minStayMonths: string
  maxStayMonths: string
  images: File[]
}

const initialFormData: FormData = {
  title: '',
  description: '',
  type: '',
  city: '',
  province: '',
  neighborhood: '',
  address: '',
  postalCode: '',
  universityId: '',
  price: '',
  billsIncluded: false,
  deposit: '',
  bedrooms: '',
  bathrooms: '',
  area: '',
  furnished: false,
  features: {
    wifi: false,
    heating: false,
    airConditioning: false,
    balcony: false,
    terrace: false,
    elevator: false,
    parking: false,
    smoking: false,
    pets: false,
    couples: false,
    desk: false,
    wardrobe: false,
  },
  availableFrom: '',
  availableTo: '',
  minStayMonths: '',
  maxStayMonths: '',
  images: [],
}

const steps: { id: Step; title: string; icon: any }[] = [
  { id: 'basic', title: 'Información básica', icon: Home },
  { id: 'location', title: 'Ubicación', icon: MapPin },
  { id: 'pricing', title: 'Precio', icon: Euro },
  { id: 'features', title: 'Características', icon: SettingsIcon },
  { id: 'availability', title: 'Disponibilidad', icon: Calendar },
  { id: 'photos', title: 'Fotos', icon: ImageIcon },
]

export default function CreateListingPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [currentStep, setCurrentStep] = useState<Step>('basic')
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature],
      },
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = [...formData.images, ...files].slice(0, 20)
    setFormData((prev) => ({ ...prev, images: newImages }))

    newImages.forEach((file) => {
      if (!file.preview) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, images: newImages }))
    setImagePreviews(newPreviews)
  }

  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 'basic':
        return !!formData.title && !!formData.description && !!formData.type
      case 'location':
        return !!formData.city && !!formData.province
      case 'pricing':
        return !!formData.price
      case 'features':
        return true
      case 'availability':
        return !!formData.availableFrom
      case 'photos':
        return formData.images.length > 0
      default:
        return true
    }
  }

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1 && validateStep(currentStep)) {
      setCurrentStep(steps[currentStepIndex + 1].id)
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          value.forEach((file: File) => {
            formDataToSend.append('images', file)
          })
        } else if (key === 'features') {
          formDataToSend.append(key, JSON.stringify(value))
        } else {
          formDataToSend.append(key, value as string)
        }
      })

      const response = await fetch('/api/listings', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        // Usar window.location.href para asegurar navegación completa
        window.location.href = '/dashboard/mis-anuncios'
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }))
        throw new Error(errorData.error || 'Error al crear el anuncio')
      }
    } catch (error) {
      console.error('Error:', error)
      alert(`Error al crear el anuncio: ${error instanceof Error ? error.message : 'Inténtalo de nuevo'}`)
      setIsSubmitting(false)
    }
    // No finally para evitar restablecer isSubmitting si la navegación va a ocurrir
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Crear Nuevo Anuncio</h1>
              <p className="text-gray-600">Completa los pasos para publicar tu alojamiento</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStepIndex > index

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                        isActive
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : isCompleted
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center hidden sm:block ${
                        isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStepIndex].title}</CardTitle>
              <CardDescription>
                Paso {currentStepIndex + 1} de {steps.length}
              </CardDescription>
            </CardHeader>
            <CardContent>

              {currentStep === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="type">Tipo de alojamiento *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => updateFormData('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {LISTING_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              {type.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="title">Título del anuncio *</Label>
                    <Input
                      id="title"
                      placeholder="Ej: Habitación luminosa cerca de la Complutense"
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.title.length}/100 caracteres
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe tu alojamiento. Incluye información sobre la habitación, las zonas comunes, los compañeros de piso, etc."
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      rows={6}
                      maxLength={2000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description.length}/2000 caracteres
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 'location' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="province">Provincia *</Label>
                      <Select
                        value={formData.province}
                        onValueChange={(value) => {
                          updateFormData('province', value)
                          updateFormData('city', '')
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona provincia" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(SPANISH_CITIES.map((c) => c.province))).map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="city">Ciudad *</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) => {
                          const city = SPANISH_CITIES.find((c) => c.value === value)
                          updateFormData('city', value)
                          if (city) updateFormData('province', city.province)
                        }}
                        disabled={!formData.province}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona ciudad" />
                        </SelectTrigger>
                        <SelectContent>
                          {SPANISH_CITIES.filter(
                            (c) => !formData.province || c.province === formData.province
                          ).map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                              {city.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="neighborhood">Barrio / Zona</Label>
                    <Input
                      id="neighborhood"
                      placeholder="Ej: Moncloa, Chamberí, Gracia..."
                      value={formData.neighborhood}
                      onChange={(e) => updateFormData('neighborhood', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      placeholder="Calle, número, piso..."
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Código Postal</Label>
                    <Input
                      id="postalCode"
                      placeholder="28001"
                      value={formData.postalCode}
                      onChange={(e) => updateFormData('postalCode', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {currentStep === 'pricing' && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="price">Precio mensual (€) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Ej: 450"
                      value={formData.price}
                      onChange={(e) => updateFormData('price', e.target.value)}
                      min={0}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="billsIncluded"
                      checked={formData.billsIncluded}
                      onChange={(e) => updateFormData('billsIncluded', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="billsIncluded" className="cursor-pointer">
                      Facturas incluidas (luz, agua, internet, gas)
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="deposit">Fianza (€)</Label>
                    <Input
                      id="deposit"
                      type="number"
                      placeholder="Generalmente 1 o 2 meses de alquiler"
                      value={formData.deposit}
                      onChange={(e) => updateFormData('deposit', e.target.value)}
                      min={0}
                    />
                  </div>
                </div>
              )}

              {currentStep === 'features' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Habitaciones</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        placeholder="Ej: 2"
                        value={formData.bedrooms}
                        onChange={(e) => updateFormData('bedrooms', e.target.value)}
                        min={1}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">Baños</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        placeholder="Ej: 1"
                        value={formData.bathrooms}
                        onChange={(e) => updateFormData('bathrooms', e.target.value)}
                        min={1}
                      />
                    </div>

                    <div>
                      <Label htmlFor="area">Superficie (m²)</Label>
                      <Input
                        id="area"
                        type="number"
                        placeholder="Ej: 80"
                        value={formData.area}
                        onChange={(e) => updateFormData('area', e.target.value)}
                        min={1}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="furnished"
                      checked={formData.furnished}
                      onChange={(e) => updateFormData('furnished', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="furnished" className="cursor-pointer">
                      El alojamiento está amueblado
                    </Label>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      Características adicionales
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {LISTING_FEATURES.map((feature) => (
                        <button
                          key={feature.key}
                          type="button"
                          onClick={() => updateFeature(feature.key)}
                          className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                            formData.features[feature.key]
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-xl">{feature.icon}</span>
                          <span className="text-sm">{feature.label}</span>
                          {formData.features[feature.key] && (
                            <Check className="h-4 w-4 ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'availability' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="availableFrom">Disponible desde *</Label>
                      <Input
                        id="availableFrom"
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) => updateFormData('availableFrom', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="availableTo">Disponible hasta</Label>
                      <Input
                        id="availableTo"
                        type="date"
                        value={formData.availableTo}
                        onChange={(e) => updateFormData('availableTo', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minStayMonths">Estancia mínima (meses)</Label>
                      <Input
                        id="minStayMonths"
                        type="number"
                        placeholder="Ej: 3"
                        value={formData.minStayMonths}
                        onChange={(e) => updateFormData('minStayMonths', e.target.value)}
                        min={1}
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxStayMonths">Estancia máxima (meses)</Label>
                      <Input
                        id="maxStayMonths"
                        type="number"
                        placeholder="Ej: 12"
                        value={formData.maxStayMonths}
                        onChange={(e) => updateFormData('maxStayMonths', e.target.value)}
                        min={1}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'photos' && (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Arrastra tus fotos aquí o haz clic para seleccionar
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      JPG, PNG o WebP. Máximo 5MB por imagen. Mínimo 1 foto.
                    </p>
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Label htmlFor="images" className="cursor-pointer">
                      <Button type="button" variant="default" onClick={(e) => {
                        e.preventDefault()
                        document.getElementById('images')?.click()
                      }}>
                        <Upload className="h-4 w-4 mr-2" />
                        Seleccionar fotos
                      </Button>
                    </Label>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div>
                      <Label className="text-base font-medium mb-4 block">
                        Fotos ({formData.images.length})
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden group"
                          >
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            {index === 0 && (
                              <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                                Portada
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStepIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            {currentStepIndex === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!validateStep(currentStep) || isSubmitting}
              >
                {isSubmitting ? 'Publicando...' : 'Publicar anuncio'}
              </Button>
            ) : (
              <Button onClick={nextStep} disabled={!validateStep(currentStep)}>
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
