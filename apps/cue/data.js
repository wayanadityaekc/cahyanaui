/* ==================================================================
   DATA HARGA & KONFIG ANGKA - Cahyana Ubud Experience
   ------------------------------------------------------------------
   File ini SATU-SATUNYA tempat ngolah harga & tarif:
   - prices          : harga jual semua program (USD + IDR)
   - CHARTER         : tarif charter (half/full/extra jam/surcharge)
   - transport       : biaya transport per aktivitas
   - TICKETS         : harga tiket masuk per orang (IDR, turis asing)
   - TOUR_TICKETS    : tiket yang di-cover Exclusive tiap tur
   - EXCLUSIVE_FEE   : fee internal Exclusive (JANGAN tampil di UI)
   - CURRENCIES dkk  : kurs & simbol mata uang
   Habis ngubah harga: node tools/sync-prices.js, lalu bump ?v= di
   semua halaman (data.js & script.js dimuat dengan versi yang sama).
   File ini WAJIB dimuat SEBELUM script.js di tiap halaman.
   ================================================================== */

// -- pricing data
// Nyembunyiin sebuah program dari situs (homepage/listing/related/suggested) TANPA hapus
// datanya: tambahin `active: false` di entry-nya di bawah (pola sama kayak PROMO.active).
// Default aktif kalau field-nya nggak ada. Balikin ke true (atau hapus field-nya) buat
// nampilin lagi di semua tempat - nggak perlu ubah apa-apa lagi. Render logic-nya di
// script.js (isProgramActive + initInactivePrograms, initRelated, relatedUpsellHTML,
// suggestState). Nggak ngefek ke harga/booking - link langsung ke halamannya tetep jalan.
const prices = {
  tour: { "Ubud Tour": { usd: 45, idr: 700000 }, "Lempuyang & Tirta Gangga": { usd: 55, idr: 850000 }, "Besakih & Taman Ujung": { usd: 60, idr: 950000 }, "Tanah Lot & Taman Ayun": { usd: 50, idr: 780000 }, "Ulun Danu Beratan & Handara Gate": { usd: 60, idr: 950000 }, "Jatiluwih Rice Terrace Tour": { usd: 45, idr: 700000 }, "Bali Hidden Beaches and Cliffs": { usd: 45, idr: 700000 }, "Banyumala & Twin Lakes": { usd: 55, idr: 850000 }, "Munduk Waterfall Tour": { usd: 55, idr: 850000 } },
  experience: { "ATV": { usd: 40, idr: 620000 }, "Rafting": { usd: 35, idr: 550000 }, "Swing": { usd: 25, idr: 400000 }, "Jeep Sunrise": { usd: 50, idr: 780000 }, "Mount Batur Trekking": { usd: 55, idr: 850000 }, "Cooking Class": { usd: 35, idr: 550000 }, "Watersport": { usd: 45, idr: 700000 }, "Bali Zoo": { usd: 40, idr: 600000 }, "Bali Bird Park": { usd: 28, idr: 430000 } },
  performance: { "Kecak Dance": { usd: 10, idr: 150000 }, "Barong Dance": { usd: 10, idr: 150000 } },
  transfer: { "Airport – Ubud": { usd: 20, idr: 300000 }, "Denpasar Area – Ubud": { usd: 20, idr: 300000 }, "Tanah Lot Area – Ubud": { usd: 30, idr: 450000 }, "Canggu Area – Ubud": { usd: 28, idr: 430000 }, "Kuta Area – Ubud": { usd: 25, idr: 400000 }, "Amed Area – Ubud": { usd: 45, idr: 700000 }, "Buleleng Area – Ubud": { usd: 50, idr: 780000 }, "Candidasa Area – Ubud": { usd: 38, idr: 580000 }, "Kintamani Area – Ubud": { usd: 30, idr: 450000 }, "Seminyak Area – Ubud": { usd: 30, idr: 450000 } },
  villa: { "Cahyana Tibuah": { usd: 80, idr: 1250000 }, "Cahyana House": { usd: 95, idr: 1480000 } },
  combo: { "Ubud Culture Day": { usd: 55, idr: 850000 }, "Uluwatu & Sunset Kecak": { usd: 55, idr: 850000 }, "GWK & Pandawa Beach": { usd: 55, idr: 850000 }, "Batur Sunrise & Adrenaline": { usd: 85, idr: 1300000 }, "Ubud Rafting Adventure": { usd: 75, idr: 1150000 }, "Ubud ATV Adventure": { usd: 80, idr: 1250000 }, "Kintamani Sunrise & Penglipuran": { usd: 85, idr: 1300000 }, "Lovina Dolphin & Sekumpul Waterfall": { usd: 95, idr: 1450000 } },
  // Standalone destinations (halaman Destinations). Harga PLACEHOLDER - CEK WAYAN.
  place: { "Uluwatu Cliff Temple": { usd: 45, idr: 700000 }, "Tanah Lot Sunset Temple": { usd: 45, idr: 700000 }, "Besakih - The Mother Temple": { usd: 45, idr: 700000 }, "Tirta Empul Holy Water Temple": { usd: 45, idr: 700000 }, "Goa Gajah - The Elephant Cave": { usd: 45, idr: 700000 }, "Gunung Kawi Temple": { usd: 45, idr: 700000 }, "Lempuyang Temple - Gates of Heaven": { usd: 45, idr: 700000 }, "Ulun Danu Beratan Lake Temple": { usd: 45, idr: 700000 }, "Taman Ayun Royal Temple": { usd: 45, idr: 700000 }, "Pura Batuan Temple": { usd: 45, idr: 700000 }, "Garuda Wisnu Kencana (GWK)": { usd: 45, idr: 700000 }, "Ubud Royal Palace & Art Market": { usd: 45, idr: 700000 }, "Penglipuran Village": { usd: 45, idr: 700000 }, "Handara Gate": { usd: 45, idr: 700000 }, "Tirta Gangga Water Palace": { usd: 45, idr: 700000 }, "Taman Ujung Water Palace": { usd: 45, idr: 700000 }, "Tegalalang Rice Terrace": { usd: 45, idr: 700000 }, "Jatiluwih Rice Terraces": { usd: 45, idr: 700000 }, "Tegenungan Waterfall": { usd: 45, idr: 700000 }, "Git Git Waterfall": { usd: 45, idr: 700000 }, "Sekumpul Waterfall": { usd: 45, idr: 700000 }, "Banyumala Twin Waterfall": { usd: 45, idr: 700000 }, "Munduk Coffee Highlands": { usd: 45, idr: 700000 }, "Buyan & Tamblingan Twin Lakes": { usd: 45, idr: 700000 }, "Pandawa Beach": { usd: 45, idr: 700000 }, "Balangan Beach": { usd: 45, idr: 700000 }, "Bingin Beach": { usd: 45, idr: 700000 }, "Green Bowl Beach": { usd: 45, idr: 700000 }, "Tegal Wangi Beach": { usd: 45, idr: 700000, active: false }, "Sacred Monkey Forest Sanctuary": { usd: 45, idr: 700000 }, "Sangeh Monkey Forest": { usd: 45, idr: 700000 }, "Ubud Traditional Market": { usd: 45, idr: 700000 }, "Ubud Arts & Crafts": { usd: 45, idr: 700000 } }
};

