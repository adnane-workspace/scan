# QTable

Digital QR menus for cafes and restaurants. Cafe managers run their menu; a platform superadmin manages cafes, QR change requests, logs, and storage.

## Stack

- Frontend: React 19, Vite, Tailwind CSS 4
- Backend: Express 5, Prisma, PostgreSQL
- Images: Cloudinary (`CLOUDINARY_FOLDER`, default `digital-menu` — do not rename if assets already exist)

## App URLs

| Space | Path |
| --- | --- |
| Marketing landing | `/` |
| Public menu (printed QR) | `/menu/:slug` |
| Cafe manager | `/app`, `/app/categories`, `/app/products`, `/app/settings` |
| Platform superadmin | `/platform`, `/platform/cafes`, `/platform/qr-requests`, `/platform/logs`, `/platform/storage` |
| Auth | `/login`, `/register`, `/forgot-password` |

Legacy `/dashboard/*` URLs redirect to `/app` or `/platform` by role.

## API

Prefix: `/api`

- Auth: `/auth`
- Manager (current cafe): `/me/cafe`, `/me/categories`, `/me/products`, `/me/stats`
- Platform: `/platform/*`
- Public menu: `/menu/:slug`
- Health: `/health`

Older manager paths (`/cafe`, `/categories`, `/products`, `/dashboard/stats`) remain as aliases.

Error responses include a stable `code` (for i18n) plus an English `message` fallback.

## Setup

```bash
npm install
cp backend/.env.example backend/.env
# set DATABASE_URL, JWT_SECRET, Cloudinary, and optional SMTP/Resend
npm run db:migrate
npm run seed
npm run dev
```

Frontend: [http://localhost:5173](http://localhost:5173)  
API: [http://localhost:5000/api](http://localhost:5000/api)

## Scripts

- `npm run dev` — backend + frontend
- `npm run db:migrate` — Prisma migrate
- `npm test` — backend Jest + frontend path/error helpers
- `npm run lint`

## Environment

See [backend/.env.example](backend/.env.example). Notable variables:

- `DATABASE_URL` — PostgreSQL
- `JWT_SECRET` / `JWT_EXPIRES_IN`
- `CLIENT_URL` — frontend origin(s), used in CORS and QR-change emails
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`
- `MAIL_FROM`, `SMTP_*` or `RESEND_API_KEY`
- Frontend: `VITE_API_URL`, optional `VITE_PUBLIC_APP_URL` for printed menu links
