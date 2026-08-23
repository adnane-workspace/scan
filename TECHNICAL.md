# Digital Menu — documentation technique

Menu digital par QR pour cafés. Monorepo **React + Express + PostgreSQL**, JavaScript uniquement (pas de TypeScript).

Un client scanne un QR → ouvre `/menu/:slug`. Un admin authentifié gère catégories, produits, photos et génère le QR.

Hors périmètre actuel : panier, commandes, paiements, génération QR côté serveur, multi-établissements par compte.

---

## Stack

| Couche | Choix |
| --- | --- |
| Runtime | Node.js ≥ 20, ESM (`"type": "module"`) |
| Frontend | React 19, Vite 8, React Router 7, Tailwind CSS 4, Axios, `qrcode` |
| Backend | Express 5, Prisma 6, Zod 4, JWT, bcrypt, Multer, Helmet, CORS |
| Base | PostgreSQL 16 |
| Images | Cloudinary (obligatoire en local et en prod) |
| Tests | Jest + Prisma (modèles backend) |

Workspaces npm : `frontend/`, `backend/`. Commandes depuis la racine.

---

## Structure du dépôt

```
scan/
├── frontend/                 # SPA Vite
│   └── src/
│       ├── pages/
│       ├── layouts/
│       ├── components/
│       ├── services/         # appels Axios
│       ├── context/          # Auth
│       └── utils/
├── backend/
│   ├── prisma/               # schéma + migrations
│   ├── src/
│   │   ├── config/           # env, Prisma
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── validators/       # schémas Zod
│   │   ├── middleware/
│   │   └── seed.js
│   └── tests/
├── backend/.env              # secrets (non versionné)
└── TECHNICAL.md
```

---

## Architecture backend

Flux d’une requête API :

```
Route → validate(Zod) → Controller → Service → Prisma
                              ↓
                         ApiError / JSON
```

- **Routes** : déclaration Express + middleware auth / upload.
- **Validators** : Zod (`req.validated.body` / `params`).
- **Controllers** : HTTP only (`asyncHandler`).
- **Services** : règles métier, isolation par `req.user.cafeId`.
- **Prisma** : tables Postgres, IDs UUID. Les réponses admin gardent `_id`.

Le serveur charge `backend/.env` via [`backend/src/config/env.js`](backend/src/config/env.js). Variables invalides → `process.exit(1)`.

### Multi-tenant

Chaque admin est lié à **un** `cafeId`. Toutes les opérations catégories / produits / dashboard filtrent sur ce café. Le menu public se résout par `Cafe.slug`, pas par token.

---

## Modèle de données

```mermaid
erDiagram
  Cafe ||--o{ User : has
  Cafe ||--o{ Category : has
  Cafe ||--o{ Product : has
  Category ||--o{ Product : contains

  Cafe {
    string name
    string slug UK
    boolean isActive
    string logo
  }
  User {
    string email UK
    string passwordHash
    string role
    uuid cafeId
  }
  Category {
    uuid cafeId
    string name
    string image
    number order
  }
  Product {
    uuid cafeId
    uuid categoryId
    string name
    number price
    string image
    boolean available
    number order
  }
```

- `User.role` : `admin` uniquement pour l’instant.
- `passwordHash` : jamais renvoyé par l’API (select sans ce champ).
- `Cafe.slug` : kebab-case, unique, URL publique.
- `Cafe.isActive === false` → menu public **403**.
- `Product.available === false` → masqué du menu public.
- `Category.image` / `Product.image` : URL HTTPS Cloudinary.

---

## Auth

JWT Bearer, durée `JWT_EXPIRES_IN` (défaut 7j).

1. `POST /api/auth/login` → `{ token, user }`.
2. Frontend : `localStorage` (`digital-menu-token`, `digital-menu-user`).
3. Axios ajoute `Authorization: Bearer <token>`.
4. 401 (hors login / menu) → purge storage + événement `auth:unauthorized`.
5. `POST /api/auth/logout` : côté client surtout (JWT stateless).

Middleware : `authenticate` puis `requireAdmin` sur tout l’admin.

---

## API

Base : `http://localhost:5000/api`.

Réponse type :

```json
{ "success": true, "message": "...", "data": {} }
```

### Public

| Méthode | Route | Description |
| --- | --- | --- |
| GET | `/health` | Santé API |
| GET | `/menu/:slug` | Menu public (catégories + produits **disponibles**) |

Menu 404 si slug inconnu, 403 si café inactif. Catégories sans produit disponible omises.

### Admin (Bearer)

| Méthode | Route | Description |
| --- | --- | --- |
| POST | `/auth/login` | Connexion |
| GET | `/auth/me` | Profil |
| POST | `/auth/logout` | Logout |
| GET | `/dashboard/stats` | Compteurs, produits récents, café |
| CRUD | `/categories` | Catégories du café |
| POST | `/categories/upload` | Image catégorie → Cloudinary |
| CRUD | `/products` | Produits du café |
| POST | `/products/upload` | Image produit → Cloudinary |

