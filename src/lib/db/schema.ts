import { pgTable, text, timestamp, integer, boolean, jsonb, decimal, pgEnum, index } from 'drizzle-orm/pg-core'
import { sql, relations } from 'drizzle-orm'

// Enums
export const userRoleEnum = pgEnum('user_role', ['student', 'advertiser', 'admin'])
export const listingStatusEnum = pgEnum('listing_status', ['active', 'rented', 'inactive'])
export const listingTypeEnum = pgEnum('listing_type', ['room', 'apartment', 'studio', 'shared'])
export const boardPostTypeEnum = pgEnum('board_post_type', ['seeking', 'offering'])
export const boardPostStatusEnum = pgEnum('board_post_status', ['active', 'found', 'closed'])
export const advertiserTypeEnum = pgEnum('advertiser_type', ['individual', 'agency', 'residence'])
export const advertiserPlanEnum = pgEnum('advertiser_plan', ['free', 'pro', 'premium', 'agency'])

// Users (para NextAuth)
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  password: text('password'),
  role: userRoleEnum('role').notNull().default('student'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Accounts (para NextAuth OAuth)
export const accounts = pgTable('accounts', {
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (table) => ({
  providerProviderAccountIdKey: index('accounts_provider_provider_account_id_key').on(table.provider, table.providerAccountId),
}))

// Sessions (para NextAuth)
export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

// Universities
export const universities = pgTable('universities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  acronym: text('acronym'),
  city: text('city').notNull(),
  website: text('website'),
  campuses: jsonb('campuses').$type<{ id: string; name: string; address: string; coordinates: { lat: number; lng: number } }[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Advertisers
export const advertisers = pgTable('advertisers', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: advertiserTypeEnum('type').notNull().default('individual'),
  name: text('name').notNull(),
  logo: text('logo'),
  phone: text('phone'),
  whatsapp: text('whatsapp'),
  website: text('website'),
  verified: boolean('verified').notNull().default(false),
  averageRating: decimal('average_rating', { precision: 2, scale: 1 }),
  totalReviews: integer('total_reviews').notNull().default(0),
  plan: advertiserPlanEnum('plan').notNull().default('free'),
  planExpiresAt: timestamp('plan_expires_at', { mode: 'date' }),
  listingsCount: integer('listings_count').notNull().default(0),
  listingsLimit: integer('listings_limit').notNull().default(1),
  imagesLimit: integer('images_limit').notNull().default(5),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Listings (anuncios de alojamiento)
export const listings = pgTable('listings', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: listingTypeEnum('type').notNull(),
  advertiserId: text('advertiser_id').notNull().references(() => advertisers.id, { onDelete: 'cascade' }),
  universityId: text('university_id').references(() => universities.id),

  // Location
  city: text('city').notNull(),
  province: text('province'),
  neighborhood: text('neighborhood'),
  address: text('address'),
  postalCode: text('postal_code'),
  coordinates: jsonb('coordinates').$type<{ lat: number; lng: number }>(),

  // Pricing
  price: integer('price').notNull(), // €/mes
  billsIncluded: boolean('bills_included').notNull().default(false),
  deposit: integer('deposit'),

  // Features
  bedrooms: integer('bedrooms'),
  bathrooms: integer('bathrooms'),
  area: integer('area'), // m²
  furnished: boolean('furnished').notNull().default(false),
  features: jsonb('features').$type<{
    wifi: boolean
    heating: boolean
    airConditioning: boolean
    balcony: boolean
    terrace: boolean
    elevator: boolean
    parking: boolean
    smoking: boolean
    pets: boolean
    couples: boolean
    desk: boolean
    wardrobe: boolean
  }>(),

  // Availability
  availableFrom: timestamp('available_from', { mode: 'date' }).notNull(),
  availableTo: timestamp('available_to', { mode: 'date' }),
  minStayMonths: integer('min_stay_months'),
  maxStayMonths: integer('max_stay_months'),

  // Media
  images: jsonb('images').$type<string[]>().default(sql`'[]'::jsonb`),
  coverImage: text('cover_image').notNull(),
  tourVideo: text('tour_video'),

  // Status
  status: listingStatusEnum('status').notNull().default('active'),
  featured: boolean('featured').notNull().default(false),
  verified: boolean('verified').notNull().default(false),

  // Metrics
  views: integer('views').notNull().default(0),
  contacts: integer('contacts').notNull().default(0),
  favorites: integer('favorites').notNull().default(0),

  // Dates
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Board Posts (tablón de compañeros)
export const boardPosts = pgTable('board_posts', {
  id: text('id').primaryKey(),
  type: boardPostTypeEnum('type').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  city: text('city').notNull(),
  neighborhood: text('neighborhood'),
  universityId: text('university_id').references(() => universities.id),

  // Budget (para seeking)
  budgetMin: integer('budget_min'),
  budgetMax: integer('budget_max'),

  // Room type (para offering)
  roomType: text('room_type'), // single, double, shared

  // Preferences
  preferences: jsonb('preferences').$type<{
    ageMin?: number
    ageMax?: number
    gender?: 'male' | 'female' | 'any'
    smoking?: 'yes' | 'no' | 'any'
    pets?: 'yes' | 'no' | 'any'
    studyField?: string
    languages: string[]
    hobbies: string[]
  }>(),

  status: boardPostStatusEnum('status').notNull().default('active'),
  availableFrom: timestamp('available_from', { mode: 'date' }).notNull(),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Conversations
export const conversations = pgTable('conversations', {
  id: text('id').primaryKey(),
  listingId: text('listing_id').references(() => listings.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Conversation Participants (join table)
export const conversationParticipants = pgTable('conversation_participants', {
  conversationId: text('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  lastReadAt: timestamp('last_read_at', { mode: 'date' }),
})

// Messages
export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: text('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Favorites
export const favorites = pgTable('favorites', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  listingId: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Reviews
export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  listingId: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  advertiserId: text('advertiser_id').notNull().references(() => advertisers.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1-5
  title: text('title').notNull(),
  comment: text('comment').notNull(),
  verified: boolean('verified').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Alerts
export const alerts = pgTable('alerts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  filters: jsonb('filters').notNull(),
  frequency: text('frequency').notNull(), // instant, daily, weekly
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users as any, ({ many, one }) => ({
  advertiser: one(advertisers, {
    fields: [advertisers.userId],
    references: [users.id] as any,
  }),
  favorites: many(favorites),
  reviews: many(reviews),
  conversationParticipants: many(conversationParticipants),
  sentMessages: many(messages),
  boardPosts: many(boardPosts),
}))

export const advertisersRelations = relations(advertisers, ({ one, many }) => ({
  user: one(users, {
    fields: [advertisers.userId],
    references: [users.id],
  }),
  listings: many(listings),
  reviews: many(reviews),
}))

export const listingsRelations = relations(listings, ({ one, many }) => ({
  advertiser: one(advertisers, {
    fields: [listings.advertiserId],
    references: [advertisers.id],
  }),
  university: one(universities, {
    fields: [listings.universityId],
    references: [universities.id],
  }),
  favorites: many(favorites),
  reviews: many(reviews),
  conversations: many(conversations),
}))

export const universitiesRelations = relations(universities, ({ many }) => ({
  listings: many(listings),
  boardPosts: many(boardPosts),
}))

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  listing: one(listings, {
    fields: [favorites.listingId],
    references: [listings.id],
  }),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
  listing: one(listings, {
    fields: [reviews.listingId],
    references: [listings.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  advertiser: one(advertisers, {
    fields: [reviews.advertiserId],
    references: [advertisers.id],
  }),
}))

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  listing: one(listings, {
    fields: [conversations.listingId],
    references: [listings.id],
  }),
  participants: many(conversationParticipants),
  messages: many(messages),
}))

export const conversationParticipantsRelations = relations(conversationParticipants, ({ one }) => ({
  conversation: one(conversations, {
    fields: [conversationParticipants.conversationId],
    references: [conversations.id],
  }),
  user: one(users, {
    fields: [conversationParticipants.userId],
    references: [users.id],
  }),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}))

export const boardPostsRelations = relations(boardPosts, ({ one }) => ({
  user: one(users, {
    fields: [boardPosts.userId],
    references: [users.id],
  }),
  university: one(universities, {
    fields: [boardPosts.universityId],
    references: [universities.id],
  }),
}))

export const alertsRelations = relations(alerts, ({ one }) => ({
  user: one(users, {
    fields: [alerts.userId],
    references: [users.id],
  }),
}))
