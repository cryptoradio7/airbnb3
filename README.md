# airbnb3

Une application de location de logements inspirée d'Airbnb, développée avec Next.js 15. Elle permet aux voyageurs de rechercher et réserver des logements, et aux hôtes de gérer leurs annonces, leurs réservations et leurs revenus.

## Fonctionnalités

- 🔍 Recherche et filtrage de logements (ville, dates, voyageurs, prix, équipements)
- 🏠 Fiches détaillées avec galerie d'images, équipements, avis et widget de réservation
- 👤 Authentification (email/mot de passe) via NextAuth
- 🧳 Dashboard voyageur : réservations à venir, passées, favoris, messagerie
- 🏡 Dashboard hôte : gestion des annonces, réservations, calendrier, revenus
- 💬 Messagerie en temps réel entre voyageurs et hôtes
- ⭐ Système d'avis et de notes
- ❤️ Favoris

## Prérequis

- [Node.js](https://nodejs.org/) **18+**
- npm 9+
- Git

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/cryptoradio7/airbnb3.git
cd airbnb3

# Installer les dépendances
npm install
```

## Variables d'environnement

Copier `.env.example` en `.env` et remplir les valeurs :

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Chemin vers la base SQLite (ex: `file:./dev.db`) |
| `NEXTAUTH_SECRET` | Secret aléatoire pour NextAuth (générer avec `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | URL de l'application (ex: `http://localhost:3000`) |

## Base de données

```bash
# Appliquer le schéma Prisma
npx prisma db push

# Charger les données de test (seed)
npx prisma db seed
```

## Lancement

```bash
# Mode développement
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

```bash
# Build de production
npm run build
npm start
```

## Structure du projet

```
airbnb3/
├── src/
│   ├── app/                        # Routes Next.js App Router
│   │   ├── (auth)/                 # Pages login / register
│   │   ├── api/                    # API Routes
│   │   │   ├── auth/               # Authentification (NextAuth + register)
│   │   │   ├── bookings/           # CRUD réservations
│   │   │   ├── favorites/          # Gestion des favoris
│   │   │   ├── listings/           # CRUD annonces
│   │   │   ├── messages/           # Messagerie
│   │   │   └── users/              # Profils utilisateurs
│   │   ├── bookings/               # Page confirmation réservation
│   │   ├── dashboard/              # Dashboards voyageur et hôte
│   │   ├── listings/[id]/          # Page détail annonce
│   │   └── profile/                # Profil utilisateur
│   ├── components/                 # Composants React réutilisables
│   │   ├── Filters.tsx
│   │   ├── Header.tsx
│   │   ├── ListingCard.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageInput.tsx
│   │   ├── MessageThread.tsx
│   │   └── SearchBar.tsx
│   ├── middleware.ts                # Protection des routes authentifiées
│   └── providers/                  # AuthProvider (SessionProvider)
├── app/                            # Pages racine (homepage, search)
│   ├── api/listings/search/        # API de recherche
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                    # Page d'accueil
│   └── search/                    # Page résultats de recherche
├── components/                     # Composants partagés (racine)
├── prisma/
│   ├── schema.prisma               # Modèles de données
│   ├── seed.ts                     # Données de test
│   └── migrations/                 # Migrations SQL
├── lib/
│   ├── auth.ts                     # Configuration NextAuth
│   └── prisma.ts                   # Client Prisma singleton
├── providers/
│   └── AuthProvider.tsx            # Wrapper SessionProvider
├── public/                         # Assets statiques
├── .env.example                    # Template variables d'environnement
├── .github/workflows/ci.yml        # CI/CD GitHub Actions
├── vercel.json                     # Configuration Vercel
├── prisma.config.ts                # Configuration Prisma
├── tsconfig.json
├── tailwind.config (postcss)
└── package.json
```

## Stack technique

| Composant | Technologie |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Langage | TypeScript 5 |
| Style | [Tailwind CSS 4](https://tailwindcss.com/) |
| Auth | [NextAuth v5](https://authjs.dev/) |
| ORM | [Prisma 7](https://www.prisma.io/) |
| Base de données | SQLite (dev) / LibSQL (prod) |
| Icônes | [Lucide React](https://lucide.dev/) |
| Validation | [Zod](https://zod.dev/) |
| Seed | [@faker-js/faker](https://fakerjs.dev/) |

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Build de production |
| `npm start` | Lance le serveur de production |
| `npm run seed` | Charge les données de test |
| `npx prisma studio` | Interface graphique pour la BDD |
| `npx prisma db push` | Synchronise le schéma |

## Déploiement Vercel

Le projet est configuré pour un déploiement automatique sur Vercel.  
Chaque `git push` sur `main` déclenche un build et un déploiement.

Variables d'environnement à configurer dans le dashboard Vercel :
- `DATABASE_URL` (utiliser une base LibSQL/Turso en production)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (URL de production)

## Licence

MIT
