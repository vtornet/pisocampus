interface WebPageSchemaProps {
  title: string
  description: string
  url: string
  image?: string
  datePublished?: Date
  dateModified?: Date
}

export function WebPageSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
}: WebPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    image,
    datePublished: datePublished?.toISOString(),
    dateModified: dateModified?.toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'PisoCampus',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pisocampus.com/icon-192.png',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
