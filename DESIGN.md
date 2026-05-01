# Flaneur Design Context

## Design Intent

Flaneur should feel like a private food notebook with a refined collectible layer. The UI is quiet, tactile, and lightly editorial, but it is still a functional product interface. The user should feel invited to record a meal quickly, then linger over the archive later.

The dominant physical metaphor is paper, album, and soft memorabilia: calendar cells, sticker cards, badge cards, gentle paper grain, and warm surfaces.

## Visual Keywords

- warm paper
- soft rose
- mist blue
- charcoal ink
- fine line icons
- quiet motion
- collectible cards
- mobile-first album

## Theme

Primary scene: a user opens the app on a phone after a meal or during a quiet evening review. Ambient light may be indoor, warm, and low contrast. The interface should reduce glare, preserve readability, and feel calm rather than clinical.

Default theme is light with warm paper surfaces. Dark mode exists as a softer evening mode and should never become high-contrast black.

## Color System

Current tokens live in `src/styles/globals.css`.

Core light palette:
- Background: `#f8f3ec`, warm paper
- Surface: `#fffaf3`, elevated paper card
- Soft: `#efe7dc`, subtle controls and empty states
- Primary: `#c9a9a6`, smoky rose
- Primary strong: `#ad8581`, stronger rose for active states
- Secondary: `#a8b5c8`, mist blue
- Charcoal: `#2c2c2c`, primary text
- Muted: `#766f68`, secondary text
- Border: `#e5d8ca`, soft dividers
- Success: `#789376`
- Warning: `#d8aa5a`

Color strategy: restrained. Tinted neutrals carry most of the surface, with smoky rose used for active states, important buttons, unlock cues, and selected controls. Mist blue may support map or seasonal moments but should not dominate the whole app.

Avoid pure black and pure white in new surfaces. Prefer tinted neutrals that sit within the existing palette.

## Typography

Current font pairing:
- Display and serif headings: Playfair Display with Chinese serif fallback
- Body and UI text: Libre Franklin with Chinese sans fallback

Hierarchy:
- Page titles should feel elegant but compact on mobile.
- Card titles should stay restrained, generally `text-base` to `text-xl`.
- Utility labels, dates, and metadata should use small sans text.
- Long notes should prioritize readability with generous line height and modest width.

Mobile scale guidance:
- Page title: about 30px to 36px on small screens
- Card title: about 16px to 20px
- Body text: about 13px to 15px
- Metadata: about 11px to 12px

## Layout

Mobile is the primary canvas.

Global page padding should stay around 16px to 20px on mobile. Cards should not fill the screen so aggressively that a single item monopolizes a viewport. Bottom content needs enough padding to clear the fixed navigation and floating add button.

Preferred mobile behaviors:
- Calendar cells remain compact, square, and stable.
- Achievement grid uses two columns with clear gaps.
- Sticker cards use `min(240px, 65vw)` on mobile so at least two complete stickers can be visible in one screenful.
- Record detail opens near the upper-middle of the viewport, around `top: 15vh`, with `max-height: 80vh`.
- High-priority modals should be fixed to the viewport and lock background scroll.

Cards:
- Use cards for actual repeated records, badges, stickers, modals, and framed tools.
- Do not nest cards inside cards.
- Avoid decorative card sections that are not meaningful objects.
- Existing global `.card` is acceptable for product surfaces.

Border radius:
- The current app uses soft rounded cards. Maintain existing radius unless solving a specific density issue.
- Compact controls can use full pills or circles.

## Components

### Bottom Navigation

Mobile bottom navigation is fixed, compact, and icon-led. It should stay visually quiet and not steal vertical space from the calendar or cards.

Active tab uses primary strong fill and surface text. Inactive tabs use muted text with soft hover.

### Floating Add Button

The add button is a 48px circle placed above the bottom navigation, 20px from the right edge. It uses the primary color, a white plus icon, and a modest shadow.

The plus line should feel fine, with Lucide stroke width around 2.

### Calendar

Calendar cells are square and compact. Records show food thumbnails clipped fully inside each cell. Today state should be visible but not oversized. Empty days use subtle dashed borders.

### Record Form

The form is a bottom sheet on mobile and a centered modal on larger screens. Inputs are clear and touch-friendly. Photo upload comes first because it anchors the memory.

Required fields should be obvious without shouting.

### Record Detail

The detail view is both a display card and an edit entry point. View mode should look like a polished memory card. Edit mode should preserve the same shell and only reveal editable fields where needed.

### Sticker Album

Sticker cards should feel collectible and slightly playful through tilt, rounded photo framing, and soft shadow. Keep the size restrained on mobile.

### Achievements

Achievement cards must avoid overlap. Use a stable grid, explicit gaps, and self-contained card heights. Locked achievements can blur or mute text, but readable unlocked content is more important than mystery styling.

Scratch-card modal should appear centered in the current viewport, with a dimmed backdrop and no background scrolling.

### Flavor Archive

Charts should feel soft and personal, not analytics-heavy. Radar charts can use rose and mist blue accents, with gentle grid lines and concise labels.

### Seasonal Scroll

Each season may shift atmosphere through background tint, small decorative cues, and image tone, but the interface should remain part of the same product family.

## Motion

Motion should be light and meaningful.

Use Framer Motion for:
- page entry
- modal entry and exit
- calendar month transitions
- record save affordances
- achievement scratch reveal
- seasonal transitions

Avoid:
- bounce
- elastic motion
- constant decorative animation
- layout-shifting animations that move content unpredictably

Preferred feel: short ease-out movement, subtle opacity changes, and gentle scale on touch feedback.

## Accessibility And Responsiveness

Baseline viewport checks:
- 375px small phones
- 390px standard phones
- 430px large phones

Requirements:
- No horizontal overflow.
- No modal content that starts below the visible screen.
- Touch targets remain usable.
- Text must not overlap icons or other text.
- Bottom navigation and FAB do not cover primary content.
- Images in calendar cells and stickers must stay clipped within their containers.

## Anti-Patterns

Avoid:
- oversized mobile cards
- dense card grids without clear gaps
- modal content inserted into document flow instead of fixed to viewport
- pure marketing landing page treatment for product surfaces
- neon achievement language
- social feed conventions
- generic dashboard styling
- heavy glassmorphism
- gradient text
- decorative side-stripe card borders

## Implementation Notes

Use Tailwind utility classes for component styling, with global tokens in `src/styles/globals.css`.

When modifying Next.js routing, layout, images, fonts, or CSS behavior, read the relevant local guide in `node_modules/next/dist/docs/` first because this project uses Next.js 16 with current App Router conventions.