// ===== Pickup surcharge (diturunkan dari harga transfer) - CEK WAYAN =====
// Opsi pickup = destinasi yang ADA di prices.transfer (nggak bikin list baru).
// Surcharge = 60% harga transfer one-way (Ubud->area), PER MOBIL, cuma dikenakan kalau
// pickup != Ubud DAN zona pickup != zona item. Angkanya nggak pernah tampil di UI
// (cuma di popup konfirmasi). Ganti 0.6 di sini buat tune di satu tempat.
const SURCHARGE_FACTOR = 0.6;
// Zona tiap area pickup (buat cek "pickup area == tour area"). Key = key di prices.transfer.
const TRANSFER_ZONE = { "Airport – Ubud": "south", "Denpasar Area – Ubud": "south", "Seminyak Area – Ubud": "south", "Kuta Area – Ubud": "south", "Canggu Area – Ubud": "south", "Tanah Lot Area – Ubud": "west", "Kintamani Area – Ubud": "kintamani", "Buleleng Area – Ubud": "north", "Amed Area – Ubud": "east", "Candidasa Area – Ubud": "east" };
const ITEM_ZONE = { "Uluwatu Cliff Temple": "south", "Tanah Lot Sunset Temple": "west", "Besakih - The Mother Temple": "east", "Tirta Empul Holy Water Temple": "ubud", "Goa Gajah - The Elephant Cave": "ubud", "Gunung Kawi Temple": "ubud", "Lempuyang Temple - Gates of Heaven": "east", "Ulun Danu Beratan Lake Temple": "west", "Taman Ayun Royal Temple": "west", "Pura Batuan Temple": "ubud", "Garuda Wisnu Kencana (GWK)": "south", "Ubud Royal Palace & Art Market": "ubud", "Penglipuran Village": "ubud", "Handara Gate": "west", "Tirta Gangga Water Palace": "east", "Taman Ujung Water Palace": "east", "Tegalalang Rice Terrace": "ubud", "Jatiluwih Rice Terraces": "west", "Tegenungan Waterfall": "ubud", "Git Git Waterfall": "north", "Sekumpul Waterfall": "north", "Banyumala Twin Waterfall": "north", "Munduk Coffee Highlands": "north", "Buyan & Tamblingan Twin Lakes": "west", "Pandawa Beach": "south", "Balangan Beach": "south", "Bingin Beach": "south", "Green Bowl Beach": "south", "Tegal Wangi Beach": "south", "Sacred Monkey Forest Sanctuary": "ubud", "Sangeh Monkey Forest": "ubud", "Ubud Traditional Market": "ubud", "Ubud Arts & Crafts": "ubud", "Ubud Tour": "ubud", "Lempuyang & Tirta Gangga": "east", "Besakih & Taman Ujung": "east", "Tanah Lot & Taman Ayun": "west", "Ulun Danu Beratan & Handara Gate": "west", "Jatiluwih Rice Terrace Tour": "west", "Bali Hidden Beaches and Cliffs": "south", "Banyumala & Twin Lakes": "north", "Munduk Waterfall Tour": "north", "Ubud Culture Day": "ubud", "Uluwatu & Sunset Kecak": "south", "GWK & Pandawa Beach": "south", "Batur Sunrise & Adrenaline": "kintamani", "Ubud Rafting Adventure": "ubud", "Ubud ATV Adventure": "ubud", "Kintamani Sunrise & Penglipuran": "kintamani", "Lovina Dolphin & Sekumpul Waterfall": "north" };

