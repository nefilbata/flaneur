# Flaneur Product Context

## Register

product

## Product Purpose

Flaneur is a personal food exploration journal for wandering a city through taste. It lets a food lover record meals, collect visual memories, understand their taste profile, and unlock achievements through repeated exploration.

The product began as a single-user gift experience and should feel intimate, polished, and personal. Future versions may expand into multi-user sharing, but the current product should prioritize one person's private archive over social feed mechanics.

## Audience

Primary user: a food lover who enjoys exploring restaurants, neighborhoods, cuisines, and seasonal meals. They use the app mostly on mobile, often shortly after eating or while reviewing recent meals.

Secondary future user: a friend or partner invited into the archive for shared food memories, restaurant ideas, or lightweight co-recording.

## Product Principles

- Mobile first. The app should work beautifully at 375px, 390px, and 430px widths.
- Record first, decorate second. The daily meal recording flow must remain the fastest path.
- Taste as memory. Photos, notes, flavor scores, dates, and places should feel like parts of one personal ritual.
- Quiet delight. Use animation for meaningful moments such as saving a record, unlocking an achievement, revealing a scratch card, or switching seasons.
- Personal collection over public feed. Avoid social-media-like ranking, comments, likes, or noisy notifications.
- Visual density must stay calm. Cards, calendars, stickers, and badges should feel collectible, not crowded.

## Brand Meaning

Flaneur comes from the French idea of a city wanderer: someone who observes, strolls, notices, and savors small details. In this product it means a food explorer who wanders the city through taste.

Brand tone: elegant, warm, calm, observant, lightly literary, and tactile.

Avoid: loud gamification, neon reward language, generic dashboard phrasing, harsh contrast, and dense enterprise UI.

## Core Experience

The home page is the daily anchor. Users see a monthly calendar, tap dates with existing meal records to open details, tap empty dates or the floating add button to create a record, and review simple monthly stats.

Food records include:
- photos, with the first photo as cover
- dish name
- restaurant name
- restaurant address
- cuisine tags
- overall rating
- six flavor scores: umami, spicy, sweet, aromatic, sour, rich
- tasting notes
- cost per person
- record date

Existing records can be reopened and edited. The detail panel should appear high enough in the viewport that mobile users can read the content without hunting for it, and editing should preserve the feeling of a polished record card rather than a raw database form.

## Current Product Flows

### Calendar Check-In

Users browse a month view. Dates with records show food photo thumbnails. Empty dates show a subtle dashed state. Tapping a recorded date opens the record detail panel. Tapping an empty date opens the record form for that date.

Monthly stats summarize record count, unique restaurants, and most frequent cuisine.

### Record Creation

The record form slides up from the bottom on mobile and appears as a modal on wider screens. It supports multiple photos, cuisine tags, overall star rating, flavor dimensions, tasting notes, and cost.

### Record Detail And Editing

The detail panel shows photos, dish and restaurant information, date, tags, rating, flavor profile, notes, and cost. A pencil action switches into edit mode. Saving updates the in-memory record list in the current app session.

### Sticker Album

The sticker album turns food photos into collectible sticker-like cards. Stickers should remain small enough on mobile that at least two complete stickers can be seen in one screenful.

### Achievements

The achievements page presents an unlocked and locked badge grid. Pending achievements can be scratched open in a fixed modal. The scratch card should be immediately visible in the current viewport and should lock background scrolling while open.

### Flavor Archive

The flavor archive expresses accumulated taste preferences through a radar chart and generated flavor title. Flavor data is based on the six flavor dimensions.

### Seasonal Scroll

The seasonal page groups food records by spring, summer, autumn, and winter. It should feel like a horizontal seasonal scroll or album, with each season carrying a distinct but restrained atmosphere.

### Food Map

The map page is intended to represent explored places and areas of the city being gradually lit up. Current implementation may be a preview, but future work should support visited restaurant points, neighborhood progress, and recent explorations.

## Information Architecture

Primary navigation has five product tabs:
- Home: calendar check-ins and record creation
- Map: explored places and city progress
- Flavor: taste profile and flavor data
- Seasons: seasonal food archive
- Achievements: badges and scratch-card reveals

Supporting surfaces:
- Sticker Album: collectible photo stickers
- Buddy: future shared exploration concept
- Welcome Overlay: first-run orientation
- Theme Toggle: light and dark modes

## Interaction Guidelines

- Bottom navigation stays compact on mobile and must not crowd page content.
- Floating add button sits above bottom navigation and should not cover the last home card.
- Modal and bottom-sheet content must respect visible viewport height.
- Background scroll should lock when high-priority modals are open.
- Touch targets should remain comfortable even when visual elements are compact.
- Use line icons from Lucide React for actions.
- Use text labels only when they clarify the action.

## Data Model Summary

Core entities:
- user
- food record
- food photo
- achievement
- explored area

Food records are the source of truth for calendar thumbnails, sticker generation, flavor archive calculations, achievement checks, seasonal grouping, and map progress.

## Technical Direction

Current stack:
- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Supabase
- Recharts
- Lucide React
- Canvas API for scratch-card reveal

Development preference:
- Keep feature code componentized by product surface.
- Preserve App Router conventions.
- Read `node_modules/next/dist/docs/` before changing Next.js APIs or file conventions.
- Use demo records when Supabase credentials are absent.
- Keep mobile responsiveness as a release gate.

## Quality Bar

Every shipped change should pass:
- `npm run lint`
- `npm run build`

Visual checks should include:
- home calendar and detail/edit flow at 375px
- achievement grid and scratch-card modal at 375px
- sticker album density at 375px
- bottom navigation and floating add button overlap

