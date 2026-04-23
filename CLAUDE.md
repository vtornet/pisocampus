# PWA Alojamiento Estudiantes - Documentación del Proyecto

## 🎯 Visión del Proyecto

Progressive Web App (PWA) para búsqueda de alojamiento estudiantil a nivel nacional en España. Plataforma marketplace que conecta estudiantes con anunciantes de alojamiento (particulares, agencias, residencias).

### Modelo de Negocio
- **Gratis para estudiantes**: Búsqueda, contacto y publicaciones en tablón sin coste
- **Pago para anunciantes**: Suscripciones mensuales para publicar alojamientos

---

## 📊 Análisis de Mercado

### Competencia Existente

| Plataforma | Modelo | Enfoque |
|------------|--------|---------|
| Idealista | Pagos por anuncio | Generalista |
| Spotahome | Comisión/fee | Mid/long-term, verificado online |
| Uniplaces | Comisión al anunciante | Específico estudiantes, internacional |
| Badi | Freemium | Compañeros de piso, room-matching |
| Erasmusu | Freemium + premium | Específico ERASMUS/internacionales |
| Piso.com | Pagos por anuncio | Generalista |

### Diferenciadores y Oportunidades

1. **Nacional con enfoque universitario local**: No solo ERASMUS, también estudiantes nacionales
2. **Tablón de compañeros**: Integración de búsqueda de roommates
3. **Gratuito para estudiantes**: Sin fees por contacto
4. **Búsqueda por universidad**: Filtrado por campus/universidad, no solo ciudad
5. **PWA nativa**: Experiencia app sin necesidad de descargar

### Mercado Potencial
- **+1.5M** estudiantes universitarios en España
- Crecimiento sostenido de movilidad estudiantil
- Dolor real: búsqueda de alojamiento es compleja y estresante

---

## 🛠️ Stack Tecnológico

### Frontend
```yaml
Framework: Next.js 15 (App Router)
  - SSR/SSG para SEO
  - API Routes integradas
  - React Server Components

UI: shadcn/ui + Tailwind CSS
  - Componentes profesionales pre-built
  - Altamente customizable
  - Dark mode integrado
  - Accesibilidad (WCAG 2.1 AA)

PWA: next-pwa
  - Service workers
  - Offline mode
  - Install prompts

Estado: Zustand o Jotai
  - State management ligero
  - Buen performance

Formularios: React Hook Form + Zod
  - Validación type-safe
```

### Backend
```yaml
Framework: Next.js API Routes o tRPC
  - Type safety end-to-end
  - Monorepo simplificado

Base de Datos: PostgreSQL (Supabase o Neon)
  - Relacional (vital para búsquedas complejas)
  - Extensiones GIS para geolocalización
  - Full-text search nativo

ORM: Drizzle ORM
  - Type-safe
  - Queries performantes
  - Migraciones simples

Cache: Redis (Upstash)
  - Sesiones
  - Rate limiting
  - Caching de búsquedas frecuentes
```

### Storage & Media
```yaml
Imágenes: Cloudflare Images o Cloudinary
  - Optimización automática
  - Transformaciones on-the-fly
  - CDN global
  - WebP/AVIF automáticos
  - Lazy loading

Videos: Mux (opcional, para tours virtuales)
```

### Autenticación
```yaml
Auth.js (NextAuth)
  - OAuth (Google, Apple)
  - Credentials (email/password)
  - Role-based access (estudiante/anunciante/admin)
```

### Pagos
```yaml
Stripe
  - Subscripciones recurrentes
  - Payment Intents
  - Facturación automática
  - Webhooks handling
```

### Despliegue & Monitoring
```yaml
Hosting: Vercel
  - Edge network global
  - Preview deployments
  - Analytics integrado

Monitoring: Sentry + Vercel Analytics
  - Error tracking
  - Performance monitoring
```

---

## 🗺️ Roadmap de Desarrollo

### FASE 1: MVP (3-4 meses)
```
├── [✅] Landing page con captación de leads
├── [✅] Directorio de universidades y campus españoles
├── [✅] Buscador básico (ciudad/barrio) + filtros avanzados
├── [✅] Perfil de anuncio (texto + fotos)
├── [✅] Tablón básico (busco/ofrezco alojamiento)
├── [✅] Autenticación (email + Google OAuth)
├── [✅] Panel básico para anunciantes
├── [✅] Páginas legales (Términos, Privacidad, Cookies)
├── [✅] Base de datos conectada (Supabase + Drizzle)
├── [✅] API de listings funcional con datos reales
└── [✅] Sistema de mensajería completo (API + UI)
```

