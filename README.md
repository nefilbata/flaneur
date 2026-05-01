# Flaneur

Personal food exploration journal for wandering a city through taste.

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Supabase
- Recharts
- Lucide React

## Getting Started

1. `npm install`
2. Copy `.env.example` to `.env.local`
3. Fill in your Supabase credentials
4. `npm run dev`

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Calendar check-ins
- Food map exploration preview
- Flavor radar archive
- Seasonal scroll
- Scratch-card achievements

## Database

The initial Supabase schema is in:

```text
supabase/migrations/202604300001_initial_schema.sql
```

The app uses demo records when Supabase environment variables are not configured.

## Quality Checks

```bash
npm run lint
npm run build
```
