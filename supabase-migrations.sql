-- ============================================
-- MIGRATIONS PARA SUPABASE
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Extensión para UUIDs (si no está ya activa)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA USERS (se crea con NextAuth)
-- ============================================
-- La tabla users se crea automáticamente con NextAuth
-- Solo asegurarse de que tenga las columnas necesarias:

-- ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;

-- ============================================
-- TABLA ADVERTISERS
-- ============================================
CREATE TABLE IF NOT EXISTS advertisers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'individual',
  name TEXT NOT NULL,
  logo TEXT,
  phone TEXT,
  whatsapp TEXT,
  website TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  average_rating DECIMAL(2,1),
  total_reviews INTEGER NOT NULL DEFAULT 0,
  plan TEXT NOT NULL DEFAULT 'free',
  plan_expires_at TIMESTAMP,
  listings_count INTEGER NOT NULL DEFAULT 0,
  listings_limit INTEGER NOT NULL DEFAULT 1,
  images_limit INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- TABLA UNIVERSITIES
-- ============================================
CREATE TABLE IF NOT EXISTS universities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  acronym TEXT,
  city TEXT NOT NULL,
  website TEXT,
  campuses JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- TABLA LISTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  advertiser_id TEXT NOT NULL REFERENCES advertisers(id) ON DELETE CASCADE,
  university_id TEXT REFERENCES universities(id),

  -- Location
  city TEXT NOT NULL,
  province TEXT,
  neighborhood TEXT,
  address TEXT,
  postal_code TEXT,
  coordinates JSONB,

  -- Pricing
  price INTEGER NOT NULL,
  bills_included BOOLEAN NOT NULL DEFAULT false,
  deposit INTEGER,

  -- Features
  bedrooms INTEGER,
  bathrooms INTEGER,
  area INTEGER,
  furnished BOOLEAN NOT NULL DEFAULT false,
  features JSONB,

  -- Availability
  available_from TIMESTAMP NOT NULL,
  available_to TIMESTAMP,
  min_stay_months INTEGER,
  max_stay_months INTEGER,

  -- Media
  images JSONB DEFAULT '[]',
  cover_image TEXT NOT NULL,
  tour_video TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'active',
  featured BOOLEAN NOT NULL DEFAULT false,
  verified BOOLEAN NOT NULL DEFAULT false,

  -- Metrics
  views INTEGER NOT NULL DEFAULT 0,
  contacts INTEGER NOT NULL DEFAULT 0,
  favorites INTEGER NOT NULL DEFAULT 0,

  -- Dates
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- TABLA BOARD_POSTS (Tablón)
-- ============================================
CREATE TABLE IF NOT EXISTS board_posts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT,
  university_id TEXT REFERENCES universities(id),

  -- Budget (para seeking)
  budget_min INTEGER,
  budget_max INTEGER,

  -- Room type (para offering)
  room_type TEXT,

  -- Preferences
  preferences JSONB,

  status TEXT NOT NULL DEFAULT 'active',
  available_from TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- TABLA CONVERSATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  listing_id TEXT REFERENCES listings(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- TABLA CONVERSATION_PARTICIPANTS
-- ============================================
CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMP,
  PRIMARY KEY (conversation_id, user_id)
);

-- ============================================
-- TABLA MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- TABLA FAVORITES
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,

  -- Constraint para evitar favoritos duplicados
  UNIQUE(user_id, listing_id)
);

-- ============================================
-- TABLA REVIEWS
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  advertiser_id TEXT NOT NULL REFERENCES advertisers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,

  -- Constraint para evitar reviews duplicadas del mismo usuario
  UNIQUE(user_id, listing_id)
);

-- ============================================
-- TABLA ALERTS
-- ============================================
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filters JSONB NOT NULL,
  frequency TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- CREAR ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================

-- Listings
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_advertiser ON listings(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_listings_university ON listings(university_id);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);

-- Favorites
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing ON favorites(listing_id);

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_advertiser ON reviews(advertiser_id);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- Conversations
CREATE INDEX IF NOT EXISTS idx_conversations_listing ON conversations(listing_id);

-- Alerts
CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts(active);

-- ============================================
-- DATOS DE PRUEBA (SEED DATA)
-- ============================================

-- Insertar universidades de prueba
INSERT INTO universities (id, name, acronym, city, website)
VALUES
  ('ucm', 'Universidad Complutense de Madrid', 'UCM', 'Madrid', 'https://www.ucm.es'),
  ('upm', 'Universidad Politécnica de Madrid', 'UPM', 'Madrid', 'https://www.upm.es'),
  ('ub', 'Universidad de Barcelona', 'UB', 'Barcelona', 'https://www.ub.edu'),
  ('uv', 'Universidad de Valencia', 'UV', 'Valencia', 'https://www.uv.es'),
  ('us', 'Universidad de Sevilla', 'US', 'Sevilla', 'https://www.us.es')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- NOTAS:
-- 1. Ejecutar este script completo en Supabase SQL Editor
-- 2. Las tablas se crearán si no existen
-- 3. Los índices se crearán si no existen
-- 4. Los datos de prueba se insertarán si no existen
-- ============================================
