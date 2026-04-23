'use client'

import { Star } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface ReviewSummaryProps {
  averageRating: string
  totalReviews: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export function ReviewSummary({
  averageRating,
  totalReviews,
  distribution,
}: ReviewSummaryProps) {
  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-8">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
          <div className="flex items-center gap-1 justify-center my-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </div>
          <div className="text-sm text-gray-600">
            {totalReviews} valoración{totalReviews !== 1 ? 'es' : ''}
          </div>
        </div>

        {/* Rating Bars */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-sm text-gray-600 w-6">{star}★</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${getPercentage(distribution[star as keyof typeof distribution])}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8 text-right">
                {distribution[star as keyof typeof distribution]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
