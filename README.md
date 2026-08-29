# Scanosh

Scanosh est une plateforme de **menus digitaux par QR code** pour cafés, restaurants et snacks. Le gérant met à jour sa carte (catégories, plats, photos, prix, disponibilité) ; le client scanne un QR et voit toujours la version actuelle, sans réimprimer.

Site de référence : [www.scanosh.com](https://www.scanosh.com)

## Ce que fait le produit

- **Menu public** : landing du café, catégories en arbre, fiches produits, prix en DH, itinéraire (adresse / GPS).
- **Dashboard gérant** (`admin`) : identité du café, logo et couverture, catégories, produits, génération du QR.
- **Console plateforme** (`superadmin`) : cafés, activation, reset mot de passe, demandes de changement de QR, logs d’activité, stockage Cloudinary.
- **QR verrouillé** : une fois généré, le slug / QR ne change plus sans validation superadmin.
- **Auth** : inscription, vérification email, login, mot de passe oublié (code à 6 chiffres).
- **Langues** : français et arabe (RTL) pour l’interface. Les textes des plats restent ceux saisis par le gérant.

## Architecture

Monorepo npm workspaces :

| Dossier | Rôle | Stack |
|---|---|---|
| `frontend/` | SPA marketing, dashboard, menu public | React 19, Vite, React Router, Tailwind CSS 4 |
| `backend/` | API REST | Express 5, Prisma, PostgreSQL, JWT, Zod, Cloudinary |

Les routes API sont montées sous `/api`. En production, le frontend est déployé sur Vercel (domaine `scanosh.com` + wildcard) et le backend aussi (API séparée).

### Hôtes (production)

Le frontend choisit l’écran selon le hostname (`frontend/src/utils/hosts.js`) :

| Host | Rôle |
|---|---|
| `scanosh.com` / `www.scanosh.com` | Site marketing / SEO |
| `app.scanosh.com` | Dashboard café |
| `platform.scanosh.com` | Console superadmin |
| `{slug}.scanosh.com` | Menu public du café |

En local (`localhost` ou preview Vercel), tout est unifié : menu via `/menu/:slug`, app via `/app`, plateforme via `/platform`.

### Rôles

- **admin** : un compte lié à un café (`/app`).
- **superadmin** : administration multi-cafés (`/platform`).

## Prérequis

- Node.js 20+
- PostgreSQL
- Compte [Cloudinary](https://cloudinary.com) (images)
- Optionnel : Resend ou SMTP pour les emails de vérification / reset

## Installation

```bash
git clone <repo>
cd scan
npm install
```

Copier les exemples d’environnement :

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Renseigner au minimum côté backend : `DATABASE_URL`, `DIRECT_URL` (même valeur en local ; en prod, l’URL **sans** pooler), `JWT_SECRET`, et les clés Cloudinary.  
Côté frontend : `VITE_API_URL` (ex. `http://localhost:5000/api`).

Puis :

```bash
npm run db:migrate
npm run seed          # optionnel : café démo + comptes
npm run dev           # API :5000 + Vite :5173
```

Santé API : `GET http://localhost:5000/api/health`

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Backend + frontend en parallèle |
| `npm run dev:frontend` | Vite seul |
| `npm run dev:backend` | API avec `--watch` |
| `npm run db:migrate` | Migrations Prisma |
| `npm run seed` | Données de démo |
| `npm test` | Tests backend (Jest) + frontend (node:test) |
| `npm run lint` | ESLint des deux workspaces |

## API (aperçu)

Préfixe : `/api`

- Public : `GET /health`, `GET /menu/:slug`, auth (`/auth/register`, `/login`, reset, etc.)
- Gérant : `/me/cafe`, `/me/categories`, `/me/products`, `/me/stats` (alias legacy : `/cafe`, `/categories`, `/products`, `/dashboard/stats`)
- Superadmin : `/platform/cafes`, `/platform/qr-requests`, `/platform/logs`, `/platform/storage`

Le détail des handlers est dans `backend/src/routes/`.

## Structure utile

```
backend/src/routes/     # endpoints Express
backend/prisma/        # schéma et migrations
frontend/src/pages/     # écrans React
frontend/src/i18n/      # FR / AR
frontend/src/utils/hosts.js
frontend/src/content/seo/   # pages marketing
```

## Licence

Projet privé — Scanosh / Adnan Elmenouar.
