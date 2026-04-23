// Usuario y roles
export type UserRole = 'student' | 'advertiser' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

// Ubicación
export interface Location {
  city: string
  province?: string
  neighborhood?: string
  address?: string
  postalCode?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

// Universidad
export interface University {
  id: string
  name: string
  acronym?: string
  city: string
  campuses: Campus[]
  website?: string
}

export interface Campus {
  id: string
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
}

// Anuncios de alojamiento
export type ListingType = 'room' | 'apartment' | 'studio' | 'shared'

export interface Listing {
  id: string
  title: string
  description: string
  type: ListingType
  location: Location
  universityId?: string
  campusId?: string

  // Precios (€/mes)
  price: number
  billsIncluded: boolean
  deposit?: number

  // Características
  bedrooms?: number
  bathrooms?: number
  area?: number // m²
  furnished: boolean
  features: ListingFeatures

  // Disponibilidad
  availableFrom: Date
  availableTo?: Date
  minStayMonths?: number
  maxStayMonths?: number

  // Fotos
  images: string[]
  coverImage: string
  tourVideo?: string

  // Anunciante
  advertiserId: string
  advertiser: Advertiser

  // Estado
  status: 'active' | 'rented' | 'inactive'
  featured: boolean
  verified: boolean

  // Métricas
  views: number
  contacts: number
  favorites: number

  // Fechas
  createdAt: Date
  updatedAt: Date
}

export interface ListingFeatures {
  // Servicios
  wifi: boolean
  heating: boolean
  airConditioning: boolean
  // Características
  balcony: boolean
  terrace: boolean
  elevator: boolean
  parking: boolean
  // Normas
  smoking: boolean
  pets: boolean
  couples: boolean
  // Para estudiantes
  desk: boolean
  wardrobe: boolean
}

// Anunciante
export interface Advertiser {
  id: string
  userId: string
  type: 'individual' | 'agency' | 'residence'
  name: string
  logo?: string
  phone?: string
  whatsapp?: string
  website?: string
  verified: boolean
  averageRating?: number
  totalReviews?: number

  // Plan de suscripción
  plan: 'free' | 'pro' | 'premium' | 'agency'
  planExpiresAt?: Date

  // Límites del plan
  listingsCount: number
  listingsLimit: number
  imagesLimit: number
}

// Tablón de compañeros
export type BoardPostType = 'seeking' | 'offering'

export interface BoardPost {
  id: string
  type: BoardPostType
  userId: string
  user: User

  title: string
  description: string
  location: Location
  universityId?: string

  // Presupuesto (para seeking)
  budgetMin?: number
  budgetMax?: number

  // Disponibilidad (para offering)
  roomType?: 'single' | 'double' | 'shared'

  // Preferencias
  preferences: RoommatePreferences

  // Estado
  status: 'active' | 'found' | 'closed'

  // Fechas
  availableFrom: Date
  createdAt: Date
  expiresAt: Date
}

export interface RoommatePreferences {
  ageMin?: number
  ageMax?: number
  gender?: 'male' | 'female' | 'any'
  smoking: 'yes' | 'no' | 'any'
  pets: 'yes' | 'no' | 'any'
  studyField?: string
  languages: string[]
  hobbies: string[]
}

// Mensajes
export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  read: boolean
  createdAt: Date
}

export interface Conversation {
  id: string
  participants: User[]
  listingId?: string
  lastMessage?: Message
  unreadCount: number
  createdAt: Date
  updatedAt: Date
}

// Favoritos
export interface Favorite {
  id: string
  userId: string
  listingId: string
  createdAt: Date
}

// Reviews
export interface Review {
  id: string
  listingId: string
  userId: string
  user: User
  advertiserId: string
  rating: number // 1-5
  title: string
  comment: string
  verified: boolean // Usuario verificó su estancia
  createdAt: Date
}

// Alertas
export interface Alert {
  id: string
  userId: string
  name: string
  filters: SearchFilters
  frequency: 'instant' | 'daily' | 'weekly'
  active: boolean
  createdAt: Date
}

// Filtros de búsqueda
export interface SearchFilters {
  query?: string
  city?: string
  universityId?: string
  campusId?: string
  type?: ListingType[]
  priceMin?: number
  priceMax?: number
  availableFrom?: Date
  features?: Partial<ListingFeatures>
  furnished?: boolean
  verified?: boolean
}

// Paginación
export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}
