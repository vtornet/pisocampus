import { Suspense } from 'react'
import { BuscarContent } from './buscar-content'

export default function BuscarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Cargando...</div>}>
      <BuscarContent />
    </Suspense>
  )
}
