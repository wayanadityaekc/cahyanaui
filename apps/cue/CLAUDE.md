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
**JADWAL JAM MULAI — `content/shared/timeSlots.js` (Sep 2026, Wayan)**
Wayan: *"kita nambah data baru di setiap tour yang di pilih harus user milih start jam berapa"*.
Jadi file ini berhenti jadi "picker jam di popup konfirmasi" dan jadi **jadwal situs**.
- `TIME_SLOTS` = **00:00–23:30, tiap 30 menit (48 slot)**. Dulu mulai 06:00 — artinya
  **02:00 & 03:00 gak ada sama sekali**, padahal itu jam berangkat trip sunrise.
- Aturannya (kata Wayan, di-quote di file itu): tour normal **08:00/08:30/09:00** ·
  **Lempuyang 03:00–09:00** · **trekking & jeep sunrise 02:00 dan 03:00** ·
  experience selain Kecak/Barong **daylight = 07:00–16:00** · **Kecak 19:00** ·
  Barong **pagi** (jam pasti nyusul) · **Uluwatu & Sunset Kecak + destinasi sunset 12:00–16:00** ·
  **charter/transfer/airport BEBAS 24 jam**.
- **DUA nama harus diterjemahin ke key katalog** — ini yang paling gampang salah:
  "Lempuyang" itu **DUA item**: `tour` → **"East Bali Tour"** (halamannya "East Bali:
  Lempuyang, Besakih & Tirta Gangga") dan `place` → **"Lempuyang Temple - Gates of
  Heaven"**. Dan **Kecak/Barong itu `performance`, BUKAN `experience`**.
- `place` **sekarang masuk `RESTRICTABLE`** — dulu nggak, jadi 34 destinasi nawarin
  semua jam, Lempuyang termasuk.
- **KENAPA typo di sini BAHAYA**: `RESTRICTED_SLOTS` di-key pakai nama item katalog.
  Key yang gak cocok **gak nge-restrict apa pun — tanpa error**: itemnya balik ke default
  kategorinya. Dites: `'Jeep sunrise'` (s kecil) bikin Jeep Sunrise jatuh ke daylight,
  jadi trip jam 2 pagi bisa di-book jam 4 sore dan situsnya keliatan normal.
- Gate: **`node tools/check-timeslots.js`** — ngadu tiap aturan lawan katalog asli
  (62 item, 11 override). Dia NOLAK jalan kalau clone `cahyana-api` ketinggalan (pola
  yang sama kayak `check-prices`). **BUKAN gate CI** (butuh repo sebelah).
  Dites pakai 2 bug asli: key typo + rentang daylight salah.
- **Server GAK perlu diubah**: kolom `pickup_time TEXT` di `inquiries` udah ada, ke-insert
  dari `l.time`, dan ke-print di 3 tempat (baris dashboard, email internal, detail email
  tamu) lewat `fmtTime12`.
- **JAMNYA DITANYA DI TANGGAL, DI SEMUA DATE PICKER** (Sep 2026, Wayan: *"ini pake di
  tiap date, kalo user milih date di booking form udah langsung milih jam, dan di my trip
  udah tersimpan dengan jamnya juga"*). Jadi alurnya sekarang: pilih tanggal = pilih jam,
  satu panel, terus jamnya ikut ke row keranjang sampai ke server.
  - **JAM = PER ITEM, BUKAN PER HARI** — row `days[]` dapet **`itemTimes[]`**, array
    paralel sama `itemModes[]`. Alesannya aturan Wayan sendiri: *"item yang berisikan
    2 tour dalam sehari ... jadi bakalan ada 2 jam soalnya beda program"*. Satu hari itu
    `items[]`, jadi satu `time` di row cuma bisa bener buat item pertama.
    **`removeItem` nge-splice `itemTimes` juga** — kalau nggak, hapus item pertama
    bikin jam item kedua nyangkut di item yang salah.
  - **`DatePopup` dapet `withTime` yang SAMA kayak `DateField`** (+ `initialTime`/
    `category`/`itemName`), dan `onPick` sekarang ngasih **`(date, time)`**. Dia yang
    kepakai 3 tempat: `BookSidebar` (Book Now tanpa tanggal), `BookCta`, dan editor
    tanggal di **My Trips**. Satu kontrol jam buat seluruh web, bukan 3 salinan.
  - **SATU BENTUK PANEL TANGGAL SE-WEB — popup ke-center, BUKAN sheet dari bawah**
    (Sep 2026, Wayan: *"buat default date pickernya kalo di klik itu sebagai pop up
    bukan muncul dari bawah"*). `DatePopup` dulu pakai `panelDateSheet`: **bottom-sheet
    di bawah 768px**, popup ke-center di desktop — sementara `DateField` (form booking)
    dari dulu selalu popup. Jadi tamu HP ketemu **DUA bentuk buat pertanyaan yang sama**,
    tergantung dia nge-tap tanggal di form booking atau di My Trips / Book Now. Sekarang
    dua-duanya `panelBookdate`.
    - **`panelDateSheet` + `PANEL_HEAD_SHEET` UDAH DIHAPUS** dari `hsClasses.js` (dead).
      Mau balik ke sheet = tulis ulang, jangan cari sisanya.
    - **`PANEL_CLOSE_SHEET` TETEP ADA** — `HeroSearch` masih sheet beneran di HP.
      Tapi `DatePopup` sekarang pakai **`PANEL_CLOSE`** (tanpa `min-[769px]:hidden`):
      yang versi sheet itu ke-hide di atas 768px, bener buat panel yang cuma JADI sheet
      di HP, tapi popup ke-center butuh tombol tutup di **semua** lebar.
    - Strukturnya ikut `DateField`: kalender WAJIB dibungkus **`PANEL_BODY`** — panelnya
      `flex flex-col overflow-hidden`, jadi tanpa pembungkus yang `flex-[1_1_auto]`
      + `overflow-y-auto` kalendernya gak bisa di-scroll di dalam panel.
    - Dijaga `verify-datetime.mjs`: per lebar di-assert **aturannya** (gak selebar layar ·
      gak nempel tepi bawah · ke-center V & H · radius sama atas-bawah · tombol tutup
      keliatan), terus **bentuk dua panel itu diadu langsung** dan wajib identik.
      Diukur di 320/390/768/1280: **beda NOL**. Dites pakai bug aslinya (bentuk sheet
      dibalikin pakai inline `style`, bukan class — dua utility specificity-nya sama jadi
      sabotase pakai class bisa diem-diem gak ke-render) → **8 assertion nyala**.
  - **Kategori buat aturan jam WAJIB dari katalog, jangan dari `type`/`presetType`.**
    `BookSidebar`/`BookCta`/`BookingForm`/`MyTripsCart`/`ItineraryBuilder` semuanya
    punya `categoryOf(name)` yang nanya `pricing.catalog` — halaman detail nge-preset
    `type:'tour'` buat experience & performance juga, jadi baca `type` bakal ngasih
    Kecak Dance jendela pagi punya tour.
  - **`BookConfirmModal` BERHENTI NANYA kalau barisnya udah bawa jam.**
    `needsTime = !!singleLine && !isAirportRoute && !lineTime`, dan `payload()` nulis
    `l.time || (isTarget && needsTime ? f.time : '')` — jadi tiap baris nerusin jamnya
    SENDIRI. Itinerary 3 tour = 3 jam beda ke server, nol field ditanya. Yang **masih**
    ditanya cuma satu kasus: satu baris yang kategorinya bebas 24 jam
    (transfer/charter), karena `TimeChoice` sengaja mulai kosong di situ.
  - **Tombol pemicu `DateField` nyebut dua-duanya di DUA varian.** Varian `rich`
    (yang dipakai booking form) dulu cuma nyetak tanggal, jadi tamu yang milih jam di
    panel gak bisa lihat dari luar. Sekarang satu `label12()` buat dua-duanya.
  - **Tombol Done/Apply pakai `self-end`, BUKAN `items-center` punya barisnya.**
    Kolom jam bawa label di atas field-nya, tombolnya nggak — jadi ke-center ke seluruh
    tumpukan bikin tombolnya duduk **11,5px lebih tinggi** dari field di sebelahnya
    (= setengah tinggi label + margin-nya, ke-ukur di 390 & 1280, DateField & DatePopup).
    Tinggi dua-duanya `--btn-h`/`--field-h` yang sama, jadi nyamain tepi BAWAH bikin
    dua-duanya lurus persis — bukan digeser pakai angka ajaib. Di `DatePopup` cuma
    dipasang kalau `withTime`: baris hint yang polos gak punya label, jadi gak ada yang
    perlu dikompensasi.
    - **INI KE-SHIP MELENCENG DULU gara-gara harness-nya salah baca**: cek pertama gua
      ambil `f.querySelector('button')` — dan itu **trigger jam**-nya, bukan Done. Jadi
      dia ngadu elemen sama elemen itu sendiri dan lapor "sejajar sempurna" di 4 kasus,
      sementara crop-nya jelas keliatan geser. Pola yang bener: CTA = tombol yang **bukan**
      `[aria-haspopup]`. Kalau harness bilang dua benda cocok sempurna, cek dulu dia gak
      lagi ngukur satu benda dua kali.
  - **Baris My Trips: tanggal + jam jadi SATU tombol** ("12 Oct · 8:30 AM"), jadi
    nge-tap benerin dua-duanya. Tombolnya **`whitespace-nowrap`** — tanpa itu di 390px
    labelnya pecah dan "AM" nyangkut sendiri di baris kedua (ke-ukur).
  - **`ItineraryBuilder`**: input `<input type="date">` mentah-nya diganti `DateField`
    (satu kontrol tanggal se-web), dan tiap item di list dapet `TimeChoice` sendiri.
    `suggestState()` nerima `timeFor(name)` biar rencana yang di-generate gak mendarat
    tanpa jam.
  - **`cascadeFrom` cuma mindahin TANGGAL**, jadi di My Trips jam-nya ditulis di atas
    hasilnya (`setItemTime(moved, ...)`) dalam **satu** `save` — dua save bikin yang
    kedua nimpa yang pertama.
  - **Row lama di localStorage tamu gak punya `itemTimes`** dan itu gak error: barisnya
    jalan tanpa jam (persis kayak sebelum fitur ini) dan tamu bisa nambahin lewat editor
    tanggal. **Gak gua isi otomatis** — nulis jam ke booking orang tanpa dia milih itu
    ngarang.
  - Verifikasi: **`verify-datetime.mjs`** di scratchpad (**83/83**) — alur penuh di
    halaman hasil build: hint kontrol nyebut jam, panel kebuka bawa footer jam, jumlah
    opsi persis per item (Ubud Tour 3 · Kecak 1 · Lempuyang 13 · Batur 02/03), nol opsi
    mati, label 12 jam tapi `value` 24 jam, **pilih tanggal gak nutup panel**, tombol
    pemicu nyebut tanggal + jam, Book Now nyimpen `itemTimes` yang bener, baris My Trips
    nyetak 12 jam & jadi satu tombol, ganti jam ke-simpen & tanggal gak kegeser, checkout
    2 baris nyebut 2 jam beda & NOL field jam, transfer TETEP ditanya, dan 4 halaman ×
    3 lebar gak melar.
    - **Dites pakai 3 bug aslinya** (`itemTimes` gak ditulis · tombol pemicu balik cuma
      tanggal · jam ditaro di luar tombol My Trips), satu-satu, ketiga-tiganya nyala.
    - **Gotcha harness (2, dua-duanya mahal)**: (1) **tiap panel tanggal ke-mount
      SELAMANYA** (biar ada frame "ketutup" buat transisi) dan yang ketutup itu
      di-translate/fade, **bukan `display:none`** — jadi `:visible` punya Playwright
      cocok ke **3 panel** di halaman detail dan "yang terakhir di DOM" itu panel yang
      SALAH. Harness-nya nandain panel yang beneran kebuka (opacity/visibility/
      pointer-events + on-screen) terus locate lewat itu. (2) **`selectOption()` GAK
      BISA dipakai di web ini** — tiap `<select>` itu `.bk-native` yang kesembunyi dan
      listbox custom yang nyetir; baca `.value` & daftar `<option>` boleh, **ngubah**
      wajib lewat kontrol yang tamu tap.
- **Picker-nya = `components/ui/TimeChoice.jsx`, SATU BENTUK buat semua** (Wayan:
  *"konsisten aja, buat semya dengan style yang sama seperti contoh east bali tour, tapi
  pilihanya yang di batasi"*): dropdown `Select` yang sama kayak kontrol lain, isinya
  **CUMA jam yang boleh**. Kecak dapet dropdown isi 1 baris, tour biasa 3, Lempuyang 13,
  charter/transfer/airport 48.
  - **Batesin dengan GAK NAMPILIN, jangan di-disable.** Kalau semua 48 ditampilin & yang
    gak boleh di-grey: Ubud Tour = 3 baris nyala di balik **45 baris mati**, Kecak = daftar
    48 baris yang cuma 1 bisa dipilih (ke-ukur). Harness-nya nge-assert **nol opsi mati**.
  - **VERSI 4 BENTUK UDAH DIBIKIN & DITOLAK** (kalimat buat 1 jam, chip buat 2-3, dropdown
    buat rentang — Wayan sempat minta itu, terus milih konsisten). Kebaca bagus di kit, tapi
    artinya tamu ketemu **3 kontrol beda buat pertanyaan yang sama** tergantung tour-nya.
    **Jangan dibalikin** — `verify-timechoice.mjs` gagal kalau chip atau kalimatnya nongol lagi.
  - Item yang **dibatasi** di-seed ke jam pertama yang boleh, dan nilai yang **udah gak boleh**
    (tamu tuker tour-nya) dikoreksi otomatis. Yang **bebas** (charter/transfer/airport)
    sengaja **mulai kosong** — milih jam transfer buat tamu itu ngarang.
  - Seed-nya di `useEffect`, **jangan di render** — nge-set state parent pas render itu loop.
  - Jam tampil **12 jam (AM/PM)**, ngikut popup booking + email (`fmtTime12` di API).
    **Picker charter nulis 24 jam** ("06:00") — beda itu lebih tua dari komponen ini dan
    belum diputusin.
  - `components/ui/TimeChoiceKit.jsx` + section di `/ui-kit` cuma buat ngeliat/nge-foto
    bentuknya lawan item katalog asli. `/ui-kit` noindex, nol pemakai di alur live.
  - **JAM & TANGGAL JADI SATU PANEL** (Wayan: *"satuin dengan datenya"*): `DateField`
    dapet prop **`withTime`** (+ `time`/`onTimeChange`/`category`/`itemName`).
    Nyala = `TimeChoice` nongol di **footer panel** yang udah ada (slot-nya emang udah
    ada dari dulu — `DatePopup` pakai itu buat baris Apply), pilih tanggal **gak nutup
    panel** lagi (kalau nutup, kontrol jamnya kabur sebelum kepake), dan ada tombol
    **Done**. Tombol pemicunya nyebut dua-duanya: "30 Sept 2026 · 8:00 AM".
    **Default MATI**, jadi 4 pemakai `DateField` yang cuma mau tanggal gak kesentuh.
  - **SEMUA JAM 12 JAM** (Wayan: *"jadiin 12 jam semua bro"*) lewat **satu** formatter
    `fmtTime` di `timeSlots.js`. Yang dulu masih 24 jam & udah disapu: **picker charter**
    (label doang — **value-nya tetep 24 jam**, itu yang masuk `pickup_time` di server dan
    yang urut bener), **baris kartu My Trips** (dulu nyetak `· 06:00` mentah), dan
    **jam penerbangan** (`DateTimeField`) — yang ini jam-nya berlabel 12 jam ("2 PM")
    **tapi menitnya tetep**, karena pesawat mendarat 14:35, bukan di setengah jam.
    Nambah select AM/PM bakal bikin kontrolnya jadi 3.
  - Verifikasi: **`verify-timechoice.mjs`** (248/248, 6 item × 320/390/768/1280) —
    jumlah opsi persis, nol opsi mati, nol chip, nol kalimat, default ke-seed (yang bebas
    kosong), tinggi 34 & radius 12 & font 12.8 (sama kayak field lain), dan **tanda tangan
    kontrolnya cuma SATU** di tiap lebar. Dites pakai bug aslinya (opsi dibalikin ke
    48-dengan-disable → 40 assertion nyala).

**Field & label — SATU KOTAK, SATU LABEL (Sep 2026, Wayan pilih "opsi 1")**
Wayan: *"gua cuma pengen ukuran dan standar yang bagus dan konsisten"*. Semuanya di
**`components/ui/formClasses.js`** — apa pun yang bentuknya field WAJIB dibangun dari situ.
- **`FIELD_INPUT`** = kotak field: `--field-h` · `py-0 px-3` · `rounded-md` (12px) ·
  border `--line` · `text-field` (12.8px). **`FIELD_AREA`** buat textarea (satu-satunya
  yang tumbuh, jadi dia punya padding vertikal sendiri).
- **`FIELD_LABEL`** = `block mb-2` (8px) · `text-small` (12.8px) · `font-medium` (500) ·
  `text-green`. **Satu label buat seluruh web.**
- **`FIELD_INVALID`** = state error, ikut ke dua string di atas.
- Yang ke-ukur SEBELUM ini (11 halaman): field-nya sendiri udah rapi, tapi sekelilingnya
  nggak — **8 definisi label**, **4 nilai padding kiri** (10.4/11.2/12.8/13.6px), **2 warna
  border** (satu `#d8d2c4` hardcoded). Sesudah: **1 label** (52 label identik), **1 padding**,
  **1 warna border**.
- **8 label yang dilebur**: `modalClasses.LABEL` · `CONTACT_LABEL` · `LABEL` di
  `AirportTransferForm` & `TransferPicker` · `FIELD_LABEL` lokal di `CharterBuilder` &
  `HeroSearch` · 3 label inline di `Navbar` · `[&_label]:` di `ITN_FIELD`.
  `CONTACT_LABEL` **UDAH DIHAPUS**; `modalClasses` nge-re-export `FIELD_LABEL` sebagai
  `LABEL` biar 2 modal gak perlu diubah importnya.
- **Konsekuensi yang disengaja**: label uppercase+tracked `FROM`/`TO` di /transfer jadi label
  biasa, dan 3 label di drawer navbar (Guests/Pickup/Currency) naik dari 400-muted ke
  500-gelap. Wayan milih **satu** label, bukan dua peran — opsi "dua peran resmi" udah
  ditawarin & **gak dipilih**.
- **`aria-invalid` DULU GAK NGEFEK APA-APA.** Dia kepasang di 14 field dari lama, tapi nol
  styling nyangkut: diukur di browser (isi email salah → submit), field yang error itu
  border/shadow/bg-nya **IDENTIK** sama field valid. Sekarang `FIELD_INVALID` bikin
  border-nya `--color-err` + ring halus.
  - Pakai **`aria-[invalid=true]:`**, BUKAN `aria-invalid:` — `aria-invalid` bukan varian
    aria bawaan Tailwind, jadi `aria-invalid:` **gak ke-generate sama sekali**. Dan harus
    di-match ke `=true`: nilainya dari `aria-invalid={!!errors.x}`, jadi tanpa itu
    `aria-invalid="false"` ikut kena merah.
- **Yang SENGAJA bukan label field** (jangan ikut dijadiin `FIELD_LABEL`): kicker section
  (`WHY CAHYANA`, 10.24px uppercase), teks di samping switch ("Add return trip"),
  `LABEL` di `PaymentStep` (judul opsi bayar) & `PayPalCheckout` (heading "Card details").
- Verifikasi: **`verify-fields.mjs`** di scratchpad (**1242/1242**, 125 field + 109 label,
  12 halaman × 390/1280). Per field: font 12.8 · radius 12 · padding kiri 12 · border
  `--line` (atau `--color-err` kalau invalid). Per label: 12.8 · bobot 500 · margin bawah 8 ·
  warna `--color-green` · gak uppercase · gak tracked. Plus: **field invalid WAJIB keliatan
  beda** dari yang valid (dites dengan beneran submit form contact).
  - **Gate-nya dites pakai 3 bug aslinya** (margin label lama, padding lama, `FIELD_INVALID`
    dikosongin) — ketiga-tiganya nyala.
  - **Input yang BORDER-nya 0 di-skip**: input search di halaman listing itu duduk DI DALAM
    kotak berbingkai, jadi yang gambar kotaknya si wrapper. Itu bener, bukan pengecualian.

**ZOOM iOS pas field di-fokus — dibenerin di VIEWPORT, bukan di font (Sep 2026)**
Wayan: *"benerin zoom tapi jangan gedein font bisa?"*
- **Gak ada cara di level elemen yang bisa dua-duanya.** Ambang iOS itu `font-size` kontrol
  yang DI-FOKUS: di bawah 16px dia nge-zoom. Field kita 12.8px (`--fs-field`) dan itu
  disengaja. Jadi satu-satunya tuas yang sisa = **viewport**, dan yang nahan zoom otomatis
  itu `maximum-scale=1`.
- **`components/layout/IosZoomFix.jsx`** — client component, di-mount dari `app/layout.jsx`,
  nge-render NOL elemen. Dia nambahin `,maximum-scale=1` ke meta viewport **cuma di iOS**.
- **KENAPA iOS DOANG (jangan ditaro di meta statis)**: **Android Chrome NURUT** sama
  `maximum-scale`, jadi kalau ditulis di HTML semua tamu Android **kehilangan pinch-zoom** —
  di web yang isinya foto, dan tombol override-nya kesembunyi di setelan aksesibilitas
  Chrome. Safari iOS sejak iOS 10 **sengaja ngabaikan** batasan zoom buat pinch dari USER,
  jadi iPhone tetep bisa pinch. Dipasang di iOS doang = nol yang dikorbanin.
  **`user-scalable=no` JANGAN dipakai** — yang itu beneran ngerampas zoom.
- **KENAPA di `useEffect`, bukan script inline di `<head>`**: udah dicoba inline dulu dan
  **ke-tangkep harness** — meta viewport itu punya metadata Next, jadi ngutak-atik dia
  sebelum hydration bikin (a) editannya dibalikin, atau (b) nyisa **DUA** tag viewport di
  head. Sesudah mount, Next udah settle dan editannya nempel. Timing aman: clamp-nya baru
  ngaruh pas tamu nge-fokus field, jauh sesudah hydration.
- iPadOS UA-nya bilang **Mac**, jadi dia ke-deteksi dari `navigator.maxTouchPoints > 1`
  (iPadOS 5, Mac 0). Mac gak pernah ada yang layar sentuh, jadi kombinasi itu = iPadOS.
- **GAK BISA DITES DI SINI, dan ini penting**: headless Chromium gak nge-implement focus-zoom
  punya Safari, dan gak ada device iOS di sandbox. Yang dijamin harness itu **SIAPA yang dapet
  clamp**, bukan zoom-nya beneran berhenti. **Wayan wajib cek di iPhone-nya.** Kalau ternyata
  iOS versi baru ngabaikan `maximum-scale`, satu-satunya jalan yang tersisa = field 16px,
  dan itu yang justru gak dia mau.
- Verifikasi: **`verify-zoom.mjs`** (108/108) — 6 jenis device × 3 halaman: iPhone & iPadOS
  dapet clamp; Mac asli, Mac layar sentuh, Android, Windows layar sentuh **nggak**; selalu
  **tepat 1** meta viewport; `width=device-width` gak pernah ilang; `user-scalable=no` gak
  pernah muncul; `maximum-scale` gak dobel.
  - **Harness-nya WAJIB maksa `navigator.maxTouchPoints`** (`addInitScript`): `hasTouch`
    punya Playwright cuma ngasih **1**, sementara iPadOS asli **5** — tanpa di-override,
    cabang iPadOS-nya **gak pernah dieksekusi** dan kasusnya "lolos" tanpa nguji apa pun.
    Itu jebakan yang sama kayak sabotase yang gak pernah ke-render.
  - **Dites pakai 2 bug aslinya**: (1) cabang iPadOS dibuang → 3 gagal, (2) clamp dikirim ke
    semua device → 12 gagal. **Dites SATU-SATU**: bug 2 nutupin bug 1 kalau dipasang bareng
    (clamp-nya kena semua orang, jadi iPadOS tetep dapet).
- Komentar di `style.css` yang dulu ngeklaim rule `!important` itu nyegah zoom **udah
  dibenerin** — dia justru mastiin zoom-nya kejadian. Jangan "dibenerin" dengan naikin font
  di situ: itu ngubah tampilan semua form.

**BARIS TERAKHIR KALENDER KEPOTONG — UDAH DIBENERIN (Sep 2026, Wayan: "naikin max-h nya juga")**
- `HS_CAL` dulu `max-h-[340px] overflow-y-auto` di atas 768px, dan bulan yang jatuh
  6 baris (mis. September 2026) gak muat. Yang bikin parah: `scrollHeight - clientHeight`
  = **0**, jadi tamu **gak bisa scroll** buat nyampe baris itu — dia cuma kepotong 24px.
  Sekarang **`max-h-[420px]`**: bulan 6 baris jadi 370px, sisa 6px lega. Di 390px dari
  dulu aman.
- **Itu BUKAN akibat footer jam.** Ke-buktiin sebelum dibenerin: panel tanggal **biasa**
  di `/charter.html` (tanpa `withTime`) kepotong **24px yang sama persis**. Gua sempat
  salah diagnosa & mecah `CAL_FOOT` jadi dua buat "benerin" — udah dibalikin, alesannya
  salah.
- Kalau nanti isi footer panel nambah lagi, **ukur ulang**: patokannya baris terakhir
  kalender kebaca utuh di 390 DAN 1280 (bulan 6 baris).

**BELUM DIPUTUSIN (ketemu pas ngerjain ini, gua GAK sentuh):**
- Border `#d8d2c4` masih ada di **1 tombol** (`ITN_GHOSTBTN`). Itu tombol, bukan field, dan
  `--line` bikin garisnya lebih terang — belum ditanyain.

- **Tinggi field** = `--field-h` **2.1rem (~33px)** — semua kontrol form (input/select/date/
  custom-select) pakai token ini biar seragam (Agu 2026, Wayan: dikecilin dari 46px nyesuain
  body text yang udah 0.8rem — 46 kerasa kegedean).
  Textarea (`.contact__group textarea`) pakai `min-height` sendiri, bukan `--field-h`.
  **TOMBOL punya token SENDIRI `--btn-h` (2.1rem)** — nilainya sama, tapi sengaja dipisah
  (lihat section "Tombol"). Catatan lama "CTA sengaja 2.9rem, boleh lebih tinggi dari field"
  **UDAH GAK BERLAKU** (Sep 2026, Wayan pilih "semua small").
- **Konsolidasi (Sep 2026)**: puluhan `font-size` yang di-hardcode langsung (bukan token) —
  hasil nambahin fitur satu-satu dari waktu ke waktu — di-sapu & di-snap ke token terdekat
  (`--fs-label`/`--fs-small`/`--fs-h3`/`1rem`/`--fs-h2`). YANG SENGAJA DIBIARIN beda-beda
  (jangan ikut disamain kalau nemu lagi): ikon/glyph (panah slider, tombol close ×, bintang
  rating — font-size di situ = ukuran ikon, bukan teks bacaan), harga (`.price`/`.summary__amt`/
  dkk), dan judul besar level-halaman (`.subhero__title` var overlap, `.vpromo__title`).
- Prices = gold (`--color-amber`, gold BENERAN — bukan `--color-gold`) + bold
  (`.price`, `.price-cur`, `.fee` — tiket masuk). Semua harga = gold.
  **TIGA pengecualian (Sep 2026, Wayan)** - semuanya karena harganya nempel ke CTA hijau
  dan amber di sebelahnya berantem: (1) **kartu paket charter** (`CharterPlans.jsx`, dipakai
  halaman charter DAN section homepage — harganya duduk di baris yang aksinya CTA hijau) dan
  (2) harga di **book bar** (`BookBar.jsx`) =
  `text-gold` (soft black), bukan amber — di bar itu amber nabrak tombol CTA hijau
  tepat di sebelahnya. Yang ketiga: (3) **baris Total di form airport**
  (`AirportTransferForm`) — Wayan, Sep 2026: "ukuran text harga gedein dikit biar lebih
  menonjol dan ganti warna menjadi black". Dia juga **digedein ke 1.35rem**: itu satu-satunya
  angka di form itu, dan di `--fs-strong` + amber dia kebaca kayak satu baris lagi dari
  daftar field di atasnya. Warnanya dioper `!text-gold` di span yang SAMA yang bawa `PRICE`
  (amber-nya nempel di elemen itu, jadi wrapper kalah). Harga di tempat lain (kartu, sidebar, ringkasan) TETAP amber.
  Warnanya WAJIB dioper lewat prop `className` punya `<Price>` — default-nya
  (`PRICE` = amber) nempel LANGSUNG di elemen `[data-price]`, jadi `text-gold` di
  elemen pembungkus KALAH. Class `price` tetep dibawa (itu hook, bukan warna).

**Judul section — TANPA GARIS BAWAH** (Sep 2026, Wayan: "hilangin garis di bawah semua
title section bro ... semua page yang ada itu hapus aja bro kita gak pakai garis itu lagi"):
- Tiap judul section dulu bawa bar emas **48×3** di `::after`, 10px di bawah teksnya.
  **Udah dihapus dari SELURUH web.** Jangan dipasang lagi di komponen baru.
- Ada **3 tempat** yang masing-masing gambar versinya sendiri, ketiganya udah bersih:
  `ui/sectionTitle.js` (`SECTION_TITLE`/`_SUB` — hampir semua judul), `ui/carouselSection.js`
  (`CAROUSEL_TITLE` — 2 carousel di bawah halaman tour), `ui/itnClasses.js`
  (`ITN_SUBTITLE` — panel itinerary). Kalau nemu bar emas lagi di bawah judul, cek tiga file itu.
- **`ST_LEFT` sekarang cuma `!text-left`.** Dia dulu ada buat nggeser underline yang
  ke-center ke tepi kiri; sisanya (`after:!left-0`, `after:![transform:none]`,
  `after:!content-none` di `Prose` varian `company`, dan di `FormHero`) udah dibuang.
- **`relative` ikut dibuang** dari `ST_CORE` + `ITN_SUBTITLE` — itu cuma containing block
  buat bar-nya.
- **Jarak NOL berubah**, itu disengaja: yang di `sectionTitle` bar-nya `absolute` jadi emang
  gak makan ruang; yang di `CAROUSEL_TITLE` **in-flow** (block + `mt-2`), jadi 11px-nya
  (8px margin + 3px bar) dibalikin sebagai `pb-[11px]`. **Padding, bukan margin** — margin di
  situ ke-collapse dan section-nya jadi 11px lebih pendek (ke-ukur). `pb-[0.45rem]` di
  `ITN_SUBTITLE` juga **DIBIARIN** dengan alasan sama.
- Diukur before/after, 15 halaman × 390 & 1280: **bar 60 → 0**, **861 elemen gak gerak**,
  1 geser 1px (pembulatan), **tinggi dokumen gak berubah di semua halaman**.

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
  Bentuk & ukuran tombol = **`BTN_SM`**, lihat section "Tombol" di bawah. **BUKAN pill lagi**
  (radius 999px) — itu keputusan lama yang udah diganti Sep 2026.
- Hover lift: keep it subtle, not harsh.

**Tombol — SATU UKURAN, radius 8px (Sep 2026, Wayan pilih "A")**
- Wayan: *"A, make sure semua text align center, margin bottom top center juga"*, sesudah
  ngeliat sheet hasil ukur. Sebelumnya tombol berserakan: **28 varian**, dan **CTA hijau
  sendiri punya 11 tinggi** (30/33/34/40/42/43/45/46/47/48/49px) + 4 ukuran teks — padahal
  doc ini nulis tingginya 46. Itu hasil nambah tombol satu-satu dari waktu ke waktu.
- **Satu string: `BTN_SM` di `components/ui/btnClasses.js`.** Import, jangan tulis ulang angkanya.
  - tinggi **`--btn-h` 2.1rem (33.6px)** · teks **`text-small` 12.8px** · radius
    **`rounded-sm` 8px** · bobot 600 · padding-x `px-4` · **`py-0`**.
  - **Radius 8px itu `--r-sm` yang udah ada, DAN persis sama dengan `rounded-md` punya
    shadcn** — jadi "ikut shadcn" di sini gak nambah angka baru.
  - **Teks ke-center DUA ARAH**: `items-center justify-center text-center leading-none`
    + `py-0` (biar gak ada sisa padding vertikal yang nggeser label). `leading-none` itu
    yang ngilangin slack line-box yang bikin label pendek keliatan turun.
- **`--btn-h` token SENDIRI walau nilainya = `--field-h`.** Kalau tinggi field diubah lagi,
  tombol gak ikut kegeser diam-diam. Ditulis di `style.css` **DAN** `app/globals.css` (mirror).
- **`BTN_SM` = GEOMETRI DOANG.** Warna, lebar, `display`, transition tetep punya pemanggil —
  pola yang sama kayak `MENU_ROW_BOX`. **`display` sengaja GAK di dalemnya**: ada yang butuh
  `flex`, ada yang `inline-flex`, ada yang display-nya di-scope breakpoint (`Hero`), dan di
  Tailwind yang menang itu urutan CSS, bukan urutan class. **Pemanggil WAJIB bawa flex sendiri**,
  kalau nggak center-nya gak jalan.
- **PALING GAMPANG SALAH**: nempelin `BTN_SM` **di samping** class geometri lama gak nge-override
  apa pun — yang menang urutan CSS hasil compile. Class lama (`h-`/`py-`/`px-`/`text-`/
  `rounded-`) **WAJIB DIHAPUS**. Ini kejadian 2x: `text-strong` ketinggalan di tombol Explore
  (font tetep 14px), dan `rounded-none` punya varian `plain` **kalah** sama `rounded-sm`.
- **`Button.jsx`: prop `size` UDAH DIHAPUS** (md/lg gak ada lagi). Varian `plain` itu **text
  link, bukan tombol** — dia pakai `BASE_LINK` dan **gak pernah** dapet `BTN_SM`.
- **LABEL 1-2 KATA** (Wayan: *"usahakan 1 max 2 kata di dalam button"*). Yang dipotong:
  "See all tours"→"All tours" · "View all programs"→"All programs" · "Book this charter"→
  "Book charter" · "Make Payment"→"Pay now" · "Leave a review"→"Write review" ·
  "Chat on WhatsApp"→"WhatsApp" · "Sign in / Sign up"→"Sign in" · "Plan your trip"→"Plan trip" ·
  "Add to My Trip"→"Save trip".
  - **"Book your airport transfer" → "Airport transfer", JANGAN "Book transfer"**: tiap link ke
    `/airport-transfer` wajib nyebut "airport" (aturan anchor text SEO). 2 kata & keyword-nya utuh.
  - **Ganti label tombol yang di-QUOTE di prosa = ganti dua-duanya.** `MyTripsCart` nulis
    "By clicking **Pay now**..." tepat di atas tombolnya; kalau cuma tombolnya yang diubah,
    halamannya nyuruh tamu nge-klik sesuatu yang udah gak ada.
  - Dua label yang **sengaja kehilangan sedikit makna** (belum diputusin ulang sama Wayan):
    "Save trip" (dulu "Add to My Trip") dan "Sign in" (nyembunyiin kalau bisa DAFTAR juga).
- **YANG BUKAN TOMBOL AKSI — jangan ikut dikasih `BTN_SM`**: chip fakta (`chipClasses`), badge
  kartu, toggle (`role="radiogroup"`/segmented Standard-Exclusive), tab (`role="tablist"`,
  track `detailCardClasses`), pita "Selected" charter, dan `CART_TOAST` (itu cangkang toast).
- **Currency picker BUKAN tombol** — dia field. Tapi radius-nya diubah **pill → `rounded-md`
  (12px)**, alasannya: komponen yang sama **udah** render `rounded-md` di varian `hero`
  (search form), dan di drawer dia duduk sebaris sama field Guests & Pickup yang dua-duanya
  12px. Jadi satu kontrol, satu sudut. Kalau Wayan gak setuju: 1 baris di `CurrencyPicker.jsx`.
- Verifikasi: **`verify-btnsm.mjs`** di scratchpad — **5180/5180**, 520 tombol, 20 halaman ×
  320/390/768/1280/1440. Patokannya per tombol: tinggi 33.6 · font 12.8 · radius 8 ·
  `justify-content`/`align-items`/`text-align` = center · padding atas-bawah 0 · display flex ·
  teks 1 baris · label ≤2 kata; plus per halaman: **nol tombol pill sisa** & halaman gak melar.
  - **Gate-nya dites pakai bug aslinya** (inline `style`, bukan utility — dua utility
    specificity-nya sama jadi sabotase pakai class bisa diem-diem gak ke-render).
  - **LUBANG YANG KE-TANGKEP GARA-GARA ITU**: `contact.html` **udah gak ada** di build (form
    kontak sekarang di section `/our-company#contact`), jadi harness-nya buka **404**, nemu
    nol tombol, dan **lapor lolos**. Sekarang dia nge-assert tiap halaman HTTP 200, judulnya
    bukan 404, dan **ada minimal 1 tombol ke-ukur**. Itu yang akhirnya nemu tombol WhatsApp
    di `ContactSection` yang belum ke-konversi — ke-hide di halaman itu, jadi census browser
    gak pernah lihat. **Halaman yang sectionnya di-`hidden` WAJIB dibuka lewat hash.**
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
- **Checklist bullet (Included/Excluded) — SATU FORMAT DI SELURUH WEB** (Sep 2026, Wayan
  pilih "opsi B" dari sheet penanda, terus "include dan not included yang ada di semua page
  ubah bro, samain kayak styling charter"):
  - **KOTAK, tanpa marker** = `components/ui/InfoBoxes.jsx` — dipakai **charter, transfer,
    airport, halaman tour & destinasi (`DetailTabs`), dan blok info halaman listing
    (`ListingPage`)**. Itu SEMUA pasangan include/exclude yang ada di web ini. Tiap daftar duduk di kotak berbingkai (`--line`, `--r-md`), **NOL simbol per
    baris**. Yang "Not included" di-tint `bg-cream` + teks `--color-muted` — itu yang
    gantiin peran lingkaran kosong. Desktop 2 kolom, HP numpuk (`max-[768px]`, sama kayak
    grid checklist lama).
    - **KOTAK-nya CUMA buat pasangan include/exclude.** Dua permintaan Wayan berurutan
      (Sep 2026): (1) "gua mau komponen include dan exclude aja yang isi border line yang
      lain jangan" = garis rambut antar-baris, terus (2) "garis di luar kontainer juga
      selain include not include juga hilangin" = bingkai kotaknya. Jadi sekarang:
      - **variant `'yes'`/`'no'`** = BERBINGKAI (border + radius + padding) **DAN**
        baris-barisnya bergaris rambut. Itu spek yang dibaca baris per baris.
      - **tanpa variant** = **KOLOM POLOS**: nol bingkai, nol padding, nol garis baris.
        Ini yang emang diminta dari awal buat "How the day works" & "What a day can cover"
        ("pakai kolom", bukan kotak). Padding-nya sengaja NOL juga — biar teksnya lurus
        sama tepi kiri kartu & judul di atas/bawahnya, bukan masuk 1.2rem tanpa alasan.
      - Aturannya **nempel ke `variant`**, jadi jangan bikin flag baru buat ini —
        kasih variant (atau jangan) di **`InfoBox`**-nya.
      - **GOTCHA yang udah kejadian**: `variant` dioper ke DUA tempat — `InfoBox`
        (bingkai + tint) dan `InfoBoxList` (garis baris + warna teks). Di `DetailTinfo`
        sempat cuma ke-pasang di list-nya, jadi kotak "What's included" transfer/airport
        ilang bingkainya diam-diam. Ke-tangkep `verify-infoboxes` doang (adu bentuk
        3 halaman) — mata gak bakal nyadar. Kasih variant ke dua-duanya.
    - **Kenapa gak ada marker**: lingkaran isi/kosong itu minjem bentuk radio button dan
      nangkring di tengah kolom bacaan. Kotaknya yang bilang "ini grup", jadi gak ada yang
      perlu diulang di tiap baris. Ikon centang/silang juga ditawarin & **gak dipilih**.
    - Teks "not included" pakai token `--color-muted`, **bukan `#8a8578` yang lama** —
      yang lama kebaca kayak disabled, bukan kayak informasi.
  - **Marker radio** (`.info__list--yes/--no li::before`: lingkaran keisi / lingkaran
    kosong) **UDAH GAK DIPAKAI BUAT INCLUDE/EXCLUDE DI MANA PUN**. String-nya
    (`INFO_LIST_YES`/`_NO`/`infoList`) TETEP di `infoClasses.js` karena masih kepakai
    2 tempat yang **bukan** pasangan include/exclude — jangan dihapus, dan jangan ikut
    dijadiin kotak tanpa nanya Wayan dulu:
    - `AboutPage` — list "Our promise / What you can hold us to". Itu daftar janji yang
      berdiri sendiri, gak ada lawannya; kotak berbingkai butuh PASANGAN buat masuk akal.
    - `Prose` blok `{ type: 'list' }` — bullet biasa di artikel guide & halaman legal
      (Terms/Privacy/Cancellation). Itu prosa, bukan spek yang dibaca baris per baris.
  - **Kalau nambah pasangan include/exclude baru**: pakai `InfoBoxes`, jangan
    `INFO_LIST_YES/_NO`. Harness `verify-incl.mjs` di scratchpad ngadu bentuk kotak
    8 halaman (charter jadi acuan) di 390/767/768/1024/1280 — patokannya nol marker sisa,
    garis rambut ada kecuali baris terakhir, kotak "not" di-tint, 2 kolom dari 768 ke atas,
    halaman gak melar, dan **tanda tangan bentuknya identik antar-halaman**.
  - **Catatan**: dari 3 halaman listing, cuma `activities` yang punya blok info + kolom
    include/exclude. `tour` & `destinations` emang gak punya `info` di
    `content/shared/listings.js` — itu dari dulu, bukan ke-skip pas konversi.
  - Bullet generik lain (mis. `.modal__details-list` = `•` emas) beda lagi.

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

## Favicon / logo tab (Sep 2026)
- Semua ikon di **`public/assets/icons/`**, di-generate dari SATU file logo pakai
  **`node tools/make-icons.js <logo.png>`** (bukan gate CI — jalanin tangan kalau logo
  ganti, terus commit hasilnya). Ganti logo = cukup 1 perintah, jangan bikin ikon satu-satu.
  - Yang dihasilkan: `favicon.svg` · `favicon.ico` (frame 16/32/48) · `favicon-16x16.png` ·
    `favicon-32x32.png` · `apple-touch-icon.png` (180) · `icon-192.png` · `icon-512.png`.
  - **Crop-nya OTOMATIS ke "ink"-nya** (bbox piksel yang bukan transparan & bukan putih,
    terus dibikin persegi dari titik tengahnya). Logo kiriman biasanya nangkring di kanvas
    transparan gede dan **gak selalu pas di tengah** — kalau gak di-crop, di 16px yang
    keliatan cuma titik kecil ngambang di dalam padding.
  - **GAK ADA KOTAK PUTIH di mana pun** (Sep 2026, Wayan: "kok isi kotak putih"). Dua perlakuan
    beda, sengaja:
    - **Ikon TAB** (`favicon.svg`/`.ico`/`favicon-16/32`) = bulatan doang, **sudut transparan**.
      Kotak putih di belakang bulatan itu gak keliatan di tab terang TAPI jadi ubin putih di tab
      gelap — transparan satu-satunya setelan yang kebaca bulat di dua-duanya, dan semua browser
      yang kita dukung udah beres sama PNG/ICO transparan.
    - **Ikon HOME-SCREEN** (`apple-touch-icon`, `icon-192/512`) WAJIB opaque — iOS & Android
      nge-compositing transparan sendiri (biasanya ke HITAM) dan sudutnya mereka yang bunderin.
      Jadi ubinnya diisi **emasnya logo sendiri** (`#b4975f`, di-SAMPLE dari artwork, bukan
      tebakan): hasilnya ubin brand utuh, bukan kotak putih yang ditempelin stiker.
      **Bulatannya di-zoom 1.45x terus di-crop tengah** biar tumpah keluar ubin — kalau cuma
      di-flatten ke emas, nyisa **cincin samar** (emas di artwork-nya rada gradient, gak ada
      warna rata yang persis sama).
    - **"Bikin semua bulat" UDAH DITANYA & GAK BISA** (Sep 2026, Wayan: "gua maunya biar semua
      circle gabisa?"). **iOS SELALU** nge-mask ikon home screen ke kotak-bunder (squircle) —
      gak ada aplikasi mana pun yang bisa bulat di situ. Yang bisa diatur cuma **isi sudutnya**:
      emas (sekarang) · putih (ditolak) · transparan → **iOS isi HITAM**, jadi malah kotak hitam
      + bulatan emas di dalamnya, lebih jelek dari dua-duanya. Wayan pilih **emas**. Jadi kalau
      nanti ada yang ngeliat ubin ini terus kepikiran "kok gak bulat" — ini jawabannya, jangan
      dicoba lagi.
    - Ikon home screen cuma nongol kalau tamu sengaja "Add to Home Screen". Tab browser, hasil
      Google, bookmark — semuanya pakai yang bulat.
  - **`favicon.svg` = cangkang SVG yang MBUNGKUS raster**, sama kayak file yang dia gantiin —
    monogram-nya glyph custom, gak ada vektor jujurnya. Bedanya: sudutnya **transparan**
    (tab browser bisa gelap, jadi bulatannya harus kebaca bulat, bukan kotak putih).
  - PNG-nya **palette** (128 warna): logo 2 warna, hasilnya sama persis tapi ukurannya
    sepotong (RGBA mentah bikin `icon-512` 4x lebih gede).
  - `sharp` kebawa **transitif dari Next**, gak kedaftar di `package.json`. Kalau suatu saat
    ilang: `npm i -D sharp`.
- **Link-nya di `app/layout.jsx` pakai CONTENT HASH** (`assetV()`, pola yang sama kayak
  `STYLE_V` punya `style.css`). File di `public/` di-serve di path tetap **tanpa hash**, dan
  browser nge-cache ikon tab lebih keras dari hampir apa pun — tuker file doang bisa bikin
  logo lama nangkring berhari-hari. Hash-nya ganti persis pas file-nya ganti, jadi **gak ada
  yang perlu di-bump tangan**. (Ini BUKAN balik ke `?v=` manual situs lama.)
  - `check-assets` aman: regex-nya berhenti di `?`, jadi path-nya tetep kebaca bersih.

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
- **/transfer vs /airport-transfer = DUA QUERY BEDA, jangan disatuin lagi** (Sep 2026, Wayan
  pilih "opsi B" dari 3 opsi yang ditawarin). Dulu dua-duanya buka title-nya pakai frasa
  **"Bali Airport Transfer"**, jadi rebutan satu query - dan yang menang link-nya
  (`/transfer`, **100 link** dari navbar + footer) justru yang paling tipis (**375 kata**),
  sementara yang punya isi + field nomor penerbangan yang beneran ngejawab query itu
  (`/airport-transfer`, **746 kata**) cuma dapet **4 link**.
  - **`/airport-transfer` PEGANG "bali airport transfer"** - cuma DIA yang title/H1-nya
    boleh mulai dengan frasa itu. Dijaga `seo-split-check.cjs` di scratchpad: dia nyisir
    SEMUA `.html` di `out/`, patokannya **tepat 1 halaman** yang mulai dengan frasa itu.
  - **`/transfer` = halaman SEMUA ROUTE.** Title "Bali Private Car Transfers | Ubud to
    Canggu, Kuta, Amed", H1 "Private Car Transfers in Bali". Frasa "airport transfer"
    **gak boleh** nongol lagi di title/meta-nya.
  - **Kartu route Airport = LINK ke `/airport-transfer`, bukan pre-fill** (Sep 2026, Wayan:
    "tulisan flying in or out delete aja bro, tapi kalo di klik airport ubud langsung
    mengarah ke page airport dan auto fill"). Href-nya
    `/airport-transfer.html?dir=pickup`; halaman tujuan baca `?dir` di `useEffect` terus
    nge-set Direction ke **arrival**. Guests gak perlu dioper - dia di TripPrefs
    (localStorage), jadi ke-baca lagi sendiri di halaman itu.
    - **Ini NGE-OVERRIDE catatan lama** yang bilang keenam kartu harus sama kelakuannya
      ("bikin 1 dari 6 kartu beda kelakuan itu bug sendiri"). Alasannya tetep masuk akal:
      leg bandara itu satu-satunya yang butuh **nomor penerbangan**, dan field itu cuma
      ada di halaman sana.
    - **5 kartu lain GAK BERUBAH** - tetep pre-fill picker di tempat, gak pindah halaman.
      Dijaga `verify-airportlink.mjs`.
    - **Tampilannya sengaja IDENTIK** (`CARD` + `<Face>` dipakai dua-duanya, cuma tag-nya
      `<a>` vs `<button>`). Yang beda cuma efek tap-nya. Kalau nanti kerasa bikin kaget,
      tinggal tambahin penanda kecil di kartu itu - belum diputusin Wayan.
    - **Baris prosa "Flying in or out? Book on the Bali airport transfer page..." UDAH
      DIHAPUS** - kartunya yang ngomong sekarang, dengan cara nganterin ke sana.
    - **Kartu itu jadi SATU-SATUNYA link dari `/transfer` ke halaman itu**, jadi dia juga
      yang mikul link internalnya. Teksnya udah ngandung keyword ("Airport → Ubud"), jadi
      aturan anchor-text tetep kepenuhan. Diukur sesudah: **100 halaman / 105 link** ke
      `/airport-transfer` (footer 100 + kartu ini) - sama kayak sebelum.
  - **Anchor text WAJIB nyebut "airport"** di tiap link ke halaman itu. Dulu semuanya
    "Book a transfer" - gak ngasih tau Google apa-apa soal isi halaman tujuannya. Sekarang:
    band airport homepage + listing (`components/sections/home/Airport.jsx`) =
    "Book your airport transfer", kartu promo slider (`content/shared/programPromo.js`) =
    "Book airport transfer".
  - **`programPromo.js` GAMPANG KELEWAT**: kartu "Transfer"-nya nyimpen **salinan judul
    halaman**, jadi H1 lama ("Bali Airport & Route Transfers") sempet ketinggalan di situ dan
    ke-print di 3 halaman listing padahal halamannya sendiri udah ganti. **Ganti H1 halaman
    yang punya kartu promo = cek file itu bareng.**
  - **Gotcha harness**: nyari anchor pakai regex `<a href="..."` itu SALAH - Next gak jamin
    urutan atribut, jadi anchor yang ke-render `class=` duluan kelewat diam-diam (kejadian:
    harness lapor anchor homepage kosong padahal udah bener). Pakai `<a\b[^>]*href="..."`.
  - **Link se-web = lewat FOOTER** (Sep 2026, Wayan: "gas footer aja bro"). Habis split-nya,
    `/airport-transfer` cuma dapet **5 link internal** lawan 100-nya `/transfer` - halaman
    yang justru mau di-rank-in malah nyaris gak ada dukungan internal. Sekarang ada baris
    **"Airport Transfer"** di kolom Explore `components/layout/Footer.jsx` (tepat di bawah
    Transfer), jadi **100 link, sama rata sama `/transfer`**.
    - Label-nya **frasa penuh, bukan "Airport"** - label footer itu SEKALIAN anchor text-nya.
    - **Tinggi footer NOL berubah** (681/632/617/306/306 di 320/390/768/1280/1440, diukur
      before-after): kolom Explore bukan yang paling tinggi, jadi baris ke-6 gratis. Kalau
      nambah baris lagi di kolom itu, **ukur ulang** - begitu dia nyusul kolom Company,
      footer-nya mulai tumbuh.
    - **Navbar sengaja GAK disentuh**: dropdown Program tetep 4 item (Tours/Experiences/
      Transfer/Charter). Footer udah ngasih jangkauan yang sama, dan dropdown 5 item kerasa
      penuh. Jangan ditambahin ke situ juga tanpa nanya - nanti dobel.
  - **Schema harga UDAH DIPASANG** (Sep 2026, Wayan: "gas schema nya bro"). Dua-duanya sekarang
    punya `Product` + harga, ikut konvensi yang udah dipake 62 Product lain:
    - `/airport-transfer` = `Offer` harga tunggal. `/transfer` = **`AggregateOffer`**
      (low/high/offerCount), karena halaman itu jual SEMUA route di picker, jadi klaim yang
      jujur itu RENTANG, bukan satu angka.
    - **Dua hint baru di BLOCK schema, bukan di dalam `json`** (apa pun di dalam `json`
      ke-print mentah jadi JSON-LD, dan ini bukan field schema.org):
      - `priceKey` — nama entry katalog buat ambil harganya. Ini yang bikin Product-nya bisa
        DIJUDULIN buat pembaca ("Bali Airport Transfer") tapi tetep ngambil harga dari key yang
        dikenal API ("Airport – Ubud").
      - `priceGroup: 'transfers'` — low/high/offerCount dihitung dari SELURUH route di katalog,
        jadi rentangnya ngikut API, bukan daftar yang disalin ke sini terus basi begitu ada
        route baru.
- **JSON-LD ITU SALINAN HARGA JUGA, dan ini kelewat 24 kali.** `JsonLd` emang nambal harga
  `Product` dari katalog live — **TAPI cuma kalau build-nya BISA nyampe API**. Kalau nggak
  (mis. jaringannya diblokir), **angka yang ketulis di `schema.js` yang dikirim ke Google**.
  Ke-buktiin dengan sengaja ngerusak angka fallback-nya terus build: angka rusaknya yang nongol.
  - Pas `check-prices` diperluas buat nyisir `schema.js`, langsung ketemu **24 harga basi** —
    semuanya sisa era kurs 15.500 dan semuanya **LEBIH MAHAL dari harga beneran** (Ubud Tour
    $45 vs $40, Bali Zoo $40 vs $35, Batur Sunrise $85 vs $74). Jadi Google dikasih tau harga
    ~12% di atas yang kita tagih, di 24 halaman. Udah disamain semua.
  - **Kartunya sendiri (60) NOL yang basi** — yang bolong emang cuma JSON-LD, karena gak ada
    yang pernah nyisir situ.
- **`check-prices` sekarang nyisir SEMUA salinan harga, bukan cuma `listings.js`**: kartu route
  `/transfer` (`transfer.js`), band airport (`home/Airport.jsx`), dan fallback JSON-LD
  (`schema.js`, dibaca generik lewat `priceKey`/`priceGroup`). Itu 3 tempat yang dulu di luar
  jangkauan — dan persis kenapa band homepage sempet nulis $20 padahal API bilang $18.
  Sekarang laporannya 2 baris: "Cards checked" + "Other copies checked".
  - **Gate-nya dites pakai bug aslinya** (aturan yang sama kayak `check-motion`): keempat jenis
    salinan dirusak satu-satu, keempat-empatnya ke-tangkep, baru dibalikin.
  - **TETEP bukan gate CI** — dia butuh clone `cahyana-api` di sebelah, dan CI cuma punya `out/`.
    Jalanin tangan tiap nyentuh harga.

## Redirect & sitemap (Sep 2026, sebelum submit GSC)
- **REDIRECT HIDUPNYA DI `public/.htaccess`, BUKAN `next.config.js`.** Situs ini
  `output: 'export'` (static export) — Next **gak dukung** `redirects()`/`rewrites()`/
  `headers()` di mode itu, jadi blok `async redirects()` bakal jadi **kode mati yang
  diem-diem gak jalan**. Hostinger itu Apache; `public/.htaccess` ke-copy ke `out/` pas
  build. Nambah redirect = tambah baris `Redirect 301` di situ.
- **JANGAN bikin redirect `/:path*.html` → `/:path*`.** URL kanonik kita JUSTRU yang
  ber-`.html`: canonical tag, 89 entri sitemap, dan semua link internal. Static export
  nulis `charter.html`; folder `out/charter/` isinya cuma payload RSC `.txt`, **gak ada
  `index.html`** — jadi `/charter` gak ada yang bisa di-serve. Redirect itu = 301-in tiap
  halaman ke-index ke 404. Kalau suatu saat emang mau URL tanpa `.html`, itu proyek
  sendiri (ubah bentuk export → tiap route emit `folder/index.html`, sapu semua link +
  canonical + sitemap, BARU pasang redirect `.html` → bersih) dan WAJIB dikerjain
  **sebelum** URL-nya ke-index rame, bukan sesudah.
- **Sitemap ada DUA, dua-duanya sengaja:**
  - `app/sitemap.js` → `out/sitemap.xml`, di-generate dari `indexablePaths()`
    (`lib/routes.js`). **Ini yang di-serve** & yang ditunjuk `robots.txt`.
  - `sitemap.xml` di **ROOT repo** = checklist tangan, **gak di-serve** (bukan di `public/`,
    jadi gak ke-copy). `check-urls` ngadu dua-duanya — dulu pernah melenceng diam-diam
    (root buang 6 halaman legal/about, `routes.js` masih bawa, jadi sitemap live nyuruh
    Google ke 6 redirect). **Jangan dihapus**, itu gate.
  - Entri yang di-**comment** di checklist = URL yang sengaja diparkir; komentarnya di-strip
    sebelum dibandingin. Makanya `grep -c '<loc>'` root (95) ≠ yang ke-serve (89).
- **Audit 404 sebelum submit GSC** (Sep 2026): gua adu SEMUA `.html` yang pernah ada di
  git history lawan halaman yang hidup + daftar redirect. Ketemu **31 URL yang bener-bener
  bolong**: halaman attraction dulu ada di ROOT (`/monkey-forest.html` dst) sebelum pindah
  ke `/attractions/`, dan sejak pindah **gak pernah di-redirect**. Slug-nya sama persis,
  jadi pemetaannya mekanis — udah dipasang semua.
  - **Gotcha `Redirect` mod_alias**: dia cocokin **prefix path**, bukan exact. Jadi sebelum
    nambah, cek sumbernya bukan awalan dari URL yang masih hidup (mis. `/tanah-lot.html`
    aman karena `/tanah-lot-taman-ayun.html` gak diawali string itu). Cek ini dijalanin
    pas masang 31 itu.
  - **Sisanya UDAH DIPUTUSIN & DIPASANG** (Sep 2026, Wayan: "gass") — 10 redirect lagi,
    total 56. Dicek dulu sebelum dipasang: **nol** link ke URL-URL itu di seluruh repo
    (yang tadinya keliatan `melasti-beach` 5 file itu FOTO-nya, `booking` itu class CSS
    `booking__*`, `why` itu `whyus` — **grep pola URL (`"/x.html"`), jangan slug
    telanjang**), dan kontennya gak pindah slug.
    - **Ternyata 14 URL, bukan 11**: 3 stop South Bali (melasti/padang-padang/jimbaran)
      sempet pindah ke `/attractions/` sebelum dibuang, jadi **dua-duanya** bolong.
    - **2 tour punya penerus PERSIS** (kebaca dari title lama di git history):
      `/east-bali-tour` = "Lempuyang Gates of Heaven & Tirta Gangga" → `/lempuyang-tirta-gangga`,
      `/west-bali-tour` = "Tanah Lot Sunset, Ulun Danu & Jatiluwih" → `/jatiluwih-tour`.
      `/north-bali-tour` **gak punya** — munduk/banyumala/lovina semuanya `HIDDEN_TOURS`,
      jadi ke `/tour.html`. 6 URL beach → `/destinations.html` (alasan yang sama:
      `hidden-beaches-cliffs` diparkir). `/scooter` → `/guide/getting-around-bali`.
      **Jangan pernah nge-301 ke tour yang diparkir** — itu ngarahin Google ke halaman
      yang gak dijual.
    - **Sengaja DIBIARIN 404**: `/booking`, `/dashboard`, `/why` (halaman internal/admin,
      gak pernah punya title publik) + scaffolding dev (`footer.html`, `navbar.html`,
      `guide/_template.html`, `react-demo/`, `dashboard-mockup.html`). Mock, `partials`,
      dan file ` 2.html` duplikat emang gak pernah live — abaikan.
    - **Cek wajib tiap nambah redirect** (udah dijalanin buat 56-nya): target harus halaman
      HIDUP & bukan sumber redirect lain (nol rantai), dan sumbernya bukan awalan URL hidup
      (mod_alias cocokin prefix). Yang 6 fold legal/about `→ /our-company.html#…` emang
      keliatan "target gak hidup" kalau dibandingin string penuh — itu fragment, aman.

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
    Harga "from $26" di-wire lewat `data-price="Airport – Ubud"` (ikut kurs/referral via `renderPrices`;
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
    - Verifikasi: **`verify-charterhome.mjs`** di scratchpad (124/124) — 320/390/430/768 + desktop
      1024/1280/1440: 3 kartu ada, NOL field, cuma 1 tombol & href-nya `/charter.html` & gak
      bergaris, gak ada kicker di atas harga, halaman gak melar. Plus **adu dua halaman di lebar yang sama**:
      nama/harga/class row/class grid/gaya teks/tinggi baris harus IDENTIK homepage vs halaman
      charter. Plus **serah-terima**: pilih Extended di homepage → tersimpan → halaman charter
      kebuka di Extended + field Extra hours ikut nongol + baris ringkasan nyebut Extended;
      pengunjung baru (storage kosong) tetep dapet Full Day. Plus **baris berdua sama About**
      (lihat bullet di bawah).
- **Charter + About = SATU BARIS 2 kolom di DESKTOP** (Sep 2026, Wayan: "khusus desktop
  charter dan section di bawah charter jadiin 2 kolom" → "gass kayak mockup bro"). Yang
  mbungkus dua-duanya = **div di `app/page.jsx`**, bukan section-nya sendiri: dia yang
  pegang container + gutter + jarak, `grid-cols-[1.35fr_1fr]` mulai **993px**
  (`items-stretch`, jadi dua kolomnya sama tinggi).
  - Dua section itu dikasih prop **`paired`** — cuma itu yang boleh beda, JANGAN bikin
    salinan komponen kedua. `CharterHome paired` ngelepas lebar + gutter + margin
    vertikalnya sendiri di 993px (wrapper yang pegang) & panelnya `h-full`.
    `About paired` berhenti jadi band full-bleed di 993px: jadi kartu `rounded-lg`
    + `overflow-hidden`, teksnya **rata KIRI** (kolom sempit lebih enak dibaca
    ragged-right daripada ke-center), `h-full`.
  - **Di bawah 993px NOL yang berubah**: charter numpuk di atas, About tetep band foto
    full-bleed. Itu disengaja — divider emas mati di homepage, jadi band foto itu yang
    ngasih ritme di bagian bawah halaman. Jangan ikut dijadiin kartu di HP.
  - Dijaga `verify-charterhome.mjs`: di 1024/1280/1440 tepi kanan charter ≤ tepi kiri
    About, atas & bawahnya selurus (sama tinggi), celahnya satu gutter, About udah gak
    selebar layar & sudutnya bunder & teksnya kiri; di 320/390/430/768 masih numpuk,
    About masih selebar viewport & sudutnya 0. Halaman gak melar di semua lebar.
- **Copy**: no em-dash (`—`) di teks — pakai hyphen biasa (` - `) atau pecah kalimat.

## Transfer / Airport / Charter = SATU CANGKANG (Sep 2026)
Wayan: "selaraskan styling layout sama charter bro, page transfer, airport dan charter
harus identik". Ketiganya **cuma punya 1 section**, dan cangkangnya sama persis:

    <FormHero title sub photo alt [photoPos] details [embedded]>
      {form halaman itu}                        <- judul, sub, FORM, FOTO, DETAILS

- **BENTUK BARU (Sep 2026, Wayan): "di atas judul abis itu formnya abis itu baru foto,
  kalo di desktop jadiin kolom, misal kiri form kanan foto".** Band foto gelap yang dulu
  nampung judul + sub + form DI ATASNYA udah **DIHAPUS**; sekarang foto jadi panel
  sendiri di sebelah form, dan tulisannya duduk di putih. Urutan DOM: judul → sub →
  form → foto. HP numpuk sesuai urutan itu; desktop 2 kolom.
- **SATU KONTAINER, details ikut di dalamnya** (Sep 2026, Wayan: "charter details sama
  form di atasanya, sekarang masih beda kontainer, jadiin satu aja dan rapikan margin
  left right"). Dulu details duduk di kartu KEDUA di atas band cream, lebarnya
  `--container-mid` (1080) lawan `--container` (1200) punya baris form - tepinya
  **meleset 60px** di 1280 & 1440 dan **8px** di 390 & 768 (diukur). Sekarang dia masuk
  `INNER` yang sama lewat prop `details`, jadi tepinya lurus dengan sendirinya
  (diukur ulang: **L0 R0 di 390/768/1024/1280/1440, ketiga halaman**).
  - **Paragraf lepas di-cap `--container-read`** tapi rata KIRI. Kontainernya 1200;
    paragraf selebar itu ±190 karakter. Kompromi yang sama kayak artikel guide. Cap-nya
    **gak pernah kena** di dalam `InfoBox` (kolomnya udah di bawah 720).
  - **Judul "X Details" ikut ke KIRI** (pola `ST_LEFT`). Dulu
    ke-center - masuk akal waktu dia baris pertama kartunya sendiri, kebaca kayak sisa
    begitu semua di atasnya rata kiri.
  - `INFO_SECTION_DETAIL` + `INFO_CARD` **TETEP ADA** - masih dipakai `ListingPage`
    sama `/settings`. Yang berubah cuma: ketiga halaman ini gak pakai mereka lagi.
- **Cangkangnya = SATU KOMPONEN, `components/sections/FormHero.jsx`**, bukan 3 salinan
  string class. Yang wajib sama itu **URUTAN** empat bagian itu, dan urutan gak bisa
  dijaga cuma dengan berbagi string - alasan yang sama kenapa `DetailHero` ada buat
  tour/attraction/guide. `CHARTER_HERO*` + file `charterHeroClasses.js` **UDAH DIHAPUS**.
- **2 kolomnya mulai 1200px, BUKAN 993 - dan angka itu penting.** `CharterBuilder`
  punya 2 kolom SENDIRI (paket | field, `1fr 340px`) dari 993px. Kalau yang luar juga
  993, kolom paket mendarat di **~244px** dan nama paket + harga gak muat sebaris. Di
  1200 kolom form ~791px jadi paket dapet ~450px. Di bawah 1200 semuanya numpuk = urutan
  HP yang diminta. **Jangan turunin ke 993.**
- **Rasio kolom `2.4fr 1fr`, hasil UKUR bukan tebakan.** Sub-baris paket charter
  ("10 hours · around 120 km · per car up to 5") mulai wrap begitu kolom form di bawah
  ~790px: di `1.75fr` dua dari tiga baris pecah di 1200px dan nyisain "5" sendirian.
  Ganti rasio = **ukur ulang sub-baris itu**.
- **Grid-nya `grid-cols-[minmax(0,1fr)]`, jangan track `auto`.** Lantai track grid itu
  **min-content**, jadi form yang bentuk tersempitnya lebih lebar dari layar bakal
  ndorong track lewat viewport dan `body{overflow-x:clip}` motong tepi kanannya
  **diam-diam**. Form airport persis gitu di 320px (form 316px di kolom 288px).
- **Judul turun jadi `<h2>` kalau `embedded`** (tab /programs punya H1 sendiri). Tanpa
  itu /programs punya 2 H1.
- **Foto `/transfer` DIGANTI** `transfer-hero.webp` → `coastal-road-beach-bali.webp`.
  Foto lama itu fasad terminal dengan tulisan "BALI International Airport" kebaca jelas.
  Dulu aman karena ke-gelapin di belakang teks putih; jadi panel terang dia naro balik
  frasa yang halaman ini justru **sengaja dilepas** (split SEO Sep 2026: yang pegang
  "bali airport transfer" itu `/airport-transfer`). `/airport-transfer` tetep pakai foto
  itu - di situ emang nyambung.
- **Foto `/charter` DIGANTI** `road-ubud.webp` → `handara-gate.webp` (Sep 2026, Wayan).
  Foto lama itu **macet** - motor berjejer + rambu larangan parkir. Aman selama dia
  ke-gelapin di belakang teks hero putih; begitu jadi panel terang di sebelah form,
  halaman yang jualan "duduk aja, ada yang nyetir" malah mamerin kemacetan. Handara
  Gate itu salah satu ide rute yang halaman ini **udah sebut sendiri** ("Full day
  north: Handara Gate"), jadi bukan foto tempat yang gak kita datengin, dan
  komposisinya ke-center jadi tahan di crop tinggi-sempit.
  - **Kartu promo Charter di 3 halaman listing IKUT DIGANTI** (Sep 2026, Wayan: "gas samain
    foto promo charter bro") — `content/shared/programPromo.js` sekarang `handara-gate.webp`
    juga. Nol `road-ubud.webp` ketinggalan di seluruh repo; dijaga `verify-r3.mjs` (3 halaman
    listing). **Yang MASIH salinan basi di file itu**: teks kartunya nulis "go anywhere, stop
    anywhere, at your own pace" — slogan yang udah dibuang dari `CHARTER.sub` (diganti fakta).
    Belum ditanyain ke Wayan, itu copy.
- **`/airport-transfer` BAGI DUA 50/50 di desktop, dua yang lain TETEP 2.4fr** (Sep 2026,
  Wayan: "di desktop bagi 2 aja, 50% kolom input 50% image nya"). Ini **hal KEDUA** yang
  boleh beda antar tiga halaman itu, setelah foto — jadi dia di `FormHero` sebagai prop
  `half`, bukan di salinan cangkang kedua.
  - Alasannya beda peran kolom: form airport itu satu tumpukan field selebar penuh, gak ada
    yang butuh lebar ekstra. **Charter GAK BISA ikut**: sub-baris paketnya wrap begitu kolom
    form di bawah ~790px, dan 50/50 di 1200 cuma ngasih **576px** (diukur).
  - Dua string class-nya ditulis PENUH (`GRID_COLS` / `GRID_COLS_HALF`) — Tailwind nyisir
    teks sumber, class yang dirangkai pakai interpolasi **gak pernah ke-generate**.
  - `verify-formhero` ikut diubah: `formw`/`photow`/`photox` **keluar** dari tanda tangan
    cangkang bersama (bedanya disengaja & di-assert sendiri), tapi **tepi KIRI form** dan
    **tepi KANAN baris** tetep wajib sama di ketiganya.
- **`photoPos` = SATU-SATUNYA prop yang ngatur foto selain `photo`/`alt`.** Default
  `[&>img]:object-center`. `/airport-transfer` naro **`[&>img]:object-[80%_50%]`**: itu
  satu-satunya offset yang muat tulisan "BALI International Airport" **UTUH** di kolom
  50/50-nya. Diadu di browser: center, 38% dan 62% semuanya motong kata "Airport" di tepi
  kanan, dan **26% — yang bener waktu kolomnya masih slot sempit 0.57:1 — sekarang malah
  mendarat di tengah papan nama.** Jadi **ganti lebar kolom = ukur ulang crop-nya**, jangan
  cuma percaya angka yang udah ada. (Papan namanya kebaca di halaman INI gak masalah: dia
  yang megang frasa itu. Yang gak boleh nampilin itu `/transfer`, dan dia pakai foto lain.)
- **SATU FIELD TANGGAL per form** (Sep 2026, Wayan: "di page airport transfer ada 2 kolom
  date, which is itu gak bener"). Form airport dulu punya **"Date" DAN "Flight date & time"**
  — nanya hal yang sama dua kali, dan dua-duanya bisa beda: transfer ke-book tanggal 12,
  pesawatnya mendarat tanggal 13. Sekarang tanggal transfer **dibaca dari penerbangannya**
  (`flightTime.slice(0,10)`), dan catatan di bawah field-nya nyebut itu. `ready` ikut:
  alamat + nomor penerbangan + tanggal penerbangan.
  - `FIELD_LABEL` di form itu **udah dihapus** (dia cuma ada buat baris Date|Guests yang
    2 kolom); sekarang semua label lewat `LABEL`.
  - Label "1. Direction" ilang "1."-nya — gak ada 2. dan 3., sisa dari versi form
    yang dulu bernomor.
- **Form gak boleh ganti tinggi pas harga nyampe** (Sep 2026). `/transfer` dulu
  nyetak **NOL** apa pun sebelum route kepilih, jadi begitu harganya muncul form-nya
  tumbuh - dan karena foto-nya `h-full` di 1200+, **foto-nya ikut lompat**. Sekarang
  slot harganya `min-h-[57px]` + `flex justify-center` dan isinya "Pick a route to
  see the price". Aturannya umum: **apa pun yang nongol belakangan di dalam form wajib
  udah punya ruangnya** - kalau nggak, panel foto di sebelahnya yang kena.
- **Yang boleh beda cuma FOTO-nya.** Sisanya (padding, bg, ukuran+bobot+warna H1, lebar
  kolom, radius foto, posisi) WAJIB identik - dijaga **`verify-formhero.mjs`** di
  scratchpad (8 lebar × 3 halaman, 226 assertion): urutan judul→sub→form→foto, foto di
  KANAN form dari 1200 & numpuk di bawahnya, tanda tangan cangkang tiap halaman diadu
  lawan charter, foto gak lazy & ada alt, halaman gak melar, dan nama + sub-baris paket
  charter gak wrap.
- **`INFO_CARD_BODY`** (ritme paragraf di dalam kartu) di `infoClasses.js`. Dulu namanya
  `BODY_TEXT`, const lokal di `CharterSection` - transfer & airport gak ikut, jadi
  paragrafnya beda. Sekarang satu string, tiga pemakai.
- **Strip fakta = CHIP, bukan kotak** (Sep 2026, Wayan: "box untuk availability,
  capacity dll ganti bro gua gamau isi box gitu"). Dulu grid 4 sel berbingkai -
  kontainer jenis kedua di halaman yang baru aja dijadiin satu. Sekarang chip pill,
  yang emang **udah jadi bahasa web ini** buat fakta jenis ini (hero tour/destinasi
  nampilin Duration/Group/Free cancellation persis pakai itu).
  - **Pill-nya SATU string di `components/ui/chipClasses.js`** (`CHIP` + `CHIP_OK`).
    `DetailHero` sekarang import dari situ dan tetep nge-export `HERO_CHIP` buat
    pemakai lamanya. Dijaga `verify-chips.mjs`: bentuk chip di strip fakta **diadu
    lawan** chip hero tour/attraction, harus identik.
  - **Chip nyetak NILAI doang; LABEL-nya milih IKON** (`chipIcon()` di file yang sama).
    Jadi tiap nilai WAJIB bisa berdiri sendiri - itu sebabnya di konten diubah:
    "English" → **"English-speaking driver"** (3 file), "At arrivals" →
    **"Meet & greet at arrivals"** (airport). Nambah fakta baru = pastiin nilainya
    kebaca tanpa label, dan daftarin label-nya di `ICONS` (kalau nggak dapet `Info`).
  - **`/activities` ikut** - dulu `ListingPage` punya SALINAN SENDIRI kotak itu
    (`INFO_FACTS`/`INFO_FACT`), jadi begitu satu berubah dua-duanya melenceng.
    Sekarang dia render `<InfoFacts>` yang sama. `INFO_FACTS`/`INFO_FACT` **UDAH
    DIHAPUS** dari `infoClasses.js`.
  - **Kenapa chip menang dari 2 opsi lain** (kolom polos & satu baris dipisah titik,
    dua-duanya udah di-render buat Wayan): di HP kolom polos jatuh **3 + 1** (baris
    kedua nyisa satu) dan satu-baris **pecah di tengah frasa**. Chip turun utuh.
  - **Gotcha harness**: `<li>` chip itu flex ITEM, jadi `inline-flex`-nya
    **ke-blockify jadi `flex`** - filter `display === 'inline-flex'` diem-diem gak
    ketemu apa-apa. Dan `line-height`-nya `normal`, jadi rumus tinggi/line-height =
    NaN; cek 1 baris pakai tinggi + `scrollWidth == clientWidth` (chip-nya
    `whitespace-nowrap`, jadi wrap ke-detect sebagai overflow).
- **Baris ke-center di `/transfer` UDAH DIKIRIKAN**: judul "Popular routes"
  (pola `ST_LEFT`) dan catatan "All prices per car...". Itu sisa dari
  waktu kartunya masih ke-center; begitu semua di sekelilingnya rata kiri, dua itu
  nyempil sendiri. (Baris ketiga, "Flying in or out?", ikut dikirikan terus **dihapus**
  sama sekali - lihat section SEO.)
- **Isi kartu dibangun `lib/detailBlocks.js`** buat transfer & airport:
  judul kartu → strip fakta (`{type:'facts'}`) → include/exclude (`{type:'boxes'}`) →
  prosa halaman itu sendiri. Charter tetep nulis blok-nya sendiri di `charter.js` (dia
  gak punya strip fakta + punya baris kotak penjelasan kedua) - yang wajib sama itu
  CANGKANG-nya, bukan isinya.
- **Judul kotak = "What's included" / "Not included"** di ketiganya. Transfer & airport
  dulu nulis "What's excluded" - ide yang sama, kata beda, di halaman yang dibaca
  berurutan sama tamu.
- **Judul `--sub` PERSIS setelah baris `boxes` kehilangan margin atasnya** (`!mt-0`
  di `Prose`, Sep 2026). `SECTION_TITLE_SUB` bawa `mt-[2.75rem]` (44px) buat misahin
  dia dari paragraf di atasnya - tapi baris `boxes` udah punya jarak bawahnya sendiri,
  jadi dua-duanya numpuk dan di charter nyisa **pita kosong ~44px** antara kotak
  "How the day works" dan judul berikutnya. Yang di-nol-in cuma posisi itu
  (`blocks[i-1].type === 'boxes'`), jadi judul `--sub` di tempat lain gak kesenggol.
  - **Sisa yang JUJUR (bukan bug)**: dua kotak charter itu tingginya sama (kotak
    stretch), tapi teks kolom kiri ~240px lawan kanan ~320px, jadi masih ada ~80px
    putih di bawah kolom kiri. Itu **panjang isi**, bukan layout - beresinnya ya
    nambah/ngurangin copy, atau pindahin "Charter or guided tour?" ke kolom kiri.
    Belum diputusin Wayan. (Kolom airport yang baru: 167/167, rata.)
- **Blok prosa full-width JANGAN dipasang di bawah baris `boxes`.** `AIRPORT.info`
  dulu gitu: kotak 2 kolom, terus paragraf selebar kartu, jadi halamannya lebar →
  sempit → lebar dan separuh kanan kebaca kayak kosong. Sekarang dia satu baris
  `boxes` isi 2 kolom polos ("Why we ask for flight details" | "How it works") -
  pola yang sama kayak charter.
- **`<DetailTinfo>` UDAH DIHAPUS** dan class **`.tinfo` emang gak pernah punya rule** di
  `style.css`. Halaman airport nulis `<section className="tinfo">`, jadi section itu
  **padding-nya NOL**: di HP 390px strip fakta & kotaknya mulai di **0px** (bordernya
  kepotong tepi layar) sementara blok yang sama di /transfer duduk di 21px. Ke-tangkep pas
  audit, bukan pas ngoding - **kalau nulis `className` string mentah, `grep` dulu
  rule-nya beneran ada.**
- **Yang dibuang bareng itu**: hero tulis-tangan di `TransferSection` (min-h 560 / inner
  560 / overlay .45-.55 - beda dari charter padahal FOTO-nya sama), `max-w-[960px]` +
  `max-w-[820px]` (dua-duanya bukan token container), dan gutter `px-[1.3rem]` (20.8px,
  bukan 24 desktop / 16 HP).
- **Gotcha harness yang nyaris nipu** (dari `verify-trio`, harness band foto lama -
  band-nya udah gak ada, pelajarannya masih kepakai): helper-nya ditulis
  `cs = (el) => getComputedStyle(el)` - argumen pseudo-nya ke-buang, jadi
  `cs(hero,'::before')` diem-diem ngebalikin gaya SECTION-nya. Harness-nya lapor 12
  gagal "cangkang beda" padahal yang beda cuma fotonya, yang emang disengaja.
  Kalau harness bilang beda, **cek dulu harness-nya baca yang bener**.
- **Route di /transfer TETEP markup halaman** (bukan blok Prose): itu kontrol berharga yang
  bisa ditap, bukan bacaan. Dia jalan paling atas di blok `details`, sebelum prosanya.
- **PICKER /transfer: SATU SISI SELALU UBUD** (Sep 2026, Wayan: "kalo kita milih area dari
  kolom input belum bisa jalan dan di book"). Semua route yang kita hargain bentuknya
  "X – Ubud", jadi pasangan yang gak ada Ubud-nya gak mungkin punya harga - tapi form-nya
  dulu ngebolehin tamu bikin persis itu, dan yang lebih parah: **To mulai di "Ubud", From
  mulai di placeholder kosong**, jadi tamu yang milih area di **To** doang nyisain From
  kosong → `routeName` kosong → harga tetep "Pick a route to see the price" dan Book mati,
  **tanpa satu kata pun di layar yang bilang kenapa**. Ke-ukur sebelum dibenerin: pilih
  To = Canggu Area → `from:""`, Book disabled.
  - Sekarang milih area di satu sisi **naro Ubud di sisi lain**; milih Ubud di sisi yang
    lawannya udah Ubud **ngosongin** yang lawannya balik ke placeholder (dulu "Ubud → Ubud"
    nampilin em dash + baris "no fixed price for this pair", kayak route-nya yang salah).
  - Aturannya di `TransferRouteProvider` (`pickFrom`/`pickTo`), dan **`setFrom`/`setTo`
    UDAH GAK di-export** — biar invariant-nya gak bisa dijebol dari luar lagi. `To` juga
    dikasih `placeholder` (dia sekarang bisa kosong).
  - `routeName` gak lagi nyoba dua bentuk: sisi yang BUKAN Ubud itu nama route-nya.
  - Baris "No fixed price for this pair" jadi **jaring pengaman**, bukan state normal.
  - **Row yang di-book sekarang bawa `pickup`/`dropoff`** (kartu My Trips udah nerusin
    dua-duanya pas checkout). Dulu cuma nama route, jadi tamu yang book "Ubud → Canggu"
    dan yang book "Canggu → Ubud" nyimpen row yang IDENTIK dan driver gak bisa bedain.
  - Dijaga `verify-r3.mjs`: milih area di From doang DAN di To doang dua-duanya kasih harga
    + Book nyala, pasangan dua-duanya non-Ubud gak bisa kejadian, swap tetep bener, 6 kartu
    route tetep pre-fill, dan arah yang ke-book ke-simpen.
- **Tombol route UDAH HIDUP** (Sep 2026, Wayan: "benerin bro"). Dulu mati - `TransferSection`
  bukan client component, jadi `onClick` yang dijanjiin catatannya ("tap a route to pre-fill
  the search") gak pernah bisa kepasang. Sekarang:
  - Enam kartunya pindah ke **`components/sections/TransferRoutes.jsx`** (`'use client'`),
    **markup-nya gak diubah sama sekali** - yang dibenerin perilakunya, bukan tampilannya.
  - From/To-nya naik ke **`components/sections/TransferRouteProvider.jsx`**. Kartunya ada di
    kartu BAWAH, form-nya di hero - beda subtree, jadi state yang dipake berdua harus di atas
    dua-duanya. Provider-nya **gak nge-render elemen**, jadi `TransferSection` TETEP server
    component & kartu detail di bawahnya tetep server-rendered; yang ngirim JS cuma form +
    6 tombol itu.
  - `selectRoute(area)` selalu nge-set **area -> Ubud**, walau tamu udah nuker arahnya:
    satu kartu route nyebut SATU arah, setengah-setengah bikin form-nya ngomong hal lain.
    Terus dia **scroll balik ke form** (form-nya di ATAS kartu - tanpa itu tamu nge-tap dan
    keliatannya gak ada yang terjadi). Scroll-nya pakai ref yang didaftarin picker, bukan id.
  - `r.key` ("Airport", "Canggu Area") = persis nama opsi di picker (route katalog dibuang
    suffix " – Ubud"). Kalau salah satu berubah, samain dua-duanya.
  - Verifikasi: `verify-routes.mjs` di scratchpad (101/101) - 390 & 1280, keenam kartu:
    From/To kepasang bener (baca `value` `<select>` native + label tombolnya), harga
    kebaca (bukan em dash), Book Now nyala, halaman scroll BALIK ke atas & picker keliatan,
    reset arah sesudah swap, halaman gak melar, dan tab Transfer di /programs ikut jalan.
    Plus harga airport = Rp450.000 / $26 di kartu DAN di picker, dua mata uang.
  - **Gotcha harness**: `#tp-from` itu `<select>` native yang kesembunyi. `textContent`
    grup-nya kebaca "SelectUbud" (placeholder + daftar opsi) - pakai `.value`-nya, atau
    label di tombol `[aria-haspopup="listbox"]`. Dan katalog WAJIB di-stub
    (`**/api/pricing/catalog*`), kalau nggak semua harga em dash & Book Now mati - itu
    bukan bug, itu emang state "API belum jawab".

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

## Our Company + My Trips = SATU CANGKANG RAIL (Sep 2026)
Wayan: "gua mau sidebar sticky, page my trip dan our company akan menggunakan layout yang
sama ... gua mau page our company kayak page email di desktop, memiliki stiky sidebar dan
sidebarnya kelihatan strong dengan konten di tengah". Dia pilih **opsi A** dari sheet 3 rail,
terus **HP-3** dari sheet 3 bentuk HP.
- **Cangkangnya = KOMPONEN, `components/ui/RailLayout.jsx`** (class-nya di `railClasses.js`).
  Dipakai **`OurCompany.jsx` DAN `MyTripsCart.jsx`**. Yang wajib sama itu **URUTAN + PERILAKU**
  (rail lalu konten; di HP daftar lalu section; back ngapus jejak), dan itu gak bisa dijaga cuma
  dengan berbagi string - alasan yang persis sama kenapa `DetailHero` & `FormHero` ada.
  State-nya dipegang pemanggil: Our Company nyetir section dari hash URL, My Trips cuma tab.
- **Tab horizontal lama My Trips (`MTC_TABS`/`mtcTab`) UDAH DIHAPUS** - rail-nya yang jadi tab
  sekarang. Dijaga harness (`hasOldTabs`), biar gak diem-diem balik lagi jadi dobel.
- **DESKTOP = satu kotak berbingkai**: rail cream 248px di kiri + kolom konten putih.
  Baris aktif = **pill putih terangkat** (bg putih + border + `--shadow-sm`) - rail-nya udah
  cream, jadi "keangkat keluar dari tint" itu yang kebaca sebagai kepilih.
  - **Rail-nya gak punya tinggi sendiri.** Dia flex child di `items-stretch`, jadi cream-nya
    otomatis ngisi setinggi kotak; yang `sticky` itu MENU di dalamnya. Jangan kasih
    `h-[100vh-...]` ke rail-nya - itu bug lama yang bikin lubang putih di halaman pendek.
- **JEBAKAN BESAR: `overflow-hidden` DI FRAME BIKIN `position:sticky` MATI TOTAL.**
  Elemen sticky nempel ke **scroll container terdekat**, dan `overflow:hidden` bikin frame-nya
  JADI scroll container - jadi menunya ke-scroll ikut halaman, gak pernah pin di bawah header.
  Diem-diem aja, gak ada error. Pakai **`overflow-clip`**: sama-sama motong cream ke sudut
  bunder, TAPI gak bikin scroll container. (Safari <16 jatuh ke `visible` = sudutnya kotak,
  halamannya tetep jalan.) Ke-tangkep `verify-rail`, mata gak bakal nyadar.
- **Rail baca `--header-h` (live), BUKAN `--header-h-max`** - dia harus NEMPEL ke bawah
  navbar. Padding-top halamannya tetep `--header-h-max` (aturan lama, jangan ketuker).
- **HP (<=992px) = rail JADI LAYAR PERTAMA** ("HP-3"): mendarat = daftar 6 section full-width
  + chevron, tap -> kontennya kebuka + baris **back**. Yang kebawa dari desktop cuma ISINYA
  (ikon, pemisah About/Legal, label section), bukan bentuknya - di 390px gak ada ruang kolom.
  - **`reading` state WAJIB `false` di initial state**, hash dibaca di `useEffect`. Ini static
    export, satu HTML dipakai HP & desktop - nilai yang cuma ada di browser bikin render
    pertama beda sama hasil pre-render.
  - **Navbar -> `/our-company.html` (tanpa hash) = mendarat di DAFTAR**; **footer -> `#faq`
    dkk = mendarat LANGSUNG di kontennya**, gak lewat daftar. Itu disengaja & dijaga harness.
  - **Back ikut ngapus hash** (`replaceState` ke pathname): kalau nggak, reload atau link
    yang di-share bakal diem-diem buka lagi section yang barusan ditinggal.
- **6 section TETEP di DOM semua** (crawler baca semuanya), cuma satu yang keliatan lewat
  atribut `hidden` - itu pola lama, jangan diganti jadi conditional render.
- **GOTCHA `<span>` pemisah grup**: `h-px` di elemen **inline** gak ngegambar apa-apa. Di rail
  desktop dia kebetulan keliatan (parent-nya `flex`, jadi ke-blockify); di daftar HP parent-nya
  div biasa, jadi **garisnya ilang diam-diam**. WAJIB `block`.
- **Tombol "Chat on WhatsApp" di rail = `w-full`**, bukan inline. Label 16 karakter di kolom
  248px itu cuma sejengkal dari nyembul keluar kartu - di-stretch = failure mode-nya ilang,
  bukan ditambal angka pas-pasan. Di HP balik `inline-flex` (kartunya lebar).
- Verifikasi: **`verify-rail.mjs`** di scratchpad (99/99) - desktop 1024/1280/1440: rail 248 &
  cream & setinggi frame, menu **beneran pin di `--header-h` sesudah di-scroll**, konten gak
  nabrak rail, prosa <=720, baris aktif putih+border, garis pemisah keliatan, tombol help
  1 baris & gak nyembul kartunya, 6 section di DOM, halaman gak melar. HP 320/390/430: mendarat
  di daftar, tap = konten + back + hash, back = balik ke daftar + hash bersih, deep link
  `#terms` langsung ke konten, garis pemisah keliatan, gak melar.
  - **Gate-nya dites pakai 3 bug aslinya** (overflow-hidden, span inline, rail 228px).
  - **PELAJARAN harness**: assertion "lebar rail == 248" itu **tautologi** - dia cuma ngulang
    angka yang gua set sendiri, dan pas rail 228 dia "nangkep" bug yang salah. Yang beneran
    ngukur itu **containment** (`btn.right <= card.right - padding`). Versi pertama cek-nya
    `scrollWidth-clientWidth` di TOMBOLNYA - dan itu selalu 0, karena `whitespace-nowrap`
    bikin tombolnya melar keluar KARTU, bukan overflow ke dalam dirinya sendiri. Jadi dia
    lapor lolos di 248 padahal masih nyembul 2.7px. **Kalau assertion-nya cuma ngulang angka
    yang lu tulis, itu bukan tes.**

- **Total + Make Payment TETEP DI DALAM KONTEN** (Sep 2026, Wayan pilih "3" dari 3 opsi;
  yang ditolak: naro di rail kiri, atau bikin kolom ketiga). Jadi rail-nya MURNI buat pindah
  section - jangan taro aksi/harga di situ.
- **LAYAR PERTAMA DI HP BEDA, dan itu disengaja**: Our Company buka di **daftar**, My Trips buka
  **langsung di keranjang** (`reading` initial `true`). My Trips punya default yang jelas dan
  tamu yang dateng buat bayar gak boleh disuruh nge-tap menu dulu; Our Company gak punya
  default. Back tetep nyampe ke daftar di dua-duanya. Cangkangnya sama, pintu masuknya beda.
- **`<h1>` "My Trips" ditaro DI ATAS frame**, bukan di kolom konten - dia nyebut seluruh
  halaman, dan ketiga section duduk di bawahnya; di dalam kolom dia bakal kebaca kayak judul
  satu section. Our Company gak punya h1 halaman (tiap section punya sendiri).

**PELAJARAN HARNESS (2 lagi, dari sesi yang sama):**
- **Ngadu PIXEL antar-halaman itu bukan ngadu cangkang.** Cek drift gua sempat lapor
  "stickTop 58 vs 91" sebagai beda - padahal dua-duanya nulis `var(--header-h)` yang sama;
  angkanya beda karena My Trips PUNYA trip bar ("Saved on this device only") dan Our Company
  `null`. Yang bener: cek **aturannya** (`stickTop == --header-h` halaman itu sendiri),
  bukan samain angkanya antar-halaman.
- **Sabotase buat nguji gate bisa GAGAL NYALA tanpa lu sadar.** Gua tes cek drift dengan
  nambahin `w-[200px]` di samping `w-[248px]` - harness lapor 151/151, dan gua nyaris nyimpulin
  cek-nya rusak. Padahal dua utility itu **specificity-nya sama**, jadi yang menang urutan CSS
  hasil generate, dan sabotasenya emang gak pernah ke-render. Pakai **inline `style`** kalau mau
  maksa beda - baru ke-tangkep (lebar + warna dua-duanya kelaporan.


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
- **BARIS DRAWER = PILL + IKON, bentuknya DIPINJEM dari rail** (Sep 2026). Wayan pilih
  **"B"** dulu dari sheet 3 opsi (sekarang / B / B+ikon) sambil bilang "tombol X nya
  hilangin" - terus dia **ngirim balik screenshot mock A: "gua mau ini"**, jadi yang
  jadi itu **A**: ikon per baris + tombol × + currency turun. Yang berlaku = A.
  **BELUM DI MAIN** - ada di branch `claude/role-definition-d9kvwl` (Wayan: "jangan di
  push live dulu"). Kalau catatan ini kebaca tapi kode-nya gak ada, berarti branch-nya
  belum di-merge.
  - Geometri baris **+ ukuran ikon** = **`MENU_ROW_BOX` di `railClasses.js`**, string yang
    SAMA dipakai `railMobileItem`. Ukuran ikon ikut masuk situ karena Lucide tanpa ukuran
    eksplisit nge-render 24px - jadi "baris menu" & "ikonnya segede apa" satu keputusan,
    bukan dua tempat yang bisa kelewat. Drawer dulu teks polos yang hover-nya cuma ganti warna, padahal
    rail Our Company & My Trips barisnya udah pill - satu web, dua macem baris menu.
    Yang travel cuma BENTUK; warna & ukuran teks tetep punya masing-masing.
  - Baris halaman aktif = **pill cream + semibold** (tepat 1 baris). Hover ngasih pill yang
    sama **cuma di desktop** - Tailwind mbungkus `hover:` di `@media (hover:hover)`, jadi
    layar sentuh gak nyangkutin state hover. Itu bener, jangan "dibenerin".
  - **Badge & chevron ke tepi KANAN** (`ml-auto`): badge keranjang dari 216px dari tepi
    drawer jadi ≤14px. Baris My Trip juga berhenti nulis salinan class-nya sendiri (dia cuma
    beda karena bawa badge), jadi sekarang dia ikut nyala pas lagi di `/my-trips`.
  - **Tiap `<li>` ditarik keluar 12px (`-mx-3` = `NAV_LI`)**, karena padding 12px punya
    pill bakal nggeser SEMUA label ke kanan dan gak lurus lagi sama baris Welcome di atasnya.
    Diukur: tepi kiri label **100px @390 / 962px @1280, sebelum = sesudah**. Submenu Program
    nyerep 12px yang sama (`pl-[1.65rem]`) biar sub-item tetep 36px dari tepi drawer -
    **ganti `NAV_LI` = ganti itu bareng.**
  - **IKON per baris**: House · Compass (Program) · BookOpen (Guide) · ShoppingBag (My Trip,
    sama kayak ikon keranjang di navbar) · **Building2** (Our Company - ikon yang PERSIS
    dipakai rail Our Company buat section "About Us") · Settings. Semuanya 16px
    (`--icon-sm`) lewat `MENU_ROW_BOX`, `strokeWidth={1.7}`.
    - **Tepi kiri yang jadi patokan sekarang IKON-nya**, bukan label: ikon mendarat di
      100px @390 / 962px @1280 (persis di tempat label dulu), label-nya geser ke 126/988.
      Jadi barisnya tetep lurus sama baris Welcome di atasnya.
  - **TOMBOL × di baris Welcome** (34×34, border `--line`, radius `--r-md`). Sebelum ini
    drawer **gak punya penanda tutup sama sekali**: hamburger-nya **ketutupan drawer**
    (diukur - drawer `fixed right-0` z-120 lawan header z-100, hit-test di tengah hamburger
    pas drawer kebuka mendarat di elemen DI DALAM drawer, di 390 DAN 1280), jadi morph
    hamburger→X itu gak pernah keliatan selama menu kebuka. Tutupnya cuma tap scrim/Escape.
    - Dia **gak nulis `transition` buat scale** - biar press feedback global di `style.css`
      yang kepakai (aturan SNAP di `check-motion`).
  - **CURRENCY PICKER TURUN ke kolom field** (gabung Guests/Pickup, label "Currency").
    Itu yang bikin ruang buat ×: diukur, 4 benda di baris Welcome (268px) bikin namanya
    **wrap 2 baris (65→77px)** atau kepotong jadi "Welcom…". Dia juga emang milik sini -
    currency itu preferensi trip kayak guests & pickup, dan di search form homepage
    ketiganya udah sebaris. Pakai **`variant="default"`**, bukan `"navbar"`: tombolnya
    sama persis, cuma tanpa `ml-auto flex-none` yang gunanya buat duduk di kanan.
    - **Efek samping yang bagus**: di **320px** baris Welcome dulu wrap (77px) walau belum
      ada × - sekarang 1 baris, 65px di 320 DAN 390.
  - **Yang GAK ditiru dari drawer Flowbite** (sumber idenya): drawer dari kiri (hamburger
    kita di kanan), baris 32px (kita 39px = ukuran jempol), `h-screen` (kita `100dvh`,
    itu yang tahan chrome browser HP muncul-ilang).
  - **HAMBURGER KETUTUPAN DRAWER** (diukur, bukan dugaan): drawer `fixed right-0` z-120,
    hamburger di header z-100 di tepi kanan - hit-test di tengah hamburger pas drawer kebuka
    mendarat di elemen DI DALAM drawer, di 390 DAN 1280. Jadi morph hamburger→X itu **gak
    keliatan** selama menu kebuka, dan sekarang **gak ada penanda tutup sama sekali** di dalam
    drawer (tutupnya: tap scrim / Escape). Wayan udah tau & milih gitu.
  - Verifikasi: **`verify-drawera.mjs`** (350/350) di 320/390/768/1280/1440 × 5 halaman:
    tiap baris punya ikon 16px & ikonnya satu tepi kiri, tepat 1 pill & bener halamannya,
    radius `--r-md`, baris ≥38px, badge/chevron ≤14px dari kanan, **tepat 1** tombol close
    34×34 & di-klik beneran nutup drawer, currency ada di kolom field & BUKAN di baris
    Welcome, nama Welcome 1 baris & gak kepotong & row-nya 65px, submenu 36px, gak melar.
    (`verify-drawerb.mjs` = versi opsi B, udah gak berlaku.)
    Plus **rail-nya diadu before/after: 17 baris × 2 lebar, IDENTIK** (dia cuma minjemin
    string, jadi wajib nol geser).
  - **Sisa yang BUKAN dari perubahan ini**: `isActive('/')` cuma cocok sama pathname `/`,
    jadi kalau ada yang mendarat di `/index.html` baris Home gak nyala (nol link internal
    ke situ, jadi praktis gak ada efeknya). Belum ditanyain ke Wayan.
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
  (bulat/avatar), `2px`/`3px` (bar tipis), `0`. (Contoh lama buat `2px`/`3px` itu underline
  judul section - **udah gak ada**, lihat "Judul section" di Design system.)
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
  **Date picker = POPUP ke-center DI SEMUA LEBAR** (Sep 2026) — bukan dropdown nempel field, dan
  **bukan bottom-sheet di HP lagi**: `DateField` DAN `DatePopup` sekarang pakai `panelBookdate` yang
  sama (lihat "SATU BENTUK PANEL TANGGAL SE-WEB" di section jadwal jam). Dropdown biasa (select)
  tetep bottom-sheet di HP / nempel field di desktop — yang disatuin cuma panel TANGGAL.
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
  - **KEBUKA CUMA DI ATAS, arah scroll gak ngaruh** (Sep 2026, Wayan: "Gas A bro").
    `scrollY > 80` = nutup, titik. Animasinya `grid-template-rows` **0fr ↔ 1fr**
    (anaknya `overflow-hidden`) — gak usah ngukur tinggi apa pun.
    - **Dulu**: nutup pas scroll turun, **balik pas scroll naik** (+ ambang jitter 6px).
      Bukanya itu yang bikin loncatan pas Wayan scroll balik ke atas ngelewatin hero:
      header tumbuh **53 → 86px**, dan strip tab sticky dipatok ke `--header-h`, jadi
      strip-nya **turun sendiri 33px dalam ~150ms** sementara konten di belakangnya
      tetep jalan ikut scroll. Diukur di scrollY yang SAMA PERSIS (1400 dua kali):
      strip pindah **53 → 68px** padahal halamannya gak gerak sama sekali.
    - Sekarang header **satu tinggi buat seluruh scroll** — yang nempel ke dia gak
      pernah gerak di tengah halaman. Strip emang baca `--header-h` (bukan
      `--header-h-max`) supaya nempel tanpa celah pas bar-nya kebuka di atas; itu
      sebabnya tingginya gak boleh berubah pas lagi di tengah halaman.
    - Verifikasi: **`verify-tripbar-a.mjs`** di scratchpad (54/54) — 390 & 1280 di
      4 jenis halaman: bar kebuka pas mendarat (scrollY 0), nutup lewat 80px, balik
      pas balik ke atas, `--header-h` **beku** selama scroll naik ngelewatin hero,
      `--header-h-max` gak gerak sama sekali, dan yang paling penting: elemen yang
      dipatok ke `--header-h` **drift ≤1px di scrollY yang sama**. Gate-nya udah
      dites pakai bug aslinya (handler lama dibalikin → 12 gagal, drift 15px).
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
      **deposit $10** — Wayan, 20 Sep 2026). Nambah janji baru = tanya Wayan dulu.
    - **Deposit = `$10` FLAT di SELURUH web** (Wayan, 20 Sep 2026 — dulu 20%, sebelumnya
      10%; disapu 35 tempat di 13 file: FAQ, Terms + kebijakan refund, Charter, Transfer,
      Airport, About, 2 guide, Itinerary, metaDesc 7 tour, JSON-LD). **Sekarang ADA
      logikanya di server** — `payment.js` di `cahyana-api` (`DEPOSIT_USD`), di-mirror
      `lib/payment.js` di sini, dan dua-duanya diadu `node tools/check-pay-agree.mjs`
      (600 kombinasi + 5 rail). Jadi copy bukan lagi satu-satunya tempat angkanya hidup:
      **ganti angkanya = ubah `DEPOSIT_USD` di API, mirror-nya di sini, TERUS sapu copy-nya**.
      Sapuannya `grep -rn "\$10 deposit"` dan kerjain SEMUA sekaligus; jangan cuma bar-nya,
      nanti web ngomong dua angka beda.
      - **Flat, gak ngikut area jemput.** Pernah ada draft spek yang bikin depositnya
        $5 di Ubud / $15 di luar — **dibuang** (Wayan: "tidak ada area yang bergantung
        deposit"). Yang ngikut area itu **pickup fee**, dan itu di `pricing.js`.
        Dipatok `paypal-flow-test.js` ("deposit is flat, outside Ubud").
      - **JANGAN kesapu**: `(save 10%)` di `TransferPicker` — itu diskon return trip,
        BUKAN deposit (dipatok `pricing-spec-test`: "return is 2x less 10%"). Makanya pola
        sapuan WAJIB di-anchor ke kata "deposit", bukan ke angka telanjang.
    - **Bayar penuh GAK dapet diskon dan GAK ngubah window batal** (Wayan, 20 Sep 2026).
      Yang dijual: gak usah bawa cash, gak usah ke money changer, bayar pakai mata uang
      sendiri di kurs yang keliatan. **Batal gratis tetep 24 jam buat SEMUA booking.**
      Sempat dirancang "48 jam buat yang bayar penuh" — **salah arah, dibuang**: notice
      lebih panjang itu deadline lebih KETAT, bukan lebih longgar, jadi malah ngehukum
      tamu yang bayar paling banyak. Kalau nemu ide ini lagi, ini jawabannya.
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
  - **Charter**: 5 jam 600k (`half`) · 10 jam 1jt (`full`) · **12 jam 1,12jt (`long`)** ·
    tambahan 60k/jam. **`long` BUKAN angka baru**: 1.120.000 = `full` + 2 × 60k, jadi dia
    tetep keiket ke tarif per jam (dipatok `pricing-spec-test`). Ditulis sebagai tarif sendiri
    di `CHARTER` biar usd-nya diturunin dari IDR-nya sendiri ($64), bukan dijumlah dari dua
    angka usd yang dua-duanya udah dibulatkan ke atas (57 + 2×4 = **65**, salah 1 dolar).
    `extHourIdr` tetep kepakai buat jam yang LEWAT dari yang di-book.
    - **`extended` UDAH GAK DIJUAL** (Sep 2026, Wayan: "jangan pakai extended pakai 12 jam
      aja yang max") — tapi branch-nya di `charterPrice` **JANGAN dihapus**: keranjang yang
      ke-simpen sebelum perubahan ini masih bawa `dur:"extended"` di localStorage tamu, dan
      tanpa branch itu row-nya dihargain **0**.
  - **Airport – Ubud = Rp450.000** (Wayan, Sep 2026 - naik dari Rp300.000). Mata uang lain
    diturunin sendiri (`usd = ceil(450000/17600) = $26`), jadi yang diubah CUMA `idr` di
    `prices.transfer` (`cahyana-api/pricing-data.js`). Salinan di CUE yang ikut disapu:
    `content/shared/transfer.js` (`priceFallback` kartu route) + `components/sections/home/
    Airport.jsx` (`fallback` band homepage). **Dua-duanya di luar jangkauan `check-prices`**
    (dia cuma nyisir `listings.js`) - itu sebabnya band homepage sempet nulis $20 padahal
    API bilang $18. Ganti harga transfer lagi = sapu tangan ketiga tempat itu.
    - **Efek sampingan yang disengaja**: surcharge pickup = 60% harga transfer, jadi pickup
      di bandara buat tour ikut naik **180k -> 270k**. Itu turunan otomatis dari satu angka,
      bukan angka kedua yang bisa di-tune sendiri.
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
    - **Hitungan harga = `useCharterTier({ area })`**, di-export dari file yang sama —
      list-nya pakai buat tiap baris, halaman pakai buat total di ringkasan & gerbang tombol
      Book. Satu rumus, gak bisa melenceng.
      - **DIA GAK NGITUNG APA-APA LAGI** (Sep 2026): tiap panjang yang dijual punya tarifnya
        sendiri di katalog (`half`/`full`/`long`), jadi dia cuma NYARI, bukan nambahin jam ke
        tarif yang lebih pendek. Versi lama nambah `extra × charterExtraHour` di atas `full`,
        jadi halaman & server dua-duanya ngitung satu harga dan bisa beda satu langkah
        pembulatan (57 + 2×4 = 65 lawan `ceil(1120000/17600)` = 64).
      - **Surcharge pickup juga dari katalog** (`charterSurcharge.display`). Dulu ke-hardcode
        `isIdr ? 100000 : 7` di sini: **7-nya udah melenceng** dari 6 yang bener, DAN buat tamu
        yang bayar AUD/EUR/GBP dia nambahin 7 mata uang MEREKA ke harga yang udah dikonversi.
        Ini kesalahan yang SAMA yang dulu bikin `CharterHome` nulis "+\$7" (lihat catatan
        `charterSurcharge` di `pricing.js`) — muncul dua kali, sekarang gak ada angka
        surcharge yang ke-tulis di CUE sama sekali.
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
  - **PAKET KETIGA = "12 Hours", BUKAN "Extended" LAGI** (Sep 2026, Wayan: "di charter kita
    ganti konsep bro, jangan pakai extended pakai 12 jam aja yang max"). Efeknya:
    - **Field "Extra hours" UDAH DIHAPUS** dari kolom input, bareng state `extra`,
      `EXTRA_HOURS`, dan `extra` di row yang ke-simpen. Yang lama itu bikin harga baris
      belum ketauan sampai tamu milih DUA hal, jadi kartunya gak bisa nyebut harganya
      sendiri. Blok tetap bisa.
    - `dur` barunya **`'long'`** (bukan `'twelve'`), nyamain nama tarif di API.
    - Sub-baris "12 hours · around 140 km · per car up to 5" — **140 km itu 12 km/jam yang
      SAMA** kayak dua baris lain (5j/60, 10j/120), bukan angka yang dibulet-buletin sendiri.
    - Nama **"12 Hours"** sengaja beda pola dari "Full Day"/"Half Day": itu justru yang
      ngebedain dia, dan "Long Day" kebaca terlalu mirip "Full Day" pas di-scan. Kalau Wayan
      mau nama day-part, tinggal ganti `name` di `content/shared/charter.js`.
    - Draft homepage yang nyimpen `dur:"extended"` **gak bikin error**: builder & homepage
      dua-duanya nge-cek `CHARTER.durations.some(...)` dulu, jadi jatuh ke Full Day.
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
    `headingVariant="company"`). `CHARTER.notes` + `planTerms` UDAH DIHAPUS.
  - **Isinya = 2 BARIS KOTAK** (Sep 2026, Wayan: "pakai kolom termasuk yang dibawahnya how
    charter works dan lagi satunya"), lewat blok prose baru `{ type: 'boxes', items: [...] }`:
    - Baris 1 = **What's included | Not included** · Baris 2 = **How the day works |
      What a day can cover**. **"Charter or guided tour?" NUMPUK DI KOLOM KIRI**, di bawah
      "How the day works" (Sep 2026, Wayan pilih opsi a dari 3 opsi buat ngeratain baris itu).
      Dulu dia heading selebar kartu DI BAWAH baris — jadi ada ~80px putih di bawah kolom
      kiri **terus masih ada konten lagi**, dan putih di tengah baris kebaca kayak bolong.
      Numpuk di kiri, kolom kirinya jadi yang paling panjang, jadi putih sisanya (**62px**,
      diukur) mendarat di UJUNG kartu di sebelah padding bawahnya sendiri.
      - Caranya: item baris `boxes` boleh isi **`stack: [...]`** = dua blok di satu sel grid
        (`Prose.jsx`). Item biasa gak kesentuh, jadi transfer & airport gak berubah.
      - **Di HP urutan bacanya DIJAGA**: pembungkus stack-nya `max-[768px]:contents`, jadi di
        bawah 768 dua blok itu jadi grid item sendiri dan yang belakangan dapet
        `order-last` — urutannya tetep How → What a day can cover → Charter or guided tour?,
        persis kayak waktu dia masih heading di bawah baris. Tanpa itu catatan penutupnya
        nyempil di TENGAH di HP.
    - **Pasangannya dipilih dari TINGGI, bukan topik**: penjelasan 3-paragraf & daftar 7 ide
      rute itu dua blok yang tingginya paling mirip, jadi kotaknya mendarat rata. Kalau
      nambah/ngurangin isi salah satunya, cek lagi pasangannya — kotak stretch, yang pendek
      bakal nyisain ruang kosong.
    - Tiap item: `{ title, variant?, paras?, list? }`. `variant:'no'` = di-tint cream +
      teks muted. Tanpa variant = kotak putih biasa (itu yang dipakai 2 kotak penjelasan).
    - **Teksnya UDAH dirapihin** (Sep 2026, Wayan: "gass rapihin text kontenya bro") — layout
      duluan, copy belakangan, sesuai urutan yang dia minta. Yang diubah:
      - **Sub hero**: klausa kedua dulu slogan ("go anywhere, stop anywhere, at your own
        pace"), diganti fakta yang kepake ("You choose the route, your driver knows the roads").
      - **"How the day works" 150 → ~85 kata**, 3 paragraf panjang jadi 4 paragraf pendek.
        Teks itu ditulis waktu blok-nya masih selebar kartu; sekarang dia **kolom sempit**,
        jadi kalimat panjang bikin baris-barisnya numpuk. **Gak ada fakta yang dibuang**:
        jam, km, no fixed route, jam tambahan di tarif per jam, deposit $10, peringatan macet
        semuanya masih ada. Yang ilang cuma bantalannya ("stop for photos, pull over for lunch
        at a warung" = sama aja sama "decide as you go") dan "driver collects you at your
        accommodation" (udah ada di Included, jadi dobel).
      - Baris Included/Not included dipendekin per baris (kolomnya sempit, tiap baris yang
        wrap = nambah tinggi), dan "Charter or guided tour?" 5 kalimat jadi 4.
      - **Opsi "3 langkah bernomor" buat How the day works GAK JADI DIPAKAI.** Itu dirancang
        waktu blok-nya masih KOTAK; sekarang dia kolom polos, dan paragraf pendek udah kebaca.
        Masih bisa dipasang kalau Wayan mau — tinggal bilang.
      - Patokan copy-nya tetep: nol em-dash, nol kata glorify, **"$10 deposit"** ditulis persis
        (itu anchor sapuan kalau angkanya berubah).
  - Verifikasi kotak Included/penjelasan = **`verify-infoboxes.mjs`** (152/152) — nyisir
    charter + transfer + airport di 390/767/768/1024/1280: gak ada marker/bullet sisa; garis
    rambut CUMA di pasangan include/exclude (gak ada di baris terakhir, gak ada sama sekali di
    kotak lain); bingkai CUMA di pasangan itu juga; kotak "not" di-tint; 2 kolom dari 768 ke
    atas & numpuk di bawahnya; halaman gak melar; DAN **bentuk kotak 3 halaman itu identik**
    (border/radius/padding/gaya judul/gaya baris) — itu yang nahan mereka melenceng lagi.
  - Verifikasi: **`verify-charter.mjs`** di scratchpad (145/145, list-nya sendiri dijaga `verify-charterhome`) — 320/390/430/768: list di ATAS
    field, cuma 1 tombol Book & posisinya di BAWAH field, nama paket 1 baris, harga ada di KIRI
    di bawah nama & gak pernah wrap & ≥22px & gelap (bukan amber), cuma baris kepilih yang
    punya pita "Selected" (warna CTA, gak kepotong) + di-tint cream, halaman gak melar. Desktop: harga pindah ke KANAN nama
    dan tiga-tiganya **berhenti di garis yang sama**. Ikon info: catatan surcharge
    GAK ke-print di halaman, nongol pas di-tap, ngambang di ATAS form (hit-test), **gak nyorong
    apa pun** (tinggi dokumen & posisi tombol Book gak gerak), gak kepotong tepi layar, Escape nutup. Desktop 1024/1280/1440: list di KIRI field
    & dua kolomnya mulai sejajar. Plus: tap baris = pindah pilihan,
    tombol mati sebelum 4 field keisi, kicker kosong → "Total" pas area kepilih, yang
    ke-book = paket yang KEPILIH (bukan yang pertama), dan mendarat di My Trips.
    - **`verify-charter.mjs` & `verify-charterhome.mjs` ILANG dari scratchpad** (scratchpad
      itu per-sesi). Yang ada sekarang: **`verify-r3.mjs`** (232/232, 390/768/1024/1280/1440)
      — dia nutup bagian yang kena perubahan Sep 2026: 3 paket & NOL field Extra hours,
      harga 12 jam 1.120.000 (dan 1.220.000 kalau pickup Canggu, dari katalog), kicker
      "Total", halaman charter & section homepage nyebut angka yang SAMA, serah-terima
      12 Hours dari homepage, plus form airport & picker transfer. Assertion lama soal
      bentuk kartu (pita, harga kiri/kanan, 1 baris) **belum ada penggantinya** — kalau
      nyentuh `charterPlanClasses`, tulis ulang harness-nya dulu.
  - **Gotcha harness**: "harga ada di samping/bawah nama" DOANG gak cukup — assertion itu lolos
    waktu namanya keremes jadi 2 baris. Ukur **nama-nya juga**: `tinggi/line-height == 1` +
    `scrollWidth == clientWidth`, dan harganya juga (1 baris). Itu yang nangkep bug badge di 320px.
  - **Gotcha harness**: span harga bawa utility `PLAN_PRICE_LEAD`, **bukan class `.price`** —
    nyari `.price` hasilnya nihil. Sama juga `.info__list--yes/--no` & `.info__card`: udah
    di-migrasi ke utility, jadi cek hasilnya (warna li yang di-mute) bukan nama class-nya.
  - **Gotcha harness**: mata uang default situs = **IDR**, jadi stub katalog WAJIB `symbol:'Rp'`;
    kalau di-stub `'$'` harness-nya ngukur "$1.000.000" — string yang gak pernah dilihat tamu.

## POPUP KONFIRMASI = 2 STEP (Sep 2026, Wayan)
Wayan: *"kalo misalnya ada input dan summary mending bikin 2 step bro, pertama step input
kedua summarynya"*. `BookConfirmModal` dulu satu layar panjang: field DI ATAS, terus
ringkasan yang nyetak ulang Guests/Date/Time/Flight — **data yang sama ke-print dua kali di
satu layar**, dan di kasus airport isinya 926px di layar 844px (**scroll 285px**, ke-ukur).
- **Step 1 = isi · Step 2 = cek & book.** Judul **"Booking Confirmation"** di bawah logo di
  **dua-duanya** (itu nama popup-nya, bukan nama satu layar), plus bar + "Step N of 2".
- **"Edit details" di PALING BAWAH**, di bawah Book Now + WhatsApp, dan **text link bukan
  tombol** — tiga tombol setumpuk kebaca kayak tiga pilihan sederajat padahal Book Now yang
  utama. Dia juga yang satu-satunya jalan balik ke step 1, dan isian yang udah diketik
  **gak ilang** pas balik.
- **Step 2 nunjukin BALIK kontak tamu** (Name/Phone/Email/Pick-up). Dulu nggak: tamu ngetik
  email terus gak pernah lihat lagi apa yang dia ketik sebelum nekan Book.
- **Kotak fakta 2x2 UDAH DITOLAK** (Wajan: "gua ga ngerti maksud lu yang ada di dalam box
  dibawah itu"). Step 2 pakai **baris label-nilai** (`ROW`) yang emang udah dipakai modal ini
  — nol bentuk baru buat dipelajarin.
- **Field jangan dipasangin 2 kolom.** Pasangan Phone|Email itu dibikin buat ngalahin scroll;
  2 step udah nyelesaiin itu, jadi pasangannya cuma nyisain ongkos: di **320px** placeholder
  `e.g. +61 412 345 678` **kepotong 31px** (ke-ukur). Semua field selebar penuh = nol kepotong.
- **Daftar "Trip details" KEBUKA default**, gak di balik accordion lagi — di ambang bayar,
  daftar apa yang di-book gak boleh kesembunyi. **Lewat 4 baris dia balik ke accordion**:
  ke-ukur, keranjang 5 baris butuh **scroll 45px @320px**, 6 baris 96px.
- Ruang sisa (ke-ukur, judul + Edit details udah dihitung): step 1 134–272px · step 2
  89–124px · My Trip step 2 **41px @320**. **Nol scroll sampai 4 baris keranjang.**

**STEP 3 ITU UTANG, dan sekarang KEPAKAI** (22 Sep 2026). Checkout dinyalain buat semua
tamu di hari yang sama (`PAY_DEFAULT = true`), jadi **pilihan bayar sekarang ikut di step 2
buat SEMUA orang** — dan itu nge-override patokan "nol scroll" yang jadi alasan popup ini
dipecah. Ke-ukur **sesudah blok bayar dirapiin** (695→492px, lihat bawah): step 2 butuh scroll
**514px @390 · 710px @320 · 432px @768** (booking 1 baris; keranjang 3 baris ~sama).
Sebelum dirapiin angkanya 717 / 954 / 554 — jadi merapikan blok itu motong ~200px di
tiap lebar, dan sisanya cuma bisa diberesin step 3. Perilakunya utuh — 101 assertion `verify-flow`
lolos, yang merah **cuma** jatah scroll. Jawabannya bukan nambal geometri lagi: **isi → cek →
bayar**, tiga step. Wayan udah dikasih angkanya; belum dibikin.
- **Jangan setel ulang jatah scroll harness biar ijo.** Merah-nya itu tanda utang ini masih ada.

**BLOK PILIHAN BAYAR = 492px, dan JANGAN digedein lagi** (22 Sep 2026, Wayan:
"rapikan blok pilihan bayar"). Dulu **695px @390 / 893px @320** dalam kotak 820px.
Yang dipotong, semuanya tanpa ngilangin fakta:
- **Baris opsi referral GAK di-render kalau kodenya belum valid.** Doc ini udah nulis
  opsi itu "cuma nongol kalau kodenya valid" dan `payOptions` udah nandain
  `available: !!hasReferral` — komponennya doang yang masih gambar dia abu-abu, makan
  **114px @390 / 154px @320** buat baris yang gak bisa dipakai tamu. Penjelasan apa itu
  tetep ada di panel `InfoDot` sebelah judulnya.
- **Sub baris "Pay in full" dipendekin** (dulu 4 baris @390). Versi panjangnya UDAH
  ketulis di `PAY_COPY.optionsInfo` di balik ikon info yang sama, jadi barisnya cukup
  bawa 2 fakta yang nentuin. **Konsekuensi yang disengaja & udah diputusin Wayan
  ("biarin")**: frasa "no money changer" gak eksplisit lagi di baris itu.
- **Baris deposit dulu nulis "on the day" DUA KALI** — sub-nya udahan gitu, terus
  kalimat saldo di belakangnya ngulang.
- **Opsi yang kepilih tapi udah gak available otomatis balik ke `deposit`.** Celah ini
  kebuka gara-gara barisnya disembunyiin: `hasReferral` bisa balik `false` pas quote
  di-refresh tanpa kodenya, jadi `'referral'` nyangkut kepilih tanpa ada apa pun di
  layar yang nunjukin, dan submit minta diskon yang gak keliatan. Server tetep ngitung
  sendiri, tapi tamu wajib bisa lihat apa yang dia bayar.

**KERANJANG DIKOSONGIN PAS KARTU KE-CHARGE, bukan pas webhook mendarat.** `onSuccess` (yang
`save({days:[],...})` di `MyTripsCart`) dipanggil dari `onPaid` punya `PayPalCheckout`.
- **Kenapa bukan webhook**: sempat gitu, dan itu bolong — `/api/booking-status` belum ke-deploy,
  jadi poll-nya 404, fase `paid` gak pernah dateng, dan tamu yang **beneran bayar** keranjangnya
  gak pernah kosong: dia bisa bayar dua kali buat trip yang sama.
- **Kenapa bukan pas submit** (perilaku sebelum ini): dengan pembayaran nyala, booking ke-simpen
  `pending` SEBELUM kartu disentuh, jadi tamu yang nutup layar bayar kehilangan seluruh trip-nya.
- Capture itu titik yang bener: duitnya udah keluar dari kartu & booking-nya udah ada di server;
  webhook cuma ngasih tau kita. Batal di layar bayar = capture gak kejadian = keranjang utuh.

**TANGGAL + JAM DI SEMUA KASUS** (Wayan: *"date dan time harus ada di semua popup, gunakan
date dan time yang kita buat tadi, kalo user udah pilih berarti auto fill dan bisa di set ulang"*):
- Pakai **`DateField withTime`** yang sama kayak seluruh web (popup kalender + `TimeChoice`
  di footer), ke-seed dari baris yang masuk dan bisa di-set ulang.
- **Field "Pickup Time" yang berdiri sendiri UDAH DIHAPUS** (bareng `needsTime` & import
  `Select`). Dia cuma ada buat nutup satu kasus yang dateng tanpa jam; sekarang jamnya
  dijawab kontrol tanggalnya. **Jangan dibalikin** — itu dua kontrol buat satu pertanyaan.
- **`lineDT` = state PER BARIS** (`[{date,time}]`), bukan satu field. Alesannya sama kayak
  `itemTimes` di keranjang: satu kontrol cuma bisa bener buat baris PERTAMA. My Trip dapet
  satu kontrol per baris, label = nama programnya.
- **Airport CUMA 1 kontrol tanggal**, dan itu **`DateTimeField` (menit asli)**, bukan
  `DateField` grid 30 menit: pesawat mendarat 2:35 PM. `dateOf()`/`timeOf()` nurunin
  tanggal & jam baris itu dari `flightDatetime`. Nambah "Date & time" kedua di situ = balik
  ke bug yang Wayan udah suruh benerin di halaman airport ("ada 2 kolom date, itu gak bener").
- **Validasi tanggal/jam PER BARIS, bukan di schema.** `bookingSchema` cuma punya SATU field
  `time`, jadi keranjang dulu **gak pernah ditanya sama sekali**; sekarang `needsTime:false`
  dan tiap baris dicek sendiri (`dtErr`). Schema tetep yang pegang field kontak.
- `payload()` nulis `date: dateOf(l,i)`, `time: timeOf(l,i)` — tiap baris nerusin punyanya
  sendiri. Daftar field yang kekirim **gak berubah** (17 key, dijaga harness).

**GEOMETRI KOTAKNYA = `SHELL_WIDE` + `BOX_WIDE`, bukan `SHELL`/`BOX`.** Gutter **12px**
(dulu 24) dan padding **20px** (dulu 32) — itu separuh "A" yang Wayan pilih, dan sempat
KETINGGALAN: layout-nya kepasang, geometrinya nggak, jadi prediksi mock "sisa 41px" gak pernah
kejadian (keranjang 3 baris scroll **106px @390 / 200px @320**). Sesudah 12/20: **19px / 98px**.
Di-scope ke popup ini, BUKAN ke `SHELL`/`BOX` — dua itu dipakai bareng modal review/auth/
konfirmasi dan belum pernah diukur di geometri yang lebih rapat. `ModalPresence` sekarang
nerima `shellClass`.
- **`max-h` = `calc(100dvh-24px)`, JANGAN `95vh`.** `95vh` itu 802px dari layar 844px padahal
  shell cuma butuh gutter 12px-nya — **42px nganggur buat nahan 18px**. Cara nemunya: scroll-nya
  **18px yang SAMA di 390 dan 768**; angka identik di dua lebar itu nandain plafon, bukan teks
  yang wrap. `dvh` bukan `vh` (chrome browser HP gerak).
- **Sisa yang JUJUR, gak bisa diberesin geometri**: di **320px** tujuh logo pembayaran turun
  jadi 2 baris = **+38px**, dan itu seluruh sisa overflow-nya. Ngecilin/ngurangin logo di
  step 2 belum ditanyain ke Wayan.

**Verifikasi: `verify-flow.mjs` di scratchpad (108/108)** — kelima kasus lewat **My Trips**,
keranjangnya di-seed ke localStorage: bentuk step 1 + autofill per kasus, nomor & jam
penerbangan ke-autofill, judul, Edit details paling bawah & beneran balik ke step 1 tanpa
ngilangin isian, transfer tanpa jam **DITAHAN** di step 1 + dikasih alasan, jam baris ke-2
diganti **gak nggeser** baris ke-1, 3 baris kekirim dengan 3 jam sendiri + daftar field utuh
(17 key), layar tunggu ke-lock (nol tombol tutup, Escape gak nutup) & beneran nanya server &
resolve ke confirmed, dan mismatch **gak pernah** ngaku confirmed.
- Jatah scroll di-assert **per lebar**, bukan ambang yang diturunin biar ijo: booking 1 baris
  **0px @390/768**, ≤45px @320 (logo pembayaran wrap); keranjang 3 baris ≤25px @390/768,
  ≤110px @320.
- **JEBAKAN HARNESS (4, semuanya mahal, semuanya ketangkep gara-gara harness-nya salah duluan):**
  1. **Stub katalog salah bentuk** — item itu `{standard:{display}}`, bukan `{price:{display}}`.
     `Price.jsx` throw pas hydration → **seluruh tree React ilang** → semua selector nol, dan
     harness-nya **nyalahin aplikasi**. Sekarang `page.on('pageerror')` bikin run MERAH.
  2. **Nama item ngarang** — `'Batur Sunrise Trekking'` gak ada di katalog (aslinya
     **`'Mount Batur Trekking'`**), dan nama yang gak cocok **diem-diem** jatuh ke jendela
     siang. Persis bahaya yang ditulis di section jadwal jam.
  3. **Alurnya salah dari awal** — harness pertama nge-klik Book di halaman detail dan nungguin
     modal yang gak pernah muncul: `BookSidebar` ngoper `onBook`, jadi tombol itu **nyimpen ke
     keranjang + pindah ke /my-trips**. `openBooking({type:'tour'})` di `BookingForm` **cuma
     kepakai di `/ui-kit`** — nol pemakai di alur tamu.
  4. **Selector tanggal ngarang** — tombol hari itu `button[aria-pressed]` (gak ada
     `data-day`), dan tanggal lampau `disabled`, jadi fallback `.nth(12)` nge-klik tombol mati.
- **Dites pakai bug aslinya**: `payload()` dibalikin ngirim `l.time` (jam yang dibawa baris,
  bukan yang tamu set) → assertion "tiap baris bawa jamnya sendiri" nyala.

**TEMUAN ALUR (2 bug asli, ketemu pas NGE-JALANIN alurnya, bukan pas baca diff):**
1. **Jam baris TRANSFER ilang di keranjang** (bug LAMA). Editor tanggal My Trips nyimpen
   `transfers[i].time` dengan bener, tapi yang mbangun baris keranjang cuma baca balik jam
   **charter** — transfer kelewat. Rantainya: kartu gak nyetak jamnya · buka lagi editornya
   kosong · **checkout ngirim jam kosong buat tiap transfer**. Ke-sembunyi selama ini karena
   popup lama cuma nanya jam kalau barisnya TUNGGAL; keranjang isi banyak gak pernah ditanya.
   Validasi per-baris yang baru yang bikin dia nongol. Perbaikannya 1 baris di `MyTripsCart`.
2. **Keranjang dikosongin SEBELUM dibayar.** `onSuccess` (yang `save({days:[],...})`) jalan
   begitu booking ke-simpen — dan dengan pembayaran nyala, booking ke-simpen **`pending`**
   sebelum kartu disentuh. Jadi tamu yang nutup layar bayar **kehilangan seluruh trip-nya** dan
   nyisa booking pending yang gak pernah dibayar. Sekarang dia nunggu duitnya cair
   (`onConfirmed` di `PayWaiting`). Dengan pembayaran MATI perilakunya **byte-identik**.

## LAYAR TUNGGU SESUDAH BAYAR — `PayWaiting.jsx` (Sep 2026, Wayan)
Wayan: *"setelah user bayar, selagi menunggu email masuk dan backend nerima notif dari
webhook, lock layar dan kasi loading dan tulisan sambil menunggu, tapi background nya itu
foto destinasi auto slide"*.
- **Kenapa perlu**: kartu ke-charge BUKAN booking-nya confirmed. Yang nandain `paid` +
  ngirim email itu **webhook** (`confirmPayment` di cahyana-api). Di antara dua momen itu
  modal dulu nampilin "Payment received" — ngaku lebih dari yang kita tau.
- **Dia NANYA ke server, bukan ngitung detik**: `GET /api/booking-status/:ref` tiap 4 detik,
  nyerah di 2 menit. Spinner di atas timer itu cuma bisa bohong atau muter selamanya.
- **Ke-LOCK beneran selagi nunggu**: nol tombol tutup, `CLOSE` modal-nya ke-hide, `onClose`
  punya `ModalPresence` di-nol-in (`paid ? () => {} : closeBooking`), body ke-lock.
  **Escape gak nutup** (dijaga harness). Tombol baru nongol kalau udah ada yang bener
  buat dibilang.
- **4 keadaan, semuanya jujur**: `paid` → "Booking confirmed" · `mismatch` → "We need to
  check this payment" + WhatsApp (**gak pernah ngaku confirmed**) · lewat 2 menit → "Still
  confirming" + boleh ditutup · **nol token** → "Payment sent" (gak bisa nanya dari device
  itu, jadi bilang apa adanya, bukan muter).
- **Foto = `content/shared/waitPhotos.js`**, 5 foto destinasi yang **udah ada di web**
  (Lempuyang, Ulun Danu, Jatiluwih, Tirta Gangga, Tegenungan). **JANGAN pakai
  `imageForProgram()`** — dia import seluruh `LISTINGS`, dan modal ini ke-mount di SEMUA
  halaman (jebakan yang sama kayak `TripBar` + `TOUR_CONTENT`).
- Yang ke-mount cuma slide sekarang + berikutnya, jadi 5 file gak di-fetch bareng.
  `prefers-reduced-motion` → fotonya **diem** di yang pertama.
- **Gak bisa nyampe sini tanpa `?pay=1`** — `PAY_DEFAULT` masih `false`.

## Pembayaran online (checkout) — Sep 2026
Tamu sekarang bisa bayar di halaman kita sendiri. Ini bagian yang kalau salah angka
= duit beneran, jadi aturannya lebih ketat dari bagian lain.

**Tiga opsi, satu sumber aturan:**
- `cahyana-api/payment.js` = SATU-SATUNYA tempat aturan deposit/diskon hidup. Dia
  **gak tau apa-apa soal PayPal/DOKU** — provider yang nanya ke dia, bukan sebaliknya.
- `CUE/lib/payment.js` = **cermin tampilan** (apa yang tamu LIHAT sebelum commit).
  Dua-duanya diadu `node tools/check-pay-agree.mjs` (600 kombinasi + 5 rail, harus
  `beda: 0`). **Ubah satu = ubah dua-duanya**, kalau nggak gate-nya merah.
- Opsinya: `deposit` ($10 flat) · `full` (100%, NOL diskon) · `referral` (5% off,
  cuma nongol kalau kodenya valid).

**Rail: IDR → DOKU, selain itu → PayPal** (`cahyana-api/providers.js`, cermin
`CUE/lib/rails.js`). **PayPal gak bisa settle rupiah sama sekali** — itu alasan
DOKU ada, bukan preferensi.
- **DOKU UDAH DIBANGUN, TAPI MASIH MATI** (Sep 2026). Server-nya lengkap
  (`cahyana-api/doku.js` + `doku-routes.js`, detailnya di CLAUDE.md sana); di sini
  saklarnya **`DOKU_READY = false` di `lib/rails.js`**. Selama itu false, booking IDR
  jatuh ke PayPal dalam USD dan tamunya **dikasih tau di layar sebelum ngetik kartu**
  (`noteFor()` → satu baris di `PaymentStep`).
  - **Nyalainnya = `DOKU_READY = true` + env DOKU di Railway.** Dua-duanya, bareng:
    flag nyala tanpa env = tamu dapet 503 "belum switched on" (di-handle, tapi jelek);
    env nyala tanpa flag = rail-nya gak pernah kepilih.
  - **Jangan nyalain sebelum satu pembayaran sandbox beneran tembus.** Alasannya persis
    sama kayak `PAY_DEFAULT` dulu, dan itu bukan teori — lihat section saklar pembayaran.
- **Bentuk DOKU BEDA dari PayPal, dan itu ngubah alurnya**: halaman DOKU itu **hosted**,
  jadi tamu **KELUAR** dari situs. Konsekuensi yang gampang kelewat:
  - **`DokuCheckout` GAK PUNYA `onPaid`** dan **gak ngosongin keranjang**. Pergi ke DOKU
    itu bukan bayar; tamu yang berubah pikiran di sana harus masih punya trip-nya.
  - Yang ngosongin keranjang = **`onConfirmed` punya `PayWaiting`**, dipanggil pas server
    bilang `paid`. Prop itu **opsional** — rail inline gak ngasih apa-apa, jadi jalur
    PayPal byte-identik.
  - **Jalan baliknya `/my-trips.html?ref=CUE-0xx`** (dari `SITE_URL` di server).
    `MyTripsCart` baca `?ref` **di `useEffect`** (static export — aturan yang sama kayak
    `charterDraft`/`payFlag`) terus nge-render `PayWaiting` yang SAMA. Balik dari DOKU =
    layar tunggu yang sama persis kayak bayar inline, bukan layar kedua yang harus
    dipelajarin lagi.
  - Tombol **back** ngapus `?ref` (`replaceState`) — kalau nggak, reload bakal mbuka lagi
    layar yang barusan ditutup.
- Verifikasi frontend: **`dokuui.mjs`** di scratchpad (9/9, dijalanin dengan
  `DOKU_READY` sementara di-`true`): di IDR yang ke-render **DOKU, bukan PayPal** (nol
  iframe PayPal), tombolnya nyebut bayar, `create-payment` ke-panggil bawa
  **ref + option doang TANPA nominal**, dan tamunya beneran dianterin ke URL hosted-nya.
  Dites pakai keadaan sebaliknya: `DOKU_READY = false` → 3 assertion langsung merah.
- `doku.js` sengaja **NOLAK jalan**, bukan pura-pura sukses: `configured()` false
  dan tiap fungsi throw. Rail pembayaran yang diem-diem no-op itu bug terburuk yang
  bisa ada di repo ini — tamu ngira udah bayar, kita ngira belum.
- Begitu DOKU nyala, `/api/paypal/create-order` **NOLAK** booking IDR (409
  `wrong_rail`). Dipatok `paypal-flow-test.js` — jadi placeholder-nya beneran
  nyambung, bukan hiasan.

**Aturan yang gak boleh dilanggar:**
1. **Nominal GAK PERNAH dateng dari browser.** Browser cuma ngirim `booking_ref` +
   `option`. Server baca harga yang DIA sendiri simpen, terus `payment.js` yang
   mutusin. Dipatok tes "browser amount ignored".
2. **Status jadi `paid` CUMA di webhook**, gak pernah dari frontend dan gak pernah
   dari respons capture doang. Webhook verifikasi signature DULU, terus adu
   **nominal DAN mata uang**; beda sedikit → `status = 'mismatch'`, tetep belum
   dibayar. Email konfirmasi juga dikirim dari webhook, bukan pas booking dibuat.
3. **Data kartu gak pernah nyentuh state React atau server kita** — Card Fields itu
   iframe punya PayPal. Itu yang bikin kita di luar scope PCI. Jangan bikin input
   kartu sendiri.
4. **Secret cuma di env Railway**, gak pernah di kode frontend atau di git.
   `PAYPAL_ENV` yang kosong = **sandbox**, bukan live (di `paypal.js`) — default yang
   salah di sini artinya duit beneran ke-charge waktu lagi ngetes.
5. `express.json({ verify })` nyimpen `rawBody` buat cek signature. **Jangan**
   serialisasi ulang body yang udah di-parse — signature-nya langsung invalid.

**Habis nyentuh checkout, jalanin:**
`node tools/check-pay-agree.mjs` (di CUE) + `node tools/paypal-flow-test.js` (di
cahyana-api, 26 assertion, stub PayPal & DB tapi server Express-nya beneran nyala).
Kalau yang berubah COPY-nya: `pay-copy.mjs` di scratchpad — buka modal booking
beneran di USD & IDR terus baca teksnya (nol janji 48 jam, window 24 jam masih
disebut, baris full jualan harinya bukan diskon, peringatan settle-USD cuma nongol
di IDR).

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

### Nge-jalanin situs lokal
- **`npm run dev` GAK BISA dipakai buat klik-klik situs ini.** Semua link internal
  diakhiri `.html` (`/ubud-tour.html`) - itu yang ditulis static export, dan yang
  dipakai canonical + sitemap + 56 redirect. `next dev` nyajiin `/ubud-tour` dan
  jawab **404** buat bentuk `.html`-nya (`/tour.html` malah **500**), jadi di dev
  **tiap kartu yang diklik mendarat di halaman error**. Itu BUKAN bug situsnya.
  - Buat klik-klik atau tes checkout: **`npm run build && npm run serve`**
    (= `node tools/serve-out.js`, port 4000) - nyajiin `out/` persis kayak
    Hostinger, jadi yang dites emang artefak yang bakal di-deploy.
  - Diadu langsung: `/ubud-tour.html` -> **200** di serve-out, **404** di dev.
  - `next dev` tetep berguna buat hot reload waktu ngoding satu komponen; yang
    gak bisa cuma navigasi antar-halaman.

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

### Saklar pembayaran (`lib/payFlag.js`)
- **NYALA buat semua tamu sejak 22 Sep 2026** (`PAY_DEFAULT = true`). Dinyalain baru
  setelah rantainya kebukti ujung-ke-ujung pakai duit beneran (CUE-013): PayPal
  capture → webhook nyampe → nominal & mata uang dicek → `paid` → dua email, semuanya
  **di detik yang sama**, tanpa disentuh.
  - **Kenapa dulu MATI**: checkout itu kode yang udah kelar jauh sebelum dia jadi
    produk yang kelar. Tamu yang ketemu form bayar yang belum dibuktiin =
    **booking yang hilang diam-diam** — dia gak bisa bayar, booking nyangkut
    `pending`, email konfirmasi gak kekirim (email nungguin webhook). Itu bukan
    teori: dua pembayaran live pertama kejadian persis gitu, gara-gara webhook-nya
    kedaftar di app PayPal yang beda (detailnya di CLAUDE.md `cahyana-api`).
  - **Matiin lagi buat semua orang** = balikin `PAY_DEFAULT` ke `false`. `?pay=0`
    cuma matiin di SATU browser.
- **`?pay=1` / `?pay=0`** di URL mana pun = paksa nyala/mati **buat browser itu doang**,
  ke-simpen di localStorage. Gotcha yang sempet bikin bingung: sekali lu buka pakai
  `?pay=1`, SEMUA halaman di browser itu ikut nyala — termasuk link yang diketik
  manual tanpa query. Itu bukan bocor ke tamu; localStorage itu per browser per
  device. Cara ngecek tampilan tamu: **Incognito**.
- **MATI = perilaku lama PERSIS**: `pay_option` dikirim kosong → server ngitung
  gak ada yang ditagih → booking langsung `new` (confirmed) + 2 email kekirim, dan
  modalnya balik nunjukin layar "Booking Received!" yang lama.
- **Dibacanya di `useEffect`, JANGAN di initial state** — static export, paint
  pertama harus sama persis sama HTML hasil pre-render (aturan yang sama kayak
  `charterDraft`).
- **Jaring pengamannya di backend**: cron tiap jam (`sweepStuckPayments`) nyisir
  pembayaran yang duitnya cair tapi webhook-nya gak nyampe, terus nyelesein sendiri
  + ngabarin owner. Dipasang SEBELUM saklar ini dinyalain, alasannya: tamu yang
  nyangkut gak bakal lapor, dia cuma pergi. Jangan matiin cron itu selama
  `PAY_DEFAULT` true.
- Verifikasi: **`payflag.mjs`** di scratchpad (10/10) — dua keadaan diadu di halaman
  hasil build beneran: step-nya nongol/nggak, `pay_option` yang KEKIRIM, dan layar
  akhir sesudah submit. Habis flip, harapannya dibalik juga: default = NYALA,
  `?pay=0` = perilaku lama persis. Ganti `PAY_DEFAULT` = **update harness-nya bareng**,
  kalau nggak dia ngetes keadaan yang udah gak ada.
  - **Harness ini KE-PATAHIN dua kali sama kerjaan orang lain** (22 Sep 2026), dan
    dua-duanya BUKAN bug produksi — jadi kalau dia merah, **cek dulu dia masih bisa
    nyetir form-nya**:
    1. Popup jadi **2 step**, jadi harness yang nge-klik "Book now" langsung gak pernah
       nyampe — sekarang dia harus pencet **Continue** dulu & mastiin "Step 2 of 2".
       Pilihan bayar ada di **step 2**, jadi cuma kebaca dari situ.
    2. Halaman tumbuh **input tanggal KEDUA**, jadi nge-set yang pertama doang ngisi form
       yang salah dan `book()` balik diem-diem tanpa mbuka apa-apa. Sekarang di-set semua.
  - **POLANYA yang penting**: waktu patah, **SEMUA assertion merah, termasuk `?pay=0`
    yang gak nyentuh flag sama sekali**, dan layar akhirnya "NO MODAL". Merah yang rata
    kayak gitu = harness keilangan alurnya. Kalau flag-nya yang beneran rusak, yang merah
    cuma sisi NYALA-nya (udah dibuktiin: `PAY_DEFAULT=false` → 4 merah, sisi `?pay=0`
    tetep ijo).
