import { Metadata } from 'next'
import { ListingSchema } from '@/components/seo/listing-schema'

interface ListingLayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

// This would ideally fetch real data, but for now we use placeholder
async function getListing(id: string) {
  // In production, fetch from DB
  return {
    id,
    title: 'Alojamiento para estudiantes',
    description: 'Habitación disponible para estudiantes universitarios',
    type: 'room' as const,
    price: 350,
    city: 'Madrid',
    province: 'Madrid',
    neighborhood: 'Moncloa',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200'],
    availableFrom: new Date(),
    url: `https://pio campus.com/anuncio/${id}`,
  }
}

export async function generateMetadata({ params }: ListingLayoutProps): Promise<Metadata> {
  const { id } = await params
  const listing = await getListing(id)

  return {
    title: listing.title,
    description: listing.description,
    openGraph: {
      title: listing.title,
      description: listing.description,
      url: listing.url,
      images: [
        {
          url: listing.images[0],
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: listing.title,
      description: listing.description,
      images: [listing.images[0]],
    },
    alternates: {
      canonical: listing.url,
    },
  }
}

export default async function ListingLayout({ children, params }: ListingLayoutProps) {
  const { id } = await params
  const listing = await getListing(id)

  return (
    <>
      <ListingSchema listing={listing} />
      {children}
    </>
  )
}
