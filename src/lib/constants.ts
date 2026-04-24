// Lista de ciudades principales para el select
export const SPANISH_CITIES = [
  { value: 'madrid', label: 'Madrid', province: 'Madrid' },
  { value: 'barcelona', label: 'Barcelona', province: 'Barcelona' },
  { value: 'valencia', label: 'Valencia', province: 'Valencia' },
  { value: 'sevilla', label: 'Sevilla', province: 'Sevilla' },
  { value: 'zaragoza', label: 'Zaragoza', province: 'Zaragoza' },
  { value: 'malaga', label: 'Málaga', province: 'Málaga' },
  { value: 'murcia', label: 'Murcia', province: 'Murcia' },
  { value: 'palma-mallorca', label: 'Palma de Mallorca', province: 'Baleares' },
  { value: 'las-palmas', label: 'Las Palmas', province: 'Las Palmas' },
  { value: 'bilbao', label: 'Bilbao', province: 'Vizcaya' },
  { value: 'alicante', label: 'Alicante', province: 'Alicante' },
  { value: 'cordoba', label: 'Córdoba', province: 'Córdoba' },
  { value: 'valladolid', label: 'Valladolid', province: 'Valladolid' },
  { value: 'vigo', label: 'Vigo', province: 'Pontevedra' },
  { value: 'gijon', label: 'Gijón', province: 'Asturias' },
  { value: 'granada', label: 'Granada', province: 'Granada' },
  { value: 'a-coruna', label: 'A Coruña', province: 'La Coruña' },
  { value: 'vitoria', label: 'Vitoria', province: 'Álava' },
  { value: 'santa-cruz-tenerife', label: 'Santa Cruz', province: 'Santa Cruz de Tenerife' },
  { value: 'oviedo', label: 'Oviedo', province: 'Asturias' },
  { value: 'pamplona', label: 'Pamplona', province: 'Navarra' },
  { value: 'santander', label: 'Santander', province: 'Cantabria' },
  { value: 'san-sebastian', label: 'San Sebastián', province: 'Guipúzcoa' },
  { value: 'burgos', label: 'Burgos', province: 'Burgos' },
  { value: 'albacete', label: 'Albacete', province: 'Albacete' },
  { value: 'salamanca', label: 'Salamanca', province: 'Salamanca' },
  { value: 'logrono', label: 'Logroño', province: 'La Rioja' },
  { value: 'badajoz', label: 'Badajoz', province: 'Badajoz' },
  { value: 'huelva', label: 'Huelva', province: 'Huelva' },
  { value: 'tarragona', label: 'Tarragona', province: 'Tarragona' },
  { value: 'leon', label: 'León', province: 'León' },
  { value: 'cadiz', label: 'Cádiz', province: 'Cádiz' },
  { value: 'lleida', label: 'Lleida', province: 'Lleida' },
  { value: 'jaen', label: 'Jaén', province: 'Jaén' },
  { value: 'ourense', label: 'Ourense', province: 'Orense' },
  { value: 'girona', label: 'Girona', province: 'Girona' },
  { value: 'lugo', label: 'Lugo', province: 'Lugo' },
  { value: 'ceuta', label: 'Ceuta', province: 'Ceuta' },
  { value: 'melilla', label: 'Melilla', province: 'Melilla' },
] as const

// Universidades principales
export const UNIVERSITIES = [
  { id: 'uc3m', name: 'Universidad Carlos III', city: 'madrid', campuses: ['Getafe', 'Leganés', 'Colmenarejo'] },
  { id: 'ucm', name: 'Universidad Complutense', city: 'madrid', campuses: ['Moncloa', 'Somosaguas'] },
  { id: 'uam', name: 'Universidad Autónoma', city: 'madrid', campuses: ['Cantoblanco'] },
  { id: 'upm', name: 'Universidad Politécnica', city: 'madrid', campuses: ['Ciudad Universitaria', 'Campus Montegancedo'] },
  { id: 'ub', name: 'Universidad de Barcelona', city: 'barcelona', campuses: ['Humanities', 'Bellvitge', 'Mundet'] },
  { id: 'upc', name: 'Universidad Politécnica de Cataluña', city: 'barcelona', campuses: ['Norte', 'Sur', 'Diagonal'] },
  { id: 'uv', name: 'Universidad de Valencia', city: 'valencia', campuses: ['Blasco Ibañez', 'Burjassot'] },
  { id: 'us', name: 'Universidad de Sevilla', city: 'sevilla', campuses: ['Reina Mercedes', 'Los Remedios'] },
  { id: 'ugr', name: 'Universidad de Granada', city: 'granada', campuses: ['Fuentenueva', 'Cartuja', 'Aynadamar'] },
  { id: 'uma', name: 'Universidad de Málaga', city: 'malaga', campuses: ['Teatinos', 'El Ejido'] },
] as const

// Tipos de alojamiento
export const LISTING_TYPES = [
  { value: 'room', label: 'Habitación', icon: '🛏️' },
  { value: 'apartment', label: 'Piso completo', icon: '🏠' },
  { value: 'studio', label: 'Estudio', icon: '🏢' },
  { value: 'shared', label: 'Compartir piso', icon: '👥' },
] as const

// Rangos de precio comunes
export const PRICE_RANGES = [
  { value: '0-300', label: 'Hasta 300€', min: 0, max: 300 },
  { value: '300-500', label: '300€ - 500€', min: 300, max: 500 },
  { value: '500-700', label: '500€ - 700€', min: 500, max: 700 },
  { value: '700-1000', label: '700€ - 1000€', min: 700, max: 1000 },
  { value: '1000+', label: 'Más de 1000€', min: 1000, max: null },
] as const

// Características del alojamiento
export const LISTING_FEATURES = [
  { key: 'wifi', label: 'Wifi', icon: '📶' },
  { key: 'heating', label: 'Calefacción', icon: '🔥' },
  { key: 'airConditioning', label: 'Aire acondicionado', icon: '❄️' },
  { key: 'balcony', label: 'Balcón', icon: '🌿' },
  { key: 'terrace', label: 'Terraza', icon: '🏞️' },
  { key: 'elevator', label: 'Ascensor', icon: '🛗' },
  { key: 'parking', label: 'Parking', icon: '🚗' },
  { key: 'desk', label: 'Escritorio', icon: '🖥️' },
  { key: 'wardrobe', label: 'Armario', icon: '👔' },
  { key: 'furnished', label: 'Amueblado', icon: '🪑' },
] as const

// Planes para anunciantes
export const ADVERTISER_PLANS = [
  {
    id: 'free',
    name: 'Básico',
    price: 0,
    features: ['1 anuncio activo', '5 fotos', 'Búsqueda básica'],
    limits: { listings: 1, images: 5 },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    features: ['5 anuncios', '15 fotos', 'Destacado en búsqueda', 'Estadísticas'],
    limits: { listings: 5, images: 15 },
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79,
    features: ['Anuncios ilimitados', '50 fotos', 'Top búsqueda', 'Analytics avanzado'],
    limits: { listings: -1, images: 50 },
  },
  {
    id: 'agency',
    name: 'Agencias',
    price: 199,
    features: ['Multi-usuario', 'API access', 'Branding personalizado'],
    limits: { listings: -1, images: -1 },
  },
] as const

// Alias para compatibilidad
export const cities = SPANISH_CITIES

// Labels para tipos de alojamiento (array format para select)
export const typeLabels = [
  { value: 'room', label: 'Habitación' },
  { value: 'apartment', label: 'Piso completo' },
  { value: 'studio', label: 'Estudio' },
  { value: 'shared', label: 'Compartir piso' },
] as const