Upload : champ multipart `image`, **JPG / PNG / WEBP / GIF**, max **5 Mo**. Réponse `{ url }`. L’URL est ensuite envoyée dans `POST/PUT` (`image`).

---

## Images (Cloudinary)

Stockage **uniquement Cloudinary**, local et prod. Pas d’écriture disque.

[`backend/src/services/storage.service.js`](backend/src/services/storage.service.js) : buffer Multer → `upload_stream`, dossier `CLOUDINARY_FOLDER` (`digital-menu`).

Les 3 clés `CLOUDINARY_*` sont **obligatoires**. Secret trop court ou incorrect → `Invalid Signature` / `api_secret mismatch`. Après modification du `.env`, **redémarrer** le backend (`node --watch` ne recharge pas l’env).

Dans Cloudinary : **Media Library → Home → `digital-menu`** (pas le dossier `samples`).

Le seed upload avec des `public_id` stables (`seed-espresso`, `seed-category-cafes`, …) : un re-seed **écrase** les mêmes assets.

---

## Frontend

Routes :

| Chemin | Page | Auth |
| --- | --- | --- |
| `/login` | Login | Non |
| `/dashboard` | Stats + QR | Oui |
| `/dashboard/products` | CRUD produits | Oui |
| `/dashboard/categories` | CRUD catégories, reorder | Oui |
| `/dashboard/settings` | Placeholder | Oui |
| `/menu/:slug` | Grille catégories | Non |
| `/menu/:slug/:categoryId` | Grille produits | Non |

Admin : sidebar + header, drawer sous `lg`. Thème Epicurean (Playfair + Inter, primary `#9e3d00`).

### Menu public

Grille photos responsive (`1` col → `5` cols). Carte catégorie : `category.image`, sinon première photo produit. Pas de nav haute / barre basse. Safe-area iOS.

### QR

Généré **côté client** (`qrcode`) dans [`QrCodeModal.jsx`](frontend/src/components/dashboard/QrCodeModal.jsx).

URL encodée :

```
{VITE_PUBLIC_APP_URL || window.location.origin}/menu/{slug}
```

Actions : aperçu, PNG, copie du lien. Un QR `localhost` n’est pas scannable depuis un téléphone.

---

## Variables d’environnement

### `backend/.env`

| Variable | Rôle |
| --- | --- |
| `PORT` | Défaut `5000` |
| `NODE_ENV` | `development` \| `production` |
| `DATABASE_URL` | Ex. `postgresql://postgres:TON_MDP@127.0.0.1:5432/digital-menu` |
| `JWT_SECRET` | ≥ 16 caractères |
| `JWT_EXPIRES_IN` | Ex. `7d` |
| `CLIENT_URL` | Origine CORS frontend (liste séparée par virgules) |
| `CLOUDINARY_CLOUD_NAME` | Obligatoire |
| `CLOUDINARY_API_KEY` | Obligatoire |
| `CLOUDINARY_API_SECRET` | Obligatoire (~27 caractères) |
| `CLOUDINARY_FOLDER` | Défaut `digital-menu` |

Ne jamais committer `.env`.

### `frontend/.env`

| Variable | Rôle |
| --- | --- |
| `VITE_API_URL` | Défaut `http://localhost:5000/api` |
| `VITE_PUBLIC_APP_URL` | Origine du QR (prod : domaine public) |

---

## Commandes

Installer [PostgreSQL](https://www.postgresql.org/download/windows/) (user `postgres`). Dans `psql` ou pgAdmin, crée la base `digital-menu`. Mets le mot de passe dans `DATABASE_URL`.

```bash
npm install
npm run db:migrate
npm run seed
npm run dev
npm run lint
npm test
```

Seed : café **Café Central** (`cafe-central`), admin `admin@example.com` / `DemoAdmin123!`. **Efface** users, cafés, catégories, produits.

Santé : `GET http://localhost:5000/api/health`.

---

## Conventions

- JavaScript only.
- Isolation café via `cafeId`, jamais d’IDs d’un autre tenant.
- Erreurs métier : `ApiError(status, message)`.
- Nouveaux endpoints admin : validator Zod + `authenticate` + `requireAdmin`.
- Images : upload Cloudinary puis URL dans Postgres.

---

## Non implémenté

- Page Settings café (nom, slug, logo, adresse).
- Suppression Cloudinary à la suppression d’un document.
- QR stocké / API QR.
- Commandes, panier, paiements.
- Déploiement (prévu ensuite : mêmes `CLOUDINARY_*` + `VITE_PUBLIC_APP_URL` de prod).
