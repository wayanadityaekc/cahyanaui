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
> Gate CI yang tersisa (jalan atas `out/`): `check-urls`, `check-detail`, `check-assets`,
> `check-motion`. Plus 1 cek manual (bukan gate): `check-prices` — lihat section harga.

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
  **DUA pengecualian (Sep 2026, Wayan)** - dua-duanya karena harganya nempel ke CTA hijau
  dan amber di sebelahnya berantem: (1) **kartu paket charter** (`CharterPlans.jsx`, dipakai
  halaman charter DAN section homepage — harganya duduk di baris yang aksinya CTA hijau) dan
  (2) harga di **book bar** (`BookBar.jsx`) =
  `text-gold` (soft black), bukan amber — di bar itu amber nabrak tombol CTA hijau
  tepat di sebelahnya. Harga di tempat lain (kartu, sidebar, ringkasan) TETAP amber.
  Warnanya WAJIB dioper lewat prop `className` punya `<Price>` — default-nya
  (`PRICE` = amber) nempel LANGSUNG di elemen `[data-price]`, jadi `text-gold` di
  elemen pembungkus KALAH. Class `price` tetep dibawa (itu hook, bukan warna).

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
  - **Masih hand-drawn & JANGAN diganti** (Lucide gak punya): 7 logo pembayaran
    (`PayChips` + `Footer`), bendera mata uang (`FlagDefs`/`CurrencyPicker`).
    (Glyph WhatsApp hand-drawn `BookBar` udah dihapus Sep 2026 bareng tombol
    WhatsApp-nya — footer udah lama pakai Lucide `MessageCircle`, bukan ini.)
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
- **HERO-nya = HERO HALAMAN DETAIL** (Sep 2026, Wayan: "ubah semua page articles, pakai
  layout seperti tour destination dan experience, biar punya ciri khasnya"). Banner gelap
  full-bleed dengan judul putih di tengah + pill tag UDAH DIGANTI: sekarang 15 halaman guide
  buka pakai **`components/sections/DetailHero.jsx`** — cangkang yang SAMA persis dipakai
  `TourPage` & `AttractionPage` (foto 45% + sheet putih 55% isi judul, intro, 3 fakta, CTA).
  - **`DetailHero` itu hasil EKSTRAK**, bukan komponen baru: markup-nya dulu ke-copy
    byte-per-byte di `TourPage` + `AttractionPage`. Diverifikasi sebelum dipakai guide:
    **464 elemen hero diadu before/after di 4 halaman × 4 lebar → 0 beda**. Ubah hero =
    edit 1 file, 3 jenis halaman ikut.
  - **FOTONYA dari KARTU HUB, bukan `data.heroStyle`.** 14 dari 15 halaman guide cuma punya
    **gradient** di `heroStyle` (gak ada foto), padahal hero split butuh foto beneran.
    Tiap guide UDAH punya foto asli + label di kartu guide hub, jadi itu yang dipakai lewat
    `lib/guideMeta.js` → `guideCard(slug)`. **Bukan foto karangan** — itu foto yang emang
    udah mewakili guide itu di seluruh web. (`heroStyle` sekarang nganggur di data guide;
    sengaja dibiarin, itu konten bukan CSS mati.)
  - **3 fakta di hero** (gantiin pill tag lama): **Category** (tab hub yang aktif) · **Topic**
    (label kartu hub, mis. "Waterfalls"/"Cultural hub") · **Read** (`~N min`, DIHITUNG dari
    jumlah kata artikelnya sendiri @200 wpm, bukan angka karangan). CTA-nya "See our tours"
    → `/tour.html` (di HP ke-hide, sama kayak CTA hero tour).
- **LAYOUT ISINYA JUGA = LAYOUT TOUR** (Sep 2026, Wayan: "kontenya buat padding yang rapi
  terutama di kiri, ikutin website biar konsisten; tab nya buat seperti tab tour, layout
  kontenya juga, se mirip mungkin"). Kolom baca 720px yang ngambang di tengah container
  UDAH DIGANTI: sekarang guide pakai `TOUR_LAYOUT_BOOK/MAIN/SIDE` yang sama + kartu konten
  yang sama (`components/ui/detailCardClasses.js`).
  - **`detailCardClasses.js` juga hasil EKSTRAK dari `DetailTabs`** (kartu putih + shadow
    inset, wrapper sticky, track pill, section + judulnya). Diverifikasi: **3008 elemen
    kolom konten tour/attraction diadu before/after → 0 beda.**
  - **Yang dibenerin Wayan**: dulu judul isi artikel mulai di **181px** @1280 (kolom 720
    ke-center), sementara halaman tour di **48px**. Sekarang dua-duanya **48px** @1280 dan
    **32px** @390 — dijaga `verify-guidehero.mjs` (ngadu langsung lawan `/ubud-tour.html`).
  - **Teksnya tetep dibatesin `--container-read` (720px) TAPI rata KIRI di dalam kartu**,
    bukan ke-center: tepi kirinya lurus sama halaman tour, tapi barisnya gak jadi ~145
    karakter (kartu-nya 1000px). Ini kompromi yang disengaja — jangan dilebarin ke penuh.
  - **NAV KATEGORI = POLA OUR COMPANY**, di `components/sections/GuideCatNav.jsx`
    (Sep 2026, Wayan: "taruh tab kategorinya seperti kategori di our company, kayaknya itu
    lebih masuk akal"). Dua varian — `variant="desktop"` (list vertikal sticky di
    `TOUR_LAYOUT_SIDE`) + `variant="mobile"`, yang sekarang **komponen BERSAMA sama Our
    Company**: `components/ui/CatDropdown.jsx` (+ `CAT_ITEM` buat gaya item, dipakai
    varian desktop juga). Dua halaman itu kontrolnya emang udah sama persis — satu salinan
    = gak bisa melenceng lagi. Ganti bentuk dropdown = edit 1 file, dua-duanya ikut.
  - **Track pill tour UDAH DICOBA & DIBUANG** (sempat ke-commit di 27f61d4). Kategori guide
    ada 5 dan panjang ("About the Island", "People & Culture"), jadi pill-nya kudu
    `TRACK_SCROLL` + `segmentLink` (segmen selebar teks + row yang bisa di-geser) —
    artinya di HP sebagian kategori **kesembunyi di luar layar**, harus di-swipe dulu baru
    ketauan ada. Dropdown Our Company nunjukin semuanya sekali tap. `TRACK_SCROLL`/
    `segmentLink` UDAH DIHAPUS dari `detailCardClasses.js` (dead) — kalau mau balik ke
    pill, tulis ulang, jangan cari sisanya.
  - **Border-nya `border-l`, BUKAN `border-r`** kayak Our Company: kolom kategori guide
    ada di **KANAN** (Our Company di kiri), jadi garisnya harus di sisi yang ngadep konten.
    Mindahin kolomnya ke kiri = artikel ke-geser dari 48px yang baru aja disamain sama
    halaman tour — jangan.
  - Nav-nya **HP = dropdown, desktop = kolom** (satu komponen, varian ke-hide lewat
    `max-[992px]:hidden` / `min-[993px]:hidden`). Jangan dibikin dua-duanya nongol
    bareng, nanti dobel.
  - **Kenapa isinya BUKAN heading artikel** (kayak Overview/Details/Included punya tour):
    kategori itu navigasi ANTAR-guide (link ke hub), heading itu navigasi DALAM halaman —
    beda peran. Daftar isi "On this page" dari heading artikel sendiri masih mungkin
    ditambah nanti di kolom yang sama (list vertikal muat 5-9 heading panjang, pill track
    nggak) — belum diputusin Wayan.
  - Isi artikel + sidebar + blok "You might also like"/"See our tours" **isinya TIDAK diubah**.
  - Verifikasi: `verify-guidehero.mjs` di scratchpad (34/34) — 15 halaman semuanya punya foto,
    3 hook & CTA; foto/judul posisi + ukurannya **identik sama `/ubud-tour.html`**; di HP
    judulnya hitam di sheet putih (bukan putih di atas foto lagi); artikel & sidebar utuh.
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
- **`tools/sync-schema.js` UDAH GAK ADA** (ikut kehapus pas situs lama dipensiunin), jadi
  **`content/shared/schema.js` sekarang dirawat TANGAN** dan bisa MELENCENG dari sumbernya.
  Udah kejadian (ketemu Sep 2026): JSON-LD `ubud-atv-adventure` masih ngiklanin stop
  **Tegenungan** yang udah lama dibuang dari program itu, padahal `metaDesc`-nya udah bener —
  jadi Google dikasih tau stop yang gak didatengin. Udah dibenerin. **Habis ubah `metaDesc`
  atau isi program, WAJIB update `schema.js` bareng**, terus adu: tiap `metaDesc` harus
  muncul PERSIS sebagai `description` di JSON-LD-nya (sekarang 7/7 cocok).

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
- **SEMUA slider FULL-BLEED di HP** (Sep 2026, Wayan: "buat slidernya full width screen kayak
  di slider guide, walk ke seluruh slider di website, ubah seperti itu semua"). Dulu cuma
  slider guide home yang gitu; sekarang satu konstanta **`BLEED_MOBILE`** di
  `components/ui/gridClasses.js` dipakai SEMUA track: `GRID_XPLORE` (homepage Tours +
  Destinations) · `GRID_SLIDER` (guide home) · `GRID_GUIDEHUB` (5 baris kategori guide hub) ·
  `GRID_GUIDEMORE` (guide article) · `GRID_CAROUSEL_4UP` (carousel halaman tour/attraction) ·
  `GRID_RELATED`. (Slider kartu charter di homepage UDAH GAK ADA - section itu sekarang baris
  tarif, lihat "Homepage section order".) **Bikin slider baru → import konstanta
  itu, jangan tulis bleed sendiri.**
  - **Rumusnya `margin-inline: calc(50% - 50vw)`, BUKAN `-mx-6`** (yang dipakai slider guide
    dulu). Alesannya: padding container tiap slider BEDA — 24px di homepage & halaman guide,
    **~18px** di dalam layout booking, **49px** di dalam panel charter. Angka mati bakal
    nyisain celah di sebagian tempat & kelewatan di sebagian lain. `50%` di margin ngukur ke
    **lebar containing block**, jadi rumus ini otomatis pas asal container-nya ke-center —
    dan semua container di web ini ke-center. Udah diukur: 24 track, semuanya mendarat di
    `L0 R0`.
  - **CUMA di HP (`max-[992px]`)** — sama kayak slider guide dulu. Di desktop sebagian grid
    ini malah jadi grid wrap (`GRID_XPLORE`/`GRID_GUIDEMORE`), sebagian lagi sengaja dipatok
    selebar container biar kartunya pas 4-up (`GRID_CAROUSEL_4UP`/`GRID_GUIDEHUB`).
    **Diverifikasi: geometri desktop (1280 & 1440) NOL berubah.**
  - **`pr-4` = satu-satunya yang beda dari slider guide yang lama.** Tanpa itu kartu terakhir
    nempel mentok ke tepi kanan pas di-scroll habis, keliatan kepotong.
  - **BAHAYA `100vw`**: kalau browser masang scrollbar klasik, `50vw` > setengah `innerWidth`
    dan halamannya melar ke samping. **WAJIB dicek** `document.scrollWidth - innerWidth == 0`
    di tiap halaman tiap lebar — harness `slider-geo.mjs` di scratchpad ngecek itu bareng
    diff geometri before/after (patokannya: desktop 0 diff, overflow 0 di semua halaman).
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

## Listing page (tour/activities/destinations) — `ListingPage.jsx`
**Navigasi kategori (Sep 2026, bentuk sekarang):**
- **HP** = `components/ui/SectionSwitcher.jsx`, satu bar di bawah layar: **nama kategori
  yang lagi keliatan · panah ◀▶**. Panah = lompat ke section sebelum/sesudah.
  Bar ini **pakai cangkang yang SAMA** kayak book bar (lihat section "Sticky bottom bar").
  Dulu dia pill sendiri di tengah-bawah dan **ketumpuk** sama tombol chat ngambang —
  itu sebabnya digabung (chat-nya sendiri sekarang udah pindah ke navbar).
- **DESKTOP** = tab segmented lama (pill panjang ngambang, `role="tablist"`, isinya
  "All Bali Tours / Ubud & Around / ..."), **SENGAJA DIBIARIN** beda dari HP
  (Sep 2026, Wayan: "desktop biarin") — layar lega, semua kategori keliatan sekaligus.
  Jangan "dirapihin" biar sama sama HP tanpa nanya.

**Isi kartu listing (`ListingRow`) — tour / experience / destinasi WAJIB seragam:**
- Barisnya: `N stops` (ikon pin) · durasi (jam) · [area, ikon PETA — destinasi doang] ·
  `Private driver` · badge `Free cancellation` · harga. Wayan minta ketiganya sama
  (Sep 2026) — kalau nambah jenis listing baru, samain juga.
- Kartu tour & experience nulis sendiri di `content/shared/listings.js`. Kartu yang
  nunjuk halaman attraction (**destinasi + experience**) dilengkapin otomatis sama
  **`withAttractionCards(listing, ATTRACTION_CONTENT)`** di `lib/tourIndex.js`, dipanggil
  dari `app/(listing)/*/page.jsx` (server component — `ListingPage` itu `'use client'`,
  kalau di-import di sana seluruh dataset tour keikut ke browser).
- `withAttractionCards` **cuma ngisi yang KOSONG**, gak nimpa: experience tetep pakai
  jam tulisan tangannya sendiri ("~2 hours riding"). Destinasi: jam ngisi slot `meta`,
  area-nya pindah ke baris sendiri.
- **Gotcha label durasi**: halaman attraction nyimpen durasi di 2 nama — **"Time here"**
  (40 halaman, destinasi) dan **"Duration"** (11 halaman, experience). Kalau cuma baca
  salah satu, ada kartu yang jamnya ilang diam-diam (kejadian: Watersport).
- **Harga**: tiap kartu bawa `priceName` + `priceFallback` sendiri (termasuk 33 kartu
  destinasi) — bukan cuma buat kartu, tapi juga dibaca book bar lewat `priceFallbackFor()`.
  Pernah dicoba naro harga destinasi di file terpisah (`place-prices.js`) → dibuang,
  Wayan: "samain aja sama tour". Satu konvensi, satu tempat.

**Scrollspy (legacy note):**
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
Urutan `index.html` (`body.home`): Hero → **Program** (`#explore`) → **Airport pickup**
(`#airport-pickup`) → Destinations (`#destinations-home`) → **Why Us** (`#why-us`) →
Guides (`#guides`) → Villas (`#villas`) → **Charter** (`#charter-promo`) → About (`#about`)
→ Featured On (`.trust`) → Reviews (`#reviews-placeholder`).
- **Section `#explore` = "Our Best Bali Program"**, SATU set 8 kartu (4 tour + 4 experience)
  digabung (Sep 2026, Wayan: "keluarin card dari kategori, tour dan experience jadi satu").
  Dulu 2 tab (Tours | Experiences) — separuh kartu kesembunyi di balik tap, dan section-nya
  keliatan lebih kurus dari katalog aslinya. 8 kartu = jumlah yang sama kayak Destinations,
  jadi `GRID_XPLORE` nata-nya persis sama: **HP 1 slider, desktop 2 baris × 4**. CTA-nya
  tinggal satu → `/programs.html` (halaman yang emang gabungin dua-duanya). Gak ada state
  tab lagi → `Explore.jsx` balik jadi **server component** (gak ngirim JS).
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
  - **Charter (`CharterHome.jsx`) = KARTU PAKET DOANG + 1 tombol** (Sep 2026, Wayan: "reuse
    komponen bro, gimanapun styling dan structure di page charter pakai itu juga di section
    homepage, berarti lu harus pisah input form dan card nya ... di section homepage gua mau cuma
    card nya aja dan button yang mengarah ke page charter untuk melengkapi form").
    - **Kartunya = `components/sections/CharterPlans.jsx` yang SAMA PERSIS dipakai halaman
      charter** — bukan tiruan, komponennya sendiri. Dulu homepage punya 4 baris tarif sendiri
      (5h/10h/12h/14h) dengan box harga cream, dan tiap kali halaman charter berubah dia
      ketinggalan. Sekarang cuma ada SATU list paket di seluruh web.
    - Homepage **gak punya field sama sekali** — form-nya cuma di halaman charter. CTA-nya satu,
      "Build your charter" → `/charter.html` (`BTN_BOOK`, jadi `no-underline` udah ikut).
    - **`area` sengaja dikosongin** di homepage: gak ada field pick-up berarti gak ada surcharge
      buat dihitung, jadi angkanya polos tanpa kata "Total" di atasnya.
    - **Pilihan tamu di homepage KEBAWA ke halaman charter** (Wayan: "make sure apapun yang di
      pilih user di homepage, tetep di inget atau auto fill di page charter") — lewat
      `lib/charterDraft.js` (localStorage `cue_charter_v1`, key-nya kedaftar di `KEY`).
      Homepage nyimpen pas di-tap; builder baca pas mount terus nge-seed `dur`/`extra`.
      **WAJIB dibaca di `useEffect`, JANGAN di initial state** — ini static export, nilai yang
      cuma ada di browser bakal bikin render pertama beda sama HTML hasil pre-render.
    - `CHARTER_CARDS` di `content/shared/home.js` + komponen `CharterPrice.jsx` **UDAH DIHAPUS**
      (ikut kebuang bareng 4 baris tarif lama). Harga sekarang dihitung `useCharterTier()` dari
      katalog API, jadi **gak ada lagi angka cadangan yang bisa basi** di homepage.
    - Verifikasi: **`verify-charterhome.mjs`** di scratchpad (81/81) — 320/390/430/768 + desktop
      1024/1280/1440: 3 kartu ada, NOL field, cuma 1 tombol & href-nya `/charter.html` & gak
      bergaris, gak ada kicker di atas harga, halaman gak melar. Plus **adu dua halaman di lebar yang sama**:
      nama/harga/class row/class grid/gaya teks/tinggi baris harus IDENTIK homepage vs halaman
      charter. Plus **serah-terima**: pilih Extended di homepage → tersimpan → halaman charter
      kebuka di Extended + field Extra hours ikut nongol + baris ringkasan nyebut Extended;
      pengunjung baru (storage kosong) tetep dapet Full Day.
- **Copy**: no em-dash (`—`) di teks — pakai hyphen biasa (` - `) atau pecah kalimat.

## Sticky bottom bar (Sep 2026)
**Cuma boleh ada SATU benda yang nempel di bawah layar.** Dua-duanya berbagi cangkang
yang sama di **`components/ui/stickyBar.jsx`** (`BAR_SHELL`) — ganti bentuk/warna bar =
edit di situ, dua-duanya ikut:
- **`BookBar`** (halaman detail yang jualan) — **gaya GetYourGuide** (Sep 2026, Wayan
  ngasih screenshot GYG): blok harga bertumpuk di kiri (**kicker "From" · angka + unit ·
  badge**), CTA **"Book now"** di kanan. Di-render dari `TourPage`/`AttractionPage`
  (**bukan** dari layout) — `<BookBar item={...} priceFallback={priceFallbackFor(...)}
  perPerson={...} />`. Karena di-render halaman, bar-nya ikut ke HTML statis → gak ada
  kedip "isi salah dulu baru bener".
  - **2 hal dari GYG SENGAJA GAK DITIRU** (jangan ditambahin nanti):
    1. **Harga coret "A$55"** — kita gak punya list price, jadi angka coret apa pun =
       diskon karangan.
    2. **Badge "Likely to sell out"** — kita gak ngelacak sisa kursi, jadi itu urgensi
       palsu. Diganti **"Free cancellation"** (+ ikon `ShieldCheck`): sama-sama jawab
       keraguan yang bikin orang nunda, tapi beneran bener & udah ada di tiap kartu.
  - **Unit WAJIB ikut jenis produk**: `perPerson` dioper dari `AttractionPage` (flag yang
    sama yang dikasih ke `BookSidebar`), tour = `per car`. Kalau gak dioper, bar bakal
    ngomong beda sama form booking di halaman yang sama.
  - **"From" itu akurat, bukan basa-basi jualan**: yang ditampilin harga base Standard,
    dan tamu/Exclusive/pickup cuma bisa naikin.
  - **Tinggi CTA = 2.9rem/46px** (token tombol aksi), **BUKAN `self-stretch`** — di-stretch
    dia jadi 81% tinggi kartu & bentuknya lonjong banget (GYG sendiri ~54%).
  - **Bar ini LEBIH TINGGI dari `SectionSwitcher`** (84px vs 53px), jadi `<body>` mesen
    ruang beda per bar lewat marker kedua **`bookbar`**. Dua rule `:has()`-nya dibikin
    **saling eksklusif** (`not-has-[.bookbar]:has-[.stickybar]` vs `has-[.bookbar]`) —
    kalau cuma ditumpuk, specificity-nya sama persis dan yang menang ditentukan urutan
    class hasil generate Tailwind, bukan maksud kita. **Ubah isi bar → ukur ulang
    tingginya & update angka padding-nya** (`verify-gygbar.mjs` ngejaga: padding harus
    ≥ tinggi bar, dan sisanya ≤14px biar gak kebanyakan ruang kosong).
- **`SectionSwitcher`** (halaman listing, HP): **nama kategori · panah ◀▶**.

**CHAT GAK DI SINI — ada di NAVBAR** (Sep 2026, Wayan: "chat di bawah sticky dihapus,
pindahin ke navbar"). Ikon `MessageCircle` di kluster kanan navbar (sebelah kiri
keranjang), keliatan di semua halaman & semua lebar, link ke `wa.me`. Tombol hijau
"Chat on WhatsApp" di dalam drawer TETEP ada. **Riwayat biar gak muter-muter**: chat
pernah jadi tombol ngambang (`ChatFab`, pojok kiri bawah) + kolom di dalam bar —
dua-duanya UDAH DIHAPUS, `BarChat`/`BAR_DIVIDER`/marker `stickybar-on` ikut kebuang.

Aturan mainnya (jangan diubah tanpa ngerti kenapa):
- **Bentuk bar = NEMPEL PENUH ke tepi bawah** (Sep 2026, Wayan: "tempelin book bar di
  bawah, persis kayak GYG"): `fixed inset-x-0 bottom-0`, full width, **sudut ATAS doang**
  (`rounded-t-[var(--r-xl)]`), HP doang (`hidden max-md:flex`). Ini langkah KETIGA dari
  permintaan yang sama — dulu ngambang (`left-2 right-2 bottom-1.5` + radius 4 sudut), terus
  "kira-kira 95% nempel", sekarang nempel beneran. **Jangan dibalikin ke ngambang.**
  Konsekuensi yang gampang kelewat:
  - **Border cuma di ATAS** (`[border-top:...]`) — sisi & bawah ke-gambar di luar layar.
  - **Bayangan harus ke ATAS** (`0 -6px 22px`), BUKAN `--shadow-xl` (yang nyorot ke BAWAH
    dan ketelen tepi layar, jadi bar-nya keliatan nempel tanpa elevasi sama sekali).
  - **WAJIB `env(safe-area-inset-bottom)`** lewat `max()`: di iPhone ada home indicator di
    strip itu, bar yang nempel bakal naro tombol CTA di bawahnya. Di device lain nilainya
    0, jadi padding normalnya kepakai.
  - **`SectionSwitcher` ikut berubah** — cangkangnya satu (itu emang aturannya di atas).
- **Marker `stickybar`** = bar-nya ADA, dipakai `<body
  className="max-md:has-[.stickybar]:pb-[60px]">` buat mesen ruang di bawah biar konten
  paling bawah gak ketutupan.
- **`BookBar` turun sembunyi pas form booking keliatan** (IntersectionObserver ke
  `.booksidebar`/`.bookcard__cta`) — Wayan: gak boleh ada 2 tombol Book kelihatan bareng.
  Bar-nya **tetep ke-mount** (cuma di-translate keluar) biar padding body gak kedip-kedip.
- **Kalau nambah rule `:has()` yang nyangkut bar ini, scope-in ke `max-md`**: elemen bar
  tetep ada di DOM di semua lebar (cuma `display:none` di atas 768px), jadi rule tanpa
  scope bakal kena juga di desktop. (Dulu kejadian pas ChatFab masih ada.)
- **Harga di bar = HITAM** (`text-gold`), bukan amber — pengecualian yang disengaja dari
  aturan "semua harga amber", lihat section Design system. Dioper lewat `className` punya
  `<Price>`, bukan lewat wrapper (wrapper kalah).
- **Harga di bar** = `priceFallbackFor(name)` (angka kartu) dulu, diganti angka API pas
  katalog nyampe. Tour/experience/destinasi WAJIB sama — ini yang dulu beda (destinasi
  kosong sampe API balas) dan Wayan minta disamain.
- Ukur pakai harness di scratchpad (`verify-navchat` / `verify-bookbar-v2` /
  `verify-listingbar` / `compare-detailbars`) — patokan: **cuma 1 elemen** nempel di bawah,
  chat ketemu di navbar di semua halaman, dan harga kebaca walau API di-`abort()`.

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
- **Ikon chat** (Sep 2026, Wayan): `MessageCircle` di kluster kanan, **sebelah kiri
  keranjang**, link `wa.me`. Ini rumah barunya chat — dulu nempel di sticky bar bawah +
  tombol ngambang, dua-duanya udah dihapus (lihat section "Sticky bottom bar").
  Gayanya niru ikon keranjang persis (`w-5 h-5`, `text-gold`, `mr-[1.3rem]` /
  `max-[992px]:mr-[0.85rem]`) - kalau ubah salah satu, samain dua-duanya.
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
  - `--container-x` = `var(--space-3)` (1.5rem) di desktop, **`1rem` (16px) di HP** —
    padding kiri/kanan seragam. **Override HP-nya di `@media (max-width: 992px)`, ditulis di
    `style.css` DAN `app/globals.css` dua-duanya** (urutan load-nya gak dijamin, jadi
    disamain biar siapa pun yang menang nilainya sama). Breakpoint 992 itu SENGAJA sama
    persis sama band `BLEED_MOBILE`: slider full-bleed nge-inset kartu pertama 1rem, jadi
    kalau container-nya tetep 24px judul section sama kartu pertama gak lurus (Sep 2026,
    Wayan: "samain 16px semua biar rapi"). **Section wrapper JANGAN hardcode `px-6` lagi** —
    pakai `px-[var(--container-x)]` biar ikut. Yang udah disapu: Hero, About, Airport,
    GuideHome, Trust, Villas, WhyUs, GuestReviews (+ XPLORE_SECTION & CharterHome udah token
    dari dulu). Cek pakai `gutter-check.mjs` di scratchpad: di 390px SEMUA judul section
    rata-kiri harus mulai di 16px dan kartu pertama tiap slider juga 16px.
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
  **BUG 3 MINGGU (dibetulin Sep 2026)**: `--dur-fast` di `style.css` ketulis
  `--dur-fast: var(--dur-fast)` - nunjuk dirinya sendiri, jadi tokennya resolve ke KOSONG. Tiap
  `transition: ... var(--dur-fast) ...` (shorthand) jadi invalid at computed-value time dan
  jatuh ke nilai awal **`all 0s`** = gak animasi apa-apa. Kena 43 pemakaian, build ijo terus.
  Sekarang dijaga gate (`check-motion` rule CYCLE). Kalau nemu transition yang "harusnya jalan
  tapi enggak", cek `getComputedStyle(el).transitionDuration` - kalau `0s` padahal class-nya
  nulis durasi, berarti ada `var()` yang gagal resolve, bukan salah selector.
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
  - **Dropdown kategori (Our Company + guide article) UDAH PINDAH `Collapse` → `PopMenu`**
    (Sep 2026, Wayan: "gua mau dropdownya itu behaviornya seperti hamburger menu, kalo di
    buka gak buat konten geser menurun"). `Collapse` animasi `height`, jadi dia **nyorong
    semua yang di bawahnya** — buka daftar kategori pas lagi baca, paragraf yang lagi dibaca
    kegeser. `PopMenu` cuma fade+naik, panelnya `absolute` = ngambang di atas artikel.
    Dua-duanya lewat `CatDropdown`.
  - **JEBAKAN posisi panel `PopMenu`**: `m.div` punya `transform` SELAMA animasi masuk,
    jadi dia jadi containing block buat anak `absolute`-nya; begitu animasi kelar Framer
    nge-set `transform: none` dan containing block-nya **pindah** ke pembungkus `relative`
    terdekat. Kalau dua acuan itu tingginya beda, panelnya **lompat** pas animasi selesai.
    Makanya pembungkus `relative`-nya WAJIB **mepet ke trigger** (nol padding sendiri) —
    jarak/border ditaro di elemen di luarnya. Pola yang sama dipakai `GuideHub` (`GC_NAV`
    cuma mbungkus tombolnya).
  - Panel ngambang WAJIB punya: bg solid + border + `--shadow-lg` (kalau nggak teks artikel
    nembus keliatan), z-index, **tap-di-luar & Escape buat nutup** (beda sama `Collapse`
    yang nyorong konten jadi jelas kebuka — yang ngambang bisa ketinggalan kebuka pas
    di-scroll).
  - **Ukuran & jarak semuanya token** (Sep 2026, Wayan: "rapikan ukuran text dan spacenya
    sesuai semua web"): teks `--fs-body` + `--lh-body` · ikon `--icon-sm` (dulu 18px,
    di luar tangga 16/20/24) · SEMUA jarak `--space-1` 8px (gap ikon-teks, padding panel,
    offset panel ke trigger, padding baris) · transisi chevron `--dur`/`--ease` (dulu
    `duration-200` mentah). Dua padding 8px yang ketemu = **16px antar-teks**, dan kolom
    desktop-nya dipatok `gap-[var(--space-2)]` = angka yang sama — jadi varian HP & desktop
    ritmenya identik. `--lh-body` bukan cuma kosmetik: tanpa itu barisnya 31px (line-height
    `normal` bawaan browser), dengan itu 36px = kekejar jempol.
  - Ngetes-nya: harness `verify-catdrop.mjs` + `verify-catpick.mjs` + **`verify-cattokens.mjs`**
    di scratchpad —
    patokannya **posisi elemen di bawah dropdown GAK BERUBAH** pas dibuka (itu inti
    permintaannya) + tinggi dokumen tetap, panel di atas konten (hit-test), gak kepotong di
    320/390/430, dan milih kategori masih ganti section/hash (Our Company) & link-nya masih
    ke anchor hub (guide).
  - **Gotcha harness**: `button[aria-expanded]` nyomot toggle submenu drawer navbar yang
    nangkring di luar layar di SEMUA halaman. Trigger-nya dikasih hook `data-catnav` —
    pakai itu.
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
  - **Tambalan kedua (Sep 2026)**: gate-nya sempet CUMA baca transition tanpa varian, jadi
    transition yang di-scope ke breakpoint kelewat - dan itu nyembunyiin bug **sheet hero HP**
    (`max-[992px]:[transition:transform...]` + `translate-y-full` = sheet-nya lompat, gak geser).
    Sekarang gate ngelompokin per scope varian (`""` = base, `max-[992px]`, `hover`, dst) dan
    ngecek tiap scope sendiri-sendiri; `motion-reduce` di-skip (emang sengaja matiin animasi).
  - **Rule 3 - CYCLE (Sep 2026)**: custom property yang didefinisiin sebagai dirinya sendiri
    (`--x: var(--x)`). Itu yang kejadian sama `--dur-fast`. Satu regex, nahan seluruh kelas bug ini.
  - **Harness `press-probe`/`snap-sweep` sempet BOHONG**: dia ngitung `transition-property: all`
    sebagai "lulus", padahal `all` + durasi `0s` itu justru tanda transition-nya MATI. Makanya
    dia lapor "index 64/64 mulus" selama `--dur-fast` rusak. Sekarang `all`+`0s` dihitung mati.
- **Sheet hero HP (tombol "Plan your trip")** - urutannya: tombol press `scale` 0.97
  (`--dur-fast`), sheet naik `translate` 0.3s **`--ease-out`** (kurva entrance - sengaja beda dari
  drawer navbar yang pakai `--ease`, karena ini "muncul" bukan "geser"), scrim `--dur-slow` biar
  **segerak sama sheet** (dulu `--dur` 0.2s, jadi gelapnya kelar duluan di ~167ms padahal sheet
  baru nyampe ~317ms). Ukur pakai `plan-probe.mjs`.
  - **Gotcha harness**: kalau nge-tes press-nya pakai mouse down+up, itu = KLIK, sheet-nya kebuka.
    Reload dulu sebelum ngukur animasi bukanya, kalau nggak semua kebaca "udah selesai".
- **Swipe-down buat nutup sheet HP = `components/ui/DragSheet.jsx`, PAKAI POINTER EVENT, BUKAN
  Framer Motion** (Sep 2026, setelah diukur). FM `drag` ada di feature set **domMax** (satu paket
  sama `layout`), dan narik itu masuk = **+12 KB gzip di SEMUA halaman**, termasuk halaman yang
  gak punya sheet - soalnya `motion/react` udah nangkring di shared chunk lewat navbar, jadi
  fitur tambahannya nimbrung di situ juga. Di-`dynamic()` pun angkanya gak gerak (udah dicoba).
  Pointer event bikin hal yang sama di 1 file, ongkos ~0 KB.
  - CSS tetep yang pegang posisi diam (open/close lewat `translate`), pointer event cuma nge-set
    `transform` selama jari nempel - dua properti beda, jadi numpuk rapi, gak rebutan.
  - Drag mulai dari **handle** (strip di atas sheet), BUKAN seluruh sheet - isinya form yang
    bisa di-scroll, kalau listener-nya se-sheet nanti scroll & tap field ketelen.
  - Ambang nutup: geser > 90px ATAU kecepatan > 0.5 px/ms (biar flick pendek juga nutup).
  - Verifikasi: `swipe-test.mjs` di scratchpad - geser 160px harus NUTUP, geser 30px harus
    TETEP KEBUKA, `transform` sisa harus bersih, dan di desktop handle-nya harus gak ada.
- **Stagger list = `<Stagger>` + `<StaggerItem>` di `Reveal.jsx`** (dipakai grid guide hub pas
  di-search). Kartu yang BARU MUNCUL fade+naik berurutan; kartu yang bertahan dari filter gak
  ke-remount jadi diem aja (itu benar, bukan bug).
  - **BUKAN `layout` animation** (kartu gliding pindah posisi) - `layout` juga di domMax, jadi
    +12 KB di semua halaman buat 1 halaman doang. Stagger pakai feature set yang udah ada = +0.1 KB.
  - **Gotcha `AnimatePresence initial={false}`**: flag-nya nyebar lewat context ke SEMUA keturunan,
    bukan cuma render pertama - jadi item yang mount belakangan ikut ke-skip dan animasinya gak
    pernah jalan. Ganti pola: provider yang baru `true` SETELAH mount-nya sendiri, jadi kartu yang
    datang bareng halaman langsung penuh (aman buat LCP) tapi kartu yang muncul belakangan animasi.
  - Nyisipin wrapper di dalam CSS grid itu RAWAN - verifikasi geometri kartu before/after
    (`guide-geo.mjs`): harus identik di desktop & HP. Terakhir diukur: 30 kotak, nol geser.
- **Modal nutup = `components/ui/ModalPresence.jsx` (AnimatePresence)** - INI kasus Framer Motion
  yang beneran gak ada gantinya. Modal-modal ini (`ReviewModal`, `BookConfirmModal`,
  dialog konfirmasi `BookSidebar`/`BookCta`) cuma **mount pas kebuka**, jadi dulu masuknya pakai
  keyframe (`heroFadeIn`/`popCardIn`) dan **keluarnya gak ada sama sekali** - elemennya udah lepas
  dari DOM sebelum transition sempat jalan. AnimatePresence nahan elemennya sampai animasi keluar
  selesai, baru di-unmount. Ongkos ~0 KB (feature set-nya udah kepasang lewat navbar).
  - Keyframe di `modalClasses.js` UDAH DIBUANG - `SHELL`/`BOX`/`BOX_SM` sekarang murni tampilan,
    animasi dua arah semuanya di `ModalPresence`. Jangan tambahin `animate-[...]` ke situ lagi.
  - **Pola "tahan isi terakhir"**: `BookConfirmModal`/`ReviewModal` dulu `return null` pas
    `ctx`/`prefill` null, jadi pas nutup gak ada yang bisa dianimasiin. Sekarang ada
    `lastCtx`/`lastPrefill` (useRef) dan **JSX-nya baca `view`**, sementara **semua jalur logika
    (validate, submit, teks WhatsApp) TETAP baca `ctx` yang live** - jangan ikut diganti ke
    `view`, itu beda maksud.
  - **Wajib `pointerEvents: 'none'` di variant `exit`**, BUKAN di prop `style` yang dihitung dari
    `open`. AnimatePresence nge-render elemen yang lagi keluar pakai props TERAKHIR-nya, jadi
    style yang diturunin dari `open` ke-bake jadi `auto` selamanya. Kalau kelewat, tombol
    "Confirm" masih bisa dipencet selama 0,32 detik fade padahal `ctx` udah null. Diukur:
    sekarang mati dalam ~43ms dan tetep mati.
  - **Gotcha harness**: nyari shell modal pakai "div z-index 200 mana aja" itu SALAH - `AuthModal`
    lewat `<Modal>` selalu ke-mount dengan opacity 0 & z-200, jadi ke-comot dan lapor "gak ada
    animasi" padahal ada. Pakai `#modal-form` terus `.closest('div.fixed.inset-0')`.

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
- **Trip bar (`components/layout/TripBar.jsx`, strip di bawah navbar)** — Sep 2026, Wayan
  minta **dibalikin ke SEMUA halaman** (sempat homepage-only). Di-render dari `Navbar`, isinya
  promo dari `PROMO` (`content/shared/promo.js`: `{active, text, cta, href}`) — cuma muncul
  kalau `active:true` & `text` keisi (default off, no fake content).
  - **Teksnya sengaja kecil & tipis**: `text-[0.72rem] font-normal text-muted` (≤12px, dulu
    12.8 HP / 14 PC dan warnanya `--color-green`). Ini pengumuman, bukan headline — jangan
    dibikin setebal nav.
  - **Nutup pas scroll turun, balik pas scroll naik.** Ambang: abaikan gerakan <6px (jitter),
    dan gak pernah nutup selama masih <80px dari atas. Animasinya `grid-template-rows`
    **0fr ↔ 1fr** (anaknya `overflow-hidden`) — gak usah ngukur tinggi apa pun.
  - **DUA var tinggi header, jangan ketuker:**
    - `--header-h` = tinggi header **live** (di-update `ResizeObserver` di `Navbar`), jadi
      ikut mengecil pas trip bar nutup. Dipakai elemen yang harus **nempel** ke bawah navbar
      (strip tab sticky di listing/guide) — kalau pakai yang beku, nanti nyisa celah.
    - `--header-h-max` = **plafon**, cuma naik, gak pernah turun (reset pas resize). Dipakai
      `padding-top` halaman (hero `TourPage`/`AttractionPage`, `OurCompany`). Kalau padding
      halaman dipatok ke `--header-h`, seluruh dokumen **lompat naik ~39px** persis pas trip
      bar nutup — itu bug-nya, dan itu sebabnya var-nya dipisah. Fallback-nya = tinggi header
      penuh hasil ukur (92px HP / 98px desktop), biar paint pertama gak kepotong.
  - **ISINYA BEDA PER HALAMAN** (Sep 2026, Wayan: "gua mau tiap halaman beda") — semua
    di **`content/shared/promo.js`**, di-resolve `promoFor(pathname)`:
    - Key = pathname **tanpa `.html`** (itu yang dikasih `usePathname` di static export).
      Key yang diakhiri `/` = cocok per **prefix** (`/guide/`), jadi halaman guide baru
      ikut sendiri. **Exact menang atas prefix**, prefix terpanjang menang (mis.
      `/attractions/kecak-dance` nimpa default detail).
    - Value = 1 pesan ATAU **array** (di-rotate di tempat — homepage: free cancellation ⇄
      Kecak, 7 detik, crossfade). `null` = bar **MATI** di halaman itu (`/our-company`,
      `/settings`) — itu state jujur buat halaman yang copy-nya belum diputusin, jangan
      diisi karangan.
    - **Default-nya = halaman DETAIL** ("10% deposit locks your date"), bukan sebaliknya:
      18 halaman tour di root + semua `/attractions/` itu mayoritas, dan buat tau slug
      mana yang tour kita harus import `TOUR_CONTENT` — itu narik seluruh dataset tour ke
      **bundle SEMUA halaman** (TripBar nempel di Navbar). Makanya dibalik: yang bukan
      halaman detail didaftarin satu-satu.
    - **Gak ada WhatsApp di halaman detail** (Wayan): book bar + kartu booking udah pegang
      langkah berikutnya, channel kedua cuma mecah perhatian.
    - Ikon per pesan (`tag`/`shield`/`calendar`/`info`/`car`, Lucide + ukuran eksplisit).
    - **SATU BARIS, selalu** (Wayan, Sep 2026: "gua gamau ada 2 line"). Jatah ±48 karakter
      **termasuk CTA**, harus muat sampe layar **320px**. `TripBar` juga ngeklem
      (`whitespace-nowrap` + `truncate`, butuh `min-w-0` di flex parent) — itu SABUK
      PENGAMAN biar header gak melar, bukan izin nulis panjang: kepanjangan = kepotong
      "...", tetep jelek. Ukur pakai `oneline.mjs` (16 halaman × 4 lebar, ngecek
      `tinggi/line-height == 1` DAN `scrollWidth == clientWidth`).
    - **Tiap baris di file itu WAJIB fakta yang udah ada di web** (gratis batal 24 jam,
      car/driver included, Exclusive include tiket, charter per mobil s/d 5 orang,
      **deposit 20%** — Wayan, Sep 2026, naik dari 10%). Nambah janji baru = tanya Wayan dulu.
    - **Deposit = 20% di SELURUH web** (Wayan, Sep 2026 — naik dari 10%, udah disapu
      33 tempat di 12 file: FAQ, Terms + kebijakan refund, Charter, Transfer, Airport,
      About, 2 guide, Itinerary, metaDesc 7 tour, JSON-LD). Gak ada logika deposit di
      server — ini murni copy. **Kalau angkanya berubah lagi, `grep -rn "20% deposit"`
      dan sapu SEMUA sekaligus**; jangan cuma bar-nya, nanti web ngomong dua angka beda.
      **JANGAN kesapu**: `(save 10%)` di `TransferPicker` — itu diskon return trip,
      BUKAN deposit (dipatok `pricing-spec-test`: "return is 2x less 10%"). Makanya pola
      sapuan WAJIB di-anchor ke kata "deposit", bukan ke angka "10%" doang.
  - **Rotasi: `setIdx` dan `setDim(false)` JANGAN di tick yang sama.** Kalau barengan,
    teks baru ke-paint langsung di opacity 1 → nyentak, bukan fade. Pola yang bener:
    fade-out → `setTimeout(FADE_MS)` → ganti index → `requestAnimationFrame` → fade-in.
  - Verifikasi: `verify-tripbar.mjs` + **`verify-promo.mjs`** di scratchpad — patokannya
    bar ada di 6 jenis halaman, font ≤12px, `--header-h` mengecil TAPI `--header-h-max`
    enggak, **posisi hero di dokumen gak geser**, tiap halaman teksnya beda (≥8 unik),
    homepage muter 2 pesan + href-nya ikut ganti, dan halaman 1-pesan **gak kedip**.
    Cek ketumpuk seluruh web = `overlap-sweep.mjs` (22 halaman × 2 lebar: konten ketutupan
    header, celah strip sticky, dan jumlah bar yang nempel di bawah).
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
  - **Destinasi single DIJUAL LAGI (Sep 2026, cb48800 di cahyana-api)** - `prices.place`
    dibalikin, isi 34 tempat, harganya dipatok dari tarif charter. Kartu destinasi
    nampilin harga, halaman destinasinya punya Book now + book bar kayak tour.
    (Ini NGE-OVERRIDE keputusan 3 Sep yang bilang destinasi single nggak dijual &
    `prices.place` dibuang - kalau nemu tulisan itu di tempat lain, yang berlaku ini.)
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
  - **Tes harga, jalanin kalau nyentuh harga:** `node tools/pricing-spec-test.js`
    (di cahyana-api) nge-assert 6 aturan di atas. Dulu ada tes kedua
    (`golden-price-test.js`) yang bandingin server sama `script.js` situs lama —
    UDAH DIHAPUS (Sep 2026, Wayan), soalnya pembandingnya ikut kehapus pas situs
    lama dipensiunin, jadi tes-nya gak bisa jalan sama sekali.
  - **Ganti isi program tour = cek tiketnya juga.** `TOUR_TICKETS` di
    `cahyana-api/pricing-data.js` nentuin tiket apa aja yang di-cover Exclusive per
    tour. Nambah/hapus stop tanpa update situ = tamu Exclusive bayar tiket tempat
    yang gak didatengin (atau sebaliknya).
  - **Harga cadangan di kartu = SALINAN, bisa basi.** Tiap kartu listing punya
    `priceFallback` (`"$40"`) di `content/shared/listings.js` - itu yang keliatan
    SEBELUM katalog API balas, dan juga yang dibaca book bar lewat `priceFallbackFor()`.
    Begitu katalog nyampe, angka API yang menang. **Ganti harga di cahyana-api = update
    juga angka di kartu**, kalau nggak tamu lihat angka lama sekejap tiap buka halaman.
    Cek pakai **`node tools/check-prices.js`** (adu semua kartu lawan `prices` di API;
    terakhir 60/60 cocok). BUKAN gate CI - CI cuma punya `out/`, gak punya repo sebelah.
  - **JEBAKAN: clone `cahyana-api` yang ketinggalan bikin lu salah baca harga.** Kejadian
    2x dalam sehari (Sep 2026): baca `pricing-data.js` dari clone lama → lapor ke Wayan
    bahwa 34 destinasi "gak ada harganya" (padahal udah ada berjam-jam sebelumnya), dan
    run pertama `check-prices` nunjuk 36 kartu bermasalah yang semuanya palsu.
    `check-prices.js` sekarang NOLAK jalan kalau clone-nya di belakang `origin/main`.
    **Sebelum ngomongin isi `cahyana-api`, `git fetch` dulu** - jangan percaya clone lokal.
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
- **Charter builder (`CharterBuilder.jsx`) - dirombak LAGI Sep 2026** (Wayan: "isi kolom input
  buat guest, date, time pickup, pickup area, di mobile tampilan pertama list card yang tadi itu,
  kedua baru kolom inputnya, di desktop jadiin 2 kolom, di kiri list charternya di kanan kolom
  inputnya, button cuma satu di bawah input yaitu book, langsung mengarah ke my trip untuk make
  payment"):
  - **Bentuknya = LIST PAKET (kiri) + KOLOM INPUT (kanan).** HP: numpuk sesuai urutan DOM —
    **list dulu, field belakangan**, tombol Book paling bawah. Desktop **993px+**: 2 kolom
    (`grid-cols-[1fr_340px]`). **993, BUKAN 769** — harus barengan sama panel-nya sendiri
    (`CHARTER_HERO_INNER_WIDE`), kalau nggak 2 kolomnya ke-jejel di dalam kotak 600px.
  - **BENTUK KARTUNYA = "opsi D"** (Sep 2026, Wayan pilih dari sheet 4 opsi): harga jadi angka
    paling gede di baris itu (`PLAN_PRICE_LEAD`, 1.5rem), bukan di box cream kecil lagi.
    **POSISINYA BEDA HP vs DESKTOP** (Wayan, Sep 2026: "di desktop jelek bro, harga bagusnya di
    kanan card") — **HP: di KIRI, persis di bawah nama**; **desktop (993px+): di KANAN**, rata
    kanan, sejajar sama nama + sub-baris. Baris desktop jadi 2 baris doang & tiga harganya lurus
    satu garis.
    - Caranya **grid** (`PLAN_GRID`/`PLAN_CELL_NAME`/`_PRICE`/`_SUB`), SATU urutan DOM buat
      dua-duanya: di HP 1 kolom (numpuk sesuai urutan: nama, harga, sub), di 993px+ kolom kedua
      buat harga yang `row-span-2` + `self-center`. **Bukan flex yang di-reorder** — flex bisa
      mindahin blok harganya, tapi cuma dengan misahin nama dari sub-baris-nya, dan dua itu
      satu paket. Di bawah harga ada **satu sub-baris**
    (`10 hours · around 120 km · per car up to 5`), gantiin 2-3 point berikon yang dulu.
    **PENANDA KEPILIH = pita "Selected"** (`FLAG`, hook `data-plan-flag`) yang nangkring di
    tepi ATAS kartu — Sep 2026, Wayan pilih opsi C dari sheet penanda, gantiin lingkaran centang
    (`TICK_ON`/`TICK_OFF` UDAH DIHAPUS). Baris kepilih juga di-tint cream (`PLAN_ROW_PICKED`).
    - **Kenapa bukan bulatan**: bulatan itu minjem bentuk radio button, dan Wayan gak mau kontrol
      form di list yang isinya kartu. Pita nyebut statusnya pakai KATA, cuma 1 kartu yang punya.
    - **Pita-nya di LUAR kotak kartu** (`-top-[9px]`), jadi list-nya WAJIB punya headroom +
      jarak antar-baris yang cukup: `ROWS = 'flex flex-col gap-3 pt-[9px]'`. `gap-2` (8px)
      kekecilan — pita-nya bakal nimpa tepi bawah kartu di atasnya, bukan mendarat di celah.
      Kalau ganti ukuran/offset pita, **ubah `ROWS` bareng**.
    - Harness-nya ngecek pita gak kepotong: `flag.top >= #charter.top`.
    - **`data-plan-grid`** = hook buat blok isi kartu. Harness JANGAN pakai `firstElementChild`:
      di kartu yang kepilih, anak pertamanya itu pita-nya, bukan grid.
    - **GAK ADA kicker "From" lagi** (Sep 2026, Wayan: "hapus from di atas harga itu bro").
      Kata di atas angka **cuma muncul kalau ada yang mau dibilang**: begitu area pick-up kepilih,
      `tier()` udah nambahin surcharge + jam tambahan, jadi angkanya total beneran dan baru di situ
      nongol **"Total"**. Sebelum itu — dan di homepage yang emang gak punya field pick-up —
      angkanya berdiri sendiri. **Jangan balikin "From"**; yang dibuang cuma kata itu, bukan
      penanda Total-nya (itu yang bikin angkanya gak bohong).
  - **LIST PAKETNYA = `components/sections/CharterPlans.jsx`, KOMPONEN BERSAMA sama section
    charter di homepage** (Sep 2026, Wayan: "reuse komponen bro ... lu harus pisah input form dan
    card nya"). Builder = list + kolom field; homepage = list doang + tombol ke halaman ini.
    Ubah bentuk kartu = edit 1 file, dua-duanya ikut.
    - **Paket kepilih itu PROP, bukan state di dalam list** (`value`/`onChange`): halaman butuh
      nilai yang sama buat baris ringkasan + tombol Book, dan homepage butuh buat nyimpen.
      Satu pemilik, gak ada salinan kebenaran kedua.
    - **Hitungan harga = `useCharterTier({ area, extra })`**, di-export dari file yang sama —
      list-nya pakai buat tiap baris, halaman pakai buat total di ringkasan & gerbang tombol
      Book. Satu rumus, gak bisa melenceng.
    - Class-nya di `components/ui/charterPlanClasses.js`. `PLAN_PRICE_BOX`/`_BIG`/`PLAN_ROW_ON`
      **UDAH DIHAPUS** (dead) — itu sisa box harga cream punya homepage yang lama.
  - **Pilihan di homepage ke-bawa ke sini** lewat `lib/charterDraft.js` — lihat bullet Charter di
    "Homepage section order" buat aturan lengkapnya (baca di `useEffect`, jangan initial state).
  - **SATU tombol Book, di bawah field** (dulu tiap kartu punya tombolnya sendiri). Artinya
    state "durasi kepilih" **BALIK LAGI** — itu disengaja atas permintaan Wayan, bukan regresi;
    kalau nemu catatan lama yang bilang state itu udah dibuang, yang berlaku ini. Baris paket =
    `role="radiogroup"` + `role="radio"`, default **Full Day** (paling atas & di-badge Popular).
  - **Slider paket + panah + penghitung "1 / 3" UDAH DIBUANG** — gak ada track lagi, jadi
    `GRID_PLANS` di `gridClasses.js` ikut **DIHAPUS** (dead). Mau balik ke slider = tulis ulang.
  - **Kata "Popular" (`PLAN_BADGE`) boleh sebaris sama nama paket TAPI wajib `flex-wrap` +
    nama-nya `whitespace-nowrap`.** Tanpa itu di **320px pakai rupiah** box harga nyisain ruang segitu
    dikit sampe "Full Day POPULAR" mecah **NAMA**-nya jadi 2 baris (ke-ukur, bukan tebakan — ini
    bug yang sama persis kayak versi kartu dulu). Dengan wrap, di 320 kata-nya turun sendiri ke
    baris bawah, di lebar lain tetep nempel di samping nama.
  - **Teks panjang pindah ke balik ikon info** (Sep 2026, Wayan: "jangan terlalu banyak tulisan
    bro, isi aja icon tanda seru buat informasi di samping your trip terus deskripsi yang panjang
    seperti pick up outside ubud itu pindahin kesana, akan muncul kalau di klik"). Catatan
    surcharge dulu 2 baris abu nempel di bawah field; sekarang ada **`components/ui/InfoDot.jsx`**
    (ikon Lucide `Info`, hook `data-infodot`) sebelah judul "Your trip", di-tap baru munculin
    panelnya.
    - Panelnya **NGAMBANG** (`PopMenu`), bukan nyorong konten — sama aturannya kayak dropdown
      kategori: bg solid + border + `--shadow-lg` + z-index + **tap-di-luar & Escape buat nutup**.
      Pembungkus `relative`-nya WAJIB mepet ke tombolnya (jebakan containing block `PopMenu`).
    - Komponennya **reusable** — kalau ada teks panjang lain yang bikin form rame, pakai ini,
      jangan tulis panel sendiri.
  - **Field "Extra hours" pindah ke KOLOM INPUT** (cuma nongol kalau paket Extended kepilih) —
    dia emang input, dan alesan lama dia gak berlabel (nyamain tinggi kartu) udah gak ada, jadi
    label-nya dibalikin.
  - **Ada baris ringkasan di atas tombol** (nama paket + total). Di HP list-nya ada di ATAS field,
    jadi pas tamu nyampe tombol Book baris yang dia pilih bisa udah keluar layar — ini yang
    ngasih tau tombolnya mau nge-book apa.
  - **Field JAM (`ch-time`)** ikut ke-simpen di `cue_itinerary_v1` (`charters[].time`), muncul di
    My Trips sebelah tanggal. **Sengaja GAK dipakai ngitung harga**: server cuma baca
    `area`/`duration`/`extra` (`pricing.js` ~baris 207), key lain diabaikan — sama kayak
    `flight_number` punya transfer.
  - **Harga gak pernah kosong**: pas `catalog` null jadi em dash + tombol mati. **Sengaja gak
    dikasih angka cadangan** — tarif charter gak ada di `listings.js`, jadi angka hardcode di
    sini gak kejaga `check-prices` dan bisa basi diem-diem.
  - **Detail halaman = SATU section** (Wayan, Sep 2026: "details seperti include exclude dan
    how charter works itu jadiin satu dan konten sama pakai styling text di our company").
    Satu kartu, judulnya "Charter Details", gaya baca **Our Company** (`BODY_TEXT` +
    `headingVariant="company"`). `CHARTER.notes` + `planTerms` UDAH DIHAPUS. List campur
    dipecah jadi **Included / Not included** (`variant: 'yes'`/`'no'`).
  - Verifikasi: **`verify-charter.mjs`** di scratchpad (134/134, list-nya sendiri dijaga `verify-charterhome`) — 320/390/430/768: list di ATAS
    field, cuma 1 tombol Book & posisinya di BAWAH field, nama paket 1 baris, harga ada di KIRI
    di bawah nama & gak pernah wrap & ≥22px & gelap (bukan amber), cuma baris kepilih yang
    punya pita "Selected" (warna CTA, gak kepotong) + di-tint cream, halaman gak melar. Desktop: harga pindah ke KANAN nama
    dan tiga-tiganya **berhenti di garis yang sama**. Ikon info: catatan surcharge
    GAK ke-print di halaman, nongol pas di-tap, ngambang di ATAS form (hit-test), **gak nyorong
    apa pun** (tinggi dokumen & posisi tombol Book gak gerak), gak kepotong tepi layar, Escape nutup. Desktop 1024/1280/1440: list di KIRI field
    & dua kolomnya mulai sejajar. Plus: tap baris = pindah pilihan, Extra hours nongol/ilang ikut
    paket & mendarat di kolom input, tombol mati sebelum 4 field keisi, kicker kosong → "Total" pas area kepilih, yang
    ke-book = paket yang KEPILIH (bukan yang pertama), dan mendarat di My Trips.
  - **Gotcha harness**: "harga ada di samping/bawah nama" DOANG gak cukup — assertion itu lolos
    waktu namanya keremes jadi 2 baris. Ukur **nama-nya juga**: `tinggi/line-height == 1` +
    `scrollWidth == clientWidth`, dan harganya juga (1 baris). Itu yang nangkep bug badge di 320px.
  - **Gotcha harness**: span harga bawa utility `PLAN_PRICE_LEAD`, **bukan class `.price`** —
    nyari `.price` hasilnya nihil. Sama juga `.info__list--yes/--no` & `.info__card`: udah
    di-migrasi ke utility, jadi cek hasilnya (warna li yang di-mute) bukan nama class-nya.
  - **Gotcha harness**: mata uang default situs = **IDR**, jadi stub katalog WAJIB `symbol:'Rp'`;
    kalau di-stub `'$'` harness-nya ngukur "$1.000.000" — string yang gak pernah dilihat tamu.

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
- **`/itinerary.html` jadi halaman yatim** (ketemu Sep 2026): navbar (ikon desktop +
  menu HP) semuanya nunjuk `/my-trips.html`, dan **nol** link internal ke
  `itinerary.html` di seluruh repo. Halamannya tetep di-build + masuk sitemap +
  bisa diindeks Google. Isinya BUKAN duplikat My Trips: `/itinerary.html` =
  builder rencana multi-hari (`ItineraryBuilder`, judul "Build Your Own Bali
  Itinerary"), `/my-trips.html` = keranjang (`MyTripsCart`, noindex). Dua-duanya
  baca simpanan yang SAMA (`cue_itinerary_v1` lewat `useItinerary`) - jadi
  storage-nya jelas masih kepakai, yang nganggur cuma halamannya. Pilihan buat
  Wayan: (a) biarin, (b) pasang link lagi (keyword "build your own bali
  itinerary" lumayan), (c) pensiunin -> 301 ke my-trips + keluarin dari sitemap.
- **Broadcast/newsletter promo + update Bali** (DITUNDA — Wayan mau lanjut nanti):
  pakai **Resend Audiences + Broadcasts** (Cara A). Rencana: auto-daftarin email
  akun baru ke Audience Resend (1 fungsi di `cahyana-api` POST /api/account), terus
  Wayan nulis & kirim broadcast dari dashboard Resend (unsubscribe + analytics
  otomatis). Email welcome akun udah janjiin "deals & Bali updates" → ini follow-up-nya.

## Before calling it "done" (checklist)
1. `npm run build` passes (this is the real syntax/build check now — no more `node --check script.js`).
2. All active CI gates pass: `node tools/check-urls.js`, `node tools/check-detail.js`,
   `node tools/check-assets.js`, `node tools/check-motion.js`. **Gate the commit on these**
   (jangan commit kalau ada yang merah).
   Marker class yang WAJIB ada di detail page (check-detail): `booksidebar`, `bookcard__cta`,
   `tour-layout--book`, `tour-hook`, `review-cta` — jangan dihapus pas convert.
2b. Nyentuh harga (di sini ATAU di `cahyana-api`) → `node tools/check-prices.js` (manual,
   bukan gate CI — butuh repo `cahyana-api` di sebelah, dan dia nolak jalan kalau clone-nya
   ketinggalan). Plus `node tools/pricing-spec-test.js` di cahyana-api.
3. Styling berubah → verify **pixel-diff / computed-style diff = 0** (harness di scratchpad:
   playwright-core + `headless_shell`, serve `out/` via `node http`). Baru hapus CSS lama-nya
   dari `style.css` kalau udah 0.
4. `style.css` `{}` braces balanced; no dead classes ketinggalan.
5. Commit + push ke `main` (deploy otomatis). Bump `?v=` UDAH GAK PERLU (hash otomatis).
