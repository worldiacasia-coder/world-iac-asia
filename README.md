# 5 Gold Stars of the Kitchen — World IAC Asia Portal

Full-stack portal for managing IAC Asia members, judge profiles, interactive regional map, and RBAC authentication.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — Michelin-inspired clean UI
- **Prisma** + SQLite (dev) — database ORM
- **JWT sessions** (jose + httpOnly cookies)
- **bcryptjs** — password hashing

## Features

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero, mission, news slider, benefits |
| IAC Network Map | `/map` | Interactive SVG map — 10 Asian countries |
| Judges | `/judges` | RBAC-protected sensitive data, 5-star ratings |
| Members | `/members` | Search/filter, expiry blur + red badge |
| Training | `/training` | Courses + registration form |
| Partners | `/partners` | Logo marquee + contact form |
| Auth | `/auth` | Login / Register tabs |
| Admin | `/admin` | Judge star editor + submissions dashboard |

## Multilingual (i18n)

- **Vietnamese:** [http://localhost:3000/vi](http://localhost:3000/vi)
- **English:** [http://localhost:3000/en](http://localhost:3000/en)
- Switch language via **VI / EN** toggle in the header
- Powered by `next-intl` with locale-prefixed routes

## Quick Start

```bash
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@worldiacasia.com | Admin@123456 |
| Member | member@worldiacasia.com | Member@123456 |

## RBAC Rules

- **Guest**: sees judge name, avatar, title, country, stars — sensitive data masked
- **Member / Admin**: full judge profiles revealed
- **Admin only**: can update judge star ratings (1–5)

## Member Expiry Logic

A member card shows blur + **"Đã hết hạn"** badge when:

```
current_date > expiration_date AND payment_status === 'unpaid'
```

## Environment Variables

Copy `.env` and update for production:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
ADMIN_EMAIL="admin@worldiacasia.com"
ADMIN_PASSWORD="Admin@123456"
```

For production, switch `DATABASE_URL` to PostgreSQL:

```
DATABASE_URL="postgresql://user:pass@host:5432/worldiac"
```

Then run `npx prisma db push`.

## Project Structure

```
src/
├── app/           # Pages & API routes
├── components/    # UI components
└── lib/           # Auth, prisma, utils, constants
prisma/
├── schema.prisma  # Database models
└── seed.ts        # Sample data
```
