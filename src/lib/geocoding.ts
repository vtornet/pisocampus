interface GeocodeResult {
  lat: number
  lng: number
  display_name: string
}

interface Coordinates {
  lat: number
  lng: number
}

/**
 * Geocoding using OpenStreetMap Nominatim API (free, no API key required)
 * Note: For production, consider rate limiting and caching
 */
export async function geocodeAddress(
  address: string,
  city: string
): Promise<Coordinates | null> {
  try {
    const query = `${address}, ${city}, Spain`.trim()
    const encodedQuery = encodeURIComponent(query)

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1`,
      {
        headers: {
          'User-Agent': 'PisoCampu', // Required by Nominatim usage policy
        },
      }
    )

    if (!response.ok) {
      console.error('Geocoding request failed:', response.statusText)
      return null
    }

    const data: GeocodeResult[] = await response.json()

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      }
    }

    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

/**
 * Fallback coordinates for major Spanish cities
 */
export const CITY_COORDINATES: Record<string, Coordinates> = {
  madrid: { lat: 40.4168, lng: -3.7038 },
  barcelona: { lat: 41.3851, lng: 2.1734 },
  valencia: { lat: 39.4699, lng: -0.3763 },
  sevilla: { lat: 37.3891, lng: -5.9845 },
  zaragoza: { lat: 41.6488, lng: -0.8891 },
  malaga: { lat: 36.7213, lng: -4.4214 },
  murcia: { lat: 37.9922, lng: -1.1307 },
  'palma-mallorca': { lat: 39.5695, lng: 2.6502 },
  'las-palmas': { lat: 28.1235, lng: -15.4363 },
  bilbao: { lat: 43.2630, lng: -2.9350 },
  alicante: { lat: 38.3452, lng: -0.4810 },
  cordoba: { lat: 37.8882, lng: -4.7794 },
  valladolid: { lat: 41.6552, lng: -4.7237 },
  vigo: { lat: 42.2406, lng: -8.7207 },
  gijon: { lat: 43.5322, lng: -5.6611 },
  granada: { lat: 37.1773, lng: -3.5986 },
  'a-coruna': { lat: 43.3623, lng: -8.4115 },
  vitoria: { lat: 42.8591, lng: -2.6812 },
  'santa-cruz-tenerife': { lat: 28.4636, lng: -16.2518 },
  oviedo: { lat: 43.3603, lng: -5.8448 },
  pamplona: { lat: 42.8125, lng: -1.6458 },
  santander: { lat: 43.4623, lng: -3.8090 },
  'san-sebastian': { lat: 43.3188, lng: -1.9812 },
  burgos: { lat: 42.3439, lng: -3.6969 },
  albacete: { lat: 38.9944, lng: -1.8605 },
  salamanca: { lat: 40.9689, lng: -5.6635 },
  logrono: { lat: 42.4668, lng: -2.4435 },
  badajoz: { lat: 38.8779, lng: -6.9707 },
  huelva: { lat: 37.2589, lng: -6.9494 },
  tarragona: { lat: 41.1189, lng: 1.2445 },
  leon: { lat: 42.5987, lng: -5.5671 },
  cadiz: { lat: 36.5271, lng: -6.2886 },
  lleida: { lat: 41.6179, lng: 0.6220 },
  jaen: { lat: 37.7796, lng: -3.7846 },
  ourense: { lat: 42.3367, lng: -7.8641 },
  girona: { lat: 41.9793, lng: 2.8214 },
  lugo: { lat: 43.0098, lng: -7.5560 },
  ceuta: { lat: 35.8894, lng: -5.3132 },
  melilla: { lat: 35.2937, lng: -2.9384 },
}

/**
 * Get coordinates for a city (fallback)
 */
export function getCityCoordinates(citySlug: string): Coordinates | null {
  return CITY_COORDINATES[citySlug] || null
}
