# Aureo — Bookmark Manager

A full-stack bookmarking application built as a Turborepo monorepo. Save, organize, and manage your bookmarks with tags, search, pin, and archive support.

## Tech Stack

**Frontend**

- React 19 + Vite + TanStack Router (file-based routing)
- TanStack React Query, Zustand, React Hook Form + Zod
- Tailwind CSS v4, Radix UI, Lucide React, Sonner

**Backend**

- NestJS 11 (Express adapter)
- Prisma ORM v7 + PostgreSQL
- Redis + BullMQ (job queues)
- JWT authentication, Nodemailer, Swagger/OpenAPI

**Shared**

- `@aureo/ui` — component library (Radix UI + shadcn conventions)
- `@aureo/ts-config` — shared TypeScript configs
- `@aureo/eslint-config` — shared ESLint configs

## Monorepo Structure

```
.
├── apps/
│   ├── backend/          # NestJS API
│   └── frontend/         # React + Vite app
├── packages/
│   ├── ui/               # Shared component library
│   ├── ts-config/        # Shared TypeScript configs
│   └── eslint-config/    # Shared ESLint configs
└── turbo.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- Redis

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd bookmarking

# Install dependencies
npm install
```

### Environment Variables

**Backend** — create `apps/backend/.env`:

```env
# App
NODE_ENV=development
PORT=3000
API_PREFIX=api
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aureo

# JWT
JWT_SECRET=your-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Mail
MAIL_USER=your@email.com
MAIL_PASS=your-app-password
MAIL_FROM=Aureo <your@email.com>

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_PASSWORD=     # required for Upstash / production
# REDIS_TLS=true      # required for Upstash / production
```

**Frontend** — create `apps/frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### Database Setup

```bash
cd apps/backend
npm run db:migrate:dev
```

### Running Locally

```bash
# Start all apps (from repo root)
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Swagger docs: http://localhost:3000/api/docs
- BullBoard: http://localhost:3000/queues

## Scripts

### Root

| Command          | Description                   |
| ---------------- | ----------------------------- |
| `npm run dev`    | Start all apps in dev mode    |
| `npm run build`  | Build entire monorepo         |
| `npm run lint`   | Lint all workspaces           |
| `npm run format` | Format all code with Prettier |

### Backend (`apps/backend`)

| Command                     | Description                    |
| --------------------------- | ------------------------------ |
| `npm run dev`               | Start in watch mode            |
| `npm run build`             | Prisma generate + NestJS build |
| `npm run start:prod`        | Start production build         |
| `npm run db:migrate:dev`    | Run Prisma migrations (dev)    |
| `npm run db:migrate:deploy` | Deploy migrations (production) |
| `npm run db:studio`         | Open Prisma Studio             |
| `npm run test`              | Run unit tests                 |
| `npm run test:e2e`          | Run e2e tests                  |
| `npm run test:cov`          | Generate coverage report       |

### Frontend (`apps/frontend`)

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start Vite dev server         |
| `npm run build`   | TypeScript check + Vite build |
| `npm run preview` | Preview production build      |

## Deployment

**Frontend** → [Vercel](https://vercel.com)

**Backend** → [Render](https://render.com)

**Database** → [Neon](https://neon.tech) (free tier)

**Redis** → [Upstash](https://upstash.com) (free tier)
