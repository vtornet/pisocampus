-- ============================================
-- SETUP BASE DE DATOS SUPABASE
-- Ejecutar en orden en Supabase SQL Editor
-- ============================================

-- Primero, verificar/crear tabla users para NextAuth
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMP,
  image TEXT,
  role TEXT DEFAULT 'student',
  password TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 1. TABLA UNIVERSITIES (sin dependencias)
-- ============================================
CREATE TABLE IF NOT EXISTS universities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  acronym TEXT,
  city TEXT NOT NULL,
  website TEXT,
  campuses JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar datos de universidades
INSERT INTO universities (id, name, acronym, city, website)
VALUES
  ('ucm', 'Universidad Complutense de Madrid', 'UCM', 'Madrid', 'https://www.ucm.es'),
  ('upm', 'Universidad Politécnica de Madrid', 'UPM', 'Madrid', 'https://www.upm.es'),
  ('ub', 'Universidad de Barcelona', 'UB', 'Barcelona', 'https://www.ub.edu'),
  ('uv', 'Universidad de Valencia', 'UV', 'Valencia', 'https://www.uv.es'),
  ('us', 'Universidad de Sevilla', 'US', 'Sevilla', 'https://www.us.es'),
  ('uma', 'Universidad de Málaga', 'UMA', 'Málaga', 'https://www.uma.es'),
  ('ugr', 'Universidad de Granada', 'UGR', 'Granada', 'https://www.ugr.es'),
  ('ua', 'Universidad de Alicante', 'UA', 'Alicante', 'https://www.ua.es')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. TABLA ADVERTISERS (depende de users)
-- ============================================
CREATE TABLE IF NOT EXISTS advertisers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT DEFAULT 'individual',
  name TEXT NOT NULL,
  logo TEXT,
  phone TEXT,
  whatsapp TEXT,
  website TEXT,
  verified BOOLEAN DEFAULT false,
  average_rating DECIMAL(3,2),
  total_reviews INTEGER DEFAULT 0,
  plan TEXT DEFAULT 'free',
  plan_expires_at TIMESTAMP,
  listings_count INTEGER DEFAULT 0,
  listings_limit INTEGER DEFAULT 1,
  images_limit INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. TABLA LISTINGS (depende de advertisers y universities)
-- ============================================
CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  advertiser_id TEXT NOT NULL,
  university_id TEXT,

  -- Ubicación
  city TEXT NOT NULL,
  province TEXT,
  neighborhood TEXT,
  address TEXT,
  postal_code TEXT,
  coordinates JSONB,

  -- Precio
  price INTEGER NOT NULL,
  bills_included BOOLEAN DEFAULT false,
  deposit INTEGER,

  -- Características
  bedrooms INTEGER,
  bathrooms INTEGER,
  area INTEGER,
  furnished BOOLEAN DEFAULT false,
  features JSONB,

  -- Disponibilidad
  available_from TIMESTAMP NOT NULL,
  available_to TIMESTAMP,
  min_stay_months INTEGER,
  max_stay_months INTEGER,

  -- Media
  images JSONB DEFAULT '[]'::jsonb,
  cover_image TEXT NOT NULL,
  tour_video TEXT,

  -- Estado
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,

  -- Métricas
  views INTEGER DEFAULT 0,
  contacts INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. TABLA REVIEWS (depende de listings, users, advertisers)
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  advertiser_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. TABLA FAVORITES (depende de users y listings)
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  listing_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. TABLA CONVERSATIONS (depende de listings)
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  listing_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 7. TABLA CONVERSATION_PARTICIPANTS
-- ============================================
CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  last_read_at TIMESTAMP,
  PRIMARY KEY (conversation_id, user_id)
);

-- ============================================
-- 8. TABLA MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 9. TABLA ALERTS (depende de users)
-- ============================================
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  filters JSONB NOT NULL,
  frequency TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 10. TABLA BOARD_POSTS (tablón)
-- ============================================
CREATE TABLE IF NOT EXISTS board_posts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT,
  university_id TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  room_type TEXT,
  preferences JSONB,
  status TEXT DEFAULT 'active',
  available_from TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_advertiser ON listings(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id);

-- ============================================
-- DATOS DE PRUEBA PARA LISTINGS
-- ============================================
INSERT INTO listings (id, title, description, type, advertiser_id, city, province, neighborhood, price, bedrooms, bathrooms, area, available_from, cover_image, images, status)
VALUES
  ('1', 'Habitación luminosa cerca de UCM', 'Bonita habitación individual en piso reformado. Amueblada con cama, escritorio y armario. Very close to university.', 'room', 'adv1', 'Madrid', 'Madrid', 'Moncloa', 450, 3, 1, 12, NOW(), 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]'::jsonb, 'active'),
  ('2', 'Piso compartido cerca de UPN', 'Piso completo compartido. 3 habitaciones, 2 baños. Salón amplio con terraza. Ideal para estudiantes.', 'apartment', 'adv2', 'Madrid', 'Madrid', 'Chamartin', 850, 3, 2, 85, NOW(), 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]'::jsonb, 'active'),
  ('3', 'Estudio en Gracia Barcelona', 'Estudio independiente perfecto para estudiantes. Cocina equipada, baño completo. Muy bien comunicado.', 'studio', 'adv3', 'Barcelona', 'Barcelona', 'Gracia', 650, 1, 1, 35, NOW(), 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"]'::jsonb, 'active')
ON CONFLICT (id) DO NOTHING;
