# CLAUDE.md — Cahyana Ubud Experience

Guidance for Claude when working on this project. Scope of this doc: **keep the UI
consistent + the code structure clean**. Claude's role = propose and implement;
**final decisions are always Wayan's** — offer options with reasons, don't force.
When unsure, ask first (keep it short).

## Project
- Bali tourism site — "Cahyana Ubud Experience" (https://cahyanaubudexperience.com)
- Core value prop: **trip planner + clear/upfront pricing**.
- Sister site: villas live at ubudprivatevillas.com (separate — don't mix in).

## Stack (CURRENT) — Next.js + React + Tailwind
> **PENTING:** situs = app **Next.js 16 + React 19** (static export `out/`). Komponen di
> `components/` + `app/` (`.jsx`). CI: push `main` → build → force-push `out/` ke branch
> `deploy` → Hostinger. `style.css` di-symlink ke `public/style.css` (di-serve dgn hash
> otomatis, gak perlu `?v=` manual).
>
> **Situs static LAMA UDAH DIPENSIUNIN** (Sep 2026, Wayan): semua `.html` (root/`attractions/`/
> `guide/`), `partials/`, `script.js`, `data.js` + tool legacy (`sync-prices`, `check-schema`,
> `check-content-fresh`, dst) udah **DIHAPUS** dari repo (masih ada di git history kalau butuh).
> Jadi bagian mana pun di doc ini yang nyebut `script.js`, `data.js`, `partials/`,
> `?v=`/`PARTIALS_VERSION` bump, `initX()` (`initBooking`/`initNavbar`/dst), `renderPrices`,
> atau file `.html` = **KONTEKS LAMA / historis**, gak berlaku lagi. Yang hidup cuma app React
> (`app/`+`components/`, state di `state/`, konten di `content/`, harga dari API `cahyana-api`).
> Gate CI yang tersisa (jalan atas `out/`): `check-urls`, `check-detail`, `check-assets`.

**Styling = Tailwind (migrasi Sep 2026, JALAN → target FULL portable):**
- **Arah baru (Sep 2026, Wayan): SEMUA komponen self-contained.** Tiap komponen bawa style-nya
  sendiri (utility di className), biar bisa cabut-tempel ke web lain tanpa ikut nyalin CSS.
  Target akhir: `style.css` = **reset + `@theme`/token doang** (warna/font/radius/shadow/dll),
  NOL class komponen. (Ini nge-override stance hybrid lama yg biarin primitif shared tetep CSS.)
- Komponen di-convert satu-satu → CSS lama-nya **DIHAPUS** dari `style.css` (verify pixel-diff /
  computed-style diff = 0 dulu, baru hapus).
- **DRY tanpa CSS**: style yang dipake >1 komponen JANGAN di-inline berulang — taro string
  utility-nya SEKALI di modul JS (pola `components/ui/hsClasses.js` / `modalClasses.js`) terus
  di-import. Jadi tetep satu sumber, tapi komponen tetep self-contained (bawa import-nya).
  Cek dulu breadth pemakaian class SEBELUM hapus CSS-nya: shared → modul, unik → inline.
- CSS-only mechanics (divider `section + section::before`, underline `::after`, `:has()`) pakai
  arbitrary variant Tailwind (`before:`/`after:`/`[&+&]:`/`has-[...]:`), bukan alesan tetep CSS.
- **Design token di `app/globals.css` `@theme`** — warna (`--color-gold/amber/cta/cream/...`),
  radius (`--radius-sm..xl` → `rounded-sm..xl`), shadow, text (`--text-h2/body/...` → `text-h2`),
  font. Nilai = mirror token `:root` di `style.css`. Ganti brand token → edit `@theme` + `:root` bareng.
- **Utilities di-import UNLAYERED** (`@import "tailwindcss/utilities.css";` tanpa `layer()`).
  WAJIB unlayered: reset `* { margin:0; padding:0 }` di `style.css` itu unlayered & selalu
  menang atas `@layer` apa pun — jadi utility di layer bakal kalah (mis. padding ke-nol-in).
  Unlayered = utility menang lewat specificity (`.px-6` 0,1,0 > `*` 0,0,0). **Jangan** balikin ke layer.
- **Preflight OFF** (`style.css` reset yang jalan). Efek: `border` utility butuh warna eksplisit;
  circle `50%` → pakai `rounded-[50%]` (bukan `rounded-full`); font-size only → `text-[1rem]`
  (bukan `text-base`, itu bawa line-height).
- **KOMPONEN = utility Tailwind** (kartu/band/tombol/section). Class string di komponen.
- **LAYOUT ENGINE = tetap CSS scoped** (`.experience__grid*` di style.css — sengaja, lihat
  komentar di file). Jangan convert layout engine multi-konteks ke `[&>*]` utility soup.
- **`style.css` = sisa CSS lama + layout engine + reset.** Terus dikecilin pas komponen
  di-convert; dead CSS udah dibersihin (pixel-diff before/after = 0).
- **Verifikasi styling = headless computed-style diff / pixel-diff** (playwright-core di scratchpad,
  `headless_shell` di `/opt/pw-browsers/`, serve `out/` via `node http`). Bandingin komputasi
  gaya lama vs baru ATAU pixel before/after — JANGAN andelin mata doang (pernah kelewat beda 8px).
- Komponen shared (Button/GuideCard/dst) WAJIB 100% identik di semua tempat pemakaian.

## Legacy static site (RETIRED Sep 2026 — historis)
- Situs lama = plain HTML + CSS + vanilla JS (`script.js`/`data.js`/`partials/`/`.html`).
  Semua UDAH DIHAPUS dari repo (ada di git history). Section-section di bawah yang detail-in
  `script.js`/`data.js`/`partials`/`?v=`/`initX`/`renderPrices` = catatan lama, jangan diikutin
  lagi buat kerjaan baru — semua logika sekarang di app React.

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
- `--color-green` #5c5c5c (medium grey — dulu hitam #1a1a1a) · `--color-gold` #22201c
  (soft black — Agu 2026, Wayan minta accent gold diganti item; NAMANYA masih "gold"
  tapi NILAI-nya bukan gold beneran, dipakai buat judul section, divider, nav, state
  aktif) · `--color-gold-d` #16140f (variant lebih gelap) · `--color-gold-l` #cfc9ba
  (kicker di foto gelap) · `--color-cream` #f8f8f8 · `--line` #e7e4dd (border) ·
  `--color-ok` #2e7d54 (sukses) · `--color-err` #9a4a3f (error).
  Abu sekunder = SATU token `--color-muted` (#7a7466; muted-2 udah dilebur).
- **`--color-amber` #c9a45c / `--color-amber-d` #b08d43** (Sep 2026) — gold BENERAN,
  dipisah dari `--color-gold` (yang soft-black) khusus buat elemen yang gold-nya
  punya makna konvensi visual: **bintang rating** (`.rating__star.active`,
  `.review-card__stars`, `.rev__stars`,
  `.tourprog .experience__rating svg`), **harga** (`.price-now`, `.experience__price`,
  `.booking__price`, `.summary__amt .price-cur`, `.fee`, dkk — SEMUA elemen harga),
  dan **badge "Popular"/featured** (`.chdur__badge`, `.highlight__tag`,
  `.binfo__tag--gold`, gradient avatar driver). Selain 3 kategori itu (judul section,
  nav, divider, hover/active state, tombol, ikon lain) TETAP `--color-gold` (soft-black)
  — itu keputusan rebrand yang disengaja, jangan ikut disamain ke amber kalau nemu lagi.

**Fonts** (self-host, `assets/fonts/`, preload di tiap HTML):
- `--font-body` = `--font-head` = **Inter** (variable 300–700) — satu font doang.
  Playfair Display dicoba (Agu 2026) terus dibuang lagi — Wayan bilang kerasa lebay.
- H1 (blok "Tier display H1" di akhir style.css — `.hero__title`/`.subhero__title`/
  `.lhero__title`, semua halaman) sengaja **bobot 700** (Sep 2026, Wayan minta dipertebal —
  dulu 500 "biar tenang", udah dibalik) + `letter-spacing: -0.01em`.
  H2 section (`.section__title` dkk, blok "Tier display" terpisah) TETEP bobot 500 —
  cuma H1 yang ditebalin, H2 nggak.
- **Bobot konsisten (jangan bold berat sembarangan):** body 400 · label 500 (tracked + uppercase,
  kesan small-caps) · harga & tombol 600 · H1 700 · H2 500.

**Text — type scale (Sep 2026, ditrim — "kerasa kegedean" per Wayan):**
- `--fs-display` (H1) tetep `clamp(1.75rem,4vw,2.5rem)` (28–40px) — cuma bobotnya yang naik,
  ukuran nggak diubah.
- `--fs-h2` (judul section body, mis. "What You'll Do") **22px → 18px**.
- `--fs-h3` **20px → 16px → 14px** (Tier UI: judul kartu/stop/footer heading/modal/driver
  name, weight 600 tetep) — disamain ke `--fs-strong` (dulu 2 token beda nilai, sekarang
  berdua 14px, biar gak ada 2 "ukuran judul kecil" yang mirip tapi beda dikit).
- Footer (`.footer__contact-item`/`.footer__tagline`/`.footer__col li`) PUNYA UKURAN SENDIRI
  sekarang (nggak numpang `--fs-body` lagi) — **16px → 12.8px**. `.footer__heading` ikut
  token `--fs-h3` (jadi 14px).
- Body/paragraph = `0.8rem` (`--fs-body`, Sep 2026 - was 1rem, Wayan minta dikecilin),
  uniform across all pages. Headings, prices, buttons, nav, and interactive controls
  (tabs, toggles, dropdown options, FAQ question triggers) do NOT use this token -
  each was unhooked to its own explicit size so they don't shrink with body text.
- Form field (input/select/textarea) = `0.8rem` (`--fs-field`, was 0.875rem — disamain ke
  `--fs-body`/`--fs-small`), semua field pakai token ini (jangan hardcode ukuran di form lagi).
- **Tinggi field** = `--field-h` **2.1rem (~33px)** — semua kontrol form (input/select/date/
  custom-select) pakai token ini biar seragam (Agu 2026, Wayan: dikecilin dari 46px nyesuain
  body text yang udah 0.8rem — 46 kerasa kegedean). **TOMBOL CTA** (`.booking__btn` dkk) TIDAK
  ikut token ini — sengaja tetep ~46px (`height: 2.9rem`), CTA boleh lebih tinggi dari field.
  Textarea (`.contact__group textarea`) pakai `min-height` sendiri, bukan `--field-h`.
- **Konsolidasi (Sep 2026)**: puluhan `font-size` yang di-hardcode langsung (bukan token) —
  hasil nambahin fitur satu-satu dari waktu ke waktu — di-sapu & di-snap ke token terdekat
  (`--fs-label`/`--fs-small`/`--fs-h3`/`1rem`/`--fs-h2`). YANG SENGAJA DIBIARIN beda-beda
  (jangan ikut disamain kalau nemu lagi): ikon/glyph (panah slider, tombol close ×, bintang
  rating — font-size di situ = ukuran ikon, bukan teks bacaan), harga (`.price`/`.summary__amt`/
  dkk), dan judul besar level-halaman (`.subhero__title` var overlap, `.vpromo__title`).
- Prices = gold (`--color-amber`, gold BENERAN — bukan `--color-gold`) + bold
  (`.price`, `.price-cur`, `.fee` — tiket masuk). Semua harga = gold.

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
- Buttons: primary CTA (Book Now, Book this program, Apply, Make Payment, dll) pakai
  token terpisah **`--color-cta` #3d5c46 / `--color-cta-d` #2f4737** (hover) — hijau,
  BUKAN `--color-gold` (Sep 2026, Wayan minta tombol lebih "manggil mata", gold/soft-black
  tetep dipake buat harga & aksen lain, sengaja dipisah biar peran warna nggak numpuk).
  Ghost/secondary variant (`.modal__btn--ghost`, `.btn-pill` "View all …") TETEP di
  gold/soft-black — bedain "aksi utama" vs "lihat lebih banyak".
  Semua tombol aksi = **pill** (border-radius 999px). Chip logo bayar & toggle nggak.
- Hover lift: keep it subtle, not harsh.
- **Ikon = `lucide-react`** (Sep 2026, Wayan pilih opsi "full Lucide" setelah lihat sheet
  perbandingan lama-vs-Lucide). Ikon baru = import dari `lucide-react`, **JANGAN gambar SVG
  manual lagi**. Aturannya:
  - **WAJIB kasih class ukuran eksplisit** (`w-4 h-4` / `w-[var(--icon-sm)]` / lewat `[&>svg]`
    di parent). Lucide nge-render atribut `width/height=24`, jadi ikon yang gak dikasih ukuran
    bakal melar jadi 24px.
  - `strokeWidth` cuma dioper kalau BUKAN 2 (default Lucide) — mis. `strokeWidth={1.7}`.
  - Ikon yang dulu **solid** (bintang rating, badge kategori) dikasih `fill="currentColor"`
    biar gak berubah jadi outline.
  - **Masih hand-drawn & JANGAN diganti** (Lucide gak punya): glyph WhatsApp (`BookBar`),
    7 logo pembayaran (`PayChips` + `Footer`), bendera mata uang (`FlagDefs`/`CurrencyPicker`).
  - Verifikasi: harness `icons-snap.mjs` + `icons-diff.mjs` di scratchpad — patokannya
    `boxDrift=0` & `countDrift=0` (gak ada ikon yang berubah ukuran / ilang).
- Icons: SVG, **no emoji**. Ukuran ikon inline kecil pakai token (Agu 2026): `--icon-sm` 16px
  (meta jam/lokasi/pax, kontak, chip, sosmed) · `--icon-md` 20px (nav cart/akun, book-bar,
  toggle, search) · `--icon-lg` 24px (ikon aksi lebih besar). Dulu berserakan 13-23px, di-snap
  ke 3 tingkat (geser maks ~3px). **DIBIARIN** (beda peran, bukan ikon inline): ikon besar
  30-56px (avatar review/driver, lingkaran step "How it works", ikon centang sukses, avatar
  panel), ikon centang mini 10px, dan logo pembayaran (`width:auto`, cuma tinggi ikut token).
- **Checklist bullet (Included/Excluded)**: SATU format di seluruh web — marker **radio**
  di `.info__list--yes/--no li::before`: included = lingkaran keisi (dot `--color-green` di dalam ring),
  excluded = lingkaran kosong (border `#cfc9ba`) + teks di-mute (`#8a8578`). Ukuran nyesuain konteks.
  Bullet generik lain (mis. `.modal__details-list` = `•` emas) beda.

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
- **Gotcha `aspect-ratio` di `<img>`**: kalau tag `<img>` punya atribut HTML `width`/`height`
  (biasa ada, buat anti-CLS), CSS `aspect-ratio` doang GAK CUKUP buat maksa rasio - atribut
  `height` menang duluan (presentational hint) kalau CSS `height` gak di-set eksplisit. WAJIB
  tambahin `height: auto;` bareng `aspect-ratio` di rule yang sama, atau foto ikut rasio file
  aslinya (kejadian di `.guide-lead`, Sep 2026).

## Guide article template (`guide/*.html`)
- Body semua halaman guide punya class **`.guide-article-page`** (beda dari `.guide-article` yang
  numpang dipake juga di Terms/Privacy/Cancellation/Charter buat kolom-baca-polos yang sama -
  jangan scope hal khusus-guide ke `.guide-article`, salah sasaran kena 4 halaman itu juga).
  **Awalnya namanya `.guide-page`** — ternyata itu udah dipake `bali-guide.html` buat
  `<section>` wrapper-nya sendiri (`max-width:1200px; margin:auto`, di style.css baris
  ~3739). Karena kepasang di `<body>` juga, rule lama itu ikut nge-constrain seluruh body
  jadi 1200px — hero `.lhero` (anak langsung body) jadi nggak full-width. Di-rename ke
  `.guide-article-page` buat lepas dari collision (rule lama `.guide-page` di bali-guide.html
  TETEP dibiarin, itu punya dia). **Gotcha buat next time**: sebelum bikin class baru yang
  scope-nya global (body/section wrapper), `grep -n` dulu namanya di style.css — nama umum
  kayak "guide-page" gampang banget udah kepake buat hal lain.
- Judul sub-section (`.section__title--sub`) di guide article rata **KIRI** (sejajar body
  text, gampang di-scan) — scoped `.guide-article-page .section__title--sub`. Di halaman lain yang
  numpang `.guide-article` (Terms dkk) TETAP center, jangan ikut diubah.
- Foto lead (`.guide-lead`, di sela-sela text, BUKAN numpuk di atas) = **4:3**, disamain sama
  foto konten tour (`.stop__image`) biar selaras — bukan 16:9 lagi. Ditaruh nyelip di antara
  paragraf (paragraf dipecah di titik yang natural), bukan satu foto besar di awal artikel —
  di `guide/ubud.html` ada 2 titik: satu di "What to Do in Town", satu lagi di "Around Ubud".
- **Template lengkap** (`.lhero` + `.guide-hero-tags`, sidebar `.guide-layout__side` kanan
  desktop / `.guide-cattabs` sticky HP, `.guide-more` "You might also like" + "See our
  tours") — **udah di-rollout ke SEMUA 15 halaman guide** (Agu 2026, dari `guide/ubud.html`
  sebagai contoh pertama). Kategori tiap halaman di-set dari crumb-nya (island/culture/nature/
  do/know) — `is-active` kepasang di `.guide-cattab` + `.guide-sidebar` item yang sesuai.
  Kategori sidebar/tab = 5 kategori asli dari `bali-guide.html`
  (`#gcat-island/culture/nature/do/know`), link-nya ke situ (anchor), BUKAN scrollspy di
  halaman guide itu sendiri. "You might also like" = kartu guide se-kategori + anchor
  (ubud/canggu/best-time/getting-around), gambar reuse dari kartu guide-home di `bali-guide.html`.
  "See our tours" = Ubud Tour + Ubud Culture Day (flagship, sama di semua halaman — Wayan bisa
  kustomin per halaman nanti). Hero pakai gradient/foto yang udah ada per halaman (no fake foto);
  placeholder "Photo coming soon" + blok `.guide-related`/`.program-cta` lama udah dibuang.
- **`.guide-article-page .lhero`** dipendekin (`min-height: 320px`, was 560px standar) - guide article
  halaman sekunder, bukan halaman utama, jangan makan layar sebanyak listing page.
- **`.guide-cattab`** (tab kategori sticky HP) disamain ke gaya `.zone-chip` (tour/activities/
  destinations) - underline tab polos, BUKAN pill isi/border. `.guide-tag` (tag di atas foto
  hero: "Culture"/"Ubud"/dst) TETAP pill - beda konteks, itu label bukan navigasi.
- **Link relatif halaman guide**: semua halaman pakai `<base href="/" />`, jadi href SELALU
  relatif ke ROOT, bukan ke folder `guide/` — link ke sesama halaman guide WAJIB prefix
  `guide/` (`href="guide/canggu.html"`), link ke halaman root (`ubud-tour.html` dkk) TANPA
  prefix apa pun (jangan `../ubud-tour.html` — itu attribut path, bukan filesystem path).

## Subhero & FAQ (standar per halaman)
- **H1 maks ±40 karakter** buat halaman lama/standar (biar tetap 2 baris di HP).
  **Dikecualikan (Sep 2026, tour restructure 12→18 tour)**: tour dengan nama SEO panjang
  (mis. "Ulun Danu Beratan & Handara Gate Instagram Tour") sengaja TETAP pakai nama penuh
  apa adanya di H1 — Wayan pilih ini setelah dites: `.tour-hero__body` (sheet putih di
  `.subhero__title`) otomatis ngikutin tinggi judul, nggak ada teks kepotong/numpuk walau
  jadi 3-4 baris di HP (cuma makan scroll lebih, bukan jebol). Jangan potong nama tour
  panjang buat "muat" ke 40 karakter - itu udah bukan aturannya lagi buat tour-tour ini.
  **Teks intro hero 25–40 kata.**
- Label section pertama: halaman tour = **"What You'll Do"**, attraction = **"The Experience"**.
- **FAQ**: DIPUSATIN ke **`faq.html`** doang (Agu 2026) — semua FAQ inline + partial di
  halaman lain UDAH DIHAPUS (link ke faq.html ada di footer). Jangan tambahin FAQ ke
  halaman manapun selain faq.html. Partial `partials/faq-*.html` UDAH DIHAPUS dari disk. `sync-schema.js` `FAQ_PAGES = {}`; schema-faq cuma di-generate buat faq.html
  (lewat section 1b inline). Card "Still have questions?" `.faq__chat` juga udah dihapus.
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
- **Card grid split (Sep 2026)**: `initTourSlider()` still unconditionally wraps any
  `.experience__grid--home4`/`--slider` in `.slider-holder` + injects arrows (JS doesn't
  check viewport/overflow) — sliding vs. wrapping is purely CSS. Reused the old
  `.experience__grid--auto` grid-wrap pattern (`repeat(auto-fill, minmax(260px,1fr))` —
  **auto-fill, not auto-fit**: kalau kartu kurang dari 1 baris penuh, sisa kolom kosong
  aja, kartu yang ada TIDAK ke-stretch ngisi lebar penuh. auto-fit collapse kolom kosong
  & stretch sisanya, itu bug-nya kalau kartu dikit, mis. kategori "South & East Bali"
  yang cuma 3 kartu — Sep 2026, Wayan),
  scoped per context, and hide `.slider-arrow` where it no longer applies:
  - `.xplore .experience__grid--home4` (homepage Explore/Destinations): **desktop** = grid
    wrap, all cards visible, no slide (>4 cards wrap to a new row, e.g. Destinations' 6
    cards). **Mobile** = still slides (unchanged) — homepage-only mobile behavior.
  - `.catsec .experience__grid--home4` (listing pages tour/activities/destinations): grid
    wrap at **every** breakpoint — desktop ~4/row + wraps if more, mobile = normal
    vertical scroll, no slide at all.
  - Everywhere else (`.related`, `.mtc-related` cart upsell, Guides & Info) still slides —
    untouched.
  - Note: this reverses an earlier documented decision (grid-wrap once caused a "cards
    stack into rows" bug, which is why it got unified to slider everywhere). Re-tested
    both contexts after the change; watch for regressions if touching this again.

## Listing page category tabs (`.zone-chip`, tour/activities/destinations)
- Anchor links + scrollspy (`initZoneAnchors()` in script.js) — tab aktif ngikutin
  section yang lagi keliatan pas scroll, no filtering.
- **Fix (Sep 2026)**: scrollspy dulu pakai `s.offsetTop`, yang keliru kalau section
  punya positioned ancestor (mis. `.experience--alt` kalau `position` bukan `static`)
  — offsetTop jadi relatif ke ancestor itu, bukan ke dokumen, jadi tab pertama
  ("Temples" dkk) ke-aktif dari awal walau user masih di hero. Sekarang pakai
  `getBoundingClientRect().top + scrollY` (posisi beneran relatif dokumen), dan
  `cur` mulai dari `null` (bukan section pertama) biar gak ada tab aktif kalau
  probe belum nyampe section manapun.

## Homepage section order (Sep 2026)
Urutan `index.html` (`body.home`): Hero → Explore/Tours (`#explore`) → **Airport pickup**
(`#airport-pickup`) → Destinations (`#destinations-home`) → **Why Us** (`#why-us`) →
Guides (`#guides`) → Villas (`#villas`) → **Charter** (`#charter-promo`) → About (`#about`)
→ Featured On (`.trust`) → Reviews (`#reviews-placeholder`).
- **Trip Planner band (`.plan` / `#plan`) DIHAPUS dari homepage** (Wayan: kebanyakan tulisan; hero
  udah "trip planner" sendiri). CSS `.plan*` masih ada (dipakai halaman lain? cek dulu kalau mau buang).
- **Driver cards DIHAPUS dari homepage** (section `.habout-people` + `#drivers-placeholder` +
  CSS-nya dibuang) — pindah ke `about-us.html` aja. Divider gold antar-section udah OFF di homepage
  (`.home section+section::before {content:none}`), jadi pemisah = **bg + jarak**.
- **Jarak antar-section SERAGAM = `--section-gap` (2.25rem/36px)** (Sep 2026, Wayan). Gap murni dari
  `margin-top` tiap section (`.home > section:not(.hero)`, + `#reviews-placeholder`), `margin-bottom:0`
  (margins collapse → gap = 36px, dari hero→tour sampe bawah). Section **putih polos** (`.home .xplore`,
  `.home .guide-home`) padding vertikalnya di-**nol**-in biar padding gak dobel jadi gap. **Band**
  (bg warna/foto: airport/whyus/vpromo/habout/trust-cream/charter-panel) padding-nya TETAP = napas
  DALAM band (bukan gap). Jadi jangan set padding vertikal gede lagi di section putih homepage.
  **Halaman lain (Sep 2026, Wayan minta ke semua)**: section konten di-snap padding vertikalnya ke
  `--section-gap` (36px) lewat rule GLOBAL — `.experience, .info, .closing-band, .faq, .contact,
  .trust, .stops, .arow, .guide-more` (dulu 48px). Jadi kalau bikin section konten baru & mau ikut
  ritme, pakai salah satu class itu atau tambahin ke daftar; jangan hardcode padding vertikal beda.
- **3 section baru** (semua pakai token, `.airport__*` / `.whyus__*` / `.charter-home__*` + `.chcard__*`):
  - **Airport** = **full-bleed** dark band (pola `.habout`: bg + `::after` overlay di `<section>`,
    konten di `.airport__inner` = container). Foto `transfer-hero.webp`. Jarak ke Tours/Destinations
    sengaja dirapetin lewat `#explore{padding-bottom}` + `#destinations-home{padding-top}` = `--space-3`.
    Harga "from $20" di-wire lewat `data-price="Airport – Ubud"` (ikut kurs/referral via `renderPrices`;
    `renderPrices` auto-nambahin `<span class="price-unit">per car</span>`, jadi JANGAN nulis "/ car" manual).
  - **Why Us** = cream band, 4 kolom ikon. Headline "Clear prices, local team, your plan" (sengaja
    beda dari About "One local family..." biar gak dobel).
  - **Charter** = **satu panel putih** (`.charter-home__in`) isi **slider kartu jam** (`.charter-home__slider`
    = `experience__grid--slider`, di-wrap `initTourSlider` → panah hover desktop + swipe HP). Kartu = 5h/10h/12h/14h
    (`.chcard`), Full Day (10h) di-highlight + badge amber "Popular" (badge di POJOK DALAM kartu, bukan
    negatif-top, biar gak kepotong `overflow` slider). Harga tiap kartu di-wire lewat
    `data-charter="half|full"` + `data-charter-extra="N"` → `renderCharterPromo()` (dipanggil dari
    `renderPrices`, baca `CHARTER` di data.js: full + N*extHour, ikut kurs).
- **Copy**: no em-dash (`—`) di teks — pakai hyphen biasa (` - `) atau pecah kalimat.

## Booking sidebar layout (`.tour-layout--book`, halaman detail bookable)
- `initBookSidebar()` (script.js) inject 2 kolom via JS setelah subhero: `.tour-layout__main`
  (konten, flex 1 1 auto) + `.tour-layout__side` (kartu "Build Your Trip", sticky, flex
  0 0 34% / max-width 380px). Lebar sidebar campuran %+max-width jadi offset kolom kiri
  dari tepi layar gak bisa dihitung lewat CSS calc() biasa.
- **Judul section di kolom kiri** (mis. "What You'll Do") sengaja digeser ke tengah LAYAR
  penuh (bukan cuma tengah kolom kiri yang lebih sempit) — via `transform: translateX(var(--title-shift))`,
  `--title-shift` diukur & di-set JS (`centerBreakoutTitles()`, sama pola kayak
  `alignSideToFirstPhoto()`/`--side-offset` di atasnya). Berlaku ke SEMUA `.section__title`
  yang landing di `.tour-layout__main`, bukan cuma "What You'll Do" doang (biar konsisten).

## Navbar
- Order: **Home · Itinerary (badge) · Program▾ · About · Contact Us** + account icon.
  Program dropdown holds: Tours / Experiences / Transfer / Charter. **Contact Us**
  (Sep 2026) ditambah di navbar (link ke `contact.html`) — gantiin floating WhatsApp
  button yang di-hide (`.wa-float { display:none!important }` di style.css; JS-nya
  di `initWhatsApp()` masih bikin elemennya, cuma CSS-hide, gampang dinyalain lagi).
  WA tetep bisa dari link footer.
- **Spacing icon kluster kanan** (akun/cart/menu): `.acct` margin-right 0.9rem,
  `.navbar__cart` margin-right 1.3rem (Sep 2026, dulu 0.3rem/0.85rem — kerasa mepet).
  Gap besar logo↔kluster (`.navbar__logo{margin-right:auto}`) itu disengaja (standar
  logo-kiri-menu-kanan), jangan diutak-atik.
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
- Body text = one style (0.9rem, `--fs-body`).
- Don't leave dead classes behind.
- **Container widths (token, Agu 2026)**: 4 tingkat resmi biar margin kiri/kanan antar-halaman
  selaras — tiap halaman WAJIB pilih salah satu, **jangan bikin lebar konten baru** (dulu
  berserakan 1000/1040/1100/1200 dst). Token di `:root`:
  - `--container` **1200px** — wide: listing (`.catsec`), homepage (`.xplore`), guide hub
    (`.guide-page`), guide article template (`.guide-layout`). Tepi konten 144px @1440 / 24px HP.
  - `--container-mid` **1080px** — konten tengah: contact (`.contact__container`), about
    (`.arows`), FAQ (`.faq__container`), charter & detail standalone (`.info__container`).
  - `--container-read` **720px** — kolom baca sempit: legal + artikel guide (`.guide-article`).
    Sengaja lebih sempit demi panjang baris enak dibaca (di 12.8px, 720 udah ±105 char — JANGAN
    dinaikin, malah kepanjangan; kalau kerasa kosong, naikin font body, bukan lebar kolom).
  - `--container-x` = `var(--space-3)` (1.5rem) — padding kiri/kanan seragam (jaga jarak tepi HP).
  - **Booking detail** (`.tour-layout--book`, ~1280px, attraction/tour bookable) = layout khusus
    2-kolom, **TIDAK ikut** token ini (sengaja paling lebar). Info di dalamnya di-override
    `max-width:none` (line ~3240), jadi ganti base `.info__container` gak ngefek ke sana.
  - **Gotcha `.catsec`**: dia nested di dalam `.experience` (yang udah padding-x 24px), jadi
    max-width-nya `calc(var(--container) - 2*var(--container-x))` (=1152) **tanpa** padding-x
    sendiri — kalau dikasih `--container-x` lagi nanti numpuk jadi 48px di HP. Hasilnya grid-nya
    pas selebar grid homepage (1200−48=1152) & tepi jatuh di 144/24 sama kayak wide lain.
- **Border radius (token, Agu 2026)**: 5 tingkat resmi biar sudut konsisten (dulu berserakan
  5/6/7/8/9/10/11/12/13/14/16/20/22px, di-snap ke tangga terdekat, geser maks ±2px):
  `--r-sm` 8 (chip/tag/field kecil/kalender) · `--r-md` 12 (field/kartu kecil/faq item/modal
  box/booking card) · `--r-lg` 16 (kartu experience/review/driver, panel, container kartu) ·
  `--r-xl` 22 (modal besar, hero card, charter box, sudut atas sheet) · `--r-pill` 999
  (tombol/chip pill/toggle). Sudut satu-sisi (mis. sheet atas) tetep pola-nya, cuma nilainya
  di-token (`var(--r-xl) var(--r-xl) 0 0`). **DIBIARIN** (jangan ikut di-token): `50%`
  (bulat/avatar), `2px`/`3px` (bar tipis mis. underline judul `.section__title::after`), `0`.
- **Shadow (token, Agu 2026, Wayan minta subtle)**: 4 tingkat elevasi neutral + focus-ring,
  sengaja HALUS (opacity rendah) biar kartu "nempel halus", bukan ngambang berat:
  `--shadow-sm` `0 1px 2px /.04` (chip/kontrol kecil) · `--shadow-md` `0 2px 8px /.05`
  (kartu default, gantiin `--shadow-card` lama) · `--shadow-lg` `0 6px 18px /.06` (dropdown/
  popover/hover) · `--shadow-xl` `0 14px 34px /.08` (modal/overlay/panel) · `--focus-ring`
  `0 0 0 3px rgba(34,32,28,.18)` (fokus field). **DIBIARIN** (disengaja, jangan di-merge):
  bayangan **green-tint** `rgba(31,61,43,x)` (kehangatan brand — booksidebar, driver hover,
  navbar), **directional/offset-negatif** (trip-bar, panel akun geser, book-bar — nyorot ke
  atas/samping), **animasi glow booksidebar** (`booksidebarGlow` keyframes), **focus-ring
  error** merah, **hairline** `0 0 0 1px`. Sama filosofinya kayak amber/gold: satuin yang
  kebetulan duplikat, jaga yang punya makna.
- **Motion (token, Agu 2026)**: durasi transisi + easing dipusatin biar animasi satu ritme.
  `--dur-fast` 0.15s (hover kecil/state cepet) · `--dur` 0.2s (default) · `--dur-slow` 0.3s
  (transform gede) · `--ease` `cubic-bezier(.4,0,.2,1)` (standar/material) · `--ease-out`
  `cubic-bezier(.16,1,.3,1)` (entrance expo-out). CUMA dipakai di `transition:` (feedback
  interaksi). **DIBIARIN** (disengaja): durasi `animation:` entrance (0.4-0.6s, choreography),
  fade lambat `0.5s`, special (marquee `35s`, glow booksidebar `2-3s`), dan keyword `ease`
  (udah konsisten). Snap durasi transition: 0.12/0.15/0.18→fast · 0.2/0.25→base · 0.28/0.3→slow.
- **Buka/tutup menu = `components/ui/Reveal.jsx`** (Framer Motion / paket `motion`, Sep 2026, Wayan
  pilih "langsung Framer Motion"). Alasannya: menu-menu itu dulu di-toggle pakai `display`
  (`hidden` / `? 'block' : 'hidden'`), dan `display` **gak bisa di-animasi sama sekali** - itu
  sumber "kaku"-nya, bukan easing-nya. Dua komponen:
  - `<Collapse open={...}>` - menu inline yang **nyorong konten di bawahnya** (submenu Program di
    navbar, list kategori HP di Our Company). Animasi `height`, jadi WAJIB `overflow:hidden` -
    makanya **JANGAN dipakai buat dropdown `absolute`**, panelnya bakal kepotong jadi nol.
  - `<PopMenu open={...}>` - panel **ngambang** di atas konten (dropdown kategori guide hub).
    Fade + naik dikit, gak nyentuh height, jadi `absolute` anaknya aman.
  - Durasi/easing-nya mirror token CSS (`--dur`/`--ease-out`) biar satu ritme sama transition
    lain. `useReducedMotion` → durasi 0 (hormatin setting OS).
  - **Ongkos: +36 KB gzip di SEMUA halaman** (homepage 295 → 332 KB), soalnya Navbar ada di mana-mana.
    Udah pakai konfigurasi paling irit (`LazyMotion` + `m` + `domAnimation`). **Code-split fitur
    animasinya malah LEBIH GEDE** (339 KB) - chunk async-nya duplikat core yang tetep dibutuhin
    eager. Udah diukur, jangan di-"optimasi" balik ke `import()` dinamis tanpa ngukur ulang.
  - **Catatan jujur**: khusus 3 menu ini, trik CSS (`grid-template-rows: 0fr → 1fr`) bisa ngasih
    hasil yang sama di **0 KB**. Framer Motion baru beneran kepake pas modal digarap (animasi
    **keluar**/unmount gak bisa CSS) - itu rencana setelah tanggal 28.
- **Press feedback tombol (Sep 2026, Wayan: "pas button di klik gak ada animasi")** - sebelum ini
  web NOL `:active` state, jadi tombol ditap gak ngasih respons apa-apa. Rule-nya di
  **`style.css` bareng reset**, BUKAN per-komponen: ada ~99 tag `<button>` tulis-tangan dan cuma
  segelintir yang lewat primitif `Button.jsx`, jadi per-komponen bakal kelewat banyak.
  - Pakai properti `scale` berdiri sendiri, **BUKAN `transform: scale()`** - kartu & CTA udah
    animasi `transform` pas hover (translateY), kalau pakai transform dua-duanya saling timpa.
    `scale` numpuk rapi sama `transform`.
  - Transition-nya sengaja di specificity elemen (0,0,1) biar komponen yang punya
    `transition` sendiri (0,1,0) tetap menang; rule `:active`-nya 0,1,1 biar feedback-nya
    SELALU kena. Konsekuensinya: komponen yang nulis `transition` sendiri harus **nambahin
    `scale`** ke daftarnya, kalau nggak press-nya nyentak (bukan gak ada, cuma gak halus).
  - Cek cakupannya: harness `press-probe.mjs` di scratchpad - ngitung tiap tombol yang keliatan
    per halaman, patokannya `press instan: 0`. Terakhir diukur: index 64/64, tour 43/43,
    our-company 29/29, bali-guide 24/24, my-trips 61/61, charter 73/76.
  - **Gotcha harness**: `html` punya `scroll-behavior: smooth`, jadi `getBoundingClientRect()`
    yang dibaca di tick yang sama sama `scrollIntoView` masih koordinat LAMA - mouse mendarat
    di tempat lain & `:active` gak kena (kejadian, sempet kebaca `scale: none`). Pakai
    `behavior:'instant'` + tunggu dulu sebelum baca rect.
- **JEBAKAN BESAR Tailwind v4: `transition-[transform]` GAK NGE-COVER utility translate/
  rotate/scale.** Di v4, `translate-x-full` / `rotate-180` / `scale-95` dikompilasi ke properti
  **berdiri sendiri** (`translate:` / `rotate:` / `scale:`), BUKAN ke `transform:`. Jadi kalau
  transition-nya nyebut `transform`, animasinya **gak jalan sama sekali** - elemennya lompat.
  Diem-diem aja, gak ada error, build lolos.
  - **CUMA bentuk ARBITRARY yang rusak.** Keyword `transition-transform` AMAN - Tailwind v4
    nge-compile dia jadi `transform,translate,scale,rotate` (udah ikut). Yang bahaya cuma tulis
    tangan: `transition-[transform]` / `[transition:transform ...]` = literal `transform` doang.
  - Kena di **5 tempat** (Sep 2026, ketahuan pas Wayan bilang hamburger masih kasar): **drawer navbar**
    (`translate-x-full` - drawer-nya gak pernah geser, langsung nempel), chevron Program, logo
    Featured-on, kartu homepage, CTA Explore hero. (Chevron Our Company sempet keitung juga -
    **SALAH**, dia pakai keyword `transition-transform`, jadi sebenernya udah jalan.)
  - **Yang arbitrary TETAP transform**: `[transform:translateY(-2px)]` beneran nge-set `transform`,
    jadi `transition`-nya memang harus `transform` (mis. kartu charter). Jangan ikut diganti.
  - **Cara cek**: harness `burger-probe.mjs` / `snap-sweep.mjs` di scratchpad baca
    `getComputedStyle(el).translate` frame per frame. Kalau langsung `100% -> 0px` dalam satu
    frame = transition-nya salah sasaran. Yang bener: `100% -> 82% -> 41% -> 16% -> 5% -> 0`.
  - Hamburger sekarang juga **morph jadi X** pas drawer kebuka (bar atas/bawah ketemu di tengah
    terus muter 45°, bar tengah fade), `aria-label` ikut ganti Open/Close menu. Scrim disamain
    ke 300ms/`--ease` biar segerak sama drawer (dulu 200ms, kepisah).
- **GATE CI `node tools/check-motion.js`** (Sep 2026, Wayan pilih "hybrid + gate" daripada
  konversi semua ke Framer Motion). Jalan atas `out/`, tanpa browser, 2 aturan:
  1. **DEAD** - elemen nge-transition `transform` tapi yang dia set translate/rotate/scale, dan
     gak ada yang nge-set `transform` -> transition-nya nembak angin, elemen bakal lompat.
  2. **SNAP** - tombol / link-pill yang nulis `transition` sendiri tanpa `scale` -> press feedback
     global di `style.css` jadi nyentak.
  - **Pas dipasang langsung nemu 8 yang kelewat dari sapuan browser** (browser cuma ngecek elemen
    yang KELIATAN di 12 halaman; gate nyisir 104 halaman termasuk isi drawer/modal/panel yang lagi
    kesembunyi). Termasuk tombol "Plan your trip" yang ternyata udah punya `active:scale-[0.99]`
    dari dulu tapi gak pernah halus karena transition-nya nyebut `transform`.
  - **Nulis gate begini WAJIB dites pakai bug aslinya.** Versi pertama gate ini "lolos" padahal
    gak ngecek apa-apa (`baseOf` balikin string, destructuring-nya `undefined`), DAN salah ambil
    transition terakhir - `motion-reduce:transition-none` nimpa transition asli, jadi drawer-nya
    ke-skip. Ketahuan cuma gara-gara bug drawer sengaja dibalikin buat nguji. Sekarang cuma
    transition TANPA varian yang dibaca.

## Key mechanics
- **Custom dropdown/date SITE-WIDE (no native select)** — SEMUA `<select>` & `<input type=date>`
  di-enhance jadi UI custom (`.hs-control` + `.hs-panel`): **desktop = dropdown ngambang, HP =
  bottom-sheet** (header + overlay). Native disembunyiin (`.bk-native`), custom nyetir value-nya
  (dispatch `change`). **Satu enhancer reusable**: `makeFieldEnhancer()` (global factory) → dipakai
  `initBookingCustomControls()` (booking form) + `initCustomSelects()` (navbar akun/charter/transfer/
  itinerary, jalan PALING akhir di initPage biar opsi udah keisi) + `enhanceFieldsIn(root)` (field di
  modal yg di-build on-demand, mis. editor "Your trip details"). Home search (`initHeroSearch`) punya
  enhancer sendiri (`.hs-panel--menu`) — enhancer di skip yg udah `dataset.enhanced`. Grup anchor
  panel: `.booking__group.bk-enh` (booking) atau `.csel-group` (auto-wrap, field lain). **Value diubah
  programmatik** (setGuests/setStay/resetGuests, swap From/To transfer) → panggil `cselRefreshAll()`
  biar label custom ikut update (native `.value=` gak fire change). Nambah select/date baru → otomatis
  ke-enhance kalau lewat `initCustomSelects` (tambah id/attr-nya) atau `enhanceFieldsIn` (modal).
  **Date picker = POPUP ke-center di desktop juga** (bukan dropdown nempel field): panel dikasih
  class `hs-panel--popup` + `bookdate-panel` → `openPanel` reparent ke body + overlay walau desktop
  (reuse gaya `.bookdate-panel` punya Book Now). Dropdown biasa (select) tetep nempel field di desktop.
- **Mobile hero = form jadi bottom-sheet** (Sep 2026, Wayan): di HP (≤992px) hero dipendekin
  (`min-height:68vh`), form search `.hero__search` disembunyiin (jadi sheet `position:fixed`
  translateY(100%)), diganti tombol **`.hero__planbtn`** ("Plan your trip", `[data-plan-open]`).
  Tap → `initHeroPlanSheet()` slide up sheet + scrim `.hero-sheet-ov` + swipe-down/×/tap-scrim
  buat nutup. **Desktop TIDAK kena** (tombol `display:none`, form tetep inline di kanan).
  **Gotcha z-index**: scrim di-append DALAM `.hero__inner` (yang punya `z-index:1` = stacking
  context) biar sheet (z45) di atas scrim (z44); kalau di body malah ke-trap ketutup scrim.
  Sub-panel field (guests/pickup) tetep reparent ke body (z55/60) → di atas sheet, aman dibuka
  dari dalam. `#search-placeholder` min-height di-nol-in di HP (form gak nahan ruang lagi).
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
  page (data.js WAJIB dimuat sebelum script.js). Any CSS/JS/data change → bump `N` on all pages. *(current: v435, PARTIALS 81)*
- **Aturan harga (Wayan, 3 Sep 2026)** - dipakai sama di `script.js` (situs lama) dan
  `cahyana-api/pricing.js` (server):
  - **Standar** = harga base tour apa adanya (×2 mobil kalau >5 tamu).
  - **Exclusive** = harga base + (tiket masuk × jumlah tamu). **Nggak ada margin** -
    `EXCLUSIVE_FEE` udah DIHAPUS total (Wayan: margin udah dimasukin ke harga base).
  - Tiket masuk beda per lokasi walau namanya mirip: **Kecak Ubud 100k ≠ Kecak Uluwatu 150k**.
    Tiket tiap tour ditentukan dari isi programnya (`TOUR_TICKETS`).
  - **Destinasi single nggak dijual lagi** - `prices.place` udah dibuang, kartu destinasi
    nggak nampilin harga. Halaman destinasinya TETAP ada (konten/SEO).
  - **Charter**: 5 jam 600k · 10 jam 1jt · tambahan 60k/jam.
  - **Pickup fee**: Ubud & nearby = 0. **Selain Ubud selalu kena, di SEMUA tour** -
    pengecualian "se-zona sama tour" udah dibuang (dulu `ITEM_ZONE`/`TRANSFER_ZONE`
    dipakai buat itu; datanya masih ada karena API ngirim `zone` ke frontend, tapi
    helper zona di script.js udah dihapus).
  - **Kurs (Wayan, 4 Sep 2026)**: `TICKET_IDR_PER_USD` = **17.600** (dulu 15.500),
    `CUR_RATE` = AUD 1.40 · EUR 0.86 · GBP 0.74 (dulu 1.53/0.92/0.79). Pembulatan
    konversi sekarang **KE ATAS** (`Math.ceil`, IDR ke ribuan terdekat ke atas) di
    `roundCur` - script.js DAN pricing.js.
  - **IDR = sumber kebenaran harga.** Harga USD tiap item DITURUNKAN dari IDR
    (`ceil(idr / 17600)`), bukan angka lepas - dulu semua ke-bake di ~15.500 jadi
    tamu USD kelebihan bayar ~13%. Ganti harga = ubah IDR, terus turunin ulang USD-nya.
  - **Dua tes, jalanin dua-duanya kalau nyentuh harga:**
    `node tools/pricing-spec-test.js` (di cahyana-api) nge-assert 6 aturan di atas, dan
    `node tools/golden-price-test.js` muat `script.js` situs lama beneran di sandbox terus
    bandingin tiap item × mata uang × jumlah tamu sama server. Aturan berubah = ubah
    `script.js` DAN `pricing.js` bareng, kalau nggak golden test langsung merah.
- **Data harga terpisah**: SEMUA harga & tarif (prices, TICKETS, TOUR_TICKETS, CHARTER,
  transport, CUR_RATE) hidup di **`data.js`** — script.js cuma logika.
  Ganti harga = edit data.js → `node tools/sync-prices.js` → bump `?v=`.
- **Multi-currency**: single source `prices` di data.js (USD+IDR per item) + static `CUR_RATE`.
  `[data-price="Name"]` spans are filled by `renderPrices()`. Supports USD/IDR/AUD/EUR/GBP,
  results are rounded, saved in localStorage `cue_currency`.
- **Form contact** (`contact.html`, `initContact`): POST JSON ke **`${API_BASE}/contact`**
  (nama/email/pesan — TANPA phone, makanya endpoint sendiri, bukan `/api/inquiry` yang
  wajib phone). Sukses cuma ditampilin kalau server balas `status:"saved"`; gagal → alert
  + tombol balik aktif. Dulu nembak `SHEET_ENDPOINT` placeholder pakai `mode:"no-cors"`
  jadi gagal diem-diem tapi tetep bilang "success" — pesan tamu keilangan. Jangan balikin
  pola fire-and-forget itu: form apa pun harus nunggu respons sebelum bilang sukses.
- **Validasi form = Zod, TANPA React Hook Form** (Sep 2026, keputusan Wayan setelah diukur).
  Semua aturan ada di **`lib/schemas.js`** (satu tempat, bisa dicocokin sama server), dipakai
  lewat `validateWith()` di `lib/validate.js`; error ditampilin **per field** pakai class
  `FIELD_ERR` (modalClasses). Form-nya sendiri tetap **plain React `useState`**.
  - **RHF UDAH DICOBA & DITOLAK.** Diukur di 4 form: ContactForm 73→69 baris, AuthModal
    104→105, ReviewModal 217→220, BookConfirmModal 348→358. Untungnya nol/minus karena
    SEMUA dropdown & date picker di web ini komponen custom (`Select`/`DateField`/
    `DateTimeField`) yang `onChange`-nya ngasih nilai, bukan event - jadi tiap satu butuh
    `Controller`. Plus RHF 26KB gzip, dan karena `AuthModal` di-import `Navbar`, itu ikut
    ke SEMUA halaman. Percobaannya diarsipkan di branch `claude/rhf-booking-review`.
  - **Gotcha Zod**: resolver/`safeParse` ngebalikin data yang UDAH DI-PARSE, dan Zod
    **buang key yang gak terdaftar di schema**. Field tanpa aturan (mis. `referral`,
    `name`/`countryCode` di review) TETAP wajib didaftarin, kalau nggak datanya hilang diam-diam.
  - **Email pakai regex sendiri** (`EMAIL_RE`), BUKAN `z.email()` - bawaan Zod lebih ketat
    dan bakal mulai nolak alamat yang selama ini diterima. Jangan diganti tanpa sengaja.
  - Habis nyentuh `lib/schemas.js` → jalanin **`node tools/form-rules-test.mjs`** (ngadu
    schema baru vs aturan if-chain lama, ~394rb kombinasi, harus "all identical").
- **Itinerary**: localStorage `cue_itinerary_v1`. Each add = a new day. Badge in the navbar.
- **Charter**: `CHARTER` config, live pricing.

## Yang masih nunggu Wayan (update terakhir: Agu 2026)
- Harga bertanda `CEK WAYAN` di **data.js** (paket operator: watersport, trek Batur, jeep,
  ATV, rafting, Zoo, Bird Park) — angka riset, Wayan koreksi.
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
1. `npm run build` passes (this is the real syntax/build check now — no more `node --check script.js`).
2. All active CI gates pass: `node tools/check-urls.js`, `node tools/check-detail.js`,
   `node tools/check-assets.js`. **Gate the commit on these** (jangan commit kalau ada yang merah).
   Marker class yang WAJIB ada di detail page (check-detail): `booksidebar`, `bookcard__cta`,
   `tour-layout--book`, `tour-hook`, `review-cta` — jangan dihapus pas convert.
3. Styling berubah → verify **pixel-diff / computed-style diff = 0** (harness di scratchpad:
   playwright-core + `headless_shell`, serve `out/` via `node http`). Baru hapus CSS lama-nya
   dari `style.css` kalau udah 0.
4. `style.css` `{}` braces balanced; no dead classes ketinggalan.
5. Commit + push ke `main` (deploy otomatis). Bump `?v=` UDAH GAK PERLU (hash otomatis).
