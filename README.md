# Flaneur

Flaneur is a personal food exploration journal built with Next.js. It starts with a calendar check-in flow and leaves room for a food map, flavor archive, seasonal scroll, and achievement hall.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React
- Supabase

## Local Development

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.local.example .env.local
```

Add your Supabase values when available:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000.

## Database

The initial Supabase schema is in:

```text
supabase/migrations/202604300001_initial_schema.sql
```

The app keeps demo records as a fallback when Supabase environment variables are not configured.

## Quality Checks

```bash
npm run lint
npm run build
```
