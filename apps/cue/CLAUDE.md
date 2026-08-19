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
- Verifikasi utama = structural checks: `node --check`, CSS `{}` brace balance, `grep`.
  Headless Chromium BISA dipakai buat ukur layout/screenshot (playwright-core di scratchpad +
  browser di `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, serve lokal via `node http`).
- Don't delete without asking: `REFERRAL_CODE`, the Nyoman placeholder.

## Design system (keep consistent)
**Colors** (CSS vars):
- `--color-green` #5c5c5c (medium grey — dulu hitam #1a1a1a) · `--color-gold` #c9a45c ·
  `--color-gold-d` #b08d43 · `--color-cream` #f8f8f8 · `--line` #e7e4dd (border field/panel).
  Palet = abu (teks/tombol) · abu terang · emas.

**Fonts** (self-host, `assets/fonts/`, preload di tiap HTML):
- `--font-body` **Inter** (variable 300–700) — body & semua UI.
- `--font-head` **Playfair Display** (variable 500–800) — heading/judul (blok "TYPOGRAPHY SYSTEM"
  di akhir style.css nge-override font-family heading lama).
- **Bobot konsisten (jangan bold berat sembarangan):** body 400 · label 500 (tracked + uppercase,
  kesan small-caps) · harga & tombol 600 · heading Playfair 600.

**Text:**
- Body/paragraph = `0.85rem`, uniform across all pages.
- Prices = gold + bold (`.price`, `.price-cur`, `.fee` — tiket masuk). Semua harga = gold.

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

## Foto & gambar (standar)
- **Nama file = subjek + slot**, semua lowercase-hyphen. Pola:
  `<slug-halaman>-card.jpg` (kartu) · `<slug-halaman>-hero.jpg` (subhero/banner) ·
  nama subjek buat foto konten (`goa-gajah-bathing-pools.jpg`, `ubud-batik-workshop.jpg`).
  **Dilarang**: nomor urut (`-content-2`), nama kamera (`IMG_1234`), nama generik (`foto1`).
- **Ukuran**: card 600×600 ≤200KB · foto stop 1200×900 (4:3) ≤200KB · hero ~1920px ≤400KB.
  Resize dulu ke ukuran target, baru export (JPG ~80% / WebP ~75%).
- **Slot foto stop & card pakai `<img>`**, BUKAN background:
  `<div class="stop__image"><img src="..." alt="..." loading="lazy" /></div>` —
  wrapper div yang pegang rasio/radius (CSS `.stop__image > img` / `.experience__image > img`
  udah ada). **Alt wajib** deskriptif (subjek foto, bukan keyword stuffing); `&` ditulis `&amp;`.
- **Tetap background** (jangan diubah ke `<img>`/lazy): hero & subhero (above the fold),
  banner highlight, slider homepage, card villa. Slot kosong = placeholder gradient + komentar
  `<!-- TODO: foto ... -->`.
- **Ganti/rename foto** → ganti SEMUA referensi: HTML (og:image + JSON-LD ikut), style.css,
  `ITEM_CARD` di script.js (nama **tanpa** prefix `images/` — gampang kelewat pas grep!),
  dan path hardcoded di `tools/sync-schema.js`. Habis itu grep nama lama = harus 0.

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
- Order: **Home · Itinerary (badge) · Program▾ · About** + account icon.
  Program dropdown holds: Tours / Experiences / Transfer / Charter.
- **Currency picker** ada **di dalam dropdown account** (custom dropdown berbendera,
  `[data-cur]`), bukan di bar navbar. Currency + Guests + Pickup + Date **juga inline
  di search form homepage** (`partials/search.html`) — semua nyetir state global via
  hook yang sama (`[data-guest-select]` / `[data-stay-select]` / `[data-cur]`), di-wire
  otomatis sama `initGuestPicker` / `initAccountMenu` / `initCurrency`.
- **Welcome popup DIHAPUS** (Agu 2026): field trip pindah ke search form homepage.
  Editor "Your trip details" (`showTripDetails`) tetep ada buat tripbar **Edit** di
  halaman kategori + navbar **Reset**. `showWelcome`/`initWelcome` udah dibuang.
- Desktop: dropdown shows on hover/click. Mobile: Program dropdown is **closed by default**
  (tap "Program" to expand), the menu has a **bottom shadow** + separator border, and items
  are more spacious.

## Code structure — script.js (+ data.js)
- **data.js** = semua data harga/tarif/kurs (dimuat duluan). **script.js** = logika.
Order **must be kept** (declarations first, run last):
1. **CONFIG & DATA** — const non-harga (PAGE_ITEM, ITEM_CARD, ITN_KEY, endpoint, ...)
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
- **Anti-CLS**: `#booking-placeholder`, `#footer-placeholder` & `#search-placeholder` punya
  `min-height` di style.css (booking 480px, footer 688/487px, search 470px — hasil ukur
  headless; navbar 57.6px desktop / 52.8px HP; mobile WAJIB ≥ tinggi form asli, kalau kurang
  hero melar & foto "zoom"). **Ubah isi partial booking/footer/search → ukur ulang & update
  angkanya** (navbar nggak perlu: position fixed). Search form juga fade+slide masuk
  (`@keyframes heroCardIn`) — placeholder yang nahan ruangnya jadi nol shift.
- **Tripbar (bar di bawah navbar)**: `initTripBar` jalan di SEMUA halaman. Halaman booking →
  bar Guests/Pickup (klik = editor trip). Halaman non-booking → bar **promo/event** dari
  `PROMO` di data.js (`{active, text, cta, href}`) — cuma muncul kalau `active:true` &
  `text` keisi (default off, no fake content). Isi PROMO = tampil di semua halaman non-booking.
- **Partials**: injected via `fetch` into `<div id="X-placeholder">`, cache-busted with
  `?v=${PARTIALS_VERSION}`. Editing anything in `partials/` → **bump `PARTIALS_VERSION`** in script.js.
- **File cache-busting**: `style.css?v=N`, `data.js?v=N` & `script.js?v=N` on **every** HTML
  page (data.js WAJIB dimuat sebelum script.js). Any CSS/JS/data change → bump `N` on all pages. *(current: v278, PARTIALS 64)*
- **Data harga terpisah**: SEMUA harga & tarif (prices, TICKETS, TOUR_TICKETS, CHARTER,
  transport, CUR_RATE, EXCLUSIVE_FEE) hidup di **`data.js`** — script.js cuma logika.
  Ganti harga = edit data.js → `node tools/sync-prices.js` → bump `?v=`.
- **Multi-currency**: single source `prices` di data.js (USD+IDR per item) + static `CUR_RATE`.
  `[data-price="Name"]` spans are filled by `renderPrices()`. Supports USD/IDR/AUD/EUR/GBP,
  results are rounded, saved in localStorage `cue_currency`.
- **Itinerary**: localStorage `cue_itinerary_v1`. Each add = a new day. Badge in the navbar.
- **Charter**: `CHARTER` config, live pricing.

## Yang masih nunggu Wayan (update terakhir: Agu 2026)
- Harga bertanda `CEK WAYAN` di **data.js** (paket operator: watersport, trek Batur, jeep,
  ATV, rafting, Zoo, Bird Park) — angka riset, Wayan koreksi.
- `SHEET_ENDPOINT` (script.js) masih placeholder — cuma kepakai 2 form sekunder;
  booking utama udah ke API_ENDPOINT (Railway).
- Review asli buat section Guest Reviews; link villa & sosmed (`href="#"`).
- Foto: og:image 43 halaman masih preview.jpg + ±93 slot placeholder (gradient) di 39 halaman.
- Kompres 10 foto >400KB (paling parah `rafting.webp` 2.6MB & `homepage_hero.webp` 725KB —
  resize ke ~1600–1920px) + 12 foto 250–400KB; habis diganti, rename ikut standar foto.
- Foto nganggur: 13 duplikat/sisa lama (hapus?) + stok belum kepasang (`ubud-palace.jpg` dkk
  buat slot TODO) — keputusan Wayan.
- Google Search Console: submit sitemap (belum pernah).
- **Broadcast/newsletter promo + update Bali** (DITUNDA — Wayan mau lanjut nanti):
  pakai **Resend Audiences + Broadcasts** (Cara A). Rencana: auto-daftarin email
  akun baru ke Audience Resend (1 fungsi di `cahyana-api` POST /api/account), terus
  Wayan nulis & kirim broadcast dari dashboard Resend (unsubscribe + analytics
  otomatis). Email welcome akun udah janjiin "deals & Bali updates" → ini follow-up-nya.

## Before calling it "done" (checklist)
1. `node --check script.js` passes.
2. CSS `{}` braces balanced.
3. Changed CSS/JS → bump `?v=` on all pages. Changed `partials/` → bump `PARTIALS_VERSION`.
4. Changed any price/ticket in `data.js` → run `node tools/sync-prices.js`
   (rewrites static fallback prices + JSON-LD Product schema in HTML).
5. Check: no dead code, no double lines, no dead classes.
6. Hand off to Wayan to review live & decide on the push.
