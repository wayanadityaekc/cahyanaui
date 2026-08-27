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
  `.review-card__stars`, `.driver-card__rating`/`.driver-modal__rating`, `.rev__stars`,
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
- Icons: SVG, **no emoji**.
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
- **H1 maks ±40 karakter** (biar tetap 2 baris di HP — lebih dari itu teks hero bisa
  ketutup panel overlap). **Teks intro hero 25–40 kata.**
- Label section pertama: halaman tour = **"What You'll Do"**, attraction = **"The Experience"**.
- **FAQ**: DIPUSATIN ke **`faq.html`** doang (Agu 2026) — semua FAQ inline + partial di
  halaman lain UDAH DIHAPUS (link ke faq.html ada di footer). Jangan tambahin FAQ ke
  halaman manapun selain faq.html. Partial `partials/faq-*.html` skarang orphan (nggak
  kepakai). `sync-schema.js` `FAQ_PAGES = {}`; schema-faq cuma di-generate buat faq.html
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
  page (data.js WAJIB dimuat sebelum script.js). Any CSS/JS/data change → bump `N` on all pages. *(current: v375, PARTIALS 73)*
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
