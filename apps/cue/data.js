/* ==================================================================
   DATA HARGA & KONFIG ANGKA - Cahyana Ubud Experience
   ------------------------------------------------------------------
   File ini SATU-SATUNYA tempat ngolah harga & tarif:
   - prices          : harga jual semua program (USD + IDR)
   - CHARTER         : tarif charter (half/full/extra jam/surcharge)
   - transport       : biaya transport per aktivitas
   - TICKETS         : harga tiket masuk per orang (IDR, turis asing)
   - TOUR_TICKETS    : tiket yang di-cover Exclusive tiap tur
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
  tour: { "Ubud Tour": { usd: 40, idr: 700000 }, "Lempuyang & Tirta Gangga": { usd: 49, idr: 850000 }, "Besakih & Taman Ujung": { usd: 54, idr: 950000 }, "Tanah Lot & Taman Ayun": { usd: 45, idr: 780000 }, "Ulun Danu Beratan & Handara Gate": { usd: 54, idr: 950000 }, "Jatiluwih Rice Terrace Tour": { usd: 40, idr: 700000 }, "Bali Hidden Beaches and Cliffs": { usd: 40, idr: 700000 }, "Banyumala & Twin Lakes": { usd: 49, idr: 850000 }, "Munduk Waterfall Tour": { usd: 49, idr: 850000 }, "3-Day Best of Bali Package": { usd: 131, idr: 2300000 } /* CEK WAYAN - paket multi-hari baru, harga contoh */, "Sangeh Monkey Forest & Tanah Lot": { usd: 45, idr: 780000 } /* CEK WAYAN - tour baru, harga contoh */ },
  experience: { "ATV": { usd: 36, idr: 620000 }, "Rafting": { usd: 32, idr: 550000 }, "Swing": { usd: 23, idr: 400000 }, "Jeep Sunrise": { usd: 45, idr: 780000 }, "Mount Batur Trekking": { usd: 49, idr: 850000 }, "Cooking Class": { usd: 32, idr: 550000 }, "Watersport": { usd: 40, idr: 700000 }, "Bali Zoo": { usd: 35, idr: 600000 }, "Bali Bird Park": { usd: 25, idr: 430000 } },
  performance: { "Kecak Dance": { usd: 9, idr: 150000 }, "Barong Dance": { usd: 9, idr: 150000 } },
  transfer: { "Airport – Ubud": { usd: 18, idr: 300000 }, "Denpasar Area – Ubud": { usd: 18, idr: 300000 }, "Tanah Lot Area – Ubud": { usd: 26, idr: 450000 }, "Canggu Area – Ubud": { usd: 25, idr: 430000 }, "Kuta Area – Ubud": { usd: 23, idr: 400000 }, "Amed Area – Ubud": { usd: 40, idr: 700000 }, "Buleleng Area – Ubud": { usd: 45, idr: 780000 }, "Candidasa Area – Ubud": { usd: 33, idr: 580000 }, "Kintamani Area – Ubud": { usd: 26, idr: 450000 }, "Seminyak Area – Ubud": { usd: 26, idr: 450000 } },
  villa: { "Cahyana Tibuah": { usd: 72, idr: 1250000 }, "Cahyana House": { usd: 85, idr: 1480000 } },
  combo: { "Ubud Culture Day": { usd: 49, idr: 850000 }, "Uluwatu & Sunset Kecak": { usd: 49, idr: 850000 }, "GWK & Pandawa Beach": { usd: 49, idr: 850000 }, "Batur Sunrise & Adrenaline": { usd: 74, idr: 1300000 }, "Ubud Rafting Adventure": { usd: 66, idr: 1150000 }, "Ubud ATV Adventure": { usd: 72, idr: 1250000 }, "Kintamani Sunrise & Penglipuran": { usd: 74, idr: 1300000 }, "Lovina Dolphin & Sekumpul Waterfall": { usd: 83, idr: 1450000 }, "Full Adventure: Rafting & ATV": { usd: 114, idr: 2000000 } /* CEK WAYAN - tour baru, harga contoh */ }
};

