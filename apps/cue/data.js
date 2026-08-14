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
const prices = {
  tour: { "Ubud Tour": { usd: 45, idr: 700000 }, "Lempuyang & Tirta Gangga": { usd: 55, idr: 850000 }, "Ulun Danu Beratan & Tanah Lot Temple": { usd: 60, idr: 950000 }, "Bali Hidden Beaches and Cliffs": { usd: 45, idr: 700000 }, "Munduk Waterfalls & Twin Lakes": { usd: 65, idr: 1000000 } },
  experience: { "ATV": { usd: 40, idr: 620000 }, "Rafting": { usd: 35, idr: 550000 }, "Swing": { usd: 25, idr: 400000 }, "Jeep Sunrise": { usd: 50, idr: 780000 }, "Mount Batur Trekking": { usd: 55, idr: 850000 }, "Cooking Class": { usd: 35, idr: 550000 }, "Watersport": { usd: 45, idr: 700000 }, "Bali Zoo": { usd: 40, idr: 600000 }, "Bali Bird Park": { usd: 28, idr: 430000 } },
  performance: { "Kecak Dance": { usd: 10, idr: 150000 }, "Barong Dance": { usd: 10, idr: 150000 } },
  transfer: { "Airport – Ubud": { usd: 20, idr: 300000 }, "Denpasar Area – Ubud": { usd: 20, idr: 300000 }, "Tanah Lot Area – Ubud": { usd: 30, idr: 450000 }, "Canggu Area – Ubud": { usd: 28, idr: 430000 }, "Kuta Area – Ubud": { usd: 25, idr: 400000 }, "Amed Area – Ubud": { usd: 45, idr: 700000 }, "Buleleng Area – Ubud": { usd: 50, idr: 780000 }, "Candidasa Area – Ubud": { usd: 38, idr: 580000 }, "Kintamani Area – Ubud": { usd: 30, idr: 450000 }, "Seminyak Area – Ubud": { usd: 30, idr: 450000 } },
  villa: { "Cahyana Tibuah": { usd: 80, idr: 1250000 }, "Cahyana House": { usd: 95, idr: 1480000 } },
  combo: { "Ubud Culture Day": { usd: 55, idr: 850000 }, "South Bali & Sunset Kecak": { usd: 85, idr: 1300000 }, "Batur Sunrise & Adrenaline": { usd: 85, idr: 1300000 }, "Ubud Rafting Adventure": { usd: 75, idr: 1150000 }, "Ubud ATV Adventure": { usd: 80, idr: 1250000 }, "Kintamani Sunrise & Penglipuran": { usd: 85, idr: 1300000 }, "Lovina Dolphin & Sekumpul Waterfall": { usd: 95, idr: 1450000 } },
  // Standalone destinations (halaman Destinations). Harga PLACEHOLDER - CEK WAYAN.
  place: { "Uluwatu Cliff Temple": { usd: 45, idr: 700000 }, "Tanah Lot Sunset Temple": { usd: 45, idr: 700000 }, "Besakih - The Mother Temple": { usd: 45, idr: 700000 }, "Tirta Empul Holy Water Temple": { usd: 45, idr: 700000 }, "Goa Gajah - The Elephant Cave": { usd: 45, idr: 700000 }, "Gunung Kawi Temple": { usd: 45, idr: 700000 }, "Lempuyang Temple - Gates of Heaven": { usd: 45, idr: 700000 }, "Ulun Danu Beratan Lake Temple": { usd: 45, idr: 700000 }, "Taman Ayun Royal Temple": { usd: 45, idr: 700000 }, "Pura Batuan Temple": { usd: 45, idr: 700000 }, "Garuda Wisnu Kencana (GWK)": { usd: 45, idr: 700000 }, "Ubud Royal Palace & Art Market": { usd: 45, idr: 700000 }, "Penglipuran Village": { usd: 45, idr: 700000 }, "Handara Gate": { usd: 45, idr: 700000 }, "Tirta Gangga Water Palace": { usd: 45, idr: 700000 }, "Taman Ujung Water Palace": { usd: 45, idr: 700000 }, "Tegalalang Rice Terrace": { usd: 45, idr: 700000 }, "Jatiluwih Rice Terraces": { usd: 45, idr: 700000 }, "Tegenungan Waterfall": { usd: 45, idr: 700000 }, "Git Git Waterfall": { usd: 45, idr: 700000 }, "Sekumpul Waterfall": { usd: 45, idr: 700000 }, "Banyumala Twin Waterfall": { usd: 45, idr: 700000 }, "Munduk Coffee Highlands": { usd: 45, idr: 700000 }, "Buyan & Tamblingan Twin Lakes": { usd: 45, idr: 700000 }, "Pandawa Beach": { usd: 45, idr: 700000 }, "Balangan Beach": { usd: 45, idr: 700000 }, "Bingin Beach": { usd: 45, idr: 700000 }, "Green Bowl Beach": { usd: 45, idr: 700000 }, "Tegal Wangi Beach": { usd: 45, idr: 700000 }, "Sacred Monkey Forest Sanctuary": { usd: 45, idr: 700000 }, "Sangeh Monkey Forest": { usd: 45, idr: 700000 }, "Ubud Traditional Market": { usd: 45, idr: 700000 }, "Ubud Arts & Crafts": { usd: 45, idr: 700000 } }
};

