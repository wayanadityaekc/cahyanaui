# Cahyana Website — Vanilla JS to Next.js Migration Brief
## For: Architect agent (Claude Code)

## Objective
Migrate cahyanaubudexperience.com from vanilla HTML/CSS/JS to Next.js + React + Tailwind CSS. This is a three-part stack decision — Next.js, React, and Tailwind — not a Next.js-only move.

## Hard constraints (non-negotiable)
- Final visual output must remain 100% pixel-identical to the current site: same colors, spacing, fonts, layout. Tailwind is a styling-implementation change only, not a redesign.
- No code comments anywhere in the code you write. Aditya adds his own comments separately.
- **STOP after completing the architecture plan below, before writing any page components.** Wait for Aditya's explicit confirmation before starting the build phase.

## Phase 1 — Architecture plan only (this phase)
Produce a written plan covering:

1. **Folder structure** — proposed Next.js project layout.
2. **Routing plan** — how pages map to routes.
3. **Component breakdown** — what gets split into reusable components vs page-local content.
4. **State management approach** — what's needed (My Trips cart, login session, currency selector, etc.) and how it's handled.
5. **Tailwind styling approach** — how existing CSS maps to Tailwind utility classes/config, preserving the current design system.
6. **Per-page/section rendering decision** — SSR, static generation, or client-side rendering for each page/section, with reasoning.
7. **URL preservation plan** — keep every existing URL slug exactly as-is, or provide a full redirect map for anything that must change. No broken links, no silent slug changes.
8. **SEO infrastructure plan** — schema markup, structured data, meta tags, and sitemap generation.
9. **Pricing/data flow plan** — master pricing and price calculation move to the backend (existing cahyana-api on Railway) as the single source of truth. The frontend only displays API-returned prices; it never calculates or trusts its own copy of a price. Define the exact fetch pattern against cahyana-api.
10. **Logic flows to migrate as-is** — see list below. Plan how each one ports over without being redesigned.
11. **Link/button/card click-through map** — every existing link, button, and card click-through (e.g. Book Now, card navigation) mapped and preserved exactly: same destination, same behavior as the current site.
12. **Image handling plan** — how moving to Next.js's Image component changes loading behavior vs the current vanilla JS approach; flag anything that could affect visual output or page speed.

## Logic-driven flows that must migrate as-is (not redesigned or simplified)
- Booking form
- Search/filter form
- Review submission + anti-spam gate (booking-verification gate stays exactly as it works now)
- Payment flow
- Account identity + session — unique by email + phone combination; matching either field on a new booking links to the existing account instead of creating a duplicate. Browser-session login persistence stays as-is.
- Pricing calculation
- Currency converter
- Referral discount system

## Parked / open item — do not decide unilaterally
Whether reviews currently support a booking-reference-number path (in addition to the logged-in-account path) is unresolved. Do not assume either way. If this becomes relevant to the architecture plan, flag it explicitly and ask rather than deciding.

## Context for reference
- Current repo: vanilla HTML/CSS/JS, multi-page site (index, about-us, activities, contact, itinerary, bali-guide, 12 tour program pages, 52+ attraction/destination pages, legal pages).
- Backend: cahyana-api (Node/Express + PostgreSQL on Railway) — already exists, already handles some endpoints; pricing/calculation logic needs to move fully server-side as part of this migration.
- Established current-site patterns worth knowing: JS-fetched partials, initPage pattern, BEM-ish CSS, state→render JS pattern, multi-currency navbar switcher, My Trips cart-style flow.

## Process reminder
- **Phase 1 (now):** architecture and planning only. No page components written yet.
- **Checkpoint:** stop, present the full plan, wait for Aditya's explicit go-ahead.
- **Phase 2 (after confirmation, separate session):** model switches to Sonnet for the repetitive page-building work, using the confirmed architecture as the spec.
