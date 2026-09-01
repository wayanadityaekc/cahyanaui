# [MIG-33] Bespoke pages — home, listings, about, contact, faq, charter, transfer, legal

**Agent:** Engine + Atelier · **Depends on:** MIG-10, MIG-11, MIG-12, MIG-20

## Objective
Build the pages that are not template-driven.

## Scope
1. **Home (`/`)** — section order fixed: Hero → Explore/Tours → Airport pickup → Destinations → Why Us → Guides → Villas → Charter → About → Featured On → Reviews. Uniform `--section-gap` (36px) between sections, gold dividers **off** on the homepage, white sections have zero vertical padding, bands keep their inner padding. Hero search form; on mobile (≤992px) the form becomes a bottom sheet behind a "Plan your trip" button, with the scrim inside `.hero__inner` for correct stacking. **No Trip Planner band, no driver cards** — both were removed.
2. **Listing pages** — `tour.html`, `activities.html`, `destinations.html`: zone chips + scrollspy, grid-wrap at every breakpoint (`auto-fill`).
3. **`airport-transfer.html`, `transfer.html`, `charter.html`** — route picker (`initTransferPicker`), charter config and live pricing (`initCharter`), transfer units.
4. **`about-us.html`** — driver cards live here (moved off the homepage), gallery.
5. **`contact.html`** — ⚠️ **the current form POSTs to the literal string `"PASTE_YOUR_APPS_SCRIPT_URL"` with `mode: "no-cors"`, so it fails silently and still shows a success message. Guest messages are being lost today.** Wire it to `POST /api/inquiry` with `type: "contact"` and show success only on a real success response.
6. **`faq.html`** — the only page with FAQ content, plus its `FAQPage` schema.
7. **Legal** — terms, privacy, cancellation, in the `--container-read` 720px column.
8. **`all-reviews.html`**.

## Out of scope
- Adding FAQ blocks to any other page.
- Re-adding the Trip Planner band, the homepage driver cards, the welcome popup, or the floating WhatsApp button.
- Redesigning the homepage section order.

## Input
- The current HTML for each page; `script.js` `initHeroSearch`, `initHeroPlanSheet`, `initExploreTabs`, `initTransferPicker`, `initCharter`, `initAirportTransfer`, `initContact`, `initAboutGallery`, `initDrivers`.
- `CLAUDE.md` — Homepage section order, Listing page tabs, Container widths.

## Acceptance criteria
1. Every page resolves at its exact current path.
2. Homepage section order and 36px rhythm match exactly.
3. Contact form submits successfully to the API and only then shows success. A failed submit shows an error, never a false success.
4. Each page uses one of the four official container widths — no new content width is introduced.
5. Screenshot diff clean at 390 / 768 / 1440.

## Definition of done
- All pages merged and diffed. The contact-form fix verified with a real submission landing in the database.