### FASE 2: Feature Complete (6-8 meses)
```
├── [✅] Buscador avanzado (universidad, precio, servicios) - Implementado
├── [✅] Sistema de mensajes integrado - Completado
├── [✅] Favoritos y alertas de nuevos anuncios
├── [ ] Geolocalización y mapas (Mapbox/Google Maps)
├── [✅] Valoraciones y reviews de alojamientos - Completado con validación de contacto previo
├── [✅] Panel de gestión para anunciantes - Completado (crear, editar, eliminar, pausar)
├── [ ] SEO técnico y content marketing
└── [ ] Analytics y eventos de conversión
```

### FASE 3: Escalado (12 meses)
```
├── Sistema de suscripciones para anunciantes
├── Integración pasarela de pago (Stripe)
├── Motor de recomendaciones ML
├── Chatbots para soporte automatizado
├── API para integraciones con residencias
├── A/B testing y optimización de conversión
└── Expansión a nuevos países (Portugal, Francia)
```

### FASE 4: Residencias (futuro)
```
├── Acuerdos B2B con residencias estudiantiles
├── Booking engine con disponibilidad en tiempo real
├── Integración de calendario de reservas
└── Sistema de comisiones por reserva
```

---

## 👥 Roles y Features

### Estudiante (Gratuito)
- Búsqueda avanzada con filtros múltiples
- Geolocalización "cerca de mi universidad"
- Guardar favoritos y crear alertas
- Mensajería ilimitada con anunciantes
- Publicar en tablón (busco compañía/ofrezco habitación)
- Valorar alojamientos después de estancia
- Ver fotos y detalles completos

### Anunciante (Pago)
- Dashboard de gestión de anuncios
- Subida de galería (hasta 20 fotos con optimización)
- Estadísticas de visitas y contactos
- Opción de destacado en búsquedas
- Mensajería con estudiantes
- Gestión de varios anuncios
- Calendario de disponibilidad
- Renovación automática de suscripción

### Admin
- Moderación de contenidos (anuncios, mensajes)
- Gestión de usuarios y roles
- Analytics avanzados y reporting
- Configuración de planes y precios
- Ban system y report handling

---

## 🏗️ Arquitectura de la Aplicación

```
/src
├── /app                    # Next.js App Router
│   ├── /(auth)            # Auth pages (login, register)
│   ├── /(dashboard)       # Dashboard protegido
│   ├── /(marketplace)     # Públicas: búsqueda, anuncios
│   ├── /api               # API Routes
│   │   ├── /auth/[...nextauth]  # NextAuth
│   │   ├── /auth/register       # Registro
│   │   ├── /listings            # CRUD anuncios
│   │   ├── /my-listings         # Anuncios del usuario
│   │   ├── /favorites           # Favoritos
│   │   ├── /conversations       # Mensajería
│   │   └── /listings/[id]/reviews # Reviews
│   └── layout.tsx         # Root layout
├── /components
│   ├── /ui               # shadcn/ui components
│   ├── /auth             # Auth components
│   ├── /dashboard        # Dashboard components
│   ├── /marketplace      # Marketplace components
│   ├── /reviews          # Review components
│   └── /shared           # Shared components
├── /lib
│   ├── /db               # Database utilities
│   │   ├── schema.ts     # Drizzle schema
│   │   └── index.ts      # DB connection
│   ├── /auth             # Auth utilities
│   ├── constants.ts      # Constantes (ciudades, tipos, etc)
│   └── /utils            # Helper functions
├── /hooks                # Custom React hooks
├── /types                # TypeScript types
└── /styles               # Global styles
```

### Rutas Públicas
| Ruta | Descripción | Estado |
|------|-------------|--------|
| `/` | Landing page | ✅ |
| `/buscar` | Buscador de alojamientos | ✅ |
| `/tablón` | Tablón de compañeros | ✅ |
| `/universidades` | Directorio de universidades | ✅ |
| `/anuncio/[id]` | Detalle de anuncio | ✅ |
| `/login` | Inicio de sesión | ✅ |
| `/registro` | Registro | ✅ |

