'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Star, CheckCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Review {
  id: string
  rating: number
  title: string
  comment: string
  verified: boolean
  createdAt: Date
  user: {
    id: string
    name: string
    image?: string | null
  }
}

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.user.image || undefined} />
          <AvatarFallback>{getInitials(review.user.name)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">{review.user.name}</span>
            {review.verified && (
              <span className="flex items-center gap-1 text-xs text-green-600" title="Estancia verificada">
                <CheckCircle className="h-3 w-3" />
                Verificado
              </span>
            )}
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
                locale: es,
              })}
            </span>
          </div>

          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          <h4 className="font-medium text-sm text-gray-900 mb-1">{review.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-3">{review.comment}</p>
        </div>
      </div>
    </Card>
  )
}