// ===== Pickup surcharge (diturunkan dari harga transfer) - CEK WAYAN =====
// Opsi pickup = destinasi yang ADA di prices.transfer (nggak bikin list baru).
// Surcharge = 60% harga transfer one-way (Ubud->area), PER MOBIL, cuma dikenakan kalau
// pickup != Ubud DAN zona pickup != zona item. Angkanya nggak pernah tampil di UI
// (cuma di popup konfirmasi). Ganti 0.6 di sini buat tune di satu tempat.
const SURCHARGE_FACTOR = 0.6;
// Zona tiap area pickup (buat cek "pickup area == tour area"). Key = key di prices.transfer.
const TRANSFER_ZONE = { "Airport – Ubud": "south", "Denpasar Area – Ubud": "south", "Seminyak Area – Ubud": "south", "Kuta Area – Ubud": "south", "Canggu Area – Ubud": "south", "Tanah Lot Area – Ubud": "west", "Kintamani Area – Ubud": "north", "Buleleng Area – Ubud": "north", "Amed Area – Ubud": "east", "Candidasa Area – Ubud": "east" };
const ITEM_ZONE = { "Uluwatu Cliff Temple": "south", "Tanah Lot Sunset Temple": "north", "Besakih - The Mother Temple": "east", "Tirta Empul Holy Water Temple": "ubud", "Goa Gajah - The Elephant Cave": "ubud", "Gunung Kawi Temple": "ubud", "Lempuyang Temple - Gates of Heaven": "east", "Ulun Danu Beratan Lake Temple": "north", "Taman Ayun Royal Temple": "ubud", "Pura Batuan Temple": "ubud", "Garuda Wisnu Kencana (GWK)": "south", "Ubud Royal Palace & Art Market": "ubud", "Penglipuran Village": "north", "Handara Gate": "north", "Tirta Gangga Water Palace": "east", "Taman Ujung Water Palace": "east", "Tegalalang Rice Terrace": "ubud", "Jatiluwih Rice Terraces": "north", "Tegenungan Waterfall": "ubud", "Git Git Waterfall": "north", "Sekumpul Waterfall": "north", "Banyumala Twin Waterfall": "north", "Munduk Coffee Highlands": "north", "Buyan & Tamblingan Twin Lakes": "north", "Pandawa Beach": "south", "Balangan Beach": "south", "Bingin Beach": "south", "Green Bowl Beach": "south", "Tegal Wangi Beach": "south", "Sacred Monkey Forest Sanctuary": "ubud", "Sangeh Monkey Forest": "ubud", "Ubud Traditional Market": "ubud", "Ubud Arts & Crafts": "ubud", "Ubud Tour": "ubud", "Lempuyang & Tirta Gangga": "east", "Ulun Danu Beratan & Tanah Lot Temple": "north", "Bali Hidden Beaches and Cliffs": "south", "Munduk Waterfalls & Twin Lakes": "north", "Ubud Culture Day": "ubud", "South Bali & Sunset Kecak": "south", "Batur Sunrise & Adrenaline": "north", "Ubud Rafting Adventure": "ubud", "Ubud ATV Adventure": "ubud", "Kintamani Sunrise & Penglipuran": "north", "Lovina Dolphin & Sekumpul Waterfall": "north" };

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
  "Ubud Tour": ["Tegalalang", "Tirta Empul", "Gunung Kawi", "Goa Gajah", "Tegenungan", "Monkey Forest"],
  "Lempuyang & Tirta Gangga": ["Lempuyang", "Tirta Gangga", "Taman Ujung", "Besakih"],
  "Ulun Danu Beratan & Tanah Lot Temple": ["Ulun Danu Beratan", "Handara Gate", "Jatiluwih", "Tanah Lot"],
  "Bali Hidden Beaches and Cliffs": ["Tegal Wangi", "Green Bowl", "Balangan", "Bingin"],
  "Munduk Waterfalls & Twin Lakes": ["Twin Lakes Viewpoint", "Banyumala", "Munduk Waterfall", "Gitgit"],
  "Ubud Culture Day": ["Barong Batubulan", "Pura Batuan", "Kecak Ubud"],
  "South Bali & Sunset Kecak": ["Watersport Package", "GWK", "Pandawa", "Uluwatu Temple", "Kecak Uluwatu"],
  "Batur Sunrise & Adrenaline": ["Batur Trek + Breakfast", "Batur Hot Spring"],
  "Ubud Rafting Adventure": ["Ayung Rafting", "Tegalalang", "Tegenungan"],
  "Ubud ATV Adventure": ["ATV Ride", "Bali Zoo", "Bali Bird Park", "Tegenungan"],
  "Kintamani Sunrise & Penglipuran": ["Jeep Sunrise", "Penglipuran", "Tirta Empul", "Tegalalang"],
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
