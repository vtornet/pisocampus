# Alojamiento Estudiantes

PWA para búsqueda de alojamiento estudiantil en España.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start
```

## 📁 Estructura del Proyecto

```
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Componentes React
│   │   ├── ui/          # shadcn/ui components
│   │   ├── shared/      # Componentes compartidos
│   │   ├── auth/        # Componentes de autenticación
│   │   ├── dashboard/   # Dashboard components
│   │   └── marketplace/ # Marketplace components
│   ├── lib/             # Utilidades
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript types
├── public/              # Archivos estáticos
└── CLAUDE.md           # Documentación del proyecto
```

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **PWA**: next-pwa
- **Database**: PostgreSQL + Drizzle ORM (pendiente)
- **Auth**: Auth.js (pendiente)
- **Payments**: Stripe (pendiente)

## 📋 Tareas Pendientes

- [ ] Configurar base de datos PostgreSQL
- [ ] Configurar Drizzle ORM
- [ ] Configurar Auth.js con Google OAuth
- [ ] Implementar sistema de búsqueda
- [ ] Crear páginas de autenticación
- [ ] Crear dashboard de anunciantes
- [ ] Implementar tablón de compañeros

## 📝 Scripts

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run start` - Inicia servidor de producción
- `npm run lint` - Ejecuta linter
- `npm run type-check` - Verifica tipos TypeScript