// Charter mobil 
// extended = full day + jam tambahan, + surcharge kalau pickup di luar Ubud.
const CHARTER = {
  half: { usd: 35, idr: 500000 },
  full: { usd: 60, idr: 900000 },
  extHourUsd: 4,
  extHourIdr: 60000,
  surchargeUsd: 7,
  surchargeIdr: 100000
};

const transport = {
  "ATV": { usd: 3, idr: 50000 }, "Rafting": { usd: 3, idr: 50000 }, "Swing": { usd: 3, idr: 50000 },
  "Jeep Sunrise": { usd: 7, idr: 100000 }, "Mount Batur Trekking": { usd: 7, idr: 100000 },
  "Cooking Class": { usd: 0, idr: 0 }, "Kecak Dance": { usd: 0, idr: 0 }, "Barong Dance": { usd: 0, idr: 0 },
  "Watersport": { usd: 0, idr: 0 } // PLACEHOLDER - transport Watersport (Tanjung Benoa jauh dari Ubud), Wayan isi
};

// Exclusive tour: SUPLEMEN TIKET PER ORANG (angka PLACEHOLDER - Wayan isi harga asli).
// Standard = jasa driver aja, tiket TIDAK termasuk (= harga di `prices`, per mobil).
// Exclusive = harga standard (per mobil) + suplemen ini × jumlah orang.
// Nama key HARUS sama persis dg key di `prices.tour` / `prices.combo`.
// -- Harga tiket masuk PER ORANG (IDR, turis asing) - riset awal 2026, Wayan koreksi.
//    Sumber tunggal buat suplemen Exclusive; fact chip di halaman attraction ikut angka ini.
const TICKETS = {
  "Tegalalang": 25000,
  "Tirta Empul": 75000,
  "Gunung Kawi": 50000,
  "Goa Gajah": 50000,
  "Tegenungan": 20000,
  "Monkey Forest": 80000,           // weekend 100k - dihitung pakai weekday
  "Lempuyang": 100000,              // incl. shuttle
  "Tirta Gangga": 75000,
  "Taman Ujung": 75000,
  "Besakih": 150000,                // incl. shuttle + sarong
  "Taman Ayun": 30000,
  "Sangeh": 30000,
  "Ulun Danu Beratan": 75000,
  "Handara Gate": 50000,
  "Jatiluwih": 50000,
  "Tanah Lot": 75000,
  "Watersport Package": 300000,     // paket dasar Tanjung Benoa - CEK WAYAN
  "GWK": 125000,
  "Pandawa": 25000,
  "Melasti": 10000,
  "Tegal Wangi": 10000,             // parkir/retribusi lokal - CEK WAYAN
  "Green Bowl": 15000,              // parkir + akses tangga - CEK WAYAN
  "Balangan": 10000,                // parkir/retribusi - CEK WAYAN
  "Bingin": 15000,                  // retribusi lokal - CEK WAYAN
  "Twin Lakes Viewpoint": 25000,
  "Banyumala": 50000,
  "Munduk Waterfall": 20000,
  "Gitgit": 20000,
  "Barong Batubulan": 100000,
  "Pura Batuan": 15000,             // donasi
  "Kecak Ubud": 100000,
  "Padang Padang": 15000,
  "Uluwatu Temple": 50000,
  "Kecak Uluwatu": 150000,
  "Batur Trek + Breakfast": 400000, // guide + sarapan - CEK WAYAN
  "Batur Hot Spring": 200000,
  "Ayung Rafting": 350000,          // harga operator dalam tur - CEK WAYAN
  "ATV Ride": 450000,               // CEK WAYAN
  "Bali Zoo": 400000,               // gate rate - CEK WAYAN
  "Bali Bird Park": 385000,         // CEK WAYAN
  "Jeep Sunrise": 400000,           // per orang, share jeep - CEK WAYAN
  "Penglipuran": 50000,
  "Lovina Boat": 150000,
  "Banjar Hot Spring": 40000,
  "Sekumpul Trek": 200000
};

