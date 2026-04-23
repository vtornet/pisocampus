'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'

interface ReviewFormProps {
  listingId: string
  onSubmitSuccess?: () => void
}

export function ReviewForm({ listingId, onSubmitSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0 || !title.trim() || !comment.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/listings/${listingId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          title: title.trim(),
          comment: comment.trim(),
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        onSubmitSuccess?.()
      } else {
        const data = await response.json()
        alert(data.error || 'Error al enviar la valoración')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Error al enviar la valoración')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-green-600 mb-2">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-1">¡Valoración enviada!</h3>
          <p className="text-gray-600">Gracias por compartir tu experiencia.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deja tu valoración</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars */}
          <div>
            <Label className="mb-2 block">Puntuación</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Título de la valoración</Label>
            <Input
              id="title"
              placeholder="Ej: Estancia perfecta cerca de la universidad"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment">Comentario</Label>
            <Textarea
              id="comment"
              placeholder="Comenta tu experiencia: ubicación, el anfitrión, las instalaciones..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={1000}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/1000 caracteres
            </p>
          </div>

          <Button type="submit" disabled={rating === 0 || isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar valoración'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