// ===== Pickup surcharge (diturunkan dari harga transfer) - CEK WAYAN =====
// Opsi pickup = destinasi yang ADA di prices.transfer (nggak bikin list baru).
// Surcharge = 60% harga transfer one-way (Ubud->area), PER MOBIL, cuma dikenakan kalau
// pickup != Ubud DAN zona pickup != zona item. Angkanya nggak pernah tampil di UI
// (cuma di popup konfirmasi). Ganti 0.6 di sini buat tune di satu tempat.
const SURCHARGE_FACTOR = 0.6;
// Zona tiap area pickup (buat cek "pickup area == tour area"). Key = key di prices.transfer.
const TRANSFER_ZONE = { "Airport – Ubud": "south", "Denpasar Area – Ubud": "south", "Seminyak Area – Ubud": "south", "Kuta Area – Ubud": "south", "Canggu Area – Ubud": "south", "Tanah Lot Area – Ubud": "west", "Kintamani Area – Ubud": "kintamani", "Buleleng Area – Ubud": "north", "Amed Area – Ubud": "east", "Candidasa Area – Ubud": "east" };
const ITEM_ZONE = { "Uluwatu Cliff Temple": "south", "Tanah Lot Sunset Temple": "west", "Besakih - The Mother Temple": "east", "Tirta Empul Holy Water Temple": "ubud", "Goa Gajah - The Elephant Cave": "ubud", "Gunung Kawi Temple": "ubud", "Lempuyang Temple - Gates of Heaven": "east", "Ulun Danu Beratan Lake Temple": "west", "Taman Ayun Royal Temple": "west", "Pura Batuan Temple": "ubud", "Garuda Wisnu Kencana (GWK)": "south", "Ubud Royal Palace & Art Market": "ubud", "Penglipuran Village": "ubud", "Handara Gate": "west", "Tirta Gangga Water Palace": "east", "Taman Ujung Water Palace": "east", "Tegalalang Rice Terrace": "ubud", "Jatiluwih Rice Terraces": "west", "Tegenungan Waterfall": "ubud", "Git Git Waterfall": "north", "Sekumpul Waterfall": "north", "Banyumala Twin Waterfall": "north", "Munduk Coffee Highlands": "north", "Buyan & Tamblingan Twin Lakes": "west", "Pandawa Beach": "south", "Balangan Beach": "south", "Bingin Beach": "south", "Green Bowl Beach": "south", "Tegal Wangi Beach": "south", "Sacred Monkey Forest Sanctuary": "ubud", "Sangeh Monkey Forest": "ubud", "Ubud Traditional Market": "ubud", "Ubud Arts & Crafts": "ubud", "Ubud Tour": "ubud", "Lempuyang & Tirta Gangga": "east", "Besakih & Taman Ujung": "east", "Tanah Lot & Taman Ayun": "west", "Ulun Danu Beratan & Handara Gate": "west", "Jatiluwih Rice Terrace Tour": "west", "Bali Hidden Beaches and Cliffs": "south", "Banyumala & Twin Lakes": "north", "Munduk Waterfall Tour": "north", "Ubud Culture Day": "ubud", "Uluwatu & Sunset Kecak": "south", "GWK & Pandawa Beach": "south", "Batur Sunrise & Adrenaline": "kintamani", "Ubud Rafting Adventure": "ubud", "Ubud ATV Adventure": "ubud", "Kintamani Sunrise & Penglipuran": "kintamani", "Lovina Dolphin & Sekumpul Waterfall": "north", "3-Day Best of Bali Package": "ubud", "Sangeh Monkey Forest & Tanah Lot": "west", "Full Adventure: Rafting & ATV": "ubud" };

// Charter mobil 
// extended = full day + jam tambahan, + surcharge kalau pickup di luar Ubud.
const CHARTER = {
  half: { usd: 35, idr: 600000 },
  full: { usd: 57, idr: 1000000 },
  extHourUsd: 4,
  extHourIdr: 60000,
  surchargeUsd: 6,
  surchargeIdr: 100000
};

