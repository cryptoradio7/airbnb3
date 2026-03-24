# Architecture — airbnb3

## Stack technique

### Frontend
- **Next.js 15** (App Router) — SSR natif, SEO, performances
- **TypeScript** — typage statique, maintenabilité
- **Tailwind CSS** — design system, responsive
- **NextAuth.js** — authentification complète (credentials + OAuth)
- **Lucide React** — icônes

### Backend
- **Next.js API Routes** — API intégrée
- **Prisma 5.0.0** — ORM type-safe
- **SQLite** — base de données simple pour MVP
- **bcryptjs** — hash des mots de passe

### Déploiement
- **Vercel** — déploiement automatique via GitHub
- **GitHub Actions** — CI/CD optionnel

## Justification des choix

### Next.js 15
- SSR natif pour SEO (listings, pages publiques)
- App Router moderne avec layouts imbriqués
- Optimisations automatiques (images, fonts)
- Écosystème React riche

### Prisma + SQLite
- SQLite : simple, pas de serveur DB à gérer pour MVP
- Prisma : schéma type-safe, migrations, seed facile
- Scalable vers PostgreSQL en production

### NextAuth.js
- Solution complète d'authentification
- Support credentials (email/mot de passe) + OAuth (Google, GitHub)
- Sessions sécurisées, middleware
- Intégration Prisma via @auth/prisma-adapter

## Structure du projet

```
airbnb3/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Routes auth (login, register)
│   │   ├── (dashboard)/     # Dashboards hôte/voyageur
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # NextAuth
│   │   │   ├── listings/    # CRUD annonces
│   │   │   ├── bookings/    # Réservations
│   │   │   └── messages/    # Messagerie
│   │   ├── listings/        # Pages listings
│   │   ├── search/          # Page recherche
│   │   └── layout.tsx       # Layout global
│   ├── components/          # Composants React
│   ├── lib/                 # Utilitaires (prisma, auth)
│   └── types/               # Types TypeScript
├── prisma/
│   ├── schema.prisma        # Schéma DB
│   └── seed.ts              # Données de test
├── public/                  # Assets statiques
└── ARCHITECTURE.md          # Ce fichier
```

## Décisions d'architecture

### 1. Authentification
- NextAuth.js avec adapter Prisma
- Sessions JWT sécurisées
- Middleware pour protéger les routes

### 2. Base de données
- SQLite pour développement/MVP
- Schéma normalisé (User, Listing, Booking, Message, Review)
- JSON arrays pour images et amenities

### 3. Upload d'images
- Cloudinary pour production
- Upload local pour MVP (public/uploads/)

### 4. Messagerie
- Polling simple pour MVP (pas de WebSocket)
- API REST avec SSE optionnel

### 5. Recherche
- Filtrage côté serveur (Prisma)
- Pagination infinie

## Environnement détecté
- OS : Linux
- Display server : Wayland/X11 (non pertinent pour web)
- Node.js : v22.22.1
- Git : disponible

## Commands utiles
```bash
# Développement
npm run dev

# Build
npm run build
npm run start

# Base de données
npx prisma generate
npx prisma db push
npx prisma db seed

# Déploiement
vercel deploy --prod
```