// -- Tiket apa aja yang ke-cover versi Exclusive tiap tur (stop gratis nggak masuk).
//    Catatan: swing di Ubud Tour & dinner Jimbaran = opsional, sengaja di luar.
const TOUR_TICKETS = {
  "Ubud Tour": ["Tegalalang", "Tirta Empul", "Gunung Kawi", "Goa Gajah", "Monkey Forest"],
  "Lempuyang & Tirta Gangga": ["Lempuyang", "Tirta Gangga"],
  "Besakih & Taman Ujung": ["Besakih", "Taman Ujung"],
  "Tanah Lot & Taman Ayun": ["Tanah Lot", "Taman Ayun"],
  "Ulun Danu Beratan & Handara Gate": ["Ulun Danu Beratan", "Handara Gate"],
  "Jatiluwih Rice Terrace Tour": ["Jatiluwih"],
  "Bali Hidden Beaches and Cliffs": ["Green Bowl", "Balangan", "Bingin"],
  "Banyumala & Twin Lakes": ["Twin Lakes Viewpoint", "Banyumala"],
  "Munduk Waterfall Tour": ["Munduk Waterfall", "Gitgit"],
  "Ubud Culture Day": ["Barong Batubulan", "Pura Batuan", "Kecak Ubud"],
  "Uluwatu & Sunset Kecak": ["Uluwatu Temple", "Kecak Uluwatu"],
  "GWK & Pandawa Beach": ["GWK", "Pandawa"],
  "Batur Sunrise & Adrenaline": ["Batur Trek + Breakfast", "Batur Hot Spring"],
  "Ubud Rafting Adventure": ["Ayung Rafting", "Tegalalang", "Tegenungan"],
  "Ubud ATV Adventure": ["ATV Ride", "Bali Zoo", "Bali Bird Park", "Tegenungan"],
  "Kintamani Sunrise & Penglipuran": ["Jeep Sunrise", "Penglipuran", "Tirta Empul"],
  "Lovina Dolphin & Sekumpul Waterfall": ["Lovina Boat", "Banjar Hot Spring", "Sekumpul Trek"]
};

// -- Fee internal Exclusive (JANGAN pernah ditampilkan ke user) & kurs tiket IDR->USD.
const EXCLUSIVE_FEE = 0.10;
const TICKET_IDR_PER_USD = 15500;

// -- Suplemen Exclusive per orang, DITURUNKAN dari TICKETS (bukan angka lepas lagi).
//    Key = penanda tur mana yang punya toggle Standard/Exclusive.
const tourExclusive = {};
Object.keys(TOUR_TICKETS).forEach(function (tour) {
  const idr = TOUR_TICKETS[tour].reduce(function (sum, t) { return sum + (TICKETS[t] || 0); }, 0);
  tourExclusive[tour] = { idr: idr, usd: idr / TICKET_IDR_PER_USD };
});

