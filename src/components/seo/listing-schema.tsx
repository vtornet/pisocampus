interface ListingSchemaProps {
  listing: {
    id: string
    title: string
    description: string
    type: 'room' | 'apartment' | 'studio' | 'shared'
    price: number
    city: string
    province?: string
    neighborhood?: string
    address?: string
    bedrooms?: number | null
    bathrooms?: number | null
    area?: number | null
    images: string[]
    availableFrom: Date
    url: string
  }
  advertiser?: {
    name: string
    type: string
  }
}

const typeMapping = {
  room: 'SingleRoom',
  apartment: 'Apartment',
  studio: 'Studio',
  shared: 'SharedRoom',
}

export function ListingSchema({ listing, advertiser }: ListingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AccommodationListing',
    name: listing.title,
    description: listing.description,
    url: listing.url,
    image: listing.images,
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      availabilityStarts: listing.availableFrom.toISOString(),
    },
    accommodationCategory: typeMapping[listing.type],
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.city,
      addressRegion: listing.province,
      addressCountry: 'ES',
      streetAddress: listing.address,
    },
    numberOfBedrooms: listing.bedrooms,
    numberOfBathroomsTotal: listing.bathrooms,
    floorSize: listing.area ? {
      '@type': 'QuantitativeValue',
      value: listing.area,
      unitCode: 'MTK',
    } : undefined,
    landlord: advertiser ? {
      '@type': advertiser.type === 'individual' ? 'Person' : 'RealEstateAgent',
      name: advertiser.name,
    } : undefined,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.4168,
      longitude: -3.7038,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