const transport = {
  "ATV": { usd: 3, idr: 50000 }, "Rafting": { usd: 3, idr: 50000 }, "Swing": { usd: 3, idr: 50000 },
  "Jeep Sunrise": { usd: 6, idr: 100000 }, "Mount Batur Trekking": { usd: 6, idr: 100000 },
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
  "Tegalalang": 45000,
  "Tirta Empul": 75000,
  "Gunung Kawi": 75000,
  "Goa Gajah": 50000,
  "Tegenungan": 30000,
  "Monkey Forest": 120000,           // weekend 100k - dihitung pakai weekday
  "Lempuyang": 100000,              // incl. shuttle
  "Tirta Gangga": 90000,
  "Taman Ujung": 100000,
  "Besakih": 150000,                // incl. shuttle + sarong
  "Taman Ayun": 50000,
  "Sangeh": 90000,
  "Ulun Danu Beratan": 100000,
  "Handara Gate": 50000,
  "Jatiluwih": 85000,
  "Tanah Lot": 75000,
  "Watersport Package": 300000,     // paket dasar Tanjung Benoa - CEK WAYAN
  "GWK": 125000,
  "Pandawa": 20000,
  "Melasti": 10000,
  "Tegal Wangi": 10000,             // parkir/retribusi lokal - CEK WAYAN
  "Green Bowl": 10000,              // parkir + akses tangga - CEK WAYAN
  "Balangan": 10000,                // parkir/retribusi - CEK WAYAN
  "Bingin": 10000,                  // retribusi lokal - CEK WAYAN
  "Twin Lakes Viewpoint": 25000,
  "Banyumala": 50000,
  "Munduk Waterfall": 30000,
  "Gitgit": 20000,
  "Barong Batubulan": 150000,
  "Pura Batuan": 50000,             // donasi
  "Kecak Ubud": 100000,
  "Padang Padang": 15000,
  "Uluwatu Temple": 60000,
  "Kecak Uluwatu": 150000,
  "Batur Trek + Breakfast": 350000, // guide + sarapan - CEK WAYAN
  "Batur Hot Spring": 185000,
  "Ayung Rafting": 450000,          // harga operator dalam tur - CEK WAYAN
  "ATV Ride": 600000,               // CEK WAYAN
  "Bali Zoo": 395000,               // gate rate - CEK WAYAN
  "Bali Bird Park": 350000,         // CEK WAYAN
  "Jeep Sunrise": 400000,           // per orang, share jeep - CEK WAYAN
  "Penglipuran": 50000,
  "Lovina Boat": 150000,
  "Banjar Hot Spring": 45000,
  "Sekumpul Trek": 150000,
  "Bali Swing": 300000
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
  "Lovina Dolphin & Sekumpul Waterfall": ["Lovina Boat", "Banjar Hot Spring", "Sekumpul Trek"],
  "3-Day Best of Bali Package": ["Tegalalang", "Monkey Forest", "Besakih", "Uluwatu Temple", "Kecak Uluwatu"],
  "Sangeh Monkey Forest & Tanah Lot": ["Sangeh", "Tanah Lot"],
  "Full Adventure: Rafting & ATV": ["Ayung Rafting", "ATV Ride"]
};

// -- Fee internal Exclusive (JANGAN pernah ditampilkan ke user) & kurs tiket IDR->USD.
const TICKET_IDR_PER_USD = 17600;

// -- Suplemen Exclusive per orang, DITURUNKAN dari TICKETS (bukan angka lepas lagi).
//    Key = penanda tur mana yang punya toggle Standard/Exclusive.
const tourExclusive = {};
Object.keys(TOUR_TICKETS).forEach(function (tour) {
  const idr = TOUR_TICKETS[tour].reduce(function (sum, t) { return sum + (TICKETS[t] || 0); }, 0);
  tourExclusive[tour] = { idr: idr, usd: idr / TICKET_IDR_PER_USD };
});

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

const CUR_RATE = { USD: 1, AUD: 1.4, EUR: 0.86, GBP: 0.74 };

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