### Rutas Protegidas
| Ruta | Descripción | Estado |
|------|-------------|--------|
| `/dashboard` | Dashboard principal | ✅ |
| `/dashboard/estudiante` | Panel estudiante | ✅ |
| `/dashboard/anunciante` | Panel anunciante | ✅ |
| `/dashboard/crear-anuncio` | Wizard crear anuncio | ✅ |
| `/dashboard/mis-anuncios` | Mis anuncios | ✅ |
| `/dashboard/favoritos` | Favoritos guardados | ✅ |
| `/dashboard/alertas` | Alertas de búsqueda | ✅ |
| `/dashboard/mensajes` | Bandeja de mensajes | ✅ |

---

## 💰 Modelo de Monetización

### Planes para Anunciantes

| Plan | Precio | Features |
|------|--------|----------|
| Básico | Gratis | 1 anuncio activo, 5 fotos |
| Pro | 29€/mes | 5 anuncios, 15 fotos, destacado en búsqueda |
| Premium | 79€/mes | Anuncios ilimitados, top búsqueda, analytics avanzado |
| Agencias | 199€/mes | API access, multi-usuario, branding personalizado |

### Ingresos Adicionales (futuro)
- Featured listings (pago por destacar)
- Bump de anuncio (subir en lista)
- Destacado en newsletter
- Banner ads en categorías premium

---

## 🎨 Principios de Diseño

### Mobile-First
- 80%+ de usuarios desde móvil
- Touch targets mínimos 44px
- Navegación thumb-friendly

### Performance
- LCP < 2.5s (Core Web Vitals)
- Imágenes lazy loading y optimizadas
- Code splitting por ruta
- Edge caching donde sea posible

### Accesibilidad
- WCAG 2.1 AA mínimo
- Navegación por teclado
- Contraste mínimo 4.5:1
- Screen reader friendly

### UX
- Menos clics = más conversión
- Onboarding simple y guiado
- Feedback inmediato en acciones
- Sin fricciones en contacto estudiante-anunciante

---

## 📈 Métricas Clave (KPIs)

### Etapa MVP
- Usuarios registrados
- Anuncios publicados
- Mensajes enviados
- Tasa de conversión lead → registro

### Etapa Escalado
- MRR (Monthly Recurring Revenue)
- CAC (Customer Acquisition Cost)
- LTV (Lifetime Value)
- Churn rate de anunciantes
- DAU/MAU (Daily/Monthly Active Users)

---

## 🔐 Seguridad

- Rate limiting en APIs ( Redis/Upstash)
- Sanitización de inputs (contra XSS)
- CSRF protection
- Headers de seguridad (CSP, HSTS)
- Encrypted connections (HTTPS)
- Sensitive data en environment variables
- Role-based access control (RBAC)

### Variables de Entorno Requeridas

```bash
# Database
DATABASE_URL="postgresql://..."

# Auth.js (NextAuth)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

# OAuth (opcional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Supabase (opcional - para cliente)
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="..."
```

---

## 🌐 SEO Strategy

- Pages estáticas para ciudades/universidades clave
- Schema markup para listings (RealEstateAgent)
- Sitemap.xml dinámico
- Meta tags optimizados
- Blog con contenido útil para estudiantes
- PageSpeed optimizado

---

## 🚀 Scripts de Desarrollo

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npm run type-check

# Test
npm run test

# E2E
npm run test:e2e

# DB migrations
npm run db:migrate