// Standalone place (halaman Destinations): Standard = mobil aja, Exclusive = + tiket masuk
// tempat itu (per orang, dari TICKETS). Peta place -> key TICKETS. Yang gratis = 0 (toggle
// tetap tampil, harga sama). Angka tiket PLACEHOLDER dari riset - CEK WAYAN.
const PLACE_TICKET = {
  "Uluwatu Cliff Temple": "Uluwatu Temple", "Tanah Lot Sunset Temple": "Tanah Lot",
  "Besakih - The Mother Temple": "Besakih", "Tirta Empul Holy Water Temple": "Tirta Empul",
  "Goa Gajah - The Elephant Cave": "Goa Gajah", "Gunung Kawi Temple": "Gunung Kawi",
  "Lempuyang Temple - Gates of Heaven": "Lempuyang", "Ulun Danu Beratan Lake Temple": "Ulun Danu Beratan",
  "Taman Ayun Royal Temple": "Taman Ayun", "Pura Batuan Temple": "Pura Batuan",
  "Garuda Wisnu Kencana (GWK)": "GWK", "Penglipuran Village": "Penglipuran",
  "Handara Gate": "Handara Gate", "Tirta Gangga Water Palace": "Tirta Gangga",
  "Taman Ujung Water Palace": "Taman Ujung", "Tegalalang Rice Terrace": "Tegalalang",
  "Jatiluwih Rice Terraces": "Jatiluwih", "Tegenungan Waterfall": "Tegenungan",
  "Git Git Waterfall": "Gitgit", "Sekumpul Waterfall": "Sekumpul Trek",
  "Banyumala Twin Waterfall": "Banyumala", "Munduk Coffee Highlands": "Munduk Waterfall",
  "Buyan & Tamblingan Twin Lakes": "Twin Lakes Viewpoint", "Pandawa Beach": "Pandawa",
  "Balangan Beach": "Balangan", "Bingin Beach": "Bingin", "Green Bowl Beach": "Green Bowl",
  "Tegal Wangi Beach": "Tegal Wangi", "Sacred Monkey Forest Sanctuary": "Monkey Forest",
  "Sangeh Monkey Forest": "Sangeh"
};
Object.keys(prices.place).forEach(function (place) {
  const idr = TICKETS[PLACE_TICKET[place]] || 0;
  tourExclusive[place] = { idr: idr, usd: idr / TICKET_IDR_PER_USD };
});

// -- Kode referral: kode (UPPERCASE) -> persen diskon. Dipakai di search form homepage
//    (input + Apply) & My Trips. Diskon dipasang ke semua harga (coret + harga baru).
//    ANGKA & KODE placeholder - CEK WAYAN (ganti/isi kode asli + persen-nya).
const REFERRAL = {
  "GOWITHCAHYANA": 10, // kode lama (checkout) - dipertahanin, jangan hapus
  "CAHYANA10": 10,
  "UBUD5": 5
};

const tourDetails = [
  "Price includes car, driver, and petrol",
  "Entrance tickets are not included",
  "Free cold water on board",
  "Flexible stops - no extra charge for stops under 1 hour",
  "Book now, pay after - no upfront payment"
];

// Versi Exclusive: tiket sudah termasuk (dipakai kalau user pilih Exclusive)
const tourDetailsExclusive = [
  "Price includes car, driver, and petrol",
  "Entrance tickets included for the listed attractions",
  "Free cold water on board",
  "Flexible stops - no extra charge for stops under 1 hour",
  "Book now, pay after - no upfront payment"
];

const experienceDetails = [
  "Price is per person (entrance ticket)",
  "Free mineral water",
  "Includes transport - driver takes you there, waits, and drives you home",
  "Book now, pay after - no upfront payment"
];

// -- currency
// Kurs STATIS relatif ke USD (1 USD = X). Update di sini kalau perlu.
// IDR pakai harga rupiah tersimpan (bukan hasil konversi) biar tetap angka bulat rapi.
const CURRENCIES = ["USD", "IDR", "AUD", "EUR", "GBP"];

const CUR_RATE = { USD: 1, AUD: 1.53, EUR: 0.92, GBP: 0.79 };

