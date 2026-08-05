# CLAUDE.md — Cahyana Ubud Experience

Guidance for Claude when working on this project. Scope of this doc: **keep the UI
consistent + the code structure clean**. Claude's role = propose and implement;
**final decisions are always Wayan's** — offer options with reasons, don't force.
When unsure, ask first (keep it short).

## Project
- Static Bali tourism site — "Cahyana Ubud Experience" (https://cahyanaubudexperience.com)
- Stack: plain HTML + CSS + vanilla JS. **No** framework, build step, or npm.
- Deploy: Hostinger via GitHub (push = live).
- Core value prop: **trip planner + clear/upfront pricing**.
- Sister site: villas live at ubudprivatevillas.com (separate — don't mix in).

## Working with Wayan
- Language: **casual Indonesian**. Wayan is learning dev — explain concisely and clearly.
- **Final decision is Wayan's.** Give a recommendation + reasoning, let him decide.
- Homework files (`homework-*.js`, etc.): **give CLUES only, never write the fix**.
- **No Python** for editing this project — use Node/JS.
- **No fake content**: reviews and driver bios must be real. Prefer an empty state over invented data.
- Don't rely on screenshots/headless to verify (they time out here). Use structural
  checks: `node --check`, CSS `{}` brace balance, `grep`.
- Don't delete without asking: `REFERRAL_CODE`, the Nyoman placeholder.

## Design system (keep consistent)
**Colors** (CSS vars):
- `--color-green` #1f3d2b · `--color-gold` #c9a45c · `--color-cream` #f7f3ea

**Fonts:**
- `--font-body` Montserrat (used everywhere). `--font-heading` Great Vibes (barely used).

**Text:**
- Body/paragraph = `0.85rem`, uniform across all pages.
- Prices = gold + bold (`.price`, `.price-cur`).

**Section dividers:**
- Thin gold **inset** line (margin on the sides) — via a `::before` pseudo-element,
  width `min(1100px, 90%)` centered, color `rgba(201,164,92,0.4)`.
- **NOT** full-width, **NOT** an `<hr>`.
- Applied automatically via `section + section`, `[id$="-placeholder"] > section`,
  `[id$="-placeholder"] + section`. Excluded: `.hero`, `.subhero`, `.booking`, and the
  section immediately after a subhero.
- If you add a section that already has its own border → check it doesn't **double up**
  with this divider.

**Misc:**
- Buttons: gold primary (`.btn-book`, `.modal__btn`), ghost variant (`.modal__btn--ghost`).
- Hover lift: keep it subtle, not harsh.
- Icons: SVG, **no emoji**.

## Subhero & FAQ (standar per halaman)
- **H1 maks ±40 karakter** (biar tetap 2 baris di HP — lebih dari itu teks hero bisa
  ketutup panel overlap). **Teks intro hero 25–40 kata.**
- Label section pertama: halaman tour = **"What You'll Do"**, attraction = **"The Experience"**.
- **FAQ**: halaman listing pakai partial (`partials/faq-*.html`); halaman tour/charter/itinerary
  pakai FAQ **inline** = 3 pertanyaan inti (harga per mobil · tiket Std/Exc · booking+bayar)
  + 3–4 pertanyaan spesifik halaman itu, **selalu ditutup card `.faq__chat`** ("Still have
  questions?" → WhatsApp). Jangan ngarang fakta — yang belum pasti dijawab "message us on WhatsApp".
- Habis ubah FAQ/meta description → jalanin `node tools/sync-schema.js` (regenerate FAQPage dkk).

## Gaya bahasa copy (English, semua halaman)
- **Lugas & bermanfaat, bukan puitis.** Kalimat pendek, info konkret yang kepake
  (jarak, timing, tips, trade-off jujur). Jawab pertanyaan tamu, jangan jualan kata.
- **Dilarang** (kata glorify): mesmerizing/mesmerising, spellbinding, breathtaking,
  stunning, magical/pure magic, hypnotic, jaw-dropping, unforgettable, electrifying,
  world-class, bucket-list, paradise, epic (adj), majestic, timeless, postcard-perfect,
  awe-inspiring, "ablaze", dan sejenisnya.
- **Boleh** (deskriptif wajar, jangan berlebihan): famous, beautiful, dramatic, iconic,
  popular, well-known — atau lebih baik: sebut faktanya ("often called Bali's most
  beautiful waterfall", "70 metres above the surf").
- Klaim reputasi ditulis sebagai fakta reputasi, bukan hiperbola sendiri.
- Jujur soal minus: antrian, tangga, jam pulang malam, "nggak bisa dijamin" — itu yang
  bikin dipercaya.

## SEO on-page (standar per halaman)
- **Title ≤65 karakter**, keyword di depan; suffix brand cuma di halaman root utama.
- **Meta description 110–170 karakter**, unik per halaman; `og:description` disamain.
- `og:image` = foto card/hero halaman itu (bukan preview.jpg) kalau ada.
- Halaman baru → tambah ke `sitemap.xml` + punya canonical + BreadcrumbList.

## Sliders (horizontal card sliders)
- Desktop: left/right arrows appear on **hover** (`.slider-arrow`, created in
  `initTourSlider()`; the slider is wrapped in `.slider-holder`).
- Scrollbar is **hidden** (navigate via arrows / swipe).
- `touch-action: pan-x pan-y` → horizontal swipe moves cards, vertical swipe still
  scrolls the page (don't revert to `pan-x` only — it makes scroll stick on mobile).

## Navbar
- Order: **[currency] · Home · Itinerary (badge) · Program▾ · About**.
  Program dropdown holds: Tours / Experiences / Transfer / Charter.
- Currency picker sits to the **left of Home** (after the logo).
- Desktop: dropdown shows on hover/click. Mobile: Program dropdown is **closed by default**
  (tap "Program" to expand), the menu has a **bottom shadow** + separator border, and items
  are more spacious.

## Code structure — script.js
Order **must be kept** (declarations first, run last):
1. **CONFIG & DATA** — all `const` (prices, CHARTER, transport, CURRENCIES, PAGE_ITEM, ITN_KEY, ...)
2. **HELPER FUNCTIONS** — small functions (fmtMoney, itemInfo, itnSave, ...)
3. **PARTIALS LOADER** — `loadPartials`
4. **INIT (per feature)** — `initNavbar`, `initBooking`, ... one function per feature
5. **APP ENTRY** — `initPage()` + `DOMContentLoaded` at the **very bottom**

- Entry at the bottom is correct. What guarantees partials load first is
  `await loadPartials()`, **not** the function's position (function declarations are
  hoisted, so order is only for readability).
- One init function per feature, called from `initPage`.
- Comment each section. **Remove dead code.**

## Code structure — CSS
- **Maximize DRY**: merge identical rules (grouped selectors / a shared base rule).
  Example: all form fields share one base rule for border/radius/font/color.
- Body text = one style (0.85rem).
- Don't leave dead classes behind.

## Key mechanics
- **Partials**: injected via `fetch` into `<div id="X-placeholder">`, cache-busted with
  `?v=${PARTIALS_VERSION}`. Editing anything in `partials/` → **bump `PARTIALS_VERSION`** in script.js.
- **File cache-busting**: `style.css?v=N` & `script.js?v=N` on **every** HTML page.
  Any CSS/JS change → bump `N` on all pages. *(current: v37, PARTIALS 21)*
- **Multi-currency**: single source `prices` (USD+IDR per item) + static `CUR_RATE`.
  `[data-price="Name"]` spans are filled by `renderPrices()`. Supports USD/IDR/AUD/EUR/GBP,
  results are rounded, saved in localStorage `cue_currency`.
- **Itinerary**: localStorage `cue_itinerary_v1`. Each add = a new day. Badge in the navbar.
- **Charter**: `CHARTER` config, live pricing.

## Placeholders Wayan must fill
- `WHATSAPP_NUMBER`, `SHEET_ENDPOINT` in script.js.
- Charter/combo prices, surcharge (IDR 100k), `CUR_RATE` rates — still approximate;
  Wayan finalizes them.
- `tourExclusive` — suplemen tiket **per orang** buat versi Exclusive tiap tour/combo
  (Standard = driver only, Exclusive = Standard + suplemen × jumlah orang). Angka masih
  PLACEHOLDER — Wayan isi harga asli.

## Before calling it "done" (checklist)
1. `node --check script.js` passes.
2. CSS `{}` braces balanced.
3. Changed CSS/JS → bump `?v=` on all pages. Changed `partials/` → bump `PARTIALS_VERSION`.
4. Changed any price in `prices` (script.js) → run `node tools/sync-prices.js`
   (rewrites static fallback prices + JSON-LD Product schema in HTML).
5. Check: no dead code, no double lines, no dead classes.
6. Hand off to Wayan to review live & decide on the push.
