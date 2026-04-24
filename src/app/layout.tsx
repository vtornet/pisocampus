import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { Providers } from '@/components/providers/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002')

export const metadata: Metadata = {
  title: {
    default: 'PisoCampus - Encuentra tu piso ideal',
    template: '%s | PisoCampus',
  },
  description: 'Plataforma gratuita para estudiantes que buscan alojamiento en España. Busca por universidad, ciudad o barrio y encuentra compañeros de piso. Sin comisiones ni fees.',
  keywords: [
    'alojamiento estudiantes',
    'piso estudiantes',
    'habitación universidad',
    'companeros piso',
    'alquiler estudiantes',
    'residencia estudiantes',
    'piso compartido',
    'habitación madrid',
    'habitación barcelona',
    'habitación valencia',
    'alojamiento erasmus',
  ],
  authors: [{ name: 'PisoCampus' }],
  creator: 'PisoCampus',
  publisher: 'PisoCampus',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PisoCampus',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/apple-icon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: 'PisoCampus',
    title: 'PisoCampus - Encuentra tu piso ideal',
    description: 'Plataforma gratuita para estudiantes que buscan alojamiento en España. Busca por universidad, ciudad o barrio y encuentra compañeros de piso.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'PisoCampus',
      },
    ],
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PisoCampus - Encuentra tu piso ideal',
    description: 'Plataforma gratuita para estudiantes que buscan alojamiento en España.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: 'https://pisocampus.com',
    languages: {
      'es-ES': 'https://pisocampus.com',
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