// Simbol per currency buat tampilan harga (AUD = A$ biar beda dari USD).
// Dropdown currency TETAP pakai kode (USD/IDR/...) - ini cuma buat harga.
const CUR_SYMBOL = { USD: "$", IDR: "Rp", AUD: "A$", EUR: "€", GBP: "£" };

// ===== Promo / event bar (tripbar di bawah navbar, halaman NON-booking) =====
// Halaman booking (tour/transfer/dll) tetap nampilin Guests + Pickup, JANGAN diisi promo.
// Halaman lain (home, guide, listing, dll) nampilin promo ini KALAU active + text ada.
// Cara pakai: set active: true, isi text (wajib). cta + href opsional (kalau diisi
// dua-duanya, bar jadi link). Kosongin text atau active:false = bar gak muncul.
const PROMO = {
  active: true,
  text: "Kecak dance: every Sunday and Tuesday",
  cta: "See details",
  href: "attractions/kecak-dance.html",
};

// Daftar negara buat dropdown "Country" di form review (Sep 2026) - optional,
// booking lama belum nangkep data negara jadi biar guest pilih sendiri di form.
// Flag SVG self-host di assets/flags/<code>.svg (set MIT lipis/flag-icons).
const COUNTRIES = [
  { code: "af", name: "Afghanistan" },
  { code: "al", name: "Albania" },
  { code: "dz", name: "Algeria" },
  { code: "as", name: "American Samoa" },
  { code: "ad", name: "Andorra" },
  { code: "ao", name: "Angola" },
  { code: "ai", name: "Anguilla" },
  { code: "aq", name: "Antarctica" },
  { code: "ag", name: "Antigua and Barbuda" },
  { code: "ar", name: "Argentina" },
  { code: "am", name: "Armenia" },
  { code: "aw", name: "Aruba" },
  { code: "au", name: "Australia" },
  { code: "at", name: "Austria" },
  { code: "az", name: "Azerbaijan" },
  { code: "bs", name: "Bahamas" },
  { code: "bh", name: "Bahrain" },
  { code: "bd", name: "Bangladesh" },
  { code: "bb", name: "Barbados" },
  { code: "by", name: "Belarus" },
  { code: "be", name: "Belgium" },
  { code: "bz", name: "Belize" },
  { code: "bj", name: "Benin" },
  { code: "bm", name: "Bermuda" },
  { code: "bt", name: "Bhutan" },
  { code: "bo", name: "Bolivia" },
  { code: "ba", name: "Bosnia and Herzegovina" },
  { code: "bw", name: "Botswana" },
  { code: "bv", name: "Bouvet Island" },
  { code: "br", name: "Brazil" },
  { code: "io", name: "British Indian Ocean Territory" },
  { code: "vg", name: "British Virgin Islands" },
  { code: "bn", name: "Brunei" },
  { code: "bg", name: "Bulgaria" },
  { code: "bf", name: "Burkina Faso" },
  { code: "bi", name: "Burundi" },
  { code: "kh", name: "Cambodia" },
  { code: "cm", name: "Cameroon" },
  { code: "ca", name: "Canada" },
  { code: "cv", name: "Cape Verde" },
  { code: "bq", name: "Caribbean Netherlands" },
  { code: "ky", name: "Cayman Islands" },
  { code: "cf", name: "Central African Republic" },
  { code: "td", name: "Chad" },
  { code: "cl", name: "Chile" },
  { code: "cn", name: "China" },
  { code: "cx", name: "Christmas Island" },
  { code: "cc", name: "Cocos (Keeling) Islands" },
  { code: "co", name: "Colombia" },
  { code: "km", name: "Comoros" },
  { code: "cg", name: "Congo" },
  { code: "ck", name: "Cook Islands" },
  { code: "cr", name: "Costa Rica" },
  { code: "hr", name: "Croatia" },
  { code: "cu", name: "Cuba" },
  { code: "cw", name: "Curaçao" },
  { code: "cy", name: "Cyprus" },
  { code: "cz", name: "Czechia" },
  { code: "cd", name: "DR Congo" },
  { code: "dk", name: "Denmark" },
  { code: "dj", name: "Djibouti" },
  { code: "dm", name: "Dominica" },
  { code: "do", name: "Dominican Republic" },
  { code: "ec", name: "Ecuador" },
  { code: "eg", name: "Egypt" },
  { code: "sv", name: "El Salvador" },
  { code: "gq", name: "Equatorial Guinea" },
  { code: "er", name: "Eritrea" },
  { code: "ee", name: "Estonia" },
  { code: "sz", name: "Eswatini" },
  { code: "et", name: "Ethiopia" },
  { code: "fk", name: "Falkland Islands" },
  { code: "fo", name: "Faroe Islands" },
  { code: "fj", name: "Fiji" },
  { code: "fi", name: "Finland" },
  { code: "fr", name: "France" },
  { code: "gf", name: "French Guiana" },
  { code: "pf", name: "French Polynesia" },
  { code: "tf", name: "French Southern and Antarctic Lands" },
  { code: "ga", name: "Gabon" },
  { code: "gm", name: "Gambia" },
  { code: "ge", name: "Georgia" },
  { code: "de", name: "Germany" },
  { code: "gh", name: "Ghana" },
  { code: "gi", name: "Gibraltar" },
  { code: "gr", name: "Greece" },
  { code: "gl", name: "Greenland" },
  { code: "gd", name: "Grenada" },
  { code: "gp", name: "Guadeloupe" },
  { code: "gu", name: "Guam" },
  { code: "gt", name: "Guatemala" },
  { code: "gg", name: "Guernsey" },
  { code: "gn", name: "Guinea" },
  { code: "gw", name: "Guinea-Bissau" },
  { code: "gy", name: "Guyana" },
  { code: "ht", name: "Haiti" },
  { code: "hm", name: "Heard Island and McDonald Islands" },
  { code: "hn", name: "Honduras" },
  { code: "hk", name: "Hong Kong" },
  { code: "hu", name: "Hungary" },
  { code: "is", name: "Iceland" },
  { code: "in", name: "India" },
  { code: "id", name: "Indonesia" },
  { code: "ir", name: "Iran" },
  { code: "iq", name: "Iraq" },
  { code: "ie", name: "Ireland" },
  { code: "im", name: "Isle of Man" },
  { code: "il", name: "Israel" },
  { code: "it", name: "Italy" },
  { code: "ci", name: "Ivory Coast" },
  { code: "jm", name: "Jamaica" },
  { code: "jp", name: "Japan" },
  { code: "je", name: "Jersey" },
  { code: "jo", name: "Jordan" },
  { code: "kz", name: "Kazakhstan" },
  { code: "ke", name: "Kenya" },
  { code: "ki", name: "Kiribati" },
  { code: "kw", name: "Kuwait" },
  { code: "kg", name: "Kyrgyzstan" },
  { code: "la", name: "Laos" },
  { code: "lv", name: "Latvia" },
  { code: "lb", name: "Lebanon" },
  { code: "ls", name: "Lesotho" },
  { code: "lr", name: "Liberia" },
  { code: "ly", name: "Libya" },
  { code: "li", name: "Liechtenstein" },
  { code: "lt", name: "Lithuania" },
  { code: "lu", name: "Luxembourg" },
  { code: "mo", name: "Macau" },
  { code: "mg", name: "Madagascar" },
  { code: "mw", name: "Malawi" },
  { code: "my", name: "Malaysia" },
  { code: "mv", name: "Maldives" },
  { code: "ml", name: "Mali" },
  { code: "mt", name: "Malta" },
  { code: "mh", name: "Marshall Islands" },
  { code: "mq", name: "Martinique" },
  { code: "mr", name: "Mauritania" },
  { code: "mu", name: "Mauritius" },
  { code: "yt", name: "Mayotte" },
  { code: "mx", name: "Mexico" },
  { code: "fm", name: "Micronesia" },
  { code: "md", name: "Moldova" },
  { code: "mc", name: "Monaco" },
  { code: "mn", name: "Mongolia" },
  { code: "me", name: "Montenegro" },
  { code: "ms", name: "Montserrat" },
  { code: "ma", name: "Morocco" },
  { code: "mz", name: "Mozambique" },
  { code: "mm", name: "Myanmar" },
  { code: "na", name: "Namibia" },
  { code: "nr", name: "Nauru" },
  { code: "np", name: "Nepal" },
  { code: "nl", name: "Netherlands" },
  { code: "nc", name: "New Caledonia" },
  { code: "nz", name: "New Zealand" },
  { code: "ni", name: "Nicaragua" },
  { code: "ne", name: "Niger" },
  { code: "ng", name: "Nigeria" },
  { code: "nu", name: "Niue" },
  { code: "nf", name: "Norfolk Island" },
  { code: "kp", name: "North Korea" },
  { code: "mk", name: "North Macedonia" },
  { code: "mp", name: "Northern Mariana Islands" },
  { code: "no", name: "Norway" },
  { code: "om", name: "Oman" },
  { code: "pk", name: "Pakistan" },
  { code: "pw", name: "Palau" },
  { code: "ps", name: "Palestine" },
  { code: "pa", name: "Panama" },
  { code: "pg", name: "Papua New Guinea" },
  { code: "py", name: "Paraguay" },
  { code: "pe", name: "Peru" },
  { code: "ph", name: "Philippines" },
  { code: "pn", name: "Pitcairn Islands" },
  { code: "pl", name: "Poland" },
  { code: "pt", name: "Portugal" },
  { code: "pr", name: "Puerto Rico" },
  { code: "qa", name: "Qatar" },
  { code: "ro", name: "Romania" },
  { code: "ru", name: "Russia" },
  { code: "rw", name: "Rwanda" },
  { code: "re", name: "Réunion" },
  { code: "bl", name: "Saint Barthélemy" },
  { code: "sh", name: "Saint Helena, Ascension and Tristan da Cunha" },
  { code: "kn", name: "Saint Kitts and Nevis" },
  { code: "lc", name: "Saint Lucia" },
  { code: "mf", name: "Saint Martin" },
  { code: "pm", name: "Saint Pierre and Miquelon" },
  { code: "vc", name: "Saint Vincent and the Grenadines" },
  { code: "ws", name: "Samoa" },
  { code: "sm", name: "San Marino" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "sn", name: "Senegal" },
  { code: "rs", name: "Serbia" },
  { code: "sc", name: "Seychelles" },
  { code: "sl", name: "Sierra Leone" },
  { code: "sg", name: "Singapore" },
  { code: "sx", name: "Sint Maarten" },
  { code: "sk", name: "Slovakia" },
  { code: "si", name: "Slovenia" },
  { code: "sb", name: "Solomon Islands" },
  { code: "so", name: "Somalia" },
  { code: "za", name: "South Africa" },
  { code: "gs", name: "South Georgia" },
  { code: "kr", name: "South Korea" },
  { code: "ss", name: "South Sudan" },
  { code: "es", name: "Spain" },
  { code: "lk", name: "Sri Lanka" },
  { code: "sd", name: "Sudan" },
  { code: "sr", name: "Suriname" },
  { code: "sj", name: "Svalbard and Jan Mayen" },
  { code: "se", name: "Sweden" },
  { code: "ch", name: "Switzerland" },
  { code: "sy", name: "Syria" },
  { code: "st", name: "São Tomé and Príncipe" },
  { code: "tw", name: "Taiwan" },
  { code: "tj", name: "Tajikistan" },
  { code: "tz", name: "Tanzania" },
  { code: "th", name: "Thailand" },
  { code: "tl", name: "Timor-Leste" },
  { code: "tg", name: "Togo" },
  { code: "tk", name: "Tokelau" },
  { code: "to", name: "Tonga" },
  { code: "tt", name: "Trinidad and Tobago" },
  { code: "tn", name: "Tunisia" },
  { code: "tm", name: "Turkmenistan" },
  { code: "tc", name: "Turks and Caicos Islands" },
  { code: "tv", name: "Tuvalu" },
  { code: "tr", name: "Türkiye" },
  { code: "ug", name: "Uganda" },
  { code: "ua", name: "Ukraine" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "gb", name: "United Kingdom" },
  { code: "us", name: "United States" },
  { code: "um", name: "United States Minor Outlying Islands" },
  { code: "vi", name: "United States Virgin Islands" },
  { code: "uy", name: "Uruguay" },
  { code: "uz", name: "Uzbekistan" },
  { code: "vu", name: "Vanuatu" },
  { code: "va", name: "Vatican City" },
  { code: "ve", name: "Venezuela" },
  { code: "vn", name: "Vietnam" },
  { code: "wf", name: "Wallis and Futuna" },
  { code: "eh", name: "Western Sahara" },
  { code: "ye", name: "Yemen" },
  { code: "zm", name: "Zambia" },
  { code: "zw", name: "Zimbabwe" },
  { code: "ax", name: "Åland Islands" }
];