# DB seed (datos de prueba)
npm run db:seed
```

---

## 📝 Notas de Desarrollo

### Prioridades
1. **Funcionalidad sobre perfección**: MVP rápido para validar
2. **Type safety estricto**: TypeScript en strict mode
3. **Testing crítico**: Testear caminos felices y edge cases
4. **Documentación**: Componentes complejos requieren comentarios

### Convenciones
- Nombre de componentes: PascalCase
- Nombre de archivos: kebab-case
- Utilidades: camelCase
- Constantes: UPPER_SNAKE_CASE
- Git commits: Conventional Commits

### Libraries a considerar
- `date-fns`: Manejo de fechas
- `zod`: Validación de schemas
- `react-hook-form`: Formularios
- `zustand`: State management
- `@tanstack/react-query`: Server state
- `next-themes`: Dark mode

### Reglas de Oro:

- No tocar nunca lo que ya funciona, realizar análisis para comprobar eso antes de guardar.
- Lee los archivos existentes antes de escribir en ellos. No los vuelvas a leer a menos que hayas realizado cambios.
- Razonamiento exhaustivo, resultados concisos.
- Omita los archivos de más de 100 KB a menos que sea necesario.
- Nada de frases introductorias aduladoras ni de palabras de cierre superfluas.
- No se permiten emojis ni guiones largos.
- No intente adivinar las API, las versiones, las banderas, los hashes SHA de las confirmaciones ni los nombres de los paquetes.
- Verifique leyendo el código o la documentación antes de afirmar.
- Solo frases cortas (máximo 8-10 palabras). Sin relleno, sin preámbulos, sin formalismos. Primero la herramienta. Primero el resultado. - No se dan explicaciones a menos que se soliciten. El código se mantiene normal. 
---

## 📋 Estado Actual del Proyecto

### Última actualización: 23 Abril 2026

#### ✅ Implementado
- **Páginas públicas**: Landing, Buscador, Tablón, Universidades
- **Autenticación**: Login/Registro con NextAuth
- **Dashboard**: Panel diferenciado por rol (estudiante/anunciante)
- **Crear anuncio**: Formulario wizard de 6 pasos
- **Páginas legales**: Términos, Privacidad, Cookies (conforme a normativa española)
- **Componentes UI**: shadcn/ui (Button, Input, Card, Select, etc.)
- **Base de datos**: Schema Drizzle ORM completo + Conexión a Supabase
- **API funcional**: `/api/listings` con filtros (ciudad, tipo, precio, universidad)
- **Datos de prueba**: Seed con 3 anuncios de prueba en Supabase
- **Buscador**: Página `/buscar` con filtros avanzados funcionando
- **Componentes de marketplace**: ListingCard, ListingMap, filtros interactivos
- **Sistema de reviews**: API `/api/listings/[id]/reviews` con validación de contacto previo
- **Mis anuncios**: Listado completo para anunciantes (crear, editar, eliminar, pausar)
- **Sistema de favoritos**: Guardar y listar alojamientos favoritos
- **Sistema de alertas**: Crear alertas personalizadas de búsqueda
- **Mensajería**: API completa de conversaciones entre usuarios

#### 🚧 En desarrollo
- UI de mensajería (chat en tiempo real)
- Subida real de imágenes (actualmente mock URLs)

#### 📅 Próximas tareas
1. Integración de subida de imágenes real (Cloudinary/Cloudflare)
2. Geolocalización y mapas
3. Integración de pagos con Stripe
4. SEO técnico y content marketing

---

## 🔗 Conexión a Base de Datos

### Supabase Configurado
- **Database URL**: Configurada en `.env`
- **Schema**: Drizzle ORM con todas las tablas
- **Seed**: Ejecutar SQL en Supabase SQL Editor para poblar datos de prueba

### Tablas Principales
- `users` - Usuarios del sistema
- `advertisers` - Perfiles de anunciantes
- `listings` - Anuncios de alojamiento
- `universities` - Directorio de universidades
- `conversations` - Mensajes entre usuarios
- `reviews` - Valoraciones de alojamientos
- `favorites` - Favoritos de usuarios

---

## 🛠️ Soluciones a Problemas Comunes

### Error de compilación en review-card.tsx
Si aparece un error de parsing en review-card.tsx:
1. Borrar caché: `rm -rf .next`
2. Reiniciar servidor: `npm run dev`

### Puerto ocupado (EADDRINUSE)
Si el puerto 3002 está ocupado:
```bash
# Windows
netstat -ano | findstr :3002  # Encontrar PID
taskkill //F //PID <PID>  # Matar proceso
```

### API devuelve datos pero página no muestra
1. Hard refresh: Ctrl + Shift + R
2. Verificar consola del navegador (F12)
3. Verificar Network tab para ver respuesta de API

### Datos no aparecen después de seed
1. Verificar que el seed se ejecutó correctamente en Supabase
2. Comprobar que `DATABASE_URL` en `.env` es correcta
3. Testear API directamente: `curl http://localhost:3002/api/listings`

---

## 🔗 Repositorio

**GitHub**: https://github.com/vtornet/pisocampus
- Branch principal: `main`
- Primer commit: 23 Abril 2026
- Proyecto inicializado y conectado a remote origin
