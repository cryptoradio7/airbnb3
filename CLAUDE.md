# CLAUDE.md — airbnb3

## Stack
- Next.js 15 + TypeScript + Tailwind CSS
- NextAuth.js + Prisma + SQLite
- Lucide React (icônes)

## Conventions de code

### Structure des fichiers
- Components : `PascalCase.tsx` dans `src/components/`
- Pages : `page.tsx` dans `src/app/{route}/`
- API routes : `route.ts` dans `src/app/api/{route}/`
- Types : `types.ts` dans `src/types/`
- Utilitaires : `lib/{name}.ts`

### Nommage
- Variables : `camelCase`
- Composants : `PascalCase`
- Fichiers : `kebab-case` pour pages, `PascalCase` pour composants
- Classes Tailwind : regroupées par fonction (layout, typography, colors)

### Imports
```typescript
// Ordre des imports
1. React / Next.js
2. Bibliothèques tierces
3. Composants locaux
4. Utilitaires
5. Types
6. Styles
```

### Tailwind CSS
- Utiliser les classes utilitaires directement
- Éviter `@apply` sauf pour les patterns récurrents
- Design system Airbnb : couleurs `#FF385C`, `#222222`, `#717171`

## Commandes

### Développement
```bash
npm run dev          # Démarre le serveur de dev
npx prisma studio    # Interface DB
```

### Base de données
```bash
npx prisma generate  # Génère le client Prisma
npx prisma db push   # Met à jour la DB
npx prisma db seed   # Seed les données
```

### Build & déploiement
```bash
npm run build        # Build production
npm run start        # Lance le build
vercel deploy        # Déploie sur Vercel
```

## Règles spécifiques

### Authentification
- Utiliser `useSession()` de NextAuth
- Protéger les routes avec middleware
- Hash des mots de passe avec bcryptjs

### API Routes
- Retourner des réponses JSON standardisées
- Gérer les erreurs avec try/catch
- Validation des inputs avec Zod

### Composants
- Server Components par défaut
- Client Components seulement si nécessaire (`'use client'`)
- Props typées avec TypeScript

### Base de données
- Toujours utiliser Prisma Client (`import prisma from '@/lib/prisma'`)
- Gérer les transactions pour les opérations multiples
- Seed avec des données réalistes (France)

## Git
- Commit fréquents avec messages descriptifs
- .gitignore : node_modules, .env, .next, *.db
- Branche main protégée
