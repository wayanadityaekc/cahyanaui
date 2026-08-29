/* ==================== 1. CONFIG & DATA ==================== */

// -- site config
// Naikin angka ini tiap kali isi file di folder partials/ diubah,
// biar browser narik versi baru dan bukan yang nyangkut di cache.
const PARTIALS_VERSION = 80;

const WHATSAPP_NUMBER = "61401657862";

const SHEET_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_URL";

const API_ENDPOINT = "https://cahyana-api-production.up.railway.app/api/inquiry";

// -- Sistem akun (passwordless). Base API + kunci token sesi di localStorage.
const API_BASE = "https://cahyana-api-production.up.railway.app/api";
const TOKEN_KEY = "cue_token";
let currentAccount = null; // null = belum login (guest)
let hasUpcoming = false; // buat titik hijau navbar (ada booking mendatang)

// Kode referral lama (single code). Sekarang semua kode + persen hidup di REFERRAL
// (data.js) & divalidasi lewat referralLookup; const ini dipertahanin (jangan hapus).
const REFERRAL_CODE = "gowithcahyana";

// -- SEMUA data harga & kurs pindah ke data.js (dimuat sebelum file ini).
//    Ubah harga/tiket/kurs -> edit data.js, BUKAN di sini.


let currentCurrency = localStorage.getItem("cue_currency") || "USD";
if (!CURRENCIES.includes(currentCurrency)) currentCurrency = "USD";

// -- jumlah orang global (dipakai buat harga Exclusive & sinkron booking form)
// 0 = user belum pilih. Kalau belum dipilih, harga Exclusive di card ditampilin
// pakai DISPLAY_GUESTS sebagai perkiraan (+ catatan "for N pax").
const DISPLAY_GUESTS = 2;
let currentGuests = parseInt(localStorage.getItem("cue_guests"), 10) || 0;
// Stay-area tamu (buat pickup surcharge). "" = belum pilih -> default Ubud (no surcharge).
let currentStay = localStorage.getItem("cue_stay") || "";
// Tanggal trip (range) - dipilih di search bar / popup. "" = belum diisi.
// Booking form per-item tetap 1 tanggal (field sendiri); range ini buat itinerary.
let currentDateFrom = localStorage.getItem("cue_date_from") || "";
let currentDateTo = localStorage.getItem("cue_date_to") || "";

// -- page -> itinerary program map
// Peta halaman detail -> nama program di itinerary (biar tombol Add di card
// mana pun tau program apa yang ditambahin, walau teks card beda)
const PAGE_ITEM = {
  "ubud-tour.html": "Ubud Tour",
  "lempuyang-tirta-gangga.html": "Lempuyang & Tirta Gangga",
  "ulun-danu-tanah-lot.html": "Ulun Danu Beratan & Tanah Lot Temple",
  "hidden-beaches-cliffs.html": "Bali Hidden Beaches and Cliffs",
  "munduk-twin-lakes.html": "Munduk Waterfalls & Twin Lakes",
  "attractions/atv-ride.html": "ATV",
  "attractions/rafting.html": "Rafting",
  "attractions/jungle-swing.html": "Swing",
  "attractions/jeep-sunrise.html": "Jeep Sunrise",
  "attractions/mount-batur-trekking.html": "Mount Batur Trekking",
  "attractions/cooking-class.html": "Cooking Class",
  "attractions/watersport.html": "Watersport",
  "attractions/kecak-dance.html": "Kecak Dance",
  "attractions/barong-dance.html": "Barong Dance",
  "attractions/bali-zoo.html": "Bali Zoo",
  "attractions/bali-bird-park.html": "Bali Bird Park",
  "ubud-culture-day.html": "Ubud Culture Day",
  "south-coast-sunset-kecak.html": "South Bali & Sunset Kecak",
  "batur-sunrise-adrenaline.html": "Batur Sunrise & Adrenaline",
  "ubud-rafting-adventure.html": "Ubud Rafting Adventure",
  "ubud-atv-adventure.html": "Ubud ATV Adventure",
  "kintamani-sunrise-penglipuran.html": "Kintamani Sunrise & Penglipuran",
  "lovina-dolphin-sekumpul.html": "Lovina Dolphin & Sekumpul Waterfall"
};

// -- Kartu visual per program di builder itinerary: foto (sama kaya homepage) + 1 kalimat desc.
// Key HARUS sama persis dg nama di `prices`. Dipakai renderDayCard buat render .experience__card.
const ITEM_CARD = {
  "Ubud Tour": { img: "ubud-tour-card.jpg", desc: "Rice terraces, sacred temples, and the monkey forest in one full day." },
  "Lempuyang & Tirta Gangga": { img: "east-bali-tour-card.jpg", desc: "Water gardens, a royal palace, and the gates of Lempuyang." },
  "Ulun Danu Beratan & Tanah Lot Temple": { img: "west-bali-tour-card.jpg", desc: "Lakeside temples, mountain views, and the Tanah Lot sunset." },
  "Bali Hidden Beaches and Cliffs": { img: "south-bali-tour-card.jpg", desc: "Quiet Bukit beaches and clifftops — Tegal Wangi, Green Bowl, Balangan, and Bingin." },
  "Munduk Waterfalls & Twin Lakes": { img: "north-bali-tour-card.jpg", desc: "Twin lakes and a trail of hidden jungle waterfalls in Bali's green north." },
  "Ubud Culture Day": { img: "ubud-culture-day-card.jpg", desc: "Morning Barong, Ubud crafts, the Batuan temple, and an evening Kecak dance." },
  "South Bali & Sunset Kecak": { img: "south-coast-sunset-kecak-card.jpg", desc: "Watersports, the GWK statue, Pandawa Beach, and the sunset Kecak dance at Uluwatu." },
  "Batur Sunrise & Adrenaline": { img: "batur-sunrise-adrenaline-card.jpg", desc: "A Mount Batur sunrise trek, a volcano breakfast, and a hot spring soak." },
  "Ubud Rafting Adventure": { img: "ubud-rafting-adventure-card.jpg", desc: "Ayung river rafting, rice terraces, luwak coffee, and a waterfall." },
  "Ubud ATV Adventure": { img: "ubud-atv-adventure-card.webp", desc: "A jungle ATV ride, Bali Zoo, Bali Bird Park, and the Tegenungan waterfall." },
  "Kintamani Sunrise & Penglipuran": { img: "jeep-batur-card.webp", desc: "A 4x4 Batur sunrise, Penglipuran village, and temples back to Ubud." },
  "Lovina Dolphin & Sekumpul Waterfall": { img: "lovina-dolphin-sekumpul-card.jpg", desc: "A Lovina dolphin sunrise, the Banjar hot springs, and Sekumpul waterfall." },
  "ATV": { img: "ubud-atv-adventure-card.webp", desc: "Quad-bike through jungle trails, mud, and tunnels." },
  "Rafting": { img: "rafting.webp", desc: "White-water rafting down the scenic Ayung River gorge." },
  "Swing": { img: "jungle-swing-card.jpg", desc: "Soar over the jungle on Bali's famous swing." },
  "Jeep Sunrise": { img: "jeep-batur-card.webp", desc: "A sunrise 4x4 across Mount Batur's black-lava fields." },
  "Mount Batur Trekking": { img: "mount-batur-sunrise.webp", desc: "A pre-dawn hike to the summit of an active volcano." },
  "Cooking Class": { img: "cooking-class-card.webp", desc: "Cook authentic Balinese dishes with a local family." },
  "Watersport": { img: "watersport-card.jpg", desc: "Jet ski, banana boat, and parasailing off the south coast." },
  "Kecak Dance": { img: "kecak.jpg", desc: "Bali's famous fire-and-chant ritual, performed at sunset." },
  "Barong Dance": { img: "barong-dance-card.webp", desc: "The ancient dance-drama of good versus evil, in ornate masks." },
  "Bali Zoo": { img: "bali-zoo-card.webp", desc: "Elephants, orangutans, and jungle wildlife just south of Ubud." },
  "Bali Bird Park": { img: "bali-bird-park-card.webp", desc: "Over 1,000 birds, aviaries, and free-flight shows near Ubud." }
};

// Peta item buat section "You might also like" di halaman detail (initRelated).
// Digenerate dari kartu listing: zone = section kategori, p = harga USD statis
// (0 = tanpa harga, mis. destinations -> kartu tampil tanpa baris harga).
const RELATED_ITEMS = [
  { href: "ubud-tour.html", type: "tour", zone: "ubud", name: "Ubud Tour", img: "ubud-tour-card.jpg", meta: "6&ndash;8 hours", p: 45, priceName: "Ubud Tour" },
  { href: "ubud-culture-day.html", type: "tour", zone: "ubud", name: "Ubud Culture Day", img: "ubud-culture-day-card.jpg", meta: "6&ndash;8 hours", p: 55, priceName: "Ubud Culture Day" },
  { href: "ubud-rafting-adventure.html", type: "tour", zone: "ubud", name: "Ubud Rafting Adventure", img: "ubud-rafting-adventure-card.jpg", meta: "6&ndash;8 hours", p: 75, priceName: "Ubud Rafting Adventure" },
  { href: "ubud-atv-adventure.html", type: "tour", zone: "ubud", name: "Ubud ATV Adventure", img: "ubud-atv-adventure-card.webp", meta: "6&ndash;8 hours", p: 80, priceName: "Ubud ATV Adventure" },
  { href: "south-coast-sunset-kecak.html", type: "tour", zone: "south", name: "South Bali &amp; Sunset Kecak", img: "south-coast-sunset-kecak-card.jpg", meta: "9&ndash;11 hours", p: 85, priceName: "South Bali &amp; Sunset Kecak" },
  { href: "hidden-beaches-cliffs.html", type: "tour", zone: "south", name: "Bali Hidden Beaches and Cliffs", img: "south-bali-tour-card.jpg", meta: "7&ndash;9 hours", p: 45, priceName: "Bali Hidden Beaches and Cliffs" },
  { href: "lempuyang-tirta-gangga.html", type: "tour", zone: "east", name: "Lempuyang &amp; Tirta Gangga", img: "east-bali-tour-card.jpg", meta: "8&ndash;10 hours", p: 55, priceName: "Lempuyang &amp; Tirta Gangga" },
  { href: "kintamani-sunrise-penglipuran.html", type: "tour", zone: "kintamani", name: "Kintamani Sunrise &amp; Penglipuran", img: "jeep-batur-card.webp", meta: "10&ndash;11 hours", p: 85, priceName: "Kintamani Sunrise &amp; Penglipuran" },
  { href: "batur-sunrise-adrenaline.html", type: "tour", zone: "kintamani", name: "Batur Sunrise &amp; Adrenaline", img: "batur-sunrise-adrenaline-card.jpg", meta: "8&ndash;10 hours", p: 85, priceName: "Batur Sunrise &amp; Adrenaline" },
  { href: "ulun-danu-tanah-lot.html", type: "tour", zone: "west", name: "Ulun Danu Beratan &amp; Tanah Lot Temple", img: "west-bali-tour-card.jpg", meta: "7&ndash;9 hours", p: 60, priceName: "Ulun Danu Beratan &amp; Tanah Lot Temple" },
  { href: "munduk-twin-lakes.html", type: "tour", zone: "west", name: "Munduk Waterfalls &amp; Twin Lakes", img: "north-bali-tour-card.jpg", meta: "10&ndash;12 hours", p: 65, priceName: "Munduk Waterfalls &amp; Twin Lakes" },
  { href: "lovina-dolphin-sekumpul.html", type: "tour", zone: "north", name: "Lovina Dolphin &amp; Sekumpul Waterfall", img: "lovina-dolphin-sekumpul-card.jpg", meta: "11&ndash;12 hours", p: 95, priceName: "Lovina Dolphin &amp; Sekumpul Waterfall" },
  { href: "attractions/atv-ride.html", type: "activity", zone: "adventure", name: "ATV Ride", img: "ubud-atv-adventure-card.webp", meta: "~2 hours", p: 40, priceName: "ATV" },
  { href: "attractions/rafting.html", type: "activity", zone: "adventure", name: "Rafting", img: "rafting.webp", meta: "~2 hours", p: 35, priceName: "Rafting" },
  { href: "attractions/jungle-swing.html", type: "activity", zone: "adventure", name: "Jungle Swing", img: "jungle-swing-card.jpg", meta: "~1&ndash;2 hours", p: 25, priceName: "Swing" },
  { href: "attractions/jeep-sunrise.html", type: "activity", zone: "adventure", name: "Jeep Sunrise", img: "jeep-batur-card.webp", meta: "~7 hours", p: 50, priceName: "Jeep Sunrise" },
  { href: "attractions/mount-batur-trekking.html", type: "activity", zone: "adventure", name: "Mount Batur Trekking", img: "mount-batur-sunrise.webp", meta: "~8 hours", p: 55, priceName: "Mount Batur Trekking" },
  { href: "attractions/watersport.html", type: "activity", zone: "adventure", name: "Watersport", img: "watersport-card.jpg", meta: "", p: 45, priceName: "Watersport" },
  { href: "attractions/barong-dance.html", type: "activity", zone: "culture", name: "Barong Dance", img: "barong-dance-card.webp", meta: "~1 hour", p: 10, priceName: "Barong Dance" },
  { href: "attractions/cooking-class.html", type: "activity", zone: "culture", name: "Cooking Class", img: "cooking-class-card.webp", meta: "~5 hours", p: 35, priceName: "Cooking Class" },
  { href: "attractions/bali-zoo.html", type: "activity", zone: "wildlife", name: "Bali Zoo", img: "bali-zoo-card.webp", meta: "~2&ndash;3 hours", p: 40, priceName: "Bali Zoo" },
  { href: "attractions/bali-bird-park.html", type: "activity", zone: "wildlife", name: "Bali Bird Park", img: "bali-bird-park-card.webp", meta: "~2&ndash;3 hours", p: 28, priceName: "Bali Bird Park" },
  { href: "attractions/uluwatu-temple.html", type: "destination", zone: "temple", name: "Uluwatu Cliff Temple", img: "uluwatu-temple-top.webp", meta: "South Bali", p: 0, priceName: "" },
  { href: "attractions/tanah-lot.html", type: "destination", zone: "temple", name: "Tanah Lot Sunset Temple", img: "tanah-lot.webp", meta: "West Bali", p: 0, priceName: "" },
  { href: "attractions/besakih.html", type: "destination", zone: "temple", name: "Besakih - The Mother Temple", img: "besakih-temple-bali.webp", meta: "East Bali", p: 0, priceName: "" },
  { href: "attractions/tirta-empul.html", type: "destination", zone: "temple", name: "Tirta Empul Holy Water Temple", img: "tirta-empul-hero.jpg", meta: "Near Ubud", p: 0, priceName: "" },
  { href: "attractions/goa-gajah.html", type: "destination", zone: "temple", name: "Goa Gajah - The Elephant Cave", img: "goa-gajah-hero.jpg", meta: "Near Ubud", p: 0, priceName: "" },
  { href: "attractions/gunung-kawi.html", type: "destination", zone: "temple", name: "Gunung Kawi Temple", img: "gunung-kawi-hero.jpg", meta: "Near Ubud", p: 0, priceName: "" },
  { href: "attractions/lempuyang-temple.html", type: "destination", zone: "temple", name: "Lempuyang Temple - Gates of Heaven", img: "lempuyang.webp", meta: "East Bali", p: 0, priceName: "" },
  { href: "attractions/ulun-danu-beratan.html", type: "destination", zone: "temple", name: "Ulun Danu Beratan Lake Temple", img: "ulun-danu-beratan-hero.webp", meta: "Central Highlands", p: 0, priceName: "" },
  { href: "attractions/taman-ayun.html", type: "destination", zone: "temple", name: "Taman Ayun Royal Temple", img: "taman-ayun-hero.jpg", meta: "West Bali", p: 0, priceName: "" },
  { href: "attractions/pura-batuan.html", type: "destination", zone: "temple", name: "Pura Batuan Temple", img: "pura-batuan-temple.jpg", meta: "Near Ubud", p: 0, priceName: "" },
  { href: "attractions/tegenungan-waterfall.html", type: "destination", zone: "waterfall", name: "Tegenungan Waterfall", img: "tegenungan-waterfall-hero.jpg", meta: "Near Ubud", p: 0, priceName: "" },
  { href: "attractions/gitgit-waterfall.html", type: "destination", zone: "waterfall", name: "Git Git Waterfall", img: "waterfall.webp", meta: "North Bali", p: 0, priceName: "" },
  { href: "attractions/sekumpul-waterfall.html", type: "destination", zone: "waterfall", name: "Sekumpul Waterfall", img: "lovina-dolphin-sekumpul-card.jpg", meta: "North Bali", p: 0, priceName: "" },
  { href: "attractions/banyumala-waterfall.html", type: "destination", zone: "waterfall", name: "Banyumala Twin Waterfall", img: "waterfall.jpg", meta: "North Bali", p: 0, priceName: "" },
  { href: "attractions/munduk.html", type: "destination", zone: "waterfall", name: "Munduk Waterfalls", img: "tibumana.webp", meta: "North Bali", p: 0, priceName: "" },
  { href: "attractions/pandawa-beach.html", type: "destination", zone: "beach", name: "Pandawa Beach", img: "green-cliff-coast-bali.webp", meta: "South Bali", p: 0, priceName: "" },
  { href: "attractions/balangan-beach.html", type: "destination", zone: "beach", name: "Balangan Beach", img: "surfers-beach.webp", meta: "South Bali", p: 0, priceName: "" },
  { href: "attractions/bingin-beach.html", type: "destination", zone: "beach", name: "Bingin Beach", img: "kelingking-beach.jpg", meta: "South Bali", p: 0, priceName: "" },
  { href: "attractions/green-bowl-beach.html", type: "destination", zone: "beach", name: "Green Bowl Beach", img: "cliff-beach.webp", meta: "South Bali", p: 0, priceName: "" },
  { href: "attractions/tegal-wangi-beach.html", type: "destination", zone: "beach", name: "Tegal Wangi Beach", img: "kelingking-beach.jpg", meta: "South Bali", p: 0, priceName: "" },
  { href: "attractions/tegalalang-rice-terrace.html", type: "destination", zone: "rice", name: "Tegalalang Rice Terrace", img: "tegalalang-rice-terrace-hero.jpg", meta: "Near Ubud", p: 0, priceName: "" },
  { href: "attractions/jatiluwih-rice-terrace.html", type: "destination", zone: "rice", name: "Jatiluwih Rice Terraces", img: "jatiluwih.webp", meta: "West Bali", p: 0, priceName: "" },
  { href: "attractions/garuda-wisnu-kencana.html", type: "destination", zone: "nature", name: "Garuda Wisnu Kencana (GWK)", img: "gwk-statue-bali.webp", meta: "South Bali", p: 0, priceName: "" },
  { href: "attractions/ubud-royal-palace.html", type: "destination", zone: "nature", name: "Ubud Royal Palace &amp; Art Market", img: "ubud-saraswati-temple.jpg", meta: "Central Ubud", p: 0, priceName: "" },
  { href: "attractions/penglipuran.html", type: "destination", zone: "nature", name: "Penglipuran Village", img: "penglipuran-village-view.jpg", meta: "Kintamani", p: 0, priceName: "" },
  { href: "attractions/handara-gate.html", type: "destination", zone: "nature", name: "Handara Gate", img: "handara-gate.webp", meta: "North Bali", p: 0, priceName: "" },
  { href: "attractions/tirta-gangga.html", type: "destination", zone: "nature", name: "Tirta Gangga Water Garden", img: "tirtagangga.jpg", meta: "East Bali", p: 0, priceName: "" },
  { href: "attractions/taman-ujung.html", type: "destination", zone: "nature", name: "Taman Ujung Water Palace", img: "ujung-water-palace-lake-bali.webp", meta: "East Bali", p: 0, priceName: "" },
  { href: "attractions/twin-lakes.html", type: "destination", zone: "nature", name: "Buyan &amp; Tamblingan Twin Lakes", img: "batur-lake.webp", meta: "North Bali", p: 0, priceName: "" },
  { href: "attractions/monkey-forest.html", type: "destination", zone: "nature", name: "Sacred Monkey Forest Sanctuary", img: "monkey-forest-hero.jpg", meta: "Central Ubud", p: 0, priceName: "" },
  { href: "attractions/sangeh-monkey-forest.html", type: "destination", zone: "nature", name: "Sangeh Monkey Forest", img: "monkey.jpg", meta: "West Bali", p: 0, priceName: "" },
  { href: "attractions/ubud-market.html", type: "destination", zone: "nature", name: "Ubud Traditional Market", img: "ubud-market-hero.jpg", meta: "Central Ubud", p: 0, priceName: "" },
  { href: "attractions/ubud-arts-crafts.html", type: "destination", zone: "nature", name: "Ubud Arts & Crafts", img: "ubud-arts-crafts-hero.jpg", meta: "Near Ubud", p: 0, priceName: "" },
];
const RELATED_ALL = {
  tour: ["tour.html", "Explore all tours"],
  activity: ["activities.html", "Explore all activities"],
  destination: ["destinations.html", "Explore all destinations"]
};



// -- itinerary store key
const ITN_KEY = "cue_itinerary_v1";

// -- "Suggested plan" (boks "Don't know where to start?" di itinerary)
// User pilih jumlah HARI + jumlah orang -> builder auto-keisi: tour ke-i buat hari ke-i
// (dari SUGGEST) + jemput & antar airport. Nama HARUS sama persis dg key prices.tour/combo.
// Urutan tour boleh digeser bebas (cuma data). PKG_AIRPORT = route jemput/antar.
const PKG_AIRPORT = "Airport – Ubud";
const PKG_AIRPORT_PLACE = "Ngurah Rai Airport (DPS)";
const SUGGEST = [
  "Ubud Tour", "Ubud Culture Day", "Batur Sunrise & Adrenaline", "Lempuyang & Tirta Gangga",
  "South Bali & Sunset Kecak", "Ulun Danu Beratan & Tanah Lot Temple", "Munduk Waterfalls & Twin Lakes"
];

/* ==================== 2. HELPER FUNCTIONS ==================== */

// -- currency & price formatting
// Bulatin hasil: IDR ke 1.000 terdekat, currency lain ke bilangan bulat.
function roundCur(v, cur) {
  return cur === "IDR" ? Math.round(v / 1000) * 1000 : Math.round(v);
}

// Konversi { usd, idr } ke currency aktif -> angka
function toCurrency(usd, idr, cur) {
  cur = cur || currentCurrency;
  const raw = cur === "IDR" ? idr : usd * (CUR_RATE[cur] || 1);
  return roundCur(raw, cur);
}

// Format jadi teks pakai simbol: "$45" / "Rp700.000" / "A$69"
function fmtMoney(usd, idr, cur) {
  cur = cur || currentCurrency;
  const v = toCurrency(usd, idr, cur);
  return (CUR_SYMBOL[cur] || cur + " ") + v.toLocaleString(cur === "IDR" ? "id-ID" : "en-US");
}

// Dipakai booking & itinerary (sekarang tampil 1 currency aktif)
const priceHTML = (usd, idr) => `<span class="price-cur">${fmtMoney(usd, idr)}</span>`;

// Isi semua <span class="price" data-price="Nama"> dari data pusat + currency aktif.
// Kalau span-nya lagi mode Exclusive (data-mode="exclusive"), tampilin harga
// standard + suplemen tiket × jumlah orang (lihat exclusivePrice).
function renderPrices() {
  document.querySelectorAll("[data-price]").forEach((el) => {
    const name = el.dataset.price;
    let usd = null, idr = null;
    if (el.dataset.mode === "exclusive") {
      const ex = exclusivePrice(name);
      if (ex) { usd = ex.usd; idr = ex.idr; }
    }
    if (usd == null) {
      const info = itemInfo(name);
      const base = info ? info.price : prices.transfer[name];
      if (base) { usd = base.usd; idr = base.idr; }
    }
    if (usd == null) return;
    // FINAL price = base (+ tiket exclusive) + pickup surcharge. Surcharge di-bake in;
    // angkanya sendiri nggak pernah ditampilin di card/form (cuma di konfirmasi).
    const s = surchargeFor(name);
    const fUsd = usd + s.usd, fIdr = idr + s.idr;
    // Referral aktif -> harga asli dicoret + harga diskon. Nggak aktif -> teks biasa.
    const pct = refDiscountPct();
    if (pct) {
      const d = applyReferral(fUsd, fIdr);
      el.innerHTML = '<span class="price-was">' + fmtMoney(fUsd, fIdr) + "</span> " +
        '<span class="price-now">' + fmtMoney(d.usd, d.idr) + "</span>";
    } else {
      el.textContent = fmtMoney(fUsd, fIdr);
    }
  });
  renderPriceLabels();
  renderFees();
  renderCharterPromo();
  updateGlanceSave();
  if (window.__transferRefresh) window.__transferRefresh(); // picker transfer ikut kurs/referral
}

// "You save X%" pill di hero harga (glance) - muncul kalau referral aktif.
function updateGlanceSave() {
  const pct = refDiscountPct();
  document.querySelectorAll("[data-glance-save]").forEach((s) => {
    if (pct) { s.textContent = "You save " + pct + "%"; s.hidden = false; }
    else { s.hidden = true; s.textContent = ""; }
  });
}

// Label kecil di bawah harga (card/form): "Pickup surcharge applied" / "No surcharge ...".
function renderPriceLabels() {
  document.querySelectorAll("[data-price-label]").forEach((el) => {
    const l = surchargeLabel(el.dataset.priceLabel);
    el.textContent = l.txt;
    el.classList.toggle("price-note--surcharge", l.has);
  });
}

// Isi <span class="fee" data-idr="N"> (tiket masuk di halaman attraction) ke
// currency aktif. Fee aslinya IDR; buat currency lain dikonversi lewat kurs tiket
// & dikasih "~" (perkiraan, karena bayarnya tetap cash IDR di gerbang).
function renderFees() {
  document.querySelectorAll("span.fee[data-idr]").forEach((el) => {
    const idr = parseInt(el.dataset.idr, 10);
    if (!idr) return;
    const cur = currentCurrency;
    const txt = fmtMoney(idr / TICKET_IDR_PER_USD, idr, cur);
    el.textContent = cur === "IDR" ? txt : "~" + txt;
  });
}

// Isi harga kartu Charter di homepage (<span data-charter="half|full">) dari CHARTER
// (data.js) ke currency aktif. Dipanggil dari renderPrices biar ikut ganti kurs.
function renderCharterPromo() {
  document.querySelectorAll("[data-charter]").forEach((el) => {
    const dur = el.dataset.charter; // "half" | "full"
    const extra = parseInt(el.dataset.charterExtra || "0", 10); // jam tambahan (full day)
    let usd, idr;
    if (dur === "half") { usd = CHARTER.half.usd; idr = CHARTER.half.idr; }
    else if (dur === "full") {
      usd = CHARTER.full.usd + extra * CHARTER.extHourUsd;
      idr = CHARTER.full.idr + extra * CHARTER.extHourIdr;
    }
    if (usd != null) el.textContent = fmtMoney(usd, idr);
  });
}

// Ganti currency: simpan + render ulang semua harga (static + booking + itinerary)
function setCurrency(cur) {
  if (!CURRENCIES.includes(cur)) return;
  currentCurrency = cur;
  localStorage.setItem("cue_currency", cur);
  renderPrices();
  // sinkron tampilan custom dropdown currency (tombol + list) di dropdown akun
  document.querySelectorAll("[data-cur]").forEach((wrap) => syncCurBtn(wrap, cur));
  const svc = document.getElementById("service-item");
  if (svc && svc.value) svc.dispatchEvent(new Event("change"));
  if (window.__itnRerender) window.__itnRerender();
  if (window.__chRefresh) window.__chRefresh();
  if (window.__atRefresh) window.__atRefresh();
  if (window.__exploreRefresh) window.__exploreRefresh();
}

// Sinkron tampilan 1 custom dropdown currency: bendera + kode di tombol, highlight
// opsi aktif di list. Dipakai setCurrency + initCurrency.
function syncCurBtn(wrap, cur) {
  const use = wrap.querySelector("[data-cur-flag] use");
  if (use) use.setAttribute("href", "#flag-" + cur.toLowerCase());
  const label = wrap.querySelector("[data-cur-label]");
  if (label) label.textContent = cur;
  wrap.querySelectorAll("[data-cur-opt]").forEach((o) => {
    const on = o.dataset.curOpt === cur;
    o.classList.toggle("is-active", on);
    o.setAttribute("aria-selected", String(on));
  });
}

// Set jumlah orang global: simpan, render ulang harga Exclusive + catatan toggle,
// dan sinkron ke field Guests di booking form (dua arah, tanpa loop).
function setGuests(n) {
  n = parseInt(n, 10) || 0;
  if (n < 1) return;
  currentGuests = n;
  localStorage.setItem("cue_guests", String(n));
  renderPrices();
  if (window.__ttypeRefresh) window.__ttypeRefresh();
  if (window.__itnGuestsSync) window.__itnGuestsSync(n); // sinkron ke builder itinerary
  // sinkron ke guest-select di navbar + badge ikon akun
  document.querySelectorAll("[data-guest-select]").forEach((s) => {
    if (parseInt(s.value, 10) !== n) s.value = String(n);
  });
  document.querySelectorAll("[data-guest-badge]").forEach((b) => { b.textContent = String(n); });
  // Booking form gak punya kolom Guests lagi -> cukup refresh harga booking.
  if (window.__bookingRefresh) window.__bookingRefresh();
  if (window.__tripbarRefresh) window.__tripbarRefresh();
  cselRefreshAll(); // label custom-dropdown ikut ke-update (value diubah programmatik)
}

// Reset dari opsi "Reset" di dropdown navbar: hapus jumlah orang tersimpan,
// balikin semua field ke default, lalu buka editor "Your trip details" biar user
// pilih ulang (welcome popup udah dimatiin — editor ini field-nya sama).
function resetGuests() {
  currentGuests = 0;
  localStorage.removeItem("cue_guests");
  document.querySelectorAll("[data-guest-select]").forEach((s) => { s.value = String(DISPLAY_GUESTS); });
  document.querySelectorAll("[data-guest-badge]").forEach((b) => { b.textContent = String(DISPLAY_GUESTS); });
  currentStay = "";
  localStorage.removeItem("cue_stay");
  document.querySelectorAll("[data-stay-select]").forEach((s) => { s.value = "ubud"; });
  renderPrices();
  if (window.__ttypeRefresh) window.__ttypeRefresh();
  if (window.__bookingRefresh) window.__bookingRefresh();
  cselRefreshAll();
  showTripDetails();
}

// -- itinerary store
function carPrice(base, guests) {
  const mult = guests > 5 ? 2 : 1;
  return { usd: base.usd * mult, idr: base.idr * mult };
}

// cari kategori & harga sebuah program dari struktur prices
function itemInfo(name) {
  for (const cat of ["tour", "experience", "performance", "villa", "combo", "place"]) {
    if (prices[cat] && prices[cat][name]) return { cat, price: prices[cat][name] };
  }
  return null;
}

// ---- Pickup surcharge (diturunkan dari harga transfer) ----
function itemZone(name) { return (typeof ITEM_ZONE !== "undefined" && ITEM_ZONE[name]) || null; }
// Zona area pickup (key transfer) atau "ubud". null kalau belum ke-map.
function pickupZoneOf(pk) {
  if (!pk || pk === "ubud") return "ubud";
  return (typeof TRANSFER_ZONE !== "undefined" && TRANSFER_ZONE[pk]) || null;
}
// Label area pickup buat UI (nama tanpa " Area – Ubud").
function pickupLabelOf(pk) {
  if (!pk || pk === "ubud") return "Ubud & nearby";
  return pk.replace(/\s*–\s*Ubud$/, "").replace(/\s*Area$/, "");
}
// Opsi dropdown pickup = SEMUA destinasi di prices.transfer + Ubud (base). Nggak ada list baru.
function pickupOptionsHTML(selected) {
  let html = '<option value="ubud">Ubud &amp; nearby</option>';
  Object.keys(prices.transfer).forEach((k) => {
    html += '<option value="' + k + '"' + (k === selected ? " selected" : "") + ">" + pickupLabelOf(k) + "</option>";
  });
  return html;
}
// Surcharge = 60% transfer one-way (Ubud->pickup) × jumlah mobil, cuma kalau pickup != Ubud
// DAN zona pickup != zona item. Transfer sendiri nggak kena. Angka cuma dipakai di konfirmasi.
function surchargeFor(name, guests) {
  const pk = currentStay || "ubud";
  if (pk === "ubud") return { usd: 0, idr: 0 };
  if (prices.transfer && prices.transfer[name]) return { usd: 0, idr: 0 };
  const pz = pickupZoneOf(pk), iz = itemZone(name) || "ubud";
  if (pz && pz === iz) return { usd: 0, idr: 0 };
  const t = prices.transfer[pk];
  if (!t) return { usd: 0, idr: 0 };
  const cars = (guests || currentGuests || DISPLAY_GUESTS) > 5 ? 2 : 1;
  return {
    usd: Math.round(t.usd * SURCHARGE_FACTOR) * cars,
    idr: Math.round((t.idr * SURCHARGE_FACTOR) / 1000) * 1000 * cars,
  };
}
function surchargeLabel(name) {
  const pk = currentStay || "ubud";
  if (pk === "ubud") return { has: false, txt: "No surcharge - pickup from Ubud" };
  if (prices.transfer && prices.transfer[name]) return { has: false, txt: "" };
  const pz = pickupZoneOf(pk), iz = itemZone(name) || "ubud";
  if (pz && pz === iz) return { has: false, txt: "No surcharge - you're in the tour area" };
  return { has: true, txt: "Pickup surcharge applied" };
}
// Set area pickup global (value = key transfer atau "ubud"): simpan + render ulang + sinkron.
function setStay(pk) {
  currentStay = pk && pk !== "ubud" ? pk : "";
  if (currentStay) localStorage.setItem("cue_stay", currentStay);
  else localStorage.removeItem("cue_stay");
  renderPrices();
  document.querySelectorAll("[data-stay-select]").forEach((s) => {
    const v = currentStay || "ubud";
    if (s.value !== v) s.value = v;
  });
  if (window.__bookingRefresh) window.__bookingRefresh();
  if (window.__tripbarRefresh) window.__tripbarRefresh();
  cselRefreshAll();
}

// Set range tanggal trip: simpan + refresh tripbar. Kalau "to" < "from", disamain.
function setDateRange(from, to) {
  from = from || "";
  to = to || "";
  if (from && to && to < from) to = from;
  currentDateFrom = from;
  currentDateTo = to;
  if (from) localStorage.setItem("cue_date_from", from); else localStorage.removeItem("cue_date_from");
  if (to) localStorage.setItem("cue_date_to", to); else localStorage.removeItem("cue_date_to");
  if (window.__tripbarRefresh) window.__tripbarRefresh();
}
// "2026-08-12" -> "12 Aug"
function fmtDateShort(v) {
  const p = (v || "").split("-");
  if (p.length !== 3) return v || "";
  const mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][parseInt(p[1], 10) - 1] || "";
  return parseInt(p[2], 10) + " " + mo;
}
// Range -> teks singkat: "12 Aug", "12–16 Aug", "28 Aug – 2 Sep", atau "".
function fmtDateRange(from, to) {
  if (!from && !to) return "";
  if (from && !to) return fmtDateShort(from);
  if (from === to) return fmtDateShort(from);
  const a = fmtDateShort(from), b = fmtDateShort(to);
  const am = a.split(" ")[1], bm = b.split(" ")[1];
  return am === bm ? a.split(" ")[0] + "–" + b : a + " – " + b;
}
// Jumlah hari dalam range (inklusif). 0 kalau kosong.
function rangeDays(from, to) {
  if (!from) return 0;
  if (!to || to === from) return 1;
  const pa = from.split("-"), pb = to.split("-");
  const da = Date.UTC(+pa[0], +pa[1] - 1, +pa[2]);
  const db = Date.UTC(+pb[0], +pb[1] - 1, +pb[2]);
  return Math.max(1, Math.round((db - da) / 86400000) + 1);
}

/* ---- Akun (passwordless) — token sesi + state ---- */
function getToken() { return localStorage.getItem(TOKEN_KEY) || ""; }
function setToken(t) { if (t) localStorage.setItem(TOKEN_KEY, t); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

// Magic link dari email ("My Trips"): kalau URL bawa ?token=, simpan (auto-login)
// lalu bersihin URL biar token gak keliatan/kebagikan.
function captureMagicToken() {
  try {
    const t = new URLSearchParams(location.search).get("token");
    if (t) { setToken(t); history.replaceState({}, "", location.pathname); }
  } catch (e) {}
}

// Ambil sesi dari token (kalau ada) -> isi currentAccount. Fail-soft (API belum siap = tetap guest).
async function acctFetchSession() {
  const t = getToken();
  if (!t) { currentAccount = null; return; }
  try {
    const r = await fetch(`${API_BASE}/account/session`, { headers: { Authorization: `Bearer ${t}` } });
    if (r.ok) { const d = await r.json(); currentAccount = d.account || null; }
    else if (r.status === 401) { clearToken(); currentAccount = null; } // token basi
  } catch (e) { /* API down -> diem, tetap guest */ }
}

// Cek ada booking mendatang (buat titik hijau navbar). Fail-soft.
async function acctRefreshUpcoming() {
  hasUpcoming = false;
  if (!getToken() || !currentAccount) return;
  try {
    const r = await fetch(`${API_BASE}/bookings/mine`, { headers: { Authorization: `Bearer ${getToken()}` } });
    if (r.ok) { const d = await r.json(); hasUpcoming = Array.isArray(d.upcoming) && d.upcoming.length > 0; }
  } catch (e) {}
}

// Buat akun dari form -> simpan token + login. Return true kalau sukses.
async function acctCreate({ name, email, phone }) {
  try {
    const r = await fetch(`${API_BASE}/account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, email, phone,
        guest_count_pref: currentGuests ? String(currentGuests) : "",
        stay_area_pref: currentStay || "",
      }),
    });
    const d = await r.json();
    if (r.ok && d.token) { setToken(d.token); currentAccount = d.account || null; renderAccount(); return true; }
    return false;
  } catch (e) { return false; }
}

// Sign in via email (magic link): minta backend kirim link sign-in ke email.
// Selalu anggap sukses kalau request-nya jalan (backend gak bocorin apakah email terdaftar).
async function acctRequestLogin(email) {
  try {
    const r = await fetch(`${API_BASE}/account/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return r.ok;
  } catch (e) { return false; }
}

function acctLogout() {
  clearToken(); currentAccount = null; hasUpcoming = false; renderAccount();
  // balik jadi guest tanpa popup — trip prefs bisa diedit dari search form / tripbar.
}

// Isi navbar sesuai state login (1 template, beda parameter). Aman kalau elemen belum ada.
function renderAccount() {
  const loggedIn = !!currentAccount;
  const nameFirst = loggedIn ? ((currentAccount.name || "").trim().split(" ")[0] || "there") : "Guest";
  const email = loggedIn ? (currentAccount.email || "") : "guest@gmail.com";
  document.querySelectorAll("[data-acct-greet]").forEach((el) => { el.textContent = loggedIn ? "Welcome back," : "Welcome,"; });
  document.querySelectorAll("[data-acct-name]").forEach((el) => { el.textContent = nameFirst; });
  document.querySelectorAll("[data-acct-email]").forEach((el) => { el.textContent = email; el.classList.toggle("is-placeholder", !loggedIn); });
  document.querySelectorAll("[data-acct-dot]").forEach((el) => { el.hidden = !(loggedIn && hasUpcoming); });
  document.querySelectorAll("[data-acct-auth]").forEach((el) => { el.dataset.mode = loggedIn ? "logout" : "create"; });
  document.querySelectorAll("[data-acct-auth-label]").forEach((el) => { el.textContent = loggedIn ? "Log out" : "Sign in / Sign up"; });
}

// Harga Exclusive buat N orang = harga standard (per mobil, ×2 kalau >5)
// + suplemen tiket per orang × N. Return null kalau program nggak punya versi Exclusive.
function exclusivePrice(name, guests) {
  const info = itemInfo(name);
  const sup = tourExclusive[name];
  if (!info || !sup) return null;
  const g = guests || currentGuests || DISPLAY_GUESTS;
  const car = carPrice(info.price, g);
  // total = (base per mobil + tiket x jumlah tamu) + fee internal, bulatkan KE ATAS
  // (USD ke dolar utuh, IDR ke 10 ribu). Fee jangan pernah muncul di UI.
  const usd = Math.ceil((car.usd + sup.usd * g) * (1 + EXCLUSIVE_FEE));
  const idr = Math.ceil(((car.idr + sup.idr * g) * (1 + EXCLUSIVE_FEE)) / 10000) * 10000;
  return { usd: usd, idr: idr };
}

// Harga charter (per mobil, TIDAK tergantung jumlah orang): base durasi
// (half / full / extended + extra jam) + surcharge kalau pickup di luar Ubud.
// dur "" -> 0. Dipakai bareng charter.html & builder itinerary (DRY).
function charterPrice(area, dur, extra) {
  let b;
  if (dur === "half") b = { usd: CHARTER.half.usd, idr: CHARTER.half.idr };
  else if (dur === "full") b = { usd: CHARTER.full.usd, idr: CHARTER.full.idr };
  else if (dur === "extended") {
    const e = parseInt(extra) || 1;
    b = {
      usd: CHARTER.full.usd + e * CHARTER.extHourUsd,
      idr: CHARTER.full.idr + e * CHARTER.extHourIdr
    };
  } else return { usd: 0, idr: 0 };
  if (area && area !== "Ubud") {
    b.usd += CHARTER.surchargeUsd;
    b.idr += CHARTER.surchargeIdr;
  }
  return b;
}

function itnLoad() {
  try {
    const s = JSON.parse(localStorage.getItem(ITN_KEY));
    if (s && Array.isArray(s.days) && Array.isArray(s.transfers)) {
      if (!Array.isArray(s.charters)) s.charters = []; // kompat state lama (sebelum charter)
      return s;
    }
  } catch (e) {}
  return { days: [], transfers: [], charters: [] };
}

function itnSave(state) {
  localStorage.setItem(ITN_KEY, JSON.stringify(state));
  itnUpdateBadge(state);
}

function itnCount(state) {
  const st = state || itnLoad();
  let n = 0;
  st.days.forEach((d) => (n += d.items.length));
  return n + st.transfers.length + (st.charters ? st.charters.length : 0);
}

function itnUpdateBadge(state) {
  const n = itnCount(state);
  document.querySelectorAll("[data-itn-badge]").forEach((b) => {
    b.textContent = n;
    b.hidden = n === 0;
  });
}

function newItnDay() {
  return { items: [], date: "", guests: "", pickup: "", dropoff: "" };
}

// Bangun state itinerary dari "suggested plan": nDays tour pertama dari SUGGEST jadi
// 1 hari masing-masing, + 2 transfer airport (jemput "to" & antar "from"). Guests keisi
// semua (diisi sekali di boks). Sisi airport pickup/drop-off di-prefill; sisi hotel kosong
// biar user isi (nanti auto-nyebar). Tanggal kosong -> user isi (baris pertama auto-cascade).
function suggestState(nDays, guests) {
  const g = guests || "";
  const days = SUGGEST.slice(0, nDays).map((name) => {
    const d = newItnDay();
    d.items.push(name);
    d.guests = g;
    return d;
  });
  const transfers = [
    { route: PKG_AIRPORT, direction: "to", pickup: PKG_AIRPORT_PLACE, dropoff: "", date: "", guests: g },
    { route: PKG_AIRPORT, direction: "from", pickup: "", dropoff: PKG_AIRPORT_PLACE, date: "", guests: g }
  ];
  return { days, transfers, charters: [] };
}

// "YYYY-MM-DD" + n hari (UTC biar nggak kena timezone). "" kalau input kosong.
function addDaysStr(ds, n) {
  if (!ds) return "";
  const p = ds.split("-");
  const dt = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
  dt.setUTCDate(dt.getUTCDate() + n);
  const z = (x) => ("0" + x).slice(-2);
  return dt.getUTCFullYear() + "-" + z(dt.getUTCMonth() + 1) + "-" + z(dt.getUTCDate());
}

// "YYYY-MM-DD" -> "Tue, 12 Aug" (buat chip ringkasan hari di builder itinerary)
function fmtDayDate(ds) {
  if (!ds) return "";
  const dt = new Date(ds + "T00:00:00");
  if (isNaN(dt)) return ds;
  return dt.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

// Jam "HH:MM" (24h) -> "3:00 pm" (12h) buat tampilan. Kosong -> "".
function fmtTime(hm) {
  if (!hm) return "";
  const p = hm.split(":");
  if (p.length < 2) return hm;
  let h = +p[0]; const m = p[1];
  const ap = h < 12 ? "am" : "pm";
  h = h % 12; if (h === 0) h = 12;
  return h + ":" + m + " " + ap;
}

// Peta nama program -> halaman detailnya (kebalikan PAGE_ITEM), buat tombol "View details".
const ITEM_URL = Object.keys(PAGE_ITEM).reduce((m, page) => {
  m[PAGE_ITEM[page]] = page;
  return m;
}, {});

// Tambah 1 program ke store. Masuk ke hari terakhir kalau slotnya cukup,
// kalau nggak muat -> bikin hari baru. Return true kalau berhasil.
// Tanpa slot: tiap program yang ditambah = 1 hari baru (add bebas).
function itnAddItem(name) {
  const info = itemInfo(name);
  if (!info || info.cat === "villa") return false; // cuma tour/experience/performance/combo
  const st = itnLoad();
  const d = newItnDay();
  d.items.push(name);
  st.days.push(d);
  itnSave(st);
  return true;
}

// Tambah 1 transfer/journey ke store. Toleran beda tanda hubung (- vs –).
function itnAddTransfer(route) {
  let key = prices.transfer[route] ? route : null;
  if (!key) {
    const norm = (s) => s.replace(/[–—-]/g, "-");
    key = Object.keys(prices.transfer).find((k) => norm(k) === norm(route)) || null;
  }
  if (!key) return false;
  const st = itnLoad();
  st.transfers.push({
    route: key,
    direction: "to",
    pickup: "",
    dropoff: "",
    date: "",
    guests: ""
  });
  itnSave(st);
  return true;
}

// -- ui popup
// Popup setelah nambah program: Go to itinerary / Continue exploring
function showAddedPopup() {
  let m = document.getElementById("itn-added-modal");
  if (!m) {
    m = document.createElement("div");
    m.className = "modal";
    m.id = "itn-added-modal";
    m.innerHTML =
      '<div class="modal__box modal__box--sm">' +
      '<div class="modal__success-icon">&check;</div>' +
      '<h3 class="modal__title">Added to My Trips</h3>' +
      '<p class="modal__sub">What would you like to do next?</p>' +
      '<button class="modal__btn" id="itn-added-go">Go to My Trips</button>' +
      '<button class="modal__btn modal__btn--ghost" id="itn-added-continue">Continue exploring</button>' +
      "</div>";
    document.body.appendChild(m);
    m.addEventListener("click", (e) => {
      if (e.target === m) m.classList.remove("active");
    });
    m.querySelector("#itn-added-go").addEventListener(
      "click",
      () => (window.location.href = "my-trips.html")
    );
    m.querySelector("#itn-added-continue").addEventListener("click", () =>
      m.classList.remove("active")
    );
  }
  m.classList.add("active");
}

// ===== Book Now universal: popup tanggal -> tambah ke cart (My Trips) =====
// Toast kecil di bawah layar.
function cartToast(msg) {
  let t = document.getElementById("cart-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "cart-toast";
    t.className = "cart-toast";
    document.body.appendChild(t);
  }
  t.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span>' + msg + "</span>";
  t.classList.add("show");
  clearTimeout(t.__h);
  t.__h = setTimeout(() => t.classList.remove("show"), 2600);
}

// Popup konfirmasi generik (Confirm / Cancel), gaya modal situs.
function cartConfirm(title, text, yesLabel, onYes, onNo) {
  const m = document.createElement("div");
  m.className = "modal active";
  m.innerHTML =
    '<div class="modal__box modal__box--sm">' +
    '<h3 class="modal__title">' + title + "</h3>" +
    '<p class="modal__sub">' + text + "</p>" +
    '<button class="modal__btn" data-yes>' + yesLabel + "</button>" +
    '<button class="modal__btn modal__btn--ghost" data-no>Cancel</button></div>';
  document.body.appendChild(m);
  const close = () => m.remove();
  const cancel = () => { close(); if (onNo) onNo(); };
  m.addEventListener("click", (e) => { if (e.target === m) cancel(); });
  m.querySelector("[data-no]").addEventListener("click", cancel);
  m.querySelector("[data-yes]").addEventListener("click", () => { close(); onYes(); });
}

// Popup pilih tanggal standalone (reuse gaya kalender .hs-cal). onPick(YYYY-MM-DD).
// Popup pilih tanggal (Book Now / + My Trips). Pakai chrome + kalender yg SAMA
// PERSIS dg date picker booking form (.hs-panel bk-panel--cal + .hs-cal bk-cal) biar
// konsisten: bottom-sheet di HP, kartu ke-center di desktop (via .bookdate-panel).
function bookDatePopup(title, onPick, initial) {
  const now = new Date();
  const TODAY = { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
  const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const MONS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const pad = (n) => String(n).padStart(2, "0");
  const keyOf = (o) => o.y * 10000 + o.m * 100 + o.d;
  // initial "YYYY-MM-DD" (opsional) -> kalender kebuka dgn tanggal itu udah kepilih.
  let sel = null;
  if (initial) {
    const ip = String(initial).split("-");
    if (ip.length === 3) sel = { y: +ip[0], m: +ip[1] - 1, d: +ip[2] };
  }

  const overlay = document.createElement("div");
  overlay.className = "hs-overlay open";
  const panel = document.createElement("div");
  panel.className = "hs-panel bk-panel bk-panel--cal bookdate-panel open";
  panel.innerHTML =
    '<div class="hs-panel__head"><h3>Select date</h3>' +
    '<button type="button" class="hs-panel__close" aria-label="Close">&times;</button></div>' +
    '<div class="hs-cal bk-cal"></div>' +
    '<div class="hs-cal__foot"><span class="hs-cal__hint">Pick a date</span>' +
    '<button type="button" class="hs-cal__apply" disabled>Apply</button></div>';
  document.body.appendChild(overlay);
  document.body.appendChild(panel);
  hsScrollLock(true);

  const calBody = panel.querySelector(".bk-cal");
  const hint = panel.querySelector(".hs-cal__hint");
  const applyBtn = panel.querySelector(".hs-cal__apply");
  if (sel) { hint.textContent = MONS[sel.m] + " " + sel.d; applyBtn.disabled = false; }
  const close = () => { panel.remove(); overlay.remove(); hsScrollLock(false); };
  function monthEl(y, mo) {
    const el = document.createElement("div");
    el.className = "hs-cal__m";
    const cap = document.createElement("div");
    cap.className = "hs-cal__cap";
    cap.textContent = MON[mo] + " " + y;
    el.appendChild(cap);
    const g = document.createElement("div");
    g.className = "hs-cal__grid";
    DOW.forEach((d) => { const h = document.createElement("div"); h.className = "hs-cal__dow"; h.textContent = d; g.appendChild(h); });
    const first = new Date(y, mo, 1).getDay(), days = new Date(y, mo + 1, 0).getDate();
    for (let i = 0; i < first; i++) { const o = document.createElement("div"); o.className = "hs-cal__d is-off"; g.appendChild(o); }
    for (let d = 1; d <= days; d++) {
      const cell = { y: y, m: mo, d: d };
      const b = document.createElement("button");
      b.type = "button"; b.className = "hs-cal__d"; b.textContent = d;
      const past = keyOf(cell) < keyOf(TODAY);
      if (past) b.classList.add("is-off");
      if (cell.y === TODAY.y && cell.m === TODAY.m && cell.d === TODAY.d) b.classList.add("today");
      if (sel && keyOf(cell) === keyOf(sel)) b.classList.add("sel");
      if (!past) b.addEventListener("click", (e) => { e.stopPropagation(); sel = cell; render(); hint.textContent = MONS[sel.m] + " " + sel.d; applyBtn.disabled = false; });
      g.appendChild(b);
    }
    el.appendChild(g);
    return el;
  }
  function render() {
    calBody.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "hs-cal__months";
    for (let k = 0; k < 13; k++) { let mm = TODAY.m + k, yy = TODAY.y; while (mm > 11) { mm -= 12; yy++; } wrap.appendChild(monthEl(yy, mm)); }
    calBody.appendChild(wrap);
  }
  render();
  // Gulung ke bulan yang lagi kepilih (kalender nampilin 13 bulan ke depan).
  if (sel) {
    const selEl = calBody.querySelector(".hs-cal__d.sel");
    if (selEl) calBody.scrollTop += selEl.getBoundingClientRect().top - calBody.getBoundingClientRect().top - calBody.clientHeight / 2;
  }
  applyBtn.addEventListener("click", (e) => { e.stopPropagation(); if (!sel) return; const ds = sel.y + "-" + pad(sel.m + 1) + "-" + pad(sel.d); close(); onPick(ds); });
  panel.querySelector(".hs-panel__close").addEventListener("click", (e) => { e.stopPropagation(); close(); });
  overlay.addEventListener("click", close);
}

// full-day? (tour/combo dianggap seharian -> buat cek bentrok tanggal)
function isFullDay(name) {
  const i = itemInfo(name);
  return !!i && (i.cat === "tour" || i.cat === "combo");
}

// Tambah item ber-tanggal ke cart (cue_itinerary_v1). type: tour/experience/performance/transfer.
function cartAddDated(type, name, date, mode) {
  if (type === "transfer") {
    const norm = (s) => String(s).replace(/[–—-]/g, "-");
    const key = prices.transfer[name] ? name : Object.keys(prices.transfer).find((k) => norm(k) === norm(name));
    if (!key) return false;
    const st = itnLoad();
    st.transfers.push({ route: key, direction: "to", pickup: "", dropoff: "", date: date, guests: "" });
    itnSave(st);
  } else {
    const info = itemInfo(name);
    if (!info || info.cat === "villa") return false;
    const st = itnLoad();
    const d = newItnDay();
    d.items.push(name);
    if (mode) d.itemModes = [mode];
    d.date = date;
    st.days.push(d);
    itnSave(st);
  }
  cartToast("Added to My Trips");
  return true;
}

// Add + cek bentrok (2 full-day tour tanggal sama -> konfirmasi, bukan blokir).
function cartAddChecked(type, name, date, mode) {
  if (type !== "transfer" && isFullDay(name)) {
    const st = itnLoad();
    const clash = st.days.some((dd) => dd.date === date && (dd.items || []).some((it) => isFullDay(it)));
    if (clash) {
      cartConfirm(
        "Two full-day tours?",
        "You already have a full-day tour on that date. Add another anyway?",
        "Add anyway",
        () => cartAddDated(type, name, date, mode)
      );
      return;
    }
  }
  cartAddDated(type, name, date, mode);
}

// Book Now universal: buka popup tanggal -> add (dgn cek bentrok).
function bookNow(type, name, mode) {
  bookDatePopup(name, (date) => cartAddChecked(type, name, date, mode));
}

// Add sebuah program (tour/experience/place) ke My Trips lewat popup tanggal.
// Type dari kategori aslinya (cuma "transfer" yg dibedain di cartAddDated).
function bookItem(name) {
  const info = itemInfo(name);
  bookNow(info ? info.cat : "tour", name);
}

/* ---------- My Trips cart: pricing + flatten (mirror global dari closure initItinerary) ----------
   Item cart (Book Now) nyimpen day/transfer dgn guests kosong -> default ke jumlah tamu
   global (currentGuests) atau 2. Semua harga pakai helper global yg sama dg builder lama. */
function cartGuestsOf(row) {
  return parseInt(row && row.guests) || currentGuests || DISPLAY_GUESTS;
}
function cartItemMode(d, idx) { return (d.itemModes && d.itemModes[idx]) || "standard"; }
function cartDayPrice(d) {
  let usd = 0, idr = 0;
  const g = cartGuestsOf(d);
  (d.items || []).forEach((name, idx) => {
    const info = itemInfo(name);
    if (!info) return;
    if (info.cat === "tour" || info.cat === "combo") {
      const p = cartItemMode(d, idx) === "exclusive" && tourExclusive[name]
        ? exclusivePrice(name, g) : carPrice(info.price, g);
      usd += p.usd; idr += p.idr;
    } else {
      const t = transport[name] || { usd: 0, idr: 0 };
      usd += info.price.usd * g + t.usd;
      idr += info.price.idr * g + t.idr;
    }
  });
  return { usd, idr };
}
function cartTransferPrice(tr) {
  if (!prices.transfer[tr.route]) return { usd: 0, idr: 0 };
  const base = carPrice(prices.transfer[tr.route], cartGuestsOf(tr));
  // Return trip = 2 arah, diskon 10%.
  if (tr.return) return { usd: Math.round(base.usd * 2 * 0.9), idr: Math.round(base.idr * 2 * 0.9) };
  return base;
}
function cartCharterPrice(ch) { return charterPrice(ch.area, ch.dur, ch.extra); }

// Ikon kecil per jenis item (SVG, no emoji) buat kartu My Trips.
function cartIcon(kind) {
  const P = {
    tour: '<path d="M9 3 3 5.5v15.5L9 18.5l6 2.5 6-2.5V5.5L15 8 9 5.5z"/><path d="M9 5.5v13M15 8v13"/>',
    experience: '<path d="M12 3l2.6 5.3 5.9.8-4.3 4.1 1 5.8L12 21.3 6.8 19l1-5.8-4.3-4.1 5.9-.8z"/>',
    transfer: '<path d="M4 16.5h16M5.5 16.5V11l1.7-4h9.6l1.7 4v5.5"/><circle cx="8" cy="16.5" r="1.6"/><circle cx="16" cy="16.5" r="1.6"/>',
    charter: '<rect x="3" y="8" width="18" height="8.5" rx="2"/><path d="M7 8V5.5h10V8"/><circle cx="8" cy="18" r="1.4"/><circle cx="16" cy="18" r="1.4"/>',
    place: '<path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.4"/>'
  };
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[kind] || P.tour) + '</svg>';
}

// deskripsi singkat per kategori (di bawah judul kartu)
const CART_CAT_DESC = {
  tour: "Private day tour", combo: "Combo day tour", experience: "Guided experience",
  performance: "Cultural show", place: "Destination visit", villa: "Villa stay"
};

function cartDayTitle(d) {
  return (d.items || []).map((n, i) => n + (cartItemMode(d, i) === "exclusive" ? " (Exclusive)" : "")).join(" + ");
}
function cartTransferTitle(tr) {
  const area = tr.route.replace(" – Ubud", "");
  const base = tr.direction === "from" ? "Ubud → " + area : area + " → Ubud";
  return tr.return ? base + " (return)" : base;
}
function cartCharterTitle(ch) {
  const dur = ch.dur === "half" ? "Half Day (5h)" : ch.dur === "full" ? "Full Day (10h)"
    : ch.dur === "extended" ? "Extended (10h + " + (parseInt(ch.extra) || 1) + "h)" : "";
  return (dur ? dur + " " : "") + "charter from " + ch.area;
}

// Ratakan state itinerary -> daftar baris kartu {ref,kind,title,desc,date,usd,idr}.
function cartFlatten(state) {
  const rows = [];
  (state.days || []).forEach((d, idx) => {
    if (!d.items || !d.items.length) return;
    const info = itemInfo(d.items[0]);
    const cat = info ? info.cat : "tour";
    const kind = cat === "combo" ? "tour" : (cat === "performance" ? "experience" : cat);
    const p = cartDayPrice(d);
    rows.push({ ref: { type: "day", idx }, kind, title: cartDayTitle(d),
      desc: (CART_CAT_DESC[cat] || "Experience") + " · " + cartGuestsOf(d) + " guests",
      img: (ITEM_CARD[d.items[0]] || {}).img || "",
      date: d.date || "", usd: p.usd, idr: p.idr });
  });
  (state.transfers || []).forEach((tr, idx) => {
    const p = cartTransferPrice(tr);
    rows.push({ ref: { type: "transfer", idx }, kind: "transfer", title: cartTransferTitle(tr),
      desc: "Private transfer · " + cartGuestsOf(tr) + " guests",
      date: tr.date || "", usd: p.usd, idr: p.idr });
  });
  (state.charters || []).forEach((ch, idx) => {
    const p = cartCharterPrice(ch);
    rows.push({ ref: { type: "charter", idx }, kind: "charter", title: cartCharterTitle(ch),
      desc: "Private charter · " + cartGuestsOf(ch) + " guests",
      date: ch.date || "", usd: p.usd, idr: p.idr });
  });
  return rows;
}

// Hapus 1 baris cart lewat ref-nya (dipakai tombol × kartu My Trips).
function cartRemove(type, idx) {
  const st = itnLoad();
  if (type === "day") st.days.splice(idx, 1);
  else if (type === "transfer") st.transfers.splice(idx, 1);
  else if (type === "charter") (st.charters || []).splice(idx, 1);
  itnSave(st);
}

// Ambil objek baris cart dari ref-nya {type, idx}.
function cartRowAt(state, ref) {
  const list = ref.type === "day" ? state.days : ref.type === "transfer" ? state.transfers : state.charters;
  return (list || [])[ref.idx];
}

// Tanggal cart = CASCADE. Set tanggal baris ke-pos, terus kartu di BAWAHNYA nyusul
// berurutan (+1 hari tiap kartu, atas ke bawah). Kartu di ATASNYA gak disentuh.
// pos = posisi di urutan tampil (cartFlatten: days -> transfers -> charters).
//
// TRANSFER DIKECUALIIN: dia antar-jemput, bukan "hari kegiatan" — tanggalnya
// berdiri sendiri, gak ikut kegeser, dan gak makan jatah hari buat kartu di
// bawahnya. Charter TETAP ikut cascade (itu sewa mobil seharian = 1 hari).
// Ngedit langsung ke object state — pemanggil yang nentuin kapan itnSave.
function cartCascadeFrom(state, pos, date) {
  const order = cartFlatten(state).map((r) => r.ref);
  const target = order[pos];
  if (!target) return;
  if (target.type === "transfer") {
    const row = cartRowAt(state, target);
    if (row) row.date = date;
    return;
  }
  let step = 0;
  for (let i = pos; i < order.length; i++) {
    if (order[i].type === "transfer") continue;
    const row = cartRowAt(state, order[i]);
    if (row) row.date = addDaysStr(date, step);
    step++;
  }
}

// Bentrok? 2 tour seharian di tanggal yang sama — dicek dari hasil cascade, bukan
// dari 1 baris doang. Aturannya sama kayak pas nambah item (cartAddChecked).
function cartHasClash(state) {
  const seen = {};
  return (state.days || []).some((d) => {
    if (!d.date || !(d.items || []).some(isFullDay)) return false;
    if (seen[d.date]) return true;
    seen[d.date] = true;
    return false;
  });
}

// Ikon hati (toggle "ada di trip"): keisi = udah masuk cart, kosong = belum.
function cartHeartIcon(on) {
  return '<svg viewBox="0 0 24 24" fill="' + (on ? "currentColor" : "none") +
    '" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 20.3 4.7 13a4.6 4.6 0 0 1 6.5-6.5l.8.8.8-.8A4.6 4.6 0 0 1 19.3 13z"/></svg>';
}

// "YYYY-MM-DD" -> "19 August" (tanggal di kartu). Kosong -> "Date to be set".
function fmtGroupDate(ds) {
  if (!ds) return "Date to be set";
  const dt = new Date(ds + "T00:00:00");
  if (isNaN(dt)) return ds;
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

/* ---------- Referral discount (Fase D isi datanya; di sini cuma pembaca) ----------
   Disimpan di localStorage cue_referral = {code, pct}. Belum ada -> null (no discount). */
function activeReferral() {
  try { return JSON.parse(localStorage.getItem("cue_referral")) || null; } catch (e) { return null; }
}
function refDiscountPct() { const r = activeReferral(); return (r && r.pct) ? r.pct : 0; }
function applyReferral(usd, idr) {
  const pct = refDiscountPct();
  if (!pct) return { usd, idr };
  return { usd: usd * (1 - pct / 100), idr: idr * (1 - pct / 100) };
}
// Harga tampil: kalau ada referral -> harga asli dicoret + harga diskon (emas).
function cartPriceTag(usd, idr) {
  const pct = refDiscountPct();
  if (!pct) return '<span class="price-cur">' + fmtMoney(usd, idr) + "</span>";
  const d = applyReferral(usd, idr);
  return '<span class="price-was">' + fmtMoney(usd, idr) + "</span> " +
    '<span class="price-cur">' + fmtMoney(d.usd, d.idr) + "</span>";
}

// Tag harga TOTAL dari banyak baris: dijumlah PER-BARIS di currency tampilan (biar
// total == jumlah angka yg keliatan di tiap kartu, & nyamain checkout yg round per-line).
function cartPriceTagSum(rows) {
  const cur = currentCurrency;
  const fmt = (v) => (CUR_SYMBOL[cur] || cur + " ") + v.toLocaleString(cur === "IDR" ? "id-ID" : "en-US");
  let wasV = 0, nowV = 0;
  rows.forEach((r) => {
    wasV += toCurrency(r.usd, r.idr);
    const d = applyReferral(r.usd, r.idr);
    nowV += toCurrency(d.usd, d.idr);
  });
  if (!refDiscountPct()) return '<span class="price-cur">' + fmt(wasV) + "</span>";
  return '<span class="price-was">' + fmt(wasV) + "</span> " +
    '<span class="price-cur">' + fmt(nowV) + "</span>";
}

// Validasi kode -> simpan {code, pct} di localStorage. Return pct (0 kalau invalid).
// REFERRAL (data.js) = { KODE: persen }. Kode di-uppercase & di-trim.
function referralLookup(code) {
  const k = String(code || "").trim().toUpperCase();
  return (typeof REFERRAL !== "undefined" && REFERRAL[k]) ? { code: k, pct: REFERRAL[k] } : null;
}
function saveReferral(entry) {
  if (entry) localStorage.setItem("cue_referral", JSON.stringify(entry));
  else localStorage.removeItem("cue_referral");
  // update semua harga + tampilan referral + My Trips (kalau lagi kebuka)
  renderPrices();
  if (window.__referralRefresh) window.__referralRefresh();
  if (window.__myTripsRefresh) window.__myTripsRefresh();
}

// Hari ini format YYYY-MM-DD (waktu lokal, bukan UTC - hindari geser hari di Bali)
function todayStr() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// Popup konfirmasi kalau program yang sama udah pernah ditambah ke itinerary
function showConfirmDuplicate(name, onConfirm) {
  let m = document.getElementById("itn-dup-modal");
  if (!m) {
    m = document.createElement("div");
    m.className = "modal";
    m.id = "itn-dup-modal";
    m.innerHTML =
      '<div class="modal__box modal__box--sm">' +
      '<h3 class="modal__title">Add this again?</h3>' +
      '<p class="modal__sub" id="itn-dup-text"></p>' +
      '<button class="modal__btn" id="itn-dup-yes">Add again</button>' +
      '<button class="modal__btn modal__btn--ghost" id="itn-dup-no">Cancel</button>' +
      "</div>";
    document.body.appendChild(m);
    m.addEventListener("click", (e) => {
      if (e.target === m) m.classList.remove("active");
    });
    m.querySelector("#itn-dup-no").addEventListener("click", () =>
      m.classList.remove("active")
    );
  }
  m.querySelector("#itn-dup-text").textContent =
    "You've already added " + name + " to your itinerary. Add it again anyway?";
  // pasang ulang handler tiap tampil biar callback-nya selalu yang terbaru
  m.querySelector("#itn-dup-yes").onclick = () => {
    m.classList.remove("active");
    onConfirm();
  };
  m.classList.add("active");
}

// Wrapper add: cek duplikat dulu, baru tambah + popup sukses
function tryAddItem(name) {
  const st = itnLoad();
  if (st.days.some((d) => d.items.includes(name))) {
    showConfirmDuplicate(name, () => {
      if (itnAddItem(name)) showAddedPopup();
    });
    return;
  }
  if (itnAddItem(name)) showAddedPopup();
}

// Popup booking hari-ini: arahin ke WhatsApp biar konfirmasi lebih cepat
function showSameDayWa(guests, service, date) {
  let m = document.getElementById("same-day-modal");
  if (!m) {
    m = document.createElement("div");
    m.className = "modal";
    m.id = "same-day-modal";
    m.innerHTML =
      '<div class="modal__box modal__box--sm">' +
      '<h3 class="modal__title">Booking for today?</h3>' +
      '<p class="modal__sub">For same-day trips, please chat with us on WhatsApp so we can confirm faster.</p>' +
      '<button class="modal__btn" id="same-day-wa">Chat via WhatsApp</button>' +
      '<button class="modal__btn modal__btn--ghost" id="same-day-cancel">Cancel</button>' +
      "</div>";
    document.body.appendChild(m);
    m.addEventListener("click", (e) => {
      if (e.target === m) m.classList.remove("active");
    });
    m.querySelector("#same-day-cancel").addEventListener("click", () =>
      m.classList.remove("active")
    );
  }
  m.querySelector("#same-day-wa").onclick = () => {
    const message =
      "Hello, I'd like to book for today:\n" +
      "Guests: " + guests + "\n" +
      "Service: " + service + "\n" +
      "Date: " + date + "\n" +
      "Could we arrange this quickly?";
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    m.classList.remove("active");
  };
  m.classList.add("active");
}

// Popup tanggal lampau (booking & itinerary) - pengganti alert
function showPastDate() {
  let m = document.getElementById("past-date-modal");
  if (!m) {
    m = document.createElement("div");
    m.className = "modal";
    m.id = "past-date-modal";
    m.innerHTML =
      '<div class="modal__box modal__box--sm">' +
      '<h3 class="modal__title">Pick an upcoming date</h3>' +
      '<p class="modal__sub">That date has already passed. Please choose a date from today onwards.</p>' +
      '<button class="modal__btn" id="past-date-ok">OK</button>' +
      "</div>";
    document.body.appendChild(m);
    m.addEventListener("click", (e) => {
      if (e.target === m) m.classList.remove("active");
    });
    m.querySelector("#past-date-ok").addEventListener("click", () =>
      m.classList.remove("active")
    );
  }
  m.classList.add("active");
}

/* ==================== 3. PARTIALS LOADER ==================== */

async function loadPartials() {
  const partials = [
    { id: "navbar-placeholder", file: "partials/navbar.html" },
    // book-modal HARUS sebelum booking-placeholder: dia inject wrapper modal
    // yang di dalamnya ada #booking-placeholder, baru booking.html masuk situ.
    { id: "book-modal-placeholder", file: "partials/book-modal.html" },
    { id: "booking-placeholder", file: "partials/booking.html" },
    // Search form homepage (partial terpisah; booking.html tetap utuh buat halaman kategori)
    { id: "search-placeholder", file: "partials/search.html" },
    { id: "book-confirm-placeholder", file: "partials/book-confirm.html" },
    { id: "drivers-placeholder", file: "partials/drivers.html" },
    { id: "guest-gallery-placeholder", file: "partials/guest-gallery.html" },
    { id: "reviews-placeholder", file: "partials/reviews.html" },
    { id: "footer-placeholder", file: "partials/footer.html" }
  ];
  // Fetch semua partial PARALEL (dulu sekuensial -> 8 round-trip berurutan, lambat di HP:
  // form booking di hero baru nongol setelah navbar+book-modal selesai). Sekarang network
  // serempak, tapi INJEKSI tetap berurutan (book-modal harus masuk sebelum booking, karena
  // #booking-placeholder-nya ada di dalam wrapper yang di-inject book-modal).
  const texts = await Promise.all(
    partials.map((part) => {
      const holder = document.getElementById(part.id);
      const file = (holder && holder.dataset.src) || part.file;
      return fetch(`${file}?v=${PARTIALS_VERSION}`)
        .then((res) => res.text())
        .catch(() => "");
    })
  );
  partials.forEach((part, i) => {
    const holder = document.getElementById(part.id);
    if (!holder) return;
    holder.innerHTML = texts[i];
    // book-modal: turunin data-default/data-item halaman ke #booking-placeholder di dalamnya
    if (part.id === "book-modal-placeholder") {
      const inner = holder.querySelector("#booking-placeholder");
      if (inner) {
        if (holder.dataset.default) inner.dataset.default = holder.dataset.default;
        if (holder.dataset.item) inner.dataset.item = holder.dataset.item;
      }
    }
  });
}

/* ==================== 4. INIT (per fitur, dipanggil dari initPage) ==================== */

function initNavbar() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  if (!hamburger || !navMenu) return;

  const isMobileNav = () => window.matchMedia("(max-width: 992px)").matches;
  const acctPanel = document.querySelector("[data-acct-panel]");

  // Scrim (dim) buat drawer di HP
  let scrim = document.querySelector(".navbar__scrim");
  if (!scrim) { scrim = document.createElement("div"); scrim.className = "navbar__scrim"; document.body.appendChild(scrim); }

  // Inject header (judul + tombol close) ke tiap drawer; tampil cuma di mobile (CSS).
  function addDrawerHead(container, title, tag) {
    if (!container || container.querySelector(".navbar__drawerhead")) return;
    const head = document.createElement(tag);
    head.className = "navbar__drawerhead";
    head.innerHTML = '<span class="navbar__drawertitle">' + title + '</span><button type="button" class="navbar__drawerclose" aria-label="Close">&times;</button>';
    container.insertBefore(head, container.firstChild);
    head.querySelector(".navbar__drawerclose").addEventListener("click", (e) => { e.stopPropagation(); closeNavDrawers(); });
  }
  addDrawerHead(navMenu, "Menu", "li");
  addDrawerHead(acctPanel, "Account", "div");

  const anyDrawerOpen = () => navMenu.classList.contains("active") || !!document.querySelector("[data-acct-panel].is-open");
  function syncNavDrawer() {
    const open = isMobileNav() && anyDrawerOpen();
    scrim.classList.toggle("open", open);
    hsScrollLock(open);
  }
  function closeNavDrawers() {
    navMenu.classList.remove("active");
    document.querySelectorAll("[data-acct-panel].is-open").forEach((p) => {
      p.classList.remove("is-open");
      const acct = p.closest("[data-acct]");
      const b = acct && acct.querySelector("[data-acct-toggle]");
      if (b) b.setAttribute("aria-expanded", "false");
    });
    syncNavDrawer();
  }
  window.__navDrawerSync = syncNavDrawer;
  window.__navDrawerClose = closeNavDrawers;

  hamburger.addEventListener("click", () => {
    const opening = !navMenu.classList.contains("active");
    // Buka menu -> tutup dropdown akun biar gak numpuk (bergantian).
    if (opening) {
      document.querySelectorAll("[data-acct-panel].is-open").forEach((panel) => {
        panel.classList.remove("is-open");
        const acct = panel.closest("[data-acct]");
        const b = acct && acct.querySelector("[data-acct-toggle]");
        if (b) b.setAttribute("aria-expanded", "false");
      });
    }
    navMenu.classList.toggle("active");
    syncNavDrawer();
  });
  scrim.addEventListener("click", closeNavDrawers);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNavDrawers(); });
  window.addEventListener("resize", () => { if (!isMobileNav()) closeNavDrawers(); else syncNavDrawer(); });

  // Dropdown "Program" (tap/klik buat toggle, di desktop juga jalan via hover)
  const drop = navMenu.querySelector(".navbar__has-drop");
  const dropToggle = navMenu.querySelector(".navbar__droptoggle");
  if (drop && dropToggle) {
    dropToggle.addEventListener("click", () => {
      const open = drop.classList.toggle("open");
      dropToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Mobile: submenu Program tertutup default, kebuka pas tombol Program diklik.
  }

  const current = location.pathname.split("/").pop() || "index.html";
  navMenu.querySelectorAll("a").forEach((link) => {
    if (link.getAttribute("href") === current) link.classList.add("active");
  });
}

// Modal konfirmasi booking - SATU buat semua flow (tour/experience/transfer/charter/itinerary).
// Diisi & dibuka lewat window.__openBooking(opts); submit -> JSON ke backend (API_ENDPOINT).
function initBookingConfirm() {
  const modal = document.getElementById("booking-modal");
  if (!modal) return;

  const el = (id) => document.getElementById(id);
  const modalForm = el("modal-form"), modalSuccess = el("modal-success");
  const nameI = el("booker-name"), phoneI = el("booker-phone"), emailI = el("booker-email");
  const pickupI = el("pickup"), pickupLabel = el("pickup-label");
  const dropoffI = el("dropoff"), dropoffLabel = el("dropoff-label");
  const referralI = el("referral"), applyRef = el("apply-referral"), refMsg = el("referral-msg");
  const sumGuest = el("sum-guest"), sumService = el("sum-service"), sumDate = el("sum-date"), sumPrice = el("sum-price");
  const sumSurcharge = el("sum-surcharge"), rowSurcharge = el("row-surcharge");
  const modalDetails = el("modal-details"), detailsToggle = el("details-toggle"), detailsList = el("details-list");
  const bookSubmit = el("book-submit"), discussWa = el("discuss-wa");
  const modalClose = el("modal-close"), successClose = el("success-close");

  let ctx = null; // konteks booking yang lagi dikonfirmasi

  const renderInto = (elx, usd, idr) => { elx.innerHTML = priceHTML(usd, idr); };

  // opts direct/charter: { type, service, guests, date, price:{usd,idr}, pickup,
  //   pickupOptional, dropoffRequired, referralEligible, detailLines }
  // opts itinerary: { ..., lines:[{type,service,date,guests,pickup,dropoff,usd,idr,day_no,eligible}] }
  // Total semua line (final = setelah diskon, base = harga asli).
  function recalcTotal() {
    ctx.final = ctx.lines.reduce(
      (a, l) => ({ usd: a.usd + l.final.usd, idr: a.idr + l.final.idr }),
      { usd: 0, idr: 0 },
    );
    renderInto(sumPrice, ctx.final.usd, ctx.final.idr);
  }

  window.__openBooking = function (o) {
    ctx = { ...o, discount: false };
    // Susun line: itinerary = banyak baris (o.lines); direct/charter = 1 baris.
    // Tiap line pegang harga base + final sendiri + flag `eligible` buat referral.
    if (Array.isArray(o.lines) && o.lines.length) {
      ctx.structured = true;
      ctx.lines = o.lines.map((l) => ({
        type: l.type, service: l.service, date: l.date || "", time: l.time || "", guests: l.guests,
        pickup: l.pickup || "", dropoff: l.dropoff || "",
        day_no: l.day_no != null ? l.day_no : null, eligible: !!l.eligible,
        flight_number: l.flight_number || "", flight_datetime: l.flight_datetime || "",
        base: { usd: l.usd, idr: l.idr }, final: { usd: l.usd, idr: l.idr },
      }));
    } else {
      ctx.structured = false;
      ctx.lines = [{
        type: o.type, service: o.service, date: o.date || "", guests: o.guests,
        pickup: "", dropoff: "", day_no: null, eligible: !!o.referralEligible,
        base: { usd: o.price.usd, idr: o.price.idr }, final: { usd: o.price.usd, idr: o.price.idr },
      }];
    }
    ctx.anyEligible = ctx.lines.some((l) => l.eligible);
    sumGuest.textContent = o.guests || "-";
    sumService.textContent = o.service;
    sumDate.textContent = o.date || "-";
    // Pickup surcharge = SATU-satunya tempat angka surcharge muncul (brief §7).
    if (rowSurcharge) {
      if (o.surcharge && o.surcharge.idr > 0) {
        sumSurcharge.textContent = fmtMoney(o.surcharge.usd, o.surcharge.idr);
        rowSurcharge.hidden = false;
      } else {
        rowSurcharge.hidden = true;
      }
    }
    recalcTotal();
    nameI.value = ""; phoneI.value = ""; emailI.value = "";
    pickupI.value = o.pickup || "";
    dropoffI.value = "";
    // Auto-apply referral yang udah dipasang sesi ini (search form) -> total checkout
    // langsung nyamain harga yg ditampilin di kartu/My Trips. Masih bisa diubah manual.
    const ar = activeReferral();
    if (ar && ctx.anyEligible) {
      referralI.value = ar.code;
      setModalDiscount(ar.pct);
      refMsg.textContent = "Referral applied - " + ar.pct + "% off!"; refMsg.className = "modal__referral-msg success";
    } else {
      referralI.value = ""; refMsg.textContent = ""; refMsg.className = "modal__referral-msg";
    }
    pickupLabel.textContent = o.pickupOptional ? "Pick-up Location (optional)" : "Pick-up Location";
    dropoffLabel.textContent = o.dropoffRequired ? "Drop-off Location" : "Drop-off Location (optional)";
    if (o.detailLines && o.detailLines.length) {
      detailsList.innerHTML = "";
      o.detailLines.forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line;
        detailsList.appendChild(li);
      });
      // Judul accordion ngikut jenis booking (default "What's included";
      // itinerary pakai "Trip details"). Default ketutup - klik buat buka.
      const dt = document.getElementById("details-title");
      if (dt) dt.textContent = o.detailsTitle || "What's included";
      modalDetails.style.display = "";
    } else {
      modalDetails.style.display = "none";
    }
    modalDetails.classList.remove("active");
    modalForm.style.display = "block";
    modalSuccess.style.display = "none";
    modal.classList.add("active");
  };

  // Pasang diskon pct% ke line eligible (tour & transfer); charter tetap harga asli.
  function setModalDiscount(pct) {
    ctx.lines.forEach((l) => {
      l.final = l.eligible
        ? { usd: Math.round(l.base.usd * (1 - pct / 100)), idr: Math.round(l.base.idr * (1 - pct / 100)) }
        : { ...l.base };
    });
    ctx.discount = pct > 0; ctx.discountPct = pct; recalcTotal();
  }
  function clearModalDiscount() {
    ctx.lines.forEach((l) => { l.final = { ...l.base }; });
    ctx.discount = false; ctx.discountPct = 0; recalcTotal();
  }
  applyRef.addEventListener("click", () => {
    if (!ctx) return;
    const noDiscount = (msg) => {
      clearModalDiscount();
      refMsg.textContent = msg; refMsg.className = "modal__referral-msg error";
    };
    const entry = referralLookup(referralI.value);
    if (!entry) return noDiscount("Invalid referral code.");
    if (!ctx.anyEligible) return noDiscount("Referral only valid for tours & transfers.");
    setModalDiscount(entry.pct);
    refMsg.textContent = "Referral applied - " + entry.pct + "% off!"; refMsg.className = "modal__referral-msg success";
  });

  function priceText() { return `${CUR_SYMBOL.USD}${ctx.final.usd} / ${CUR_SYMBOL.IDR}${ctx.final.idr.toLocaleString("id-ID")}`; }

  function validate() {
    if (!nameI.value.trim()) { alert("Please enter your name."); return false; }
    if (!phoneI.value.trim()) { alert("Please enter your phone number."); return false; }
    if (!/^\S+@\S+\.\S+$/.test(emailI.value.trim())) { alert("Please enter a valid email address."); return false; }
    if (!ctx.pickupOptional && !pickupI.value.trim()) { alert("Please enter your pick-up location."); return false; }
    if (ctx.dropoffRequired && !dropoffI.value.trim()) { alert("Please enter your drop-off location."); return false; }
    return true;
  }

  function payload() {
    // Tiap line -> baris sendiri di DB. Direct/charter pickup+dropoff dari input modal;
    // itinerary tiap line bawa pickup/dropoff sendiri (kosong -> pakai hotel di modal).
    const lines = ctx.lines.map((l) => ({
      type: l.type,
      service: l.service,
      date: l.date || "",
      time: l.time || "",
      guests: String(l.guests || ""),
      pickup: ctx.structured ? l.pickup || pickupI.value : pickupI.value,
      dropoff: ctx.structured ? l.dropoff : dropoffI.value,
      price_usd: l.final.usd,
      price_idr: l.final.idr,
      day_no: l.day_no != null ? l.day_no : null,
      flight_number: l.flight_number || "",
      flight_datetime: l.flight_datetime || "",
    }));
    return {
      type: ctx.type,
      service: ctx.service,
      name: nameI.value,
      phone: phoneI.value,
      email: emailI.value,
      referral: ctx.discount ? referralI.value : "",
      lines: lines,
    };
  }

  bookSubmit.addEventListener("click", () => {
    if (!ctx || !validate()) return;
    fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload())
    })
      .then((r) => r.json())
      .then((d) => {
        // Auto-login habis booking: simpan token kalau belum login. Fail-soft.
        if (d && d.token && !getToken()) {
          setToken(d.token);
          currentAccount = d.account || null;
          hasUpcoming = true; // baru booking -> ada trip mendatang
          renderAccount();
        }
      })
      .catch(() => {});
    if (typeof ctx.onSuccess === "function") ctx.onSuccess();
    modalForm.style.display = "none";
    modalSuccess.style.display = "block";
  });

  discussWa.addEventListener("click", () => {
    if (!ctx || !validate()) return;
    let msg =
      `Hello, I'd like to book:\n` +
      `Service: ${ctx.service}\n` +
      `Name: ${nameI.value}\n` + `Phone: ${phoneI.value}\n` + `Email: ${emailI.value}\n`;
    if (ctx.structured) {
      msg +=
        ctx.lines
          .map((l) => `- ${l.day_no ? "Day " + l.day_no + " · " : ""}${l.date || "TBD"}${l.time ? " · " + fmtTime(l.time) : ""} · ${l.service} · ${l.guests || "-"} pax`)
          .join("\n") + "\n" + `Pick-up: ${pickupI.value || "-"}\n`;
    } else {
      msg += `Pick-up: ${pickupI.value || "-"}\n` + `Drop-off: ${dropoffI.value || "-"}\n`;
    }
    msg +=
      `Referral: ${ctx.discount ? referralI.value : "-"}\n` +
      `Guests: ${ctx.guests || "-"}\n` + `Date: ${ctx.date || "-"}\n` + `Price: ${priceText()}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  });

  const reset = () => { modal.classList.remove("active"); modalForm.style.display = "block"; modalSuccess.style.display = "none"; };
  detailsToggle.addEventListener("click", () => modalDetails.classList.toggle("active"));
  modalClose.addEventListener("click", reset);
  successClose.addEventListener("click", reset);
  modal.addEventListener("click", (e) => { if (e.target === modal) reset(); });
}

// Form "Build Your Trip" (hero / modal program): hitung harga live, lalu buka modal konfirmasi.
function initBooking() {
  const bookNowBtn = document.getElementById("book-now");
  if (!bookNowBtn) return;

  // Guests gak lagi jadi kolom di form — diambil dari pilihan global (navbar/welcome).
  const guestCount = () => currentGuests || DISPLAY_GUESTS;
  const serviceSelect = document.getElementById("service");
  const serviceItemSelect = document.getElementById("service-item");
  const dateField = document.getElementById("date");
  dateField.min = todayStr(); // blokir tanggal lampau di date picker
  const priceField = document.getElementById("price");
  const priceNote = document.getElementById("price-note");
  const priceSurcharge = document.getElementById("price-surcharge");

  let currentPrice = null;
  let bookingMode = "standard"; // Standard / Exclusive (cuma buat tour & combo)

  const bookingType = document.getElementById("booking-type");
  const typeBtns = bookingType ? bookingType.querySelectorAll(".booking__type-btn") : [];

  function setBookingMode(mode, recalc) {
    bookingMode = mode === "exclusive" ? "exclusive" : "standard";
    typeBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.mode === bookingMode));
    // sinkron checklist Included/Excluded di kartu sidebar (kalau ada)
    if (window.__bookListsSync) window.__bookListsSync(bookingMode);
    if (recalc) calculatePrice();
  }
  window.__setBookingMode = setBookingMode; // dipanggil dari toggle di halaman detail

  function calculatePrice() {
    const category = serviceSelect.value, item = serviceItemSelect.value, guests = guestCount();
    const paxTxt = guests + " pax";
    // Toggle Standard/Exclusive selalu tampil (biar tinggi form konsisten), tapi
    // di-nonaktifin (redup) kalau service-nya bukan tour/combo yg punya Exclusive.
    const hasExclusive = category === "tour" && !!tourExclusive[item];
    if (bookingType) {
      bookingType.classList.toggle("is-disabled", !hasExclusive);
      typeBtns.forEach((b) => (b.disabled = !hasExclusive));
    }
    if (!hasExclusive && bookingMode !== "standard") setBookingMode("standard", false);
    // Belum lengkap pilih service: harga tetap "-", tapi 2 baris teks tetap diisi
    // (placeholder) biar tinggi form stabil (gak loncat). PAX di baris 1 paling depan.
    if (!category || !item || !guests) {
      priceNote.textContent = paxTxt;
      if (priceSurcharge) {
        priceSurcharge.textContent = "Price & surcharge shown once you choose";
        priceSurcharge.classList.remove("price-note--surcharge");
      }
      return;
    }
    let usd, idr, note;
    if (category === "tour") {
      // tour wilayah ATAU combo - dua-duanya per mobil, bisa Standard / Exclusive
      const info = itemInfo(item);
      if (!info) return;
      if (bookingMode === "exclusive" && tourExclusive[item]) {
        const ex = exclusivePrice(item, guests);
        usd = ex.usd; idr = ex.idr;
        note = "Exclusive · entrance tickets included";
      } else {
        const p = carPrice(info.price, guests);
        usd = p.usd; idr = p.idr;
        note = guests > 5 ? "2 cars needed (large group)"
          : (hasExclusive ? "Standard · driver only" : "Price per car");
      }
    } else if (category === "transfer") {
      const base = prices.transfer[item];
      if (!base) return;
      const p = carPrice(base, guests);
      usd = p.usd; idr = p.idr;
      note = guests > 5 ? "2 cars needed (large group)" : "Price per car";
    } else {
      const base = prices[category][item];
      if (!base) return;
      const t = transport[item] || { usd: 0, idr: 0 };
      usd = base.usd * guests + t.usd; idr = base.idr * guests + t.idr;
      note = t.idr > 0 ? `Ticket per person + transport ${CUR_SYMBOL.IDR}${t.idr.toLocaleString("id-ID")}` : "Ticket per person · free transport";
    }
    // Pickup surcharge (stay-area) baked into the FINAL price shown. Angka surcharge-nya
    // sendiri cuma muncul di modal konfirmasi (lihat __openBooking), nggak di sini.
    const sc = surchargeFor(item, guests);
    usd += sc.usd; idr += sc.idr;
    currentPrice = { usd, idr, category, exclusive: bookingMode === "exclusive" && hasExclusive, surcharge: sc };
    priceField.innerHTML = cartPriceTag(usd, idr);
    priceNote.textContent = paxTxt + " · " + note;
    if (priceSurcharge) {
      const sl = surchargeLabel(item);
      priceSurcharge.textContent = sl.txt;
      priceSurcharge.classList.toggle("price-note--surcharge", sl.has);
    }
  }
  window.__bookingRefresh = calculatePrice; // biar setGuests bisa refresh harga booking

  typeBtns.forEach((b) => b.addEventListener("click", () => setBookingMode(b.dataset.mode, true)));

  serviceSelect.addEventListener("change", () => {
    serviceItemSelect.innerHTML = "";
    // "Tour Program" = tour wilayah + combo (dua-duanya per mobil)
    const items = serviceSelect.value === "tour"
      ? [...Object.keys(prices.tour), ...Object.keys(prices.combo)]
      : Object.keys(prices[serviceSelect.value] || {});
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item; option.textContent = item;
      serviceItemSelect.appendChild(option);
    });
    setBookingMode("standard", false);
    calculatePrice();
  });
  serviceItemSelect.addEventListener("change", () => { setBookingMode("standard", false); calculatePrice(); });

  // Tambah program (tour/experience/place) yg dipilih di form ke cart (My Trips).
  // `checked`=true -> lewat cek bentrok tanggal (buat "Add to My Trip", user tetap di halaman).
  // false -> langsung tambah tanpa modal (buat "Book Now" yg abis itu pindah ke My Trips).
  // return true kalau berhasil nambah (dipakai Book Now buat mutusin redirect).
  const addFromForm = (checked) => {
    if (!serviceItemSelect.value || !dateField.value) {
      alert("Please choose a service and a date first."); return false;
    }
    const today = todayStr();
    if (dateField.value < today) { showPastDate(); return false; }
    if (dateField.value === today) { showSameDayWa(guestCount(), serviceItemSelect.value, dateField.value); return false; }
    if (!currentPrice) return false;
    const category = currentPrice.category;
    const item = serviceItemSelect.value;
    const isExcl = currentPrice.exclusive;
    const mode = (category === "tour" && tourExclusive[item]) ? (isExcl ? "exclusive" : "standard") : null;
    if (checked) cartAddChecked(category, item, dateField.value, mode);
    else cartAddDated(category, item, dateField.value, mode);
    // kalau form ini lagi di dalam modal (dibuka dari kartu), tutup modalnya
    const bm = document.getElementById("book-modal");
    if (bm) bm.classList.remove("active");
    return true;
  };

  // Book Now = tambah ke My Trips lalu pindah ke halaman My Trips (user pilih mau bayar yg mana).
  bookNowBtn.addEventListener("click", () => {
    if (addFromForm(false)) window.location.href = "my-trips.html";
  });

  // Add to My Trip = tambah ke My Trips + cek bentrok tanggal, user tetap di halaman (toast).
  const addTripBtn = document.getElementById("add-trip");
  if (addTripBtn) addTripBtn.addEventListener("click", () => addFromForm(true));

  // Overlap + preset service/item dari halaman program (data-default / data-item)
  const holder = document.getElementById("booking-placeholder");
  const section = document.getElementById("booking");
  if (holder && holder.dataset.overlap === "true" && section) section.classList.add("booking--overlap");
  const def = (holder && holder.dataset.default) || (section && section.dataset.default) || "";
  if (def) { serviceSelect.value = def; serviceSelect.dispatchEvent(new Event("change")); }
  const presetItem = holder && holder.dataset.item;
  if (presetItem) { serviceItemSelect.value = presetItem; serviceItemSelect.dispatchEvent(new Event("change")); }
  calculatePrice(); // render awal: minimal PAX langsung tampil walau belum pilih service
}

// Slideshow .slider (bisa lebih dari satu: Activities & Performances). Tiap slider
// self-contained - tombol prev/next & dots dicari di dalam slider itu sendiri.
function initSlider() {
  document.querySelectorAll(".slider").forEach((slider) => {
    const slides = slider.querySelectorAll(".slider__slide");
    if (!slides.length) return;
    const dots = slider.querySelectorAll(".slider__dot");
    let current = 0;

    function show(index) {
      slides.forEach((s) => s.classList.remove("active"));
      dots.forEach((d) => d.classList.remove("active"));
      slides[index].classList.add("active");
      if (dots[index]) dots[index].classList.add("active");
      current = index;
    }
    const nextSlide = () => show((current + 1) % slides.length);
    const prevSlide = () => show((current - 1 + slides.length) % slides.length);

    dots.forEach((dot, index) => dot.addEventListener("click", () => show(index)));

    // Ganti panah: geser (swipe/drag) kiri-kanan buat pindah slide.
    let sx = null;
    slider.addEventListener("pointerdown", (e) => { sx = e.clientX; });
    slider.addEventListener("pointerup", (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx;
      sx = null;
      if (Math.abs(dx) > 40) (dx < 0 ? nextSlide : prevSlide)();
    });

    setInterval(nextSlide, 5000);
  });
}

// Panah kiri/kanan buat slider Tour Programs (muncul pas hover, desktop)
// Galeri foto About (landscape 4:3, scroll-snap). Swipe jalan native; di desktop
// tambahin panah prev/next yg nge-scroll selebar 1 slide. Cuma jalan kalau >=2 slide.
function initAboutGallery() {
  const g = document.querySelector("[data-about-gallery]");
  if (!g) return;
  const track = g.querySelector(".about-gallery__track");
  if (!track || track.children.length < 2) return;
  [["prev", "‹"], ["next", "›"]].forEach(([dir, glyph]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "about-gallery__arrow about-gallery__arrow--" + dir;
    btn.setAttribute("aria-label", dir === "prev" ? "Previous photo" : "Next photo");
    btn.innerHTML = glyph;
    btn.addEventListener("click", () => {
      const w = track.clientWidth;
      track.scrollBy({ left: dir === "prev" ? -w : w, behavior: "smooth" });
    });
    g.appendChild(btn);
  });
}

function initTourSlider() {
  // #itn-days ikut: di desktop dia slider horizontal (panah muncul pas hover;
  // di mobile tetap numpuk vertikal & panahnya emang ke-hide via CSS hover).
  document.querySelectorAll(".experience__grid--slider, .experience__grid--home4, #itn-days").forEach((slider) => {
    if (slider.parentElement.classList.contains("slider-holder")) return;
    const holder = document.createElement("div");
    holder.className = "slider-holder";
    slider.parentNode.insertBefore(holder, slider);
    holder.appendChild(slider);

    const makeArrow = (dir, label, glyph) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "slider-arrow slider-arrow--" + dir;
      b.setAttribute("aria-label", label);
      b.innerHTML = glyph;
      b.addEventListener("click", () => {
        const dist = slider.clientWidth * 0.8;
        slider.scrollBy({ left: dir === "prev" ? -dist : dist, behavior: "smooth" });
      });
      return b;
    };
    holder.appendChild(makeArrow("prev", "Previous", "&lsaquo;"));
    holder.appendChild(makeArrow("next", "Next", "&rsaquo;"));
  });
}

// Section "Guides & Information" (homepage): menu kategori samping ganti panel slider.
// Search typeahead guide (dipakai homepage teaser & halaman bali-guide).
// Cari di SEMUA kartu .guide-home__card di dalam root (judul + keyword), termasuk
// yang lagi hidden (di homepage cuma featured yg tampil, tapi search tetap nemu semua).
const GUIDE_CATLABEL = { island: "About the Island", culture: "People & Culture", nature: "Nature", do: "What to Do", know: "Good to Know" };
function guideTypeahead(searchRoot, cardsRoot) {
  cardsRoot = cardsRoot || searchRoot; // search & kartu bisa beda scope (guide page: search di hero, kartu di .guide-page)
  const input = searchRoot.querySelector("[data-guide-search]");
  const sug = searchRoot.querySelector(".gsearch__sug");
  if (!input || !sug) return;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const cards = Array.from(cardsRoot.querySelectorAll(".guide-home__card:not([data-more])"));
  const index = cards.map((c) => {
    const img = c.querySelector("img");
    return {
      title: c.querySelector(".experience__name").textContent.trim(),
      catLabel: GUIDE_CATLABEL[c.dataset.cat] || "",
      kw: (c.dataset.kw || "").toLowerCase(),
      href: c.getAttribute("href"),
      img: img ? img.getAttribute("src") : ""
    };
  });
  function closeSug() { sug.hidden = true; sug.innerHTML = ""; }
  function renderSug(raw) {
    const q = raw.trim().toLowerCase();
    if (!q) return closeSug();
    const hits = index
      .filter((g) => g.title.toLowerCase().includes(q) || g.kw.includes(q))
      .slice(0, 6);
    if (!hits.length) {
      sug.innerHTML = '<div class="gsearch__empty">No guides match &ldquo;' + esc(raw.trim()) + '&rdquo; - try a place or topic.</div>';
      sug.hidden = false;
      return;
    }
    sug.innerHTML =
      '<div class="gsearch__head">Guides matching &ldquo;' + esc(raw.trim()) + '&rdquo;</div>' +
      hits.map((g) =>
        '<a class="gsearch__opt" href="' + g.href + '">' +
        '<span class="gsearch__th"' + (g.img ? ' style="background-image:url(' + g.img + ')"' : "") + '></span>' +
        '<span class="gsearch__meta"><span class="gsearch__cat">' + esc(g.catLabel) + '</span>' +
        '<span class="gsearch__ttl">' + esc(g.title) + '</span></span></a>'
      ).join("");
    sug.hidden = false;
  }
  input.addEventListener("input", () => renderSug(input.value));
  input.addEventListener("focus", () => { if (input.value.trim()) renderSug(input.value); });
  input.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeSug(); input.blur(); } });
  document.addEventListener("click", (e) => { if (!e.target.closest(".gsearch")) closeSug(); });
}

// Homepage: teaser slider (slider di-handle initTourSlider) + search typeahead.
function initGuideHome() {
  const root = document.querySelector(".guide-home");
  if (!root) return;
  guideTypeahead(root);
}

// Halaman bali-guide: search typeahead + tombol "Categories" (dropdown -> loncat
// scroll ke slider kategori). Semua kategori tetep tampil, toggle cuma navigasi.
function initGuidePage() {
  const root = document.querySelector(".guide-page");
  if (!root) return;
  // Search bar-nya ada di hero (.guide-hero-search), kartu di .guide-page.
  const searchBar = document.querySelector(".guide-hero-search");
  if (searchBar) guideTypeahead(searchBar, root);

  const toggle = document.querySelector("[data-cat-toggle]");
  const menu = document.querySelector("[data-cat-menu]");
  if (!toggle || !menu) return;
  const setOpen = (on) => {
    menu.hidden = !on;
    toggle.setAttribute("aria-expanded", on ? "true" : "false");
  };
  toggle.addEventListener("click", (e) => { e.stopPropagation(); setOpen(menu.hidden); });
  menu.querySelectorAll("a[href^='#']").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(a.getAttribute("href").slice(1));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(false);
    });
  });
  document.addEventListener("click", (e) => { if (!e.target.closest("[data-cat-menu]") && !e.target.closest("[data-cat-toggle]")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
}

function initContact() {
  const sendBtn = document.getElementById("c-send");
  if (!sendBtn) return;

  const form = document.getElementById("contact-form");
  const success = document.getElementById("contact-success");
  const nameField = document.getElementById("c-name");
  const emailField = document.getElementById("c-email");
  const messageField = document.getElementById("c-message");

  sendBtn.addEventListener("click", () => {
    if (!nameField.value.trim()) { alert("Please enter your name."); return; }
    if (!/^\S+@\S+\.\S+$/.test(emailField.value.trim())) { alert("Please enter a valid email address."); return; }
    if (!messageField.value.trim()) { alert("Please enter a message."); return; }

    const data = new URLSearchParams({
      type: "contact",
      name: nameField.value,
      email: emailField.value,
      message: messageField.value
    });

    fetch(SHEET_ENDPOINT, { method: "POST", mode: "no-cors", body: data });

    form.style.display = "none";
    success.style.display = "block";
  });
}

function initItinerary() {
  const daysWrap = document.getElementById("itn-days");
  if (!daysWrap) return;

  let state = itnLoad();
  const save = () => itnSave(state);

  // Sync range tanggal dari search bar / popup -> itinerary: samain jumlah hari
  // (tambah hari kosong kalau kurang) + set tanggal mulai lalu cascade. Cuma di-apply
  // SEKALI per nilai range (disimpan di cue_itn_synced) biar edit manual tanggal/hari
  // di itinerary nggak ke-reset tiap buka. Nggak pernah hapus hari/item user.
  (function syncRangeToItn() {
    const from = currentDateFrom;
    if (!from) return;
    const key = from + "|" + (currentDateTo || "");
    if (localStorage.getItem("cue_itn_synced") === key) return;
    const n = rangeDays(from, currentDateTo);
    while (state.days.length < n) state.days.push(newItnDay());
    if (state.days.length) {
      state.days[0].date = from;
      cascadeDates(0);
    }
    localStorage.setItem("cue_itn_synced", key);
    save();
  })();

  // Mode Standard/Exclusive per item dalam satu hari (default Standard).
  // Disimpan di d.itemModes[idx] - sejajar sama d.items (string tetap dipakai).
  const itemMode = (d, idx) => (d.itemModes && d.itemModes[idx]) || "standard";

  // ---------- auto-fill helper (suggested plan & manual) ----------
  // Isi tanggal di hari ke-fromIdx -> hari berikutnya +1 berturut (bisa diubah lagi).
  function cascadeDates(fromIdx) {
    const base = state.days[fromIdx].date;
    if (!base) return;
    for (let j = fromIdx + 1; j < state.days.length; j++)
      state.days[j].date = addDaysStr(base, j - fromIdx);
  }
  // Input hotel pertama -> nyebar ke semua slot pickup/drop-off yang masih kosong.
  // Sisi airport (pickup transfer "to" / drop-off transfer "from") nggak disentuh.
  function propagateLocation(val) {
    if (!val) return;
    state.days.forEach((d) => {
      if (!d.pickup) d.pickup = val;
      if (!d.dropoff) d.dropoff = val;
    });
    state.transfers.forEach((tr) => {
      const hotelField = tr.direction === "from" ? "pickup" : "dropoff";
      if (!tr[hotelField]) tr[hotelField] = val;
    });
    (state.charters || []).forEach((ch) => {
      if (!ch.pickup) ch.pickup = val; // drop-off charter = tujuan, jangan diisi hotel
    });
  }
  // Jumlah tamu diisi sekali -> nyebar ke hari/transfer/charter lain yang masih kosong.
  function propagateGuests(val) {
    if (!val) return;
    state.days.forEach((d) => { if (!d.guests) d.guests = val; });
    state.transfers.forEach((tr) => { if (!tr.guests) tr.guests = val; });
    (state.charters || []).forEach((ch) => { if (!ch.guests) ch.guests = val; });
  }
  // Pilih Standard/Exclusive di hari ke-fromIdx -> hari berikutnya ikut (bisa diubah).
  function cascadeModes(fromIdx, mode) {
    for (let j = fromIdx + 1; j < state.days.length; j++) {
      const d = state.days[j];
      if (!d.itemModes) d.itemModes = [];
      d.items.forEach((name, idx) => { if (tourExclusive[name]) d.itemModes[idx] = mode; });
    }
  }

  // ---------- pricing ----------
  function dayPrice(d) {
    let usd = 0,
      idr = 0;
    const g = parseInt(d.guests) || 0;
    if (!g) return { usd, idr };
    d.items.forEach((name, idx) => {
      const info = itemInfo(name);
      if (!info) return;
      if (info.cat === "tour" || info.cat === "combo") {
        // per mobil (×2 kalau >5). Exclusive = + tiket per orang.
        const p = itemMode(d, idx) === "exclusive" && tourExclusive[name]
          ? exclusivePrice(name, g)
          : carPrice(info.price, g);
        usd += p.usd;
        idr += p.idr;
      } else {
        const t = transport[name] || { usd: 0, idr: 0 };
        usd += info.price.usd * g + t.usd;
        idr += info.price.idr * g + t.idr;
      }
    });
    return { usd, idr };
  }
  function transferPrice(tr) {
    const g = parseInt(tr.guests) || 0;
    if (!g || !prices.transfer[tr.route]) return { usd: 0, idr: 0 };
    return carPrice(prices.transfer[tr.route], g);
  }
  const dayComplete = (d) =>
    d.items.length > 0 && !!d.date && (parseInt(d.guests) || 0) > 0;
  const transferComplete = (tr) =>
    !!tr.route && !!tr.date && (parseInt(tr.guests) || 0) > 0;
  const charterComplete = (ch) =>
    !!ch.area && !!ch.dur && !!ch.date && (parseInt(ch.guests) || 0) > 0;

  function guestOptions(val) {
    let o = `<option value="" disabled ${val ? "" : "selected"}>Guests</option>`;
    for (let n = 1; n <= 10; n++)
      o += `<option value="${n}" ${val == n ? "selected" : ""}>${n}</option>`;
    return o;
  }

  // Slot jam jemput (tiap 30 menit, 24 jam) - value 24h "HH:MM", label 12h "3:00 pm".
  function timeOptions(val) {
    let o = `<option value="" disabled ${val ? "" : "selected"}>Time</option>`;
    for (let h = 0; h < 24; h++)
      for (let m = 0; m < 60; m += 30) {
        const v = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
        o += `<option value="${v}" ${val === v ? "selected" : ""}>${fmtTime(v)}</option>`;
      }
    return o;
  }

  // Pilihan area pickup charter: Ubud (tanpa surcharge) + area transfer (luar Ubud).
  const CH_AREAS = ["Ubud", ...Object.keys(prices.transfer).map((r) => r.replace(" – Ubud", ""))];
  function charterAreaOptions(sel) {
    let o = `<option value="" disabled ${sel ? "" : "selected"}>Pick-up area</option>`;
    CH_AREAS.forEach((a) => {
      o += `<option value="${a}" ${sel === a ? "selected" : ""}>${a}</option>`;
    });
    return o;
  }

  // ---------- render hari ----------
  // State form override per-hari (kebuka via Edit). Disimpan biar tahan rerender.
  const openDays = new Set();
  // Animasi fade-up cuma di render PERTAMA (biar nggak kedip tiap edit/rerender)
  let itnEntered = false;
  function renderDays() {
    daysWrap.innerHTML = "";
    if (!state.days.length) {
      daysWrap.innerHTML = `<p class="itn__empty">No days yet. Tap "Add to your trip", pick a category, choose on the next page - it comes right back here.</p>`;
      return;
    }
    state.days.forEach((d, i) => daysWrap.appendChild(renderDayCard(d, i)));
    // Form override per-hari (.f-date) -> custom date picker, bukan native browser.
    enhanceFieldsIn(daysWrap);
  }

  function renderDayCard(d, i) {
    const card = document.createElement("div");
    card.className = "itn-day";
    if (!itnEntered) {
      card.classList.add("itn-enter");
      card.style.animationDelay = Math.min(i, 5) * 0.07 + "s";
    }
    const done = dayComplete(d);

    // Kartu program = .experience__card homepage (foto 1:1 + judul di foto + desc)
    // + toggle Standard/Exclusive di badan kartu + tombol × hapus.
    // 1 hari = 1 program (dukung >1 buat state lama: dirender grid).
    const cardsHTML = d.items.length
      ? d.items
          .map((name, idx) => {
            const info = ITEM_CARD[name] || {};
            const bg = info.img ? `background-image:url('assets/images/${info.img}')` : "";
            const desc = info.desc || "";
            const url = ITEM_URL[name] || "";
            const mode = itemMode(d, idx);
            const pinfo = itemInfo(name);
            const g = parseInt(d.guests) || DISPLAY_GUESTS;
            // Harga + unit + note per program (biar card sama persis kayak card tour).
            let ip = null, unit = "";
            if (pinfo) {
              if (pinfo.cat === "tour" || pinfo.cat === "combo") {
                ip = mode === "exclusive" && tourExclusive[name] ? exclusivePrice(name, g) : carPrice(pinfo.price, g);
                unit = "per car";
              } else {
                const t = transport[name] || { usd: 0, idr: 0 };
                ip = { usd: pinfo.price.usd * g + t.usd, idr: pinfo.price.idr * g + t.idr };
                unit = "per person";
              }
            }
            const noteHTML = tourExclusive[name]
              ? `<small class="itn-prog__note">${mode === "exclusive"
                  ? "Includes entrance tickets &middot; price for " + g + " pax"
                  : "Driver only &middot; entrance tickets not included"}</small>`
              : "";
            const priceCardHTML = ip
              ? `<div class="itn-prog__price">${priceHTML(ip.usd, ip.idr)}<span class="price-unit">${unit}</span></div>`
              : "";
            const toggleHTML = tourExclusive[name]
              ? `<div class="itn-type" data-idx="${idx}">
                  <span class="itn-item-type">
                    <button type="button" class="itn-item-type__btn ${mode === "standard" ? "is-active" : ""}" data-mode="standard">Standard</button>
                    <button type="button" class="itn-item-type__btn ${mode === "exclusive" ? "is-active" : ""}" data-mode="exclusive">Exclusive</button>
                  </span>
                </div>`
              : "";
            // Kartu bisa diklik ke halaman program (ganti "View details"). × & footer di luar link.
            const open = url ? `<a class="itn-prog__link" href="${url}" target="_blank" rel="noopener">` : `<div class="itn-prog__link">`;
            const close = url ? `</a>` : `</div>`;
            return `<article class="experience__card itn-prog">
              ${open}
                <div class="experience__image photo-titled" style="${bg}">
                  <h3 class="experience__name">${name}</h3>
                </div>
                ${desc ? `<div class="experience__body"><p class="experience__desc">${desc}</p></div>` : ""}
              ${close}
              <button class="itn-prog__rm" type="button" data-rmitem="${idx}" aria-label="Remove ${name}">&times;</button>
              <div class="itn-prog__foot">
                ${toggleHTML}
                ${noteHTML}
                ${priceCardHTML}
              </div>
            </article>`;
          })
          .join("")
      : `<div class="itn-day__empty">Empty day. <button class="itn-day__emptyrm" type="button" data-rmday="${i}">Remove</button></div>`;

    const headHTML = `
      <div class="itn-day__head">
        <h4 class="itn-day__title">Day ${i + 1}</h4>
        <span class="itn-day__status ${done ? "done" : ""}">${done ? "Complete" : "Incomplete"}</span>
      </div>`;
    if (d.items.length) {
      // Kartu + chip ringkasan (keisi otomatis dari Trip Details) + form override
      // per-hari (kebuka via tombol Edit, state di openDays biar tahan rerender).
      card.classList.add("itn-day--prog");
      const chipTxt = done
        ? `<b>${fmtDayDate(d.date)}</b> &middot; ${d.guests} guest${d.guests > 1 ? "s" : ""}${d.pickup ? " &middot; " + d.pickup : ""}`
        : `Fill <b>Trip details</b> above - this day follows automatically`;
      card.innerHTML = `${headHTML}
      <div class="itn-day__cards">${cardsHTML}</div>
      <div class="itn-chip">
        <span class="itn-chip__ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg></span>
        <span class="itn-chip__txt">${chipTxt}</span>
        <button class="itn-chip__edit" type="button">Edit</button>
      </div>
      <div class="itn-ovr${openDays.has(i) ? " open" : ""}">
        <div class="itn-day__fields">
          <div class="field"><label>Date</label><input type="date" class="f-date" min="${todayStr()}" value="${d.date}" /></div>
          <div class="field"><label>Pick-up</label><input type="text" class="f-pickup" placeholder="Hotel / villa / area" value="${d.pickup || ""}" /></div>
          <div class="field field--full"><label>Drop-off</label><input type="text" class="f-dropoff" placeholder="Hotel / villa / area" value="${d.dropoff || ""}" /></div>
        </div>
        <p class="itn-ovr__note">Only this day changes - other days keep following Trip Details.</p>
      </div>`;
    } else {
      card.innerHTML = `${headHTML}
      <div class="itn-day__cards">${cardsHTML}</div>`;
    }
    card.querySelectorAll("[data-rmitem]").forEach((b) =>
      b.addEventListener("click", () => {
        const idx = +b.dataset.rmitem;
        d.items.splice(idx, 1);
        if (d.itemModes) d.itemModes.splice(idx, 1); // buang mode item yang sama
        if (!d.items.length) state.days.splice(i, 1);
        save();
        rerender();
      })
    );
    // Toggle Standard/Exclusive tiap program
    card.querySelectorAll(".itn-type").forEach((box) => {
      const idx = +box.dataset.idx;
      box.querySelectorAll(".itn-item-type__btn").forEach((b) =>
        b.addEventListener("click", () => {
          if (!d.itemModes) d.itemModes = [];
          d.itemModes[idx] = b.dataset.mode;
          cascadeModes(i, b.dataset.mode);
          save();
          rerender();
        })
      );
    });
    const rmDayBtn = card.querySelector("[data-rmday]"); // cuma ada di hari kosong
    if (rmDayBtn) rmDayBtn.addEventListener("click", () => {
      state.days.splice(i, 1);
      save();
      rerender();
    });
    // Tombol Edit: buka/tutup form override hari ini (state di openDays)
    const editBtn = card.querySelector(".itn-chip__edit");
    if (editBtn) editBtn.addEventListener("click", () => {
      const ovr = card.querySelector(".itn-ovr");
      if (openDays.has(i)) { openDays.delete(i); ovr.classList.remove("open"); }
      else { openDays.add(i); ovr.classList.add("open"); }
    });
    // Form override: cuma ubah hari ini (tanggal tetap cascade ke hari setelahnya)
    const fDate = card.querySelector(".f-date");
    if (fDate) fDate.addEventListener("change", (e) => {
      if (e.target.value && e.target.value < todayStr()) {
        showPastDate();
        e.target.value = d.date || ""; // balikin ke nilai valid sebelumnya
        return;
      }
      d.date = e.target.value;
      cascadeDates(i); // hari berikutnya auto +1 dari sini
      save();
      rerender();
    });
    const fPickup = card.querySelector(".f-pickup");
    if (fPickup) {
      fPickup.addEventListener("input", (e) => { d.pickup = e.target.value; save(); });
      fPickup.addEventListener("change", (e) => { d.pickup = e.target.value; save(); rerender(); });
    }
    const fDropoff = card.querySelector(".f-dropoff");
    if (fDropoff) {
      fDropoff.addEventListener("input", (e) => { d.dropoff = e.target.value; save(); });
      fDropoff.addEventListener("change", (e) => { d.dropoff = e.target.value; save(); rerender(); });
    }
    return card;
  }

  // ---------- render transfer & charter: mini cards (2 kolom) + popup form ----------
  const AIRPORT_ROUTE = "Airport – Ubud";
  function svcIcon(kind) {
    if (kind === "pickup")
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2.5 19h19"/><path d="M21 14.6l-8.5-3.2L8 5.8l-1.9.7 2.1 6-4.3-1.6-1.4.5 3 3.4 15-.2z" fill="currentColor" stroke="none" opacity=".85"/></svg>';
    if (kind === "dropoff")
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 5.6l8.4 3.5L16 3.9l1.9.7-2.2 5.9 4.4-1.5 1.4.6-3.1 3.3-15-.3z" fill="currentColor" stroke="none" opacity=".7"/><path d="M2.5 19h19"/></svg>';
    if (kind === "charter")
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 13l2-5a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 8l2 5"/><path d="M3 13h18v4H3z"/><circle cx="7" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/></svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 5v14M5 12h14"/></svg>';
  }

  function miniCard(opt) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "itn-mini " + (opt.filled ? "itn-mini--filled" : "itn-mini--empty");
    b.innerHTML =
      (opt.complete
        ? '<span class="itn-mini__check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2"><path d="M20 6L9 17l-5-5"/></svg></span>'
        : "") +
      '<span class="itn-mini__ic">' + svcIcon(opt.kind) + "</span>" +
      '<span class="itn-mini__t">' + opt.title + "</span>" +
      '<span class="itn-mini__s">' + opt.sub + "</span>";
    b.addEventListener("click", opt.onClick);
    return b;
  }

  function renderTransfers() {
    const box = document.getElementById("itn-transfers-list");
    if (!box) return;
    box.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "itn-minis";
    if (!itnEntered) grid.classList.add("itn-enter");

    // Slot airport: pickup (bandara -> Ubud) & drop-off (Ubud -> bandara) SELALU tampil
    let puIdx = -1, doIdx = -1;
    state.transfers.forEach((tr, i) => {
      if (tr.route !== AIRPORT_ROUTE) return;
      if (tr.direction !== "from" && puIdx < 0) puIdx = i;
      else if (tr.direction === "from" && doIdx < 0) doIdx = i;
    });
    const trSub = (tr) =>
      !tr ? "" : transferComplete(tr) ? "<b>" + fmtDayDate(tr.date) + "</b>" + (tr.time ? " &middot; " + fmtTime(tr.time) : "") : "Tap to complete";

    grid.appendChild(miniCard({
      kind: "pickup", title: "Airport Pickup",
      sub: puIdx < 0 ? "Airport &rarr; your hotel" : trSub(state.transfers[puIdx]),
      filled: puIdx >= 0,
      complete: puIdx >= 0 && transferComplete(state.transfers[puIdx]),
      onClick: () => openSvcModal("pickup", puIdx)
    }));
    grid.appendChild(miniCard({
      kind: "dropoff", title: "Airport Drop-off",
      sub: doIdx < 0 ? "Your hotel &rarr; airport" : trSub(state.transfers[doIdx]),
      filled: doIdx >= 0,
      complete: doIdx >= 0 && transferComplete(state.transfers[doIdx]),
      onClick: () => openSvcModal("dropoff", doIdx)
    }));

    // Charter: slot pertama selalu tampil; charter tambahan dapet kartu sendiri
    const chs = state.charters || [];
    const chSub = (ch) =>
      !ch ? "Car + driver, your route" : charterComplete(ch) ? "<b>" + fmtDayDate(ch.date) + "</b>" + (ch.time ? " &middot; " + fmtTime(ch.time) : "") : "Tap to complete";
    grid.appendChild(miniCard({
      kind: "charter", title: "Private Charter",
      sub: chSub(chs[0]), filled: !!chs[0],
      complete: !!chs[0] && charterComplete(chs[0]),
      onClick: () => openSvcModal("charter", chs.length ? 0 : -1)
    }));
    chs.slice(1).forEach((ch, k) => grid.appendChild(miniCard({
      kind: "charter", title: "Private Charter",
      sub: chSub(ch), filled: true, complete: charterComplete(ch),
      onClick: () => openSvcModal("charter", k + 1)
    })));

    // Transfer non-airport yang udah ada + slot "Other Transfer" buat nambah
    state.transfers.forEach((tr, i) => {
      if (i === puIdx || i === doIdx) return;
      const area = tr.route.replace(" – Ubud", "");
      grid.appendChild(miniCard({
        kind: "other",
        title: tr.direction === "from" ? "Ubud &rarr; " + area : area + " &rarr; Ubud",
        sub: trSub(tr), filled: true, complete: transferComplete(tr),
        onClick: () => openSvcModal("other", i)
      }));
    });
    grid.appendChild(miniCard({
      kind: "other", title: "Other Transfer", sub: "Canggu, Kuta, Amed...",
      filled: false, complete: false,
      onClick: () => openSvcModal("other", -1)
    }));

    box.appendChild(grid);
  }

  // Popup form transfer/charter (satu modal, diisi dinamis per jenis slot)
  const svcModal = document.getElementById("itn-svc-modal");
  const svcBody = document.getElementById("itn-svc-body");
  if (svcModal)
    svcModal.addEventListener("click", (e) => {
      if (e.target === svcModal || e.target.closest("[data-close]"))
        svcModal.classList.remove("active");
    });

  function svcRouteOptions(sel) {
    let o = "";
    Object.keys(prices.transfer).forEach((r) => {
      if (r === AIRPORT_ROUTE) return; // airport punya slot sendiri
      o += '<option value="' + r + '" ' + (sel === r ? "selected" : "") + ">" + r.replace(" – Ubud", "") + "</option>";
    });
    return o;
  }

  function openSvcModal(kind, idx) {
    if (!svcModal || !svcBody) return;
    const isCharter = kind === "charter";
    const tr = !isCharter && idx >= 0 ? state.transfers[idx] : null;
    const ch = isCharter && idx >= 0 ? state.charters[idx] : null;
    const t = state.trip || {};
    const cur = tr || ch;
    const guests = (cur && cur.guests) || t.guests || "";
    const date = (cur && cur.date) || "";
    const time = (cur && cur.time) || "";
    // Sisi hotel: pickup transfer "to" = drop-off, "from" = pick-up; charter = pick-up
    const hotel =
      (tr && (tr.direction === "from" ? tr.pickup : tr.dropoff)) ||
      (ch && ch.pickup) || t.hotel || "";

    const titles = {
      pickup: ["Airport Pickup", "Ngurah Rai Airport &rarr; your hotel in Ubud."],
      dropoff: ["Airport Drop-off", "Your hotel in Ubud &rarr; Ngurah Rai Airport."],
      other: ["Transfer", "Private door-to-door transfer."],
      charter: ["Private Charter", "Your own car &amp; driver - go anywhere, your schedule."]
    };
    const hotelLabel = kind === "pickup" ? "Drop-off (hotel / villa)" : "Pick-up (hotel / villa)";

    let fieldsHTML = "";
    if (kind === "other") {
      fieldsHTML +=
        '<div class="field"><label>Area</label><select class="sv-route">' + svcRouteOptions(tr ? tr.route : "") + "</select></div>" +
        '<div class="field"><label>Direction</label><select class="sv-dir">' +
        '<option value="to" ' + (!tr || tr.direction !== "from" ? "selected" : "") + ">To Ubud</option>" +
        '<option value="from" ' + (tr && tr.direction === "from" ? "selected" : "") + ">From Ubud</option>" +
        "</select></div>";
    }
    if (isCharter) {
      fieldsHTML +=
        '<div class="field"><label>Pick-up area</label><select class="sv-area">' + charterAreaOptions(ch ? ch.area : "") + "</select></div>" +
        '<div class="field"><label>Duration</label><select class="sv-dur">' +
        '<option value="" disabled ' + (ch && ch.dur ? "" : "selected") + ">Duration</option>" +
        '<option value="half" ' + (ch && ch.dur === "half" ? "selected" : "") + ">Half day (5 hrs)</option>" +
        '<option value="full" ' + (ch && ch.dur === "full" ? "selected" : "") + ">Full day (10 hrs)</option>" +
        '<option value="extended" ' + (ch && ch.dur === "extended" ? "selected" : "") + ">Extended (10+ hrs)</option>" +
        "</select></div>" +
        '<div class="field sv-extra-wrap" style="' + (ch && ch.dur === "extended" ? "" : "display:none") + '"><label>Extra hours after 10</label><input type="number" class="sv-extra" min="1" max="6" value="' + ((ch && ch.extra) || 1) + '" /></div>';
    }
    fieldsHTML +=
      '<div class="field"><label>Date</label><input type="date" class="sv-date" min="' + todayStr() + '" value="' + date + '" /></div>' +
      '<div class="field"><label>Pick-up time</label><select class="sv-time">' + timeOptions(time) + "</select></div>" +
      '<div class="field"><label>Guests</label><select class="sv-guests">' + guestOptions(guests) + "</select></div>" +
      '<div class="field field--full"><label>' + hotelLabel + '</label><input type="text" class="sv-hotel" placeholder="Hotel / villa / area" value="' + hotel.replace(/"/g, "&quot;") + '" /></div>';

    svcBody.innerHTML =
      '<p class="svc__t"><span class="itn-mini__ic">' + svcIcon(kind) + "</span>" + titles[kind][0] + "</p>" +
      '<p class="svc__s">' + titles[kind][1] + "</p>" +
      '<div class="itn-day__fields svc__fields">' + fieldsHTML + "</div>" +
      '<div class="svc__price"><span>Price</span><b class="sv-price"></b></div>' +
      '<button class="svc__save" type="button">Save</button>' +
      (idx >= 0 ? '<button class="svc__rm" type="button">Remove from trip</button>' : "");

    // Harga live di popup (ngikut isian route/dur/guests)
    const q = (sel) => svcBody.querySelector(sel);
    function livePrice() {
      const g = q(".sv-guests").value;
      let p = { usd: 0, idr: 0 };
      if (isCharter) {
        const dur = q(".sv-dur").value;
        if (dur) p = charterPrice(q(".sv-area").value, dur, parseInt(q(".sv-extra") ? q(".sv-extra").value : 1) || 1);
      } else {
        const route = kind === "other" ? q(".sv-route").value : AIRPORT_ROUTE;
        p = transferPrice({ route: route, guests: g || DISPLAY_GUESTS });
      }
      q(".sv-price").innerHTML = priceHTML(p.usd, p.idr);
    }
    // onchange (bukan addEventListener) biar listener popup sebelumnya ketimpa,
    // nggak numpuk tiap kali popup dibuka
    svcBody.onchange = () => {
      const durEl = q(".sv-dur");
      const wrap = q(".sv-extra-wrap");
      if (durEl && wrap) wrap.style.display = durEl.value === "extended" ? "" : "none";
      livePrice();
    };
    livePrice();

    q(".svc__save").addEventListener("click", () => {
      const dv = q(".sv-date").value;
      if (dv && dv < todayStr()) { showPastDate(); return; }
      const gv = q(".sv-guests").value;
      const tv = q(".sv-time").value;
      const hv = q(".sv-hotel").value.trim();
      if (isCharter) {
        const entry = ch || { area: "", dur: "", extra: 1, date: "", time: "", guests: "", pickup: "", dropoff: "" };
        entry.area = q(".sv-area").value;
        entry.dur = q(".sv-dur").value;
        entry.extra = parseInt(q(".sv-extra").value) || 1;
        entry.date = dv; entry.time = tv; entry.guests = gv; entry.pickup = hv;
        if (!ch) state.charters.push(entry);
      } else {
        const dir = kind === "pickup" ? "to" : kind === "dropoff" ? "from" : q(".sv-dir").value;
        const route = kind === "other" ? q(".sv-route").value : AIRPORT_ROUTE;
        const area = route === AIRPORT_ROUTE ? "Ngurah Rai Airport" : route.replace(" – Ubud", "");
        const entry = tr || { route: "", direction: "to", date: "", time: "", guests: "", pickup: "", dropoff: "" };
        entry.route = route; entry.direction = dir; entry.date = dv; entry.time = tv; entry.guests = gv;
        if (dir === "from") { entry.pickup = hv; entry.dropoff = area; }
        else { entry.pickup = area; entry.dropoff = hv; }
        if (!tr) state.transfers.push(entry);
      }
      save();
      rerender();
      svcModal.classList.remove("active");
    });
    const rmBtn = q(".svc__rm");
    if (rmBtn) rmBtn.addEventListener("click", () => {
      if (isCharter) state.charters.splice(idx, 1);
      else state.transfers.splice(idx, 1);
      save();
      rerender();
      svcModal.classList.remove("active");
    });

    // Date + semua select di popup ini pakai custom picker kita (bukan native browser).
    enhanceFieldsIn(svcBody);

    svcModal.classList.add("active");
  }

  // ---------- ringkasan ----------
  function renderSummary() {
    let usd = 0,
      idr = 0;
    state.days.forEach((d) => {
      const p = dayPrice(d);
      usd += p.usd;
      idr += p.idr;
    });
    state.transfers.forEach((tr) => {
      const p = transferPrice(tr);
      usd += p.usd;
      idr += p.idr;
    });
    const chs = state.charters || [];
    chs.forEach((ch) => {
      const p = charterPrice(ch.area, ch.dur, ch.extra);
      usd += p.usd;
      idr += p.idr;
    });
    document.getElementById("itn-total").innerHTML = priceHTML(usd, idr);
    const nDays = state.days.length,
      nTr = state.transfers.length,
      nCh = chs.length;
    let label = `${nDays} day${nDays === 1 ? "" : "s"}`;
    if (nTr) label += ` \u00B7 ${nTr} transfer${nTr === 1 ? "" : "s"}`;
    if (nCh) label += ` \u00B7 ${nCh} charter`;
    document.getElementById("itn-total-label").textContent = label;
    const allDone =
      state.days.every(dayComplete) &&
      state.transfers.every(transferComplete) &&
      chs.every(charterComplete);
    document.getElementById("itn-book").disabled = !(nDays || nTr || nCh) || !allDone;
  }

  function rerender() {
    renderDays();
    renderTransfers();
    renderSummary();
    itnEntered = true; // render berikutnya tanpa animasi masuk
  }
  window.__itnRerender = rerender; // biar ganti currency bisa re-render itinerary
  // Ganti seluruh isi itinerary (dipakai "Use this package"). Set state closure +
  // simpan + render, biar builder langsung update tanpa reload halaman.
  window.__itnReplaceState = function (st) {
    st.trip = st.trip || state.trip; // pertahanin Trip Details yang udah keisi
    state = st;
    applyTrip(false); // hari baru langsung keisi dari Trip Details
    save();
    rerender();
  };

  // ---------- tombol Add -> popup pilih kategori ----------
  const pickModal = document.getElementById("itn-pick-modal");
  const addBtn = document.getElementById("itn-add");
  if (addBtn && pickModal) {
    addBtn.addEventListener("click", () => pickModal.classList.add("active"));
    pickModal.addEventListener("click", (e) => {
      if (e.target === pickModal || e.target.closest("[data-close]"))
        pickModal.classList.remove("active");
    });
  }

  // Charter beda dari kategori lain: nggak "pilih yang mana", tapi 1 kartu yang
  // dikonfigurasi. Jadi langsung tambah kartu charter kosong ke builder (inline).
  const pickCharter = document.getElementById("pick-charter");
  if (pickCharter)
    pickCharter.addEventListener("click", () => {
      state.charters.push({ area: "", dur: "", extra: 1, date: "", time: "", guests: "", pickup: "", dropoff: "" });
      save();
      rerender();
      if (pickModal) pickModal.classList.remove("active");
    });

  const clearBtn = document.getElementById("itn-clear");
  if (clearBtn)
    clearBtn.addEventListener("click", () => {
      if (!itnCount(state)) return;
      if (!confirm("Clear the whole itinerary?")) return;
      state = { days: [], transfers: [], charters: [], trip: { start: "", guests: currentGuests ? String(currentGuests) : "", hotel: "" } };
      openDays.clear();
      syncTripInputs(); // form Trip Details ikut kosong
      save();
      rerender();
    });

  // ---------- Book -> modal konfirmasi bersama (window.__openBooking) ----------
  function dayServiceName(d) {
    return d.items
      .map((name, idx) => name + (itemMode(d, idx) === "exclusive" ? " (Exclusive)" : ""))
      .join(" + ");
  }
  function dayLine(d) {
    let s = dayServiceName(d);
    const loc = [d.pickup, d.dropoff].filter(Boolean);
    if (loc.length) s += ` (${loc.join(" → ")})`;
    return s;
  }
  function transferLine(tr) {
    const area = tr.route.replace(" – Ubud", "");
    return tr.direction === "from" ? `Ubud → ${area}` : `${area} → Ubud`;
  }
  function charterDurLabel(ch) {
    if (ch.dur === "half") return "Half Day (5h)";
    if (ch.dur === "full") return "Full Day (10h)";
    if (ch.dur === "extended") return `Extended (10h + ${parseInt(ch.extra) || 1}h)`;
    return "";
  }

  document.getElementById("itn-book").addEventListener("click", () => {
    if (!window.__openBooking) return;
    let usd = 0,
      idr = 0;
    state.days.forEach((d) => {
      const p = dayPrice(d);
      usd += p.usd;
      idr += p.idr;
    });
    state.transfers.forEach((tr) => {
      const p = transferPrice(tr);
      usd += p.usd;
      idr += p.idr;
    });
    const chs = state.charters || [];
    chs.forEach((ch) => {
      const p = charterPrice(ch.area, ch.dur, ch.extra);
      usd += p.usd;
      idr += p.idr;
    });
    // Tiap hari/transfer/charter -> 1 line (dikirim ke backend sebagai array `lines`).
    // day_no cuma buat hari; transfer/charter null tapi tetap 1 order (booking_ref sama).
    // eligible: tour & transfer kena referral, charter nggak (sama kayak booking langsung).
    const lines = [
      ...state.days.map((d, i) => {
        const p = dayPrice(d);
        return { type: "tour", service: dayServiceName(d), date: d.date, guests: d.guests,
          pickup: d.pickup || "", dropoff: d.dropoff || "", usd: p.usd, idr: p.idr, day_no: i + 1, eligible: true };
      }),
      ...state.transfers.map((tr) => {
        const p = transferPrice(tr);
        return { type: "transfer", service: transferLine(tr), date: tr.date, time: tr.time || "", guests: tr.guests,
          pickup: tr.pickup || "", dropoff: tr.dropoff || "", usd: p.usd, idr: p.idr, day_no: null, eligible: true };
      }),
      ...chs.map((ch) => {
        const p = charterPrice(ch.area, ch.dur, ch.extra);
        return { type: "charter", service: `${charterDurLabel(ch)} from ${ch.area}`, date: ch.date, time: ch.time || "", guests: ch.guests,
          pickup: ch.pickup || "", dropoff: ch.dropoff || "", usd: p.usd, idr: p.idr, day_no: null, eligible: false };
      }),
    ];
    const nDays = state.days.length, nTr = state.transfers.length, nCh = chs.length;
    const parts = [];
    if (nDays) parts.push(`${nDays} day${nDays > 1 ? "s" : ""}`);
    if (nTr) parts.push(`${nTr} transfer${nTr > 1 ? "s" : ""}`);
    if (nCh) parts.push(`${nCh} charter`);
    // Ringkasan buat popup: guests dari trip, date = rentang hari pertama-terakhir,
    // rincian per hari/transfer/charter masuk accordion "Trip details" (bisa dibuka-tutup)
    const dayDates = state.days.map((d) => d.date).filter(Boolean);
    const dateRange = dayDates.length
      ? fmtDayDate(dayDates[0]) + (dayDates.length > 1 ? " - " + fmtDayDate(dayDates[dayDates.length - 1]) : "")
      : "";
    const detailLines = [
      ...state.days.map((d, i) => `Day ${i + 1} · ${d.date ? fmtDayDate(d.date) : "date TBD"} · ${dayLine(d)}`),
      ...state.transfers.map((tr) => `Transfer · ${tr.date ? fmtDayDate(tr.date) : "date TBD"}${tr.time ? " · " + fmtTime(tr.time) : ""} · ${transferLine(tr)}`),
      ...chs.map((ch) => `Charter · ${ch.date ? fmtDayDate(ch.date) : "date TBD"}${ch.time ? " · " + fmtTime(ch.time) : ""} · ${charterDurLabel(ch)} from ${ch.area}`)
    ];
    window.__openBooking({
      type: "itinerary",
      service: `Custom Itinerary (${parts.join(" + ")})`,
      guests: state.trip.guests || "",
      date: dateRange,
      price: { usd, idr },
      pickup: state.trip.hotel || "",
      pickupOptional: true,
      dropoffRequired: false,
      detailLines: detailLines,
      detailsTitle: "Trip details",
      lines: lines,
      onSuccess: () => {
        state = { days: [], transfers: [], charters: [], trip: { start: "", guests: currentGuests ? String(currentGuests) : "", hotel: "" } };
        openDays.clear();
        syncTripInputs();
        save();
        rerender();
      }
    });
  });

  // ---------- Trip Details (isi sekali di atas -> semua hari ngikut) ----------
  // force=false: cuma isi slot kosong (dipanggil pas load, biar override per-hari
  // nggak ketimpa). force=true: timpa semua hari (dipanggil pas form diubah).
  state.trip = state.trip || { start: "", guests: "", hotel: "" };
  function applyTrip(force) {
    const t = state.trip;
    state.days.forEach((d, idx) => {
      if (t.start && (force || !d.date)) d.date = addDaysStr(t.start, idx);
      if (t.guests && (force || !d.guests)) d.guests = t.guests;
      if (t.hotel) {
        if (force || !d.pickup) d.pickup = t.hotel;
        if (force || !d.dropoff) d.dropoff = t.hotel;
      }
    });
    // Transfer/charter: isi slot kosong aja (sisi airport nggak disentuh)
    if (t.guests) propagateGuests(t.guests);
    if (t.hotel) propagateLocation(t.hotel);
  }
  const tripStart = document.getElementById("trip-start");
  const tripHotel = document.getElementById("trip-hotel");
  const tripGuestsN = document.getElementById("trip-guests-n");
  // Sinkron isi form Trip Details dari state (dipakai init + Clear all + habis booking)
  function syncTripInputs() {
    if (!tripStart || !tripHotel) return;
    tripStart.value = state.trip.start || "";
    tripHotel.value = state.trip.hotel || "";
    if (tripGuestsN) tripGuestsN.textContent = state.trip.guests || "-";
  }
  if (tripStart && tripHotel) {
    tripStart.min = todayStr();
    // Guests nggak punya field di Trip Details: sumbernya picker navbar (cue_guests)
    if (currentGuests) state.trip.guests = String(currentGuests);
    syncTripInputs();
    const onTripChange = () => {
      if (tripStart.value && tripStart.value < todayStr()) {
        showPastDate();
        tripStart.value = state.trip.start || "";
        return;
      }
      state.trip = { start: tripStart.value, guests: state.trip.guests || "", hotel: tripHotel.value.trim() };
      applyTrip(true);
      save();
      rerender();
    };
    tripStart.addEventListener("change", onTripChange);
    tripHotel.addEventListener("change", onTripChange);
    applyTrip(false); // hari yang baru ditambah dari halaman lain langsung keisi
    save();
  }
  // Guests navbar ganti -> sebar ke trip + semua hari (transfer/charter isi yang kosong)
  window.__itnGuestsSync = function (n) {
    state.trip.guests = String(n);
    state.days.forEach((d) => { d.guests = state.trip.guests; });
    propagateGuests(state.trip.guests);
    save();
    rerender();
    syncTripInputs();
    const sg = document.getElementById("sg-guests");
    if (sg) sg.value = String(n);
  };

  rerender();
}

// Generic popup handling: [data-open="id"] opens, .modal__close / [data-close] / backdrop closes
function initModals() {
  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Book Now dari kartu tour / halaman destinasi: skip form modal, langsung
      // popup tanggal -> tambah ke cart (My Trips). Item & tipe dibaca dari placeholder.
      if (btn.dataset.open === "book-modal") {
        const ph = document.getElementById("book-modal-placeholder");
        const type = (ph && ph.dataset.default) || "tour";
        const name = (ph && ph.dataset.item) || "";
        if (name) { bookNow(type, name); return; }
      }
      const m = document.getElementById(btn.dataset.open);
      if (m) m.classList.add("active");
    });
  });
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest("[data-close]")) modal.classList.remove("active");
    });
  });
}

// Satu kartu review - dipake homepage strip & halaman all-reviews.html.
// Logo sumber review (pojok kanan bawah kartu) - "cahyana" default buat review
// yang ditulis langsung di web; tiga lainnya buat kalau ada review di-import.
const REVIEW_SOURCE_LOGO = {
  cahyana: { src: "assets/images/logo.webp", alt: "Cahyana Ubud Experience" },
  tripadvisor: { src: "assets/images/tripadvisor.webp", alt: "Tripadvisor" },
  viator: { src: "assets/images/viator.webp", alt: "Viator" },
  google: { src: "assets/images/google.svg", alt: "Google" },
};
// Nama negara (disimpen di DB) -> kode buat file assets/flags/<code>.svg.
const COUNTRY_CODE_BY_NAME = Object.fromEntries(COUNTRIES.map((c) => [c.name, c.code]));

function renderReviewCard(r) {
  const n = Math.max(1, Math.min(5, parseInt(r.rating, 10) || 0));
  const stars = "&#9733;".repeat(n) + "&#9734;".repeat(5 - n);
  const flagCode = r.country ? COUNTRY_CODE_BY_NAME[r.country] : null;
  const flag = flagCode
    ? '<img class="rev__flag" src="assets/flags/' + flagCode + '.svg" alt="' + escHtml(r.country) + '" loading="lazy" />'
    : "";
  const src = REVIEW_SOURCE_LOGO[r.source] || REVIEW_SOURCE_LOGO.cahyana;
  return '<article class="rev">' +
    '<div class="rev__head"><span class="rev__name">' + escHtml(r.name) + "</span>" + flag + "</div>" +
    (r.service ? '<div class="rev__service">' + escHtml(r.service) + "</div>" : "") +
    '<div class="rev__stars" aria-label="' + n + ' out of 5">' + stars + "</div>" +
    '<p class="rev__text">' + escHtml(r.message) + "</p>" +
    '<img class="rev__logo" src="' + src.src + '" alt="' + src.alt + '" loading="lazy" />' +
  "</article>";
}

// Guest Reviews strip (homepage dkk) — tarik yang UDAH DI-APPROVE dari
// GET /api/reviews. Kosong / fetch gagal -> tetep invite markup statis
// yang udah ada di partial (no fake content), section TETEP keliatan.
async function initReviews() {
  const section = document.getElementById("reviews");
  const strip = document.querySelector(".reviews-strip");
  if (!section || !strip) return;
  try {
    const rows = await fetch(`${API_BASE}/reviews`).then((r) => r.json());
    // No approved reviews yet - keep the static invite markup already in the partial.
    if (!Array.isArray(rows) || !rows.length) return;
    strip.innerHTML = rows.map(renderReviewCard).join("");
  } catch (e) {
    // fetch failed - leave the static invite markup in place
  }
}

// Halaman "See all reviews" (all-reviews.html) - list lengkap, endpoint sama,
// container/empty-state beda dari strip homepage.
async function initAllReviews() {
  const list = document.querySelector("[data-all-reviews]");
  if (!list) return;
  try {
    const rows = await fetch(`${API_BASE}/reviews`).then((r) => r.json());
    if (!Array.isArray(rows) || !rows.length) return; // static empty state udah di HTML
    list.innerHTML = rows.map(renderReviewCard).join("");
  } catch (e) {
    // fetch failed - leave the static empty state in place
  }
}

// Tombol mana pun yang buka modal review (empty-state homepage, header
// all-reviews.html, dll) - wired sekali dari sini, bukan per-halaman.
function initReviewTriggers() {
  document.querySelectorAll("[data-open-review]").forEach((btn) => {
    btn.addEventListener("click", () => openReviewModal());
  });
}

/* ===== Review submission — dua cara buktiin booking itu punya kamu:
   (a) login (token sesi) - dari tombol per-tour di My Trips, langsung ke tahap
       "write", udah ke-prefill; (b) booking_ref + email/phone (tahap "verify"
       dulu). Dua-duanya dicek ULANG di server (endpoint verify di sini cuma
       buat UX). Satu booking bisa punya beberapa tour beda (custom itinerary)
       -> dropdown "Which tour" kalau lebih dari satu, direview satu-satu. ===== */

// Ambil nama item/tour halaman ini - sumber kebenarannya SAMA kayak yang
// dipake initBooking buat preset form (data-item di booking-placeholder ATAU
// book-modal-placeholder). Dipake juga buat filter review per-tour.
function pageItemName() {
  const holder = document.getElementById("booking-placeholder") || document.getElementById("book-modal-placeholder");
  return (holder && holder.dataset.item) || "";
}

// Review khusus tour/halaman ini (bukan campur semua kayak homepage) - GET
// /api/reviews?service=... Kosong -> section gak ditampilin sama sekali (beda
// dari homepage/all-reviews.html yang punya invite state sendiri; ngulang
// "be the first" itu di 60+ halaman kerasa berisik, cukup di 2 tempat itu).
async function initTourReviews() {
  const service = pageItemName();
  const mount = document.getElementById("footer-placeholder");
  if (!service || !mount || document.querySelector(".tour-reviews")) return;
  let rows = [];
  try {
    rows = await fetch(`${API_BASE}/reviews?service=${encodeURIComponent(service)}`).then((r) => r.json());
    if (!Array.isArray(rows)) rows = [];
  } catch (e) {
    rows = [];
  }
  if (!rows.length) return;
  const wrap = document.createElement("section");
  wrap.className = "reviews tour-reviews";
  wrap.innerHTML =
    '<div class="reviews__head"><h2 class="section__title">Guest Reviews</h2></div>' +
    '<div class="reviews-strip">' + rows.map(renderReviewCard).join("") + "</div>";
  mount.parentNode.insertBefore(wrap, mount);
}

// Tombol "Leave a review" di paling bawah halaman — CUMA di halaman yang
// bisa di-book (aturan Wayan: "kalau bisa di-book berarti bisa di-review").
// Dicek dari placeholder yang sama kayak initTripBar pakai buat mode booking.
function initReviewCta() {
  const hasBooking = document.getElementById("booking-placeholder") || document.getElementById("book-modal-placeholder");
  const mount = document.getElementById("footer-placeholder");
  if (!hasBooking || !mount || document.querySelector(".review-cta")) return;
  const wrap = document.createElement("div");
  wrap.className = "review-cta";
  wrap.innerHTML = '<button type="button" class="btn-pill">Leave a review</button>';
  mount.parentNode.insertBefore(wrap, mount);
  wrap.querySelector("button").addEventListener("click", () => openReviewModal());
}

let reviewModalPromise = null; // fetch partial cuma sekali, dipake ulang tiap kebuka

// prefill = { ref, items, name } - dikasih dari tombol "Leave a Review" di My
// Trips (udah login) buat lompat langsung ke tahap "write", skip verifikasi.
// items = daftar tour yang bisa direview dari booking itu (1 atau lebih -
// dropdown "Which tour" di step write munculin pilihan kalau lebih dari 1).
// Kosongin prefill buat alur biasa (verifikasi manual booking ref + kontak dulu).
async function openReviewModal(prefill) {
  if (!reviewModalPromise) {
    const host = document.createElement("div");
    document.body.appendChild(host);
    reviewModalPromise = fetch(`partials/review-modal.html?v=${PARTIALS_VERSION}`)
      .then((r) => r.text())
      .then((html) => {
        host.innerHTML = html;
        const modal = host.querySelector(".modal");
        wireReviewModal(modal);
        return modal;
      });
  }
  const modal = await reviewModalPromise;
  resetReviewModal(modal);
  if (prefill && prefill.ref && prefill.items && prefill.items.length) {
    enterWriteStep(modal, { ref: prefill.ref, name: prefill.name || "", items: prefill.items, mode: "account" });
  }
  modal.classList.add("active");
}

function resetReviewModal(modal) {
  modal.querySelector('[data-step="verify"]').hidden = false;
  modal.querySelector('[data-step="write"]').hidden = true;
  // .modal__success punya CSS "display:none" bawaan (dipake book-confirm.html juga,
  // di-toggle lewat style.display, BUKAN attribute hidden) - ikutin pola yang sama.
  modal.querySelector("#rvm-success").style.display = "none";
  modal.querySelector("#rvm-ref").value = "";
  modal.querySelector("#rvm-contact").value = "";
  modal.querySelector("#rvm-name").value = "";
  modal.querySelector("#rvm-country").value = "";
  modal.querySelector("#rvm-checklist").innerHTML = "";
  modal.querySelector("#rvm-blocks").innerHTML = "";
  modal.dataset.mode = "contact";
  const vErr = modal.querySelector("#rvm-verify-error"); vErr.hidden = true; vErr.textContent = "";
  const sErr = modal.querySelector("#rvm-submit-error"); sErr.hidden = true; sErr.textContent = "";
}

// Satu blok rating+teks per tour (di-render buat SEMUA item, disembunyiin/
// dimunculin lewat checkbox - bukan dibikin/dibuang, biar teks yg udah
// diketik gak ilang kalau guest toggle centangnya).
function reviewBlockHTML(service, idx) {
  const stars = [1, 2, 3, 4, 5]
    .map((n) => '<button type="button" class="rating__star" data-value="' + n + '" aria-label="' + n + " star" + (n > 1 ? "s" : "") + '">&#9733;</button>')
    .join("");
  return '<div class="rvm-block" data-review-block data-idx="' + idx + '" data-service="' + escHtml(service) + '" data-rating="0">' +
    '<p class="modal__sub"><strong>' + escHtml(service) + "</strong></p>" +
    '<div class="rating">' + stars + "</div>" +
    '<div class="modal__group"><textarea rows="3" placeholder="Your review for ' + escHtml(service) + '"></textarea></div>' +
  "</div>";
}

// Pindah dari tahap "verify" ke "write" - dipake abis verify sukses ATAU
// langsung dari prefill (My Trips). items = daftar tour yang bisa direview
// dari booking itu (server-side, udah difilter yang tripnya udah lewat &
// belum direview - lihat reviewableItems() di cahyana-api). Lebih dari 1 tour
// -> munculin checklist, guest centang mana aja yang mau direview (default
// semua kecentang), satu blok rating+teks per tour yang dicentang.
function enterWriteStep(modal, { ref, name, items, mode }) {
  modal.dataset.ref = ref;
  modal.dataset.mode = mode;
  modal.querySelector("#rvm-name").value = name || "";

  const checklist = modal.querySelector("#rvm-checklist");
  const blocksWrap = modal.querySelector("#rvm-blocks");
  checklist.innerHTML = items.length > 1
    ? '<p class="modal__sub">Which tours would you like to review?</p>' +
      items.map((s, i) =>
        '<label class="rvm-check"><input type="checkbox" data-review-check data-idx="' + i + '" checked /> ' + escHtml(s) + "</label>",
      ).join("")
    : "";
  blocksWrap.innerHTML = items.map((s, i) => reviewBlockHTML(s, i)).join("");

  checklist.querySelectorAll("[data-review-check]").forEach((cb) => {
    cb.addEventListener("change", () => {
      const block = blocksWrap.querySelector('[data-review-block][data-idx="' + cb.dataset.idx + '"]');
      if (block) block.hidden = !cb.checked;
    });
  });
  blocksWrap.querySelectorAll("[data-review-block]").forEach((block) => {
    block.querySelectorAll(".rating__star").forEach((star) => {
      star.addEventListener("click", () => {
        block.dataset.rating = star.dataset.value;
        block.querySelectorAll(".rating__star").forEach((s) =>
          s.classList.toggle("active", parseInt(s.dataset.value, 10) <= parseInt(star.dataset.value, 10)));
      });
    });
  });

  modal.querySelector('[data-step="verify"]').hidden = true;
  modal.querySelector('[data-step="write"]').hidden = false;
}

function wireReviewModal(modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-close]")) modal.classList.remove("active");
  });

  // Dropdown negara diisi sekali (partial-nya di-cache, gak perlu diulang tiap buka).
  // data-flag = kode negara -> custom dropdown render bendera + nama (Wayan).
  modal.querySelector("#rvm-country").insertAdjacentHTML(
    "beforeend",
    COUNTRIES.map((c) => `<option value="${escHtml(c.name)}" data-flag="${escHtml(c.code)}">${escHtml(c.name)}</option>`).join(""),
  );
  // Pakai custom dropdown kita (bukan <select> native) - judul panel "Country" +
  // search box (ketik "i" -> India, Indonesia, ... lalu pilih).
  globalEnhancer().enhanceSelect(modal.querySelector("#rvm-country"), "Country", { search: true, searchPlaceholder: "Type a country" });

  const verifyBtn = modal.querySelector("#rvm-verify-btn");
  const verifyErr = modal.querySelector("#rvm-verify-error");
  verifyBtn.addEventListener("click", async () => {
    const ref = modal.querySelector("#rvm-ref").value.trim();
    const contact = modal.querySelector("#rvm-contact").value.trim();
    verifyErr.hidden = true;
    if (!ref || !contact) {
      verifyErr.textContent = "Please enter your booking reference and email or phone.";
      verifyErr.hidden = false;
      return;
    }
    verifyBtn.disabled = true;
    try {
      const data = await fetch(`${API_BASE}/reviews/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_ref: ref, contact }),
      }).then((r) => r.json());
      if (!data.ok) {
        verifyErr.textContent = data.reason || "We couldn't verify that booking.";
        verifyErr.hidden = false;
        return;
      }
      modal.dataset.contact = contact;
      enterWriteStep(modal, { ref, name: data.name, items: data.items, mode: "contact" });
    } catch (e) {
      verifyErr.textContent = "Something went wrong. Please try again.";
      verifyErr.hidden = false;
    } finally {
      verifyBtn.disabled = false;
    }
  });

  const submitBtn = modal.querySelector("#rvm-submit-btn");
  const submitErr = modal.querySelector("#rvm-submit-error");
  submitBtn.addEventListener("click", async () => {
    const name = modal.querySelector("#rvm-name").value.trim();
    const country = modal.querySelector("#rvm-country").value;
    const blocks = Array.from(modal.querySelectorAll("[data-review-block]")).filter((b) => !b.hidden);
    submitErr.hidden = true;
    if (!blocks.length) { submitErr.textContent = "Please select at least one tour to review."; submitErr.hidden = false; return; }

    const items = [];
    for (const block of blocks) {
      const service = block.dataset.service;
      const rating = parseInt(block.dataset.rating || "0", 10);
      const message = block.querySelector("textarea").value.trim();
      if (!rating) { submitErr.textContent = "Please give a star rating for " + service + "."; submitErr.hidden = false; return; }
      if (!message) { submitErr.textContent = "Please write a review for " + service + "."; submitErr.hidden = false; return; }
      items.push({ service, rating, message });
    }

    submitBtn.disabled = true;
    try {
      // Satu POST per tour dicentang - boleh isinya beda-beda, submit sekali jalan.
      const results = [];
      for (const it of items) {
        const body = { booking_ref: modal.dataset.ref, service: it.service, rating: it.rating, message: it.message, country, name };
        const headers = { "Content-Type": "application/json" };
        if (modal.dataset.mode === "account") headers.Authorization = `Bearer ${getToken()}`;
        else body.contact = modal.dataset.contact;
        const data = await fetch(`${API_BASE}/reviews`, { method: "POST", headers, body: JSON.stringify(body) }).then((r) => r.json());
        results.push({ service: it.service, ok: data.ok, reason: data.reason });
      }
      const failed = results.filter((r) => !r.ok);
      if (failed.length) {
        submitErr.textContent = failed.map((f) => f.service + ": " + (f.reason || "failed")).join(" · ");
        submitErr.hidden = false;
        return;
      }
      modal.querySelector('[data-step="write"]').hidden = true;
      modal.querySelector("#rvm-success").style.display = "block";
    } catch (e) {
      submitErr.textContent = "Something went wrong. Please try again.";
      submitErr.hidden = false;
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// Driver cards: click a card to open its profile popup (description + its reviews)
function initDrivers() {
  const cards = document.querySelectorAll(".driver-card");
  if (!cards.length) return;

  const modal = document.getElementById("driver-modal");
  if (!modal) return;
  const mName = document.getElementById("driver-modal-name");
  const mTagline = document.getElementById("driver-modal-tagline");
  const mDesc = document.getElementById("driver-modal-desc");

  const mAvatar = modal.querySelector(".driver-card__avatar");
  cards.forEach((card) => {
    // Avatar inisial: huruf depan nama gantiin ikon placeholder (sampai foto asli ada)
    const av = card.querySelector(".driver-card__avatar");
    if (av && card.dataset.name) av.textContent = card.dataset.name.charAt(0);
    card.addEventListener("click", () => {
      const detail = card.querySelector(".driver-card__detail");
      mName.textContent = card.dataset.name || "";
      mTagline.textContent = card.dataset.tagline || "";
      if (mAvatar) mAvatar.textContent = (card.dataset.name || "").charAt(0);
      mDesc.textContent = detail ? (detail.dataset.desc || "") : "";
      modal.classList.add("active");
    });
  });
}

// Isi semua link [data-wa] dengan nomor WhatsApp (satu sumber: WHATSAPP_NUMBER)
function initWhatsApp() {
  const num = String(WHATSAPP_NUMBER).replace(/[^0-9]/g, "");
  const msg = encodeURIComponent("Hi Cahyana, I have a question about your tours.");
  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = "https://wa.me/" + num + "?text=" + msg;
  });

  // Tombol WhatsApp ngambang di pojok kanan bawah (semua halaman KECUALI
  // halaman itinerary, biar nggak numpuk sama katalog floating di mobile)
  const onItinerary = !!document.getElementById("itn-days");
  if (!onItinerary && !document.querySelector(".wa-float")) {
    const wa = document.createElement("a");
    wa.className = "wa-float";
    wa.href =
      "https://wa.me/" +
      num +
      "?text=" +
      encodeURIComponent("Hi Wayan, I'd like to plan a trip.");
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.setAttribute("aria-label", "Talk with Wayan on WhatsApp");
    wa.innerHTML =
      '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.5 2.1 7.9L.5 31.5l7.8-2c2.3 1.3 5 1.9 7.7 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.3c-2.5 0-4.9-.7-7-1.9l-.5-.3-4.6 1.2 1.2-4.5-.3-.5C3.6 20.6 2.9 18.3 2.9 16 2.9 8.8 8.8 2.9 16 2.9c7.2 0 13.1 5.9 13.1 13.1S23.2 28.8 16 28.8zm7.2-9.6c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.7.2-.2.2-.4.4-.6.1-.3 0-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.7h-.7c-.2 0-.6.1-.9.5-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.4 3.7 5.8 5.1.8.3 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 2-1 2.3-1.9.3-.9.3-1.7.2-1.9-.1-.1-.3-.2-.7-.4z"/></svg><span class="wa-float__text">Talk with Wayan</span>';
    document.body.appendChild(wa);
  }
}

// Card & judul muncul (fade + naik) pas ke-scroll masuk layar.
// Class ditambah dari sini, jadi kalau JS mati semua elemen tetap tampil.
function initReveal() {
  const selectors = [
    ".experience__card",
    ".villa__card",
    ".review-card",
    ".driver-card",
    ".stop",
    ".info__fact",
    ".about__content",
    ".faq__item",
    ".section__title",
    ".itn-suggest",
    ".itn-trip",
    ".summary",
    ".guide-lead",
    ".guide-article p",
    ".guide-article ul"
  ];
  const els = document.querySelectorAll(selectors.join(","));
  if (!els.length) return;

  // Cuma animasikan elemen yang KELIHATAN di layar awal (above the fold) pas
  // halaman kebuka. Yang di bawah (harus scroll) dibiarin langsung siap - TANPA
  // reveal-on-scroll (dulu semua konten muncul pas di-scroll = kebanyakan gerak).
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const groupCount = new Map();
  const revealed = [];
  els.forEach((el) => {
    if (el.closest(".modal")) return; // lewati isi popup
    const top = el.getBoundingClientRect().top;
    if (top < 0 || top >= vh) return; // di luar layar awal -> biarin, no anim
    const parent = el.parentElement;
    const idx = groupCount.get(parent) || 0;
    groupCount.set(parent, idx + 1);
    el.style.transitionDelay = Math.min(idx, 5) * 0.07 + "s";
    el.classList.add("reveal");
    revealed.push(el);
  });
  if (!revealed.length) return;

  // Trigger fade-in di frame berikutnya (biar transisi jalan dari opacity 0).
  requestAnimationFrame(() =>
    requestAnimationFrame(() => revealed.forEach((el) => el.classList.add("is-visible")))
  );
  // Buang class reveal setelah animasi kelar, biar hover pakai transisi milik
  // card-nya sendiri (bukan transisi reveal).
  setTimeout(() => {
    revealed.forEach((el) => {
      el.classList.remove("reveal", "is-visible");
      el.style.transitionDelay = "";
    });
  }, 1300);
}

// Boks "Don't know where to start?" (Days + Guests + Build) di atas builder itinerary.
// Generate "suggested plan" ke builder yang udah ada (reuse initItinerary + __itnReplaceState).
// Homepage cuma punya CTA <a> ke itinerary.html (nggak ada boks), jadi ini early-return di situ.
function initSuggested() {
  const daysSel = document.getElementById("sg-days");
  const guestsSel = document.getElementById("sg-guests");
  const buildBtn = document.getElementById("sg-build");
  if (!daysSel || !guestsSel || !buildBtn) return;

  for (let i = 1; i <= 7; i++)
    daysSel.insertAdjacentHTML("beforeend", `<option value="${i}"${i === 3 ? " selected" : ""}>${i} day${i > 1 ? "s" : ""}</option>`);
  guestsSel.insertAdjacentHTML("beforeend", `<option value="" selected disabled>Guests</option>`);
  for (let n = 1; n <= 10; n++)
    guestsSel.insertAdjacentHTML("beforeend", `<option value="${n}">${n}</option>`);
  // Selaras sama picker guests di navbar (dua arah)
  if (currentGuests) guestsSel.value = String(currentGuests);
  guestsSel.addEventListener("change", () => setGuests(guestsSel.value));

  buildBtn.addEventListener("click", () => {
    const nDays = parseInt(daysSel.value) || 1;
    const g = guestsSel.value;
    if (!g) { alert("Please choose the number of guests first."); return; }
    const cur = itnLoad();
    if ((cur.days.length || cur.transfers.length) &&
        !confirm("This replaces your current itinerary with a suggested plan. Continue?")) return;
    const st = suggestState(nDays, g);
    itnSave(st);
    if (window.__itnReplaceState) window.__itnReplaceState(st);
    const target = document.getElementById("itinerary");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// Tiap card (a) badan card bisa diklik -> halaman detail,
// (b) ada tombol "Add to itinerary" yang nambah program ke store.
function initItineraryButtons() {
  // :not(.itn-prog) -> jangan sentuh kartu di builder itinerary (punya link foto +
  // tombol Set date sendiri). Kalau kena, link foto ke-remove + nambah tombol nyasar.
  document.querySelectorAll(".experience__card:not(.itn-prog)").forEach((card) => {
    const link = card.querySelector("a[href]");
    const href = link ? link.getAttribute("href") : null;
    const hasPage = href && PAGE_ITEM[href];
    // item dari halaman detail (via arrow) ATAU dari data-program (combo tanpa detail)
    const item = hasPage ? PAGE_ITEM[href] : card.dataset.program;

    // (a) kartu apapun yang punya link -> SELURUH badan card clickable, panah dibuang
    // (kartu tanpa item bookable — mis. Destinations — tetap bisa dibuka ke halamannya).
    if (href) {
      link.remove();
      card.classList.add("card-clickable");
      card.addEventListener("click", (e) => {
        if (e.target.closest(".card-add")) return;
        window.location.href = href;
      });
    }

    if (!item) return; // nggak ada item bookable -> stop di sini (nggak nambah + My Trips)

    // (b) tombol + My Trips -> buka popup tanggal (sama kayak Book Now)
    const body = card.querySelector(".experience__body") || card;
    if (!body.querySelector(".card-add")) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "card-add";
      btn.textContent = "+ My Trips";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        bookItem(item);
      });
      body.appendChild(btn);
    }
  });

  // Tombol + My Trips eksplisit (halaman detail, highlight card, dsb.) -> popup tanggal
  document.querySelectorAll("[data-add-item]").forEach((btn) => {
    btn.textContent = "+ My Trips";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      bookItem(btn.dataset.addItem);
    });
  });
}

// ===== Transfer route picker (halaman transfer) =====
// Rute simetris Ubud <-> area; harga per mobil dari prices.transfer. Klik "From"/"To"
// (salah satu wajib Ubud) -> harga fix langsung tampil. Return trip = 2 arah, diskon 10%.
// Perkiraan jam tempuh dari/ke Ubud - CEK WAYAN.
const TRANSFER_HOURS = {
  "Airport": "~1.5 hrs", "Denpasar Area": "~1 hr", "Tanah Lot Area": "~1.5 hrs",
  "Canggu Area": "~1.25 hrs", "Kuta Area": "~1.25 hrs", "Amed Area": "~2.5 hrs",
  "Buleleng Area": "~2.5 hrs", "Candidasa Area": "~1.5 hrs", "Kintamani Area": "~1 hr",
  "Seminyak Area": "~1.25 hrs"
};
const TRANSFER_LABEL = { "Airport": "Ngurah Rai Airport" }; // sisanya pakai nama area apa adanya
function initTransferPicker() {
  const box = document.querySelector("[data-transfer-picker]");
  if (!box) return;
  const fromSel = box.querySelector("[data-tp-from]");
  const toSel = box.querySelector("[data-tp-to]");
  const priceEl = box.querySelector("[data-tp-price]");
  const unitEl = box.querySelector("[data-tp-unit]");
  const retEl = box.querySelector("[data-tp-return]");
  const naEl = box.querySelector("[data-tp-na]");
  const bookBtn = box.querySelector("[data-tp-book]");
  const addBtn = box.querySelector("[data-tp-add]");
  if (!fromSel || !toSel) return;

  const areas = Object.keys(prices.transfer).map((k) => k.replace(" – Ubud", ""));
  const labelOf = (a) => (a === "Ubud" ? "Ubud" : (TRANSFER_LABEL[a] || a));
  const opts = ["Ubud", ...areas].map((a) => `<option value="${a}">${labelOf(a)}</option>`).join("");
  fromSel.innerHTML = opts; toSel.innerHTML = opts;
  fromSel.value = areas[0] || "Ubud"; toSel.value = "Ubud"; // default: Airport -> Ubud

  // Quote rute: cari area (sisi yg bukan Ubud), ambil harga fix, itung return kalau dicentang.
  const quote = () => {
    const from = fromSel.value, to = toSel.value;
    if (from === to) return null;
    const area = from === "Ubud" ? to : (to === "Ubud" ? from : null);
    if (!area) return null; // dua-duanya bukan Ubud -> nggak ada harga fix
    const base = prices.transfer[area + " – Ubud"];
    if (!base) return null;
    const direction = from === "Ubud" ? "from" : "to";
    const ret = !!(retEl && retEl.checked);
    const total = ret ? { usd: Math.round(base.usd * 2 * 0.9), idr: Math.round(base.idr * 2 * 0.9) } : base;
    return { area, direction, ret, total, hours: TRANSFER_HOURS[area] || "" };
  };

  const render = () => {
    const q = quote();
    if (!q) {
      priceEl.textContent = "—"; unitEl.textContent = "";
      if (naEl) naEl.hidden = false;
      bookBtn.disabled = true; addBtn.disabled = true;
      return;
    }
    if (naEl) naEl.hidden = true;
    bookBtn.disabled = false; addBtn.disabled = false;
    priceEl.textContent = fmtMoney(q.total.usd, q.total.idr);
    unitEl.textContent = "total per car" + (q.hours ? " · " + q.hours : "") + (q.ret ? " · return" : "");
    cselRefreshAll(); // From/To bisa berubah programmatik (jaga-Ubud, swap, rute populer) -> sync label
  };
  window.__transferRefresh = render; // dipanggil renderPrices pas kurs/referral berubah

  const addToCart = () => {
    const q = quote();
    if (!q) return false;
    const st = itnLoad();
    st.transfers.push({ route: q.area + " – Ubud", direction: q.direction, return: q.ret, pickup: "", dropoff: "", date: "", time: "", guests: "" });
    itnSave(st);
    return true;
  };

  // Jaga salah satu sisi selalu Ubud (rute cuma Ubud<->area).
  fromSel.addEventListener("change", () => { if (fromSel.value !== "Ubud" && toSel.value !== "Ubud") toSel.value = "Ubud"; render(); });
  toSel.addEventListener("change", () => { if (fromSel.value !== "Ubud" && toSel.value !== "Ubud") fromSel.value = "Ubud"; render(); });
  if (retEl) retEl.addEventListener("change", render);
  const swap = box.querySelector("[data-tp-swap]");
  if (swap) swap.addEventListener("click", () => { const f = fromSel.value; fromSel.value = toSel.value; toSel.value = f; render(); });

  // Airport butuh flight details -> gak lewat cart transfer biasa, langsung ke page khusus
  // (dimanapun ada pilihan Airport, tombol book-nya ngarah ke sana - Wayan, Sep 2026).
  const isAirportSelected = () => {
    const q = quote();
    return !!(q && q.area === "Airport");
  };

  // Book Now -> tambah ke My Trips lalu pindah ke halaman My Trips. Add -> tetap (toast).
  bookBtn.addEventListener("click", () => {
    if (isAirportSelected()) { window.location.href = "airport-transfer.html"; return; }
    if (addToCart()) window.location.href = "my-trips.html";
  });
  addBtn.addEventListener("click", () => {
    if (isAirportSelected()) { window.location.href = "airport-transfer.html"; return; }
    if (addToCart()) cartToast("Added to My Trips");
  });

  // Popular routes: klik baris -> isi picker (area -> Ubud) + scroll ke picker + glow.
  // Airport -> langsung ke page khusus (flight details), gak isi picker.
  document.querySelectorAll("[data-tp-route]").forEach((row) => {
    row.addEventListener("click", () => {
      if (row.dataset.tpRoute === "Airport") { window.location.href = "airport-transfer.html"; return; }
      fromSel.value = row.dataset.tpRoute; toSel.value = "Ubud";
      if (retEl) retEl.checked = false;
      render();
      box.scrollIntoView({ behavior: "smooth", block: "center" });
      box.classList.remove("tpick--glow"); void box.offsetWidth; box.classList.add("tpick--glow");
      setTimeout(() => box.classList.remove("tpick--glow"), 2000);
    });
  });

  render();
}

function initCharter() {
  const pickup = document.getElementById("ch-pickup");
  if (!pickup) return; // bukan halaman charter

  // isi pickup: Ubud (tanpa surcharge) + area transfer (luar Ubud)
  ["Ubud", ...Object.keys(prices.transfer).map((r) => r.replace(" – Ubud", ""))].forEach(
    (a) => pickup.add(new Option(a, a))
  );
  const guestsEl = document.getElementById("ch-guests");
  for (let n = 1; n <= 10; n++) guestsEl.add(new Option(n, n));

  const durBtns = document.querySelectorAll(".chdur");
  const extraWrap = document.getElementById("ch-extra-wrap");
  const extraInput = document.getElementById("ch-extra");
  const dateEl = document.getElementById("ch-date");
  const bookBtn = document.getElementById("ch-book");
  const st = { dur: "" };

  // harga tiap durasi (incl. surcharge kalau area di luar Ubud) via helper bersama
  const priceFor = (dur) => charterPrice(pickup.value, dur, extraInput.value);

  function renderCharter() {
    document.querySelectorAll("[data-ch]").forEach((el) => {
      const p = priceFor(el.dataset.ch);
      el.textContent = fmtMoney(p.usd, p.idr);
    });
    const totalBox = document.getElementById("ch-total");
    if (st.dur) {
      const p = priceFor(st.dur);
      totalBox.innerHTML = priceHTML(p.usd, p.idr);
    } else {
      totalBox.innerHTML = '<span class="price-cur">-</span>';
    }
    bookBtn.disabled = !(pickup.value && st.dur && dateEl.value && guestsEl.value);
  }
  window.__chRefresh = renderCharter; // ikut update pas ganti currency

  pickup.addEventListener("change", () => {
    durBtns.forEach((b) => (b.disabled = false));
    renderCharter();
  });
  durBtns.forEach((b) =>
    b.addEventListener("click", () => {
      if (b.disabled) return;
      st.dur = b.dataset.dur;
      durBtns.forEach((x) => x.classList.toggle("active", x === b));
      extraWrap.hidden = st.dur !== "extended";
      renderCharter();
    })
  );
  extraInput.addEventListener("input", renderCharter);
  dateEl.addEventListener("change", renderCharter);
  guestsEl.addEventListener("change", renderCharter);

  // Book -> buka modal konfirmasi bersama (pickup udah keisi dari builder, dropoff wajib)
  bookBtn.addEventListener("click", () => {
    if (!window.__openBooking) return;
    const p = priceFor(st.dur);
    const label =
      st.dur === "half"
        ? "Half Day (5h)"
        : st.dur === "full"
          ? "Full Day (10h)"
          : `Extended (10h + ${parseInt(extraInput.value) || 1}h)`;
    window.__openBooking({
      type: "charter",
      service: "Charter - " + label,
      guests: guestsEl.value,
      date: dateEl.value,
      price: { usd: p.usd, idr: p.idr },
      pickup: pickup.value,
      pickupOptional: false,
      dropoffRequired: true,
      referralEligible: false,
      detailLines: null
    });
  });

  renderCharter();
}

// Halaman khusus airport-transfer.html — sengaja page terpisah (bukan lewat picker/cart
// transfer biasa) karena butuh flight number + flight date/time (Wayan: perlu buat driver
// nunggu di jam yang bener). Harga fix = prices.transfer["Airport – Ubud"] (sama kayak yang
// dipakai transfer.html/homepage Airport band). Reuse langsung window.__openBooking (pola
// sama kayak initCharter) lewat `lines` structured 1-item biar pickup/dropoff udah kekunci
// dari sini, guest gak perlu isi ulang di modal (pickupOptional/dropoffRequired = false).
function initAirportTransfer() {
  const dirEl = document.getElementById("at-direction");
  if (!dirEl) return; // bukan halaman airport transfer
  const guestsEl = document.getElementById("at-guests");
  for (let n = 1; n <= 10; n++) guestsEl.add(new Option(n, n));
  const dateEl = document.getElementById("at-date");
  const addressEl = document.getElementById("at-address");
  const addressLabel = document.getElementById("at-address-label");
  const flightNoEl = document.getElementById("at-flight-number");
  const flightTimeEl = document.getElementById("at-flight-time");
  const totalBox = document.getElementById("at-total");
  const bookBtn = document.getElementById("at-book");

  function renderPrice() {
    const p = prices.transfer["Airport – Ubud"];
    if (p && totalBox) totalBox.innerHTML = priceHTML(p.usd, p.idr);
  }
  window.__atRefresh = renderPrice; // ikut update pas ganti currency (pola sama kayak __chRefresh)

  function syncLabel() {
    addressLabel.textContent = dirEl.value === "dropoff"
      ? "Hotel / villa pick-up address"
      : "Hotel / villa drop-off address";
  }
  dirEl.addEventListener("change", syncLabel);
  syncLabel();

  function validate() {
    return !!(dateEl.value && guestsEl.value && addressEl.value.trim() && flightNoEl.value.trim() && flightTimeEl.value);
  }
  function updateBtn() { bookBtn.disabled = !validate(); }
  [dateEl, guestsEl, addressEl, flightNoEl, flightTimeEl].forEach((el) => el.addEventListener("input", updateBtn));
  updateBtn();

  bookBtn.addEventListener("click", () => {
    if (!window.__openBooking || !validate()) return;
    const p = prices.transfer["Airport – Ubud"];
    const isDropoff = dirEl.value === "dropoff";
    const address = addressEl.value.trim();
    const pickup = isDropoff ? address : "Ngurah Rai Airport (DPS)";
    const dropoff = isDropoff ? "Ngurah Rai Airport (DPS)" : address;
    const service = "Airport Transfer - " + (isDropoff ? "Drop-off" : "Pickup");
    const flightNumber = flightNoEl.value.trim();
    const flightDatetime = flightTimeEl.value;
    const flightLabel = flightDatetime ? flightDatetime.replace("T", " ") : "";
    window.__openBooking({
      type: "transfer",
      service: service,
      guests: guestsEl.value,
      date: dateEl.value,
      price: { usd: p.usd, idr: p.idr },
      pickup: "",
      pickupOptional: true,
      dropoffRequired: false,
      detailLines: [
        "Flight " + flightNumber + (flightLabel ? " · " + flightLabel : ""),
        pickup + " → " + dropoff
      ],
      detailsTitle: "Trip details",
      lines: [{
        type: "transfer", service: service, date: dateEl.value, guests: guestsEl.value,
        pickup: pickup, dropoff: dropoff, usd: p.usd, idr: p.idr, day_no: null, eligible: true,
        flight_number: flightNumber, flight_datetime: flightDatetime,
      }],
    });
  });

  renderPrice();
}

// Wiring 1 custom dropdown currency (tombol + list bendera). Dipakai di dropdown
// akun (navbar) & popup welcome. Pilih -> setCurrency (langsung sync semua).
function wireCurDropdown(wrap) {
  const btn = wrap.querySelector("[data-cur-toggle]");
  const list = wrap.querySelector("[data-cur-list]");
  if (!btn || !list) return;
  syncCurBtn(wrap, currentCurrency);
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = list.hidden;
    list.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
  });
  list.querySelectorAll("[data-cur-opt]").forEach((opt) => {
    opt.addEventListener("click", () => {
      setCurrency(opt.dataset.curOpt);
      list.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target) && !list.hidden) {
      list.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
  });
}

// HTML custom dropdown currency (button + list bendera SVG). Bendera pakai
// <use href="#flag-xxx"> yang symbol-nya udah ada di partial navbar.
function curDropdownHTML() {
  let opts = "";
  CURRENCIES.forEach((c) => {
    opts += '<li class="acct__curopt" role="option" data-cur-opt="' + c + '">' +
      '<span class="acct__flag"><svg viewBox="0 0 60 40" aria-hidden="true"><use href="#flag-' + c.toLowerCase() + '"/></svg></span>' + c + "</li>";
  });
  return '<div class="acct__cur" data-cur>' +
    '<button type="button" class="acct__curbtn" data-cur-toggle aria-haspopup="listbox" aria-expanded="false">' +
      '<span class="acct__flag" data-cur-flag><svg viewBox="0 0 60 40" aria-hidden="true"><use href="#flag-usd"/></svg></span>' +
      '<span class="acct__curcode" data-cur-label>USD</span>' +
      '<svg class="acct__curcaret" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    "</button>" +
    '<ul class="acct__curlist" data-cur-list role="listbox" aria-label="Currency" hidden>' + opts + "</ul>" +
  "</div>";
}

// Search form: input kode referral + Apply (ganti field tanggal). Kode aktif disimpan
// di localStorage cue_referral; diskon dipasang site-wide via renderPrices + cartPriceTag.
function initReferral() {
  // Strict: kode valid -> keapply (input kekunci + tombol "Remove"). Kode salah ->
  // NGGAK diterima (border merah sekejap, input balik kosong). Nggak ada teks pesan.
  function refreshFields() {
    const active = activeReferral();
    document.querySelectorAll("[data-referral-field]").forEach((field) => {
      const inp = field.querySelector("[data-ref-input]");
      const btn = field.querySelector("[data-ref-apply]");
      if (!inp || !btn) return;
      inp.classList.remove("is-err");
      if (active) {
        inp.value = active.code;
        inp.disabled = true;
        btn.textContent = "Remove";
        btn.classList.add("is-active");
      } else {
        inp.disabled = false;
        btn.textContent = "Apply";
        btn.classList.remove("is-active");
      }
    });
  }
  window.__referralRefresh = refreshFields;

  document.querySelectorAll("[data-referral-field]").forEach((field) => {
    const inp = field.querySelector("[data-ref-input]");
    const btn = field.querySelector("[data-ref-apply]");
    if (!inp || !btn) return;
    const doApply = () => {
      if (activeReferral()) { saveReferral(null); return; } // tombol lagi "Remove"
      const entry = referralLookup(inp.value);
      if (entry) { saveReferral(entry); return; } // sukses -> refreshFields via saveReferral
      // strict reject: flash merah + kosongin, tanpa teks
      inp.classList.add("is-err");
      inp.value = "";
    };
    btn.addEventListener("click", doApply);
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); doApply(); } });
    inp.addEventListener("input", () => inp.classList.remove("is-err"));
  });

  refreshFields();
}

// Wiring custom dropdown currency yang udah ada di HTML (navbar) + render awal
function initCurrency() {
  document.querySelectorAll("[data-cur]").forEach(wireCurDropdown);
  renderPrices();
}

// Guest picker di navbar (desktop + mobile). Set jumlah orang global -> harga Exclusive
// & booking form ikut update. Nilai awal = pilihan tersimpan, atau DISPLAY_GUESTS (perkiraan).
function initGuestPicker() {
  const sels = document.querySelectorAll("[data-guest-select]");
  if (!sels.length) return;
  const val = currentGuests || DISPLAY_GUESTS;
  sels.forEach((sel) => {
    sel.value = String(val);
    sel.addEventListener("change", () => {
      if (sel.value === "reset") { resetGuests(); return; }
      setGuests(sel.value);
    });
  });
}

// Ikon akun di navbar: dropdown berisi Guests + Stay area. Badge = jumlah guests.
// Toggle buka/tutup panel + tutup pas klik di luar. Stay-select nyetir pickup surcharge.
function initAccountMenu() {
  const g = currentGuests || DISPLAY_GUESTS;
  document.querySelectorAll("[data-guest-badge]").forEach((b) => { b.textContent = String(g); });
  const staySel = currentStay || "ubud";
  document.querySelectorAll("[data-stay-select]").forEach((s) => {
    s.innerHTML = pickupOptionsHTML(staySel);
    s.value = staySel;
    s.addEventListener("change", () => setStay(s.value));
  });
  const closeAll = (except) => {
    document.querySelectorAll("[data-acct]").forEach((acct) => {
      if (acct === except) return;
      const panel = acct.querySelector("[data-acct-panel]");
      const btn = acct.querySelector("[data-acct-toggle]");
      if (panel && panel.classList.contains("is-open")) { panel.classList.remove("is-open"); if (btn) btn.setAttribute("aria-expanded", "false"); }
    });
  };
  document.querySelectorAll("[data-acct]").forEach((acct) => {
    const btn = acct.querySelector("[data-acct-toggle]");
    const panel = acct.querySelector("[data-acct-panel]");
    if (!btn || !panel) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !panel.classList.contains("is-open");
      closeAll(acct);
      // Buka akun -> tutup menu hamburger biar gak numpuk (bergantian).
      if (willOpen) {
        const nm = document.getElementById("nav-menu");
        if (nm) nm.classList.remove("active");
      }
      panel.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", String(willOpen));
      if (window.__navDrawerSync) window.__navDrawerSync();
    });
  });
  document.addEventListener("click", (e) => {
    let changed = false;
    document.querySelectorAll("[data-acct]").forEach((acct) => {
      if (!acct.contains(e.target)) {
        const panel = acct.querySelector("[data-acct-panel]");
        const btn = acct.querySelector("[data-acct-toggle]");
        if (panel && panel.classList.contains("is-open")) { panel.classList.remove("is-open"); if (btn) btn.setAttribute("aria-expanded", "false"); changed = true; }
      }
    });
    if (changed && window.__navDrawerSync) window.__navDrawerSync();
  });
}

// Field bersama popup welcome & "Your trip details": guests + pickup + currency
// (+ date opsional). Dipakai biar 1 sumber, gak dobel markup.
function tripFieldsHTML(includeDate) {
  const pre = currentGuests || DISPLAY_GUESTS;
  let opts = "";
  for (let n = 1; n <= 10; n++) opts += '<option value="' + n + '"' + (n === pre ? " selected" : "") + ">" + n + "</option>";
  const stayOpts = pickupOptionsHTML(currentStay || "ubud");
  const dateField = includeDate
    ? '<div class="welcome__field"><label>When</label>' +
      '<div class="welcome__daterow">' +
        '<input id="trip-date-from" type="date" aria-label="Start date" value="' + (currentDateFrom || "") + '" />' +
        '<input id="trip-date-to" type="date" aria-label="End date" value="' + (currentDateTo || "") + '" />' +
      "</div></div>"
    : "";
  return (
    dateField +
    '<div class="welcome__field">' +
      '<label for="welcome-guests">Number of guests</label>' +
      '<select id="welcome-guests">' + opts + "</select>" +
    "</div>" +
    '<div class="welcome__field">' +
      '<label for="welcome-stay">Where are you staying? (pickup)</label>' +
      '<select id="welcome-stay" data-stay-select>' + stayOpts + "</select>" +
    "</div>" +
    '<div class="welcome__field">' +
      "<label>Show prices in</label>" +
      curDropdownHTML() +
    "</div>"
  );
}
// Simpan pilihan dari popup (guests + pickup + date kalau ada) ke state global.
function saveTripPrefs(modal) {
  setGuests(modal.querySelector("#welcome-guests").value);
  setStay(modal.querySelector("#welcome-stay").value);
  const df = modal.querySelector("#trip-date-from");
  const dt = modal.querySelector("#trip-date-to");
  if (df || dt) setDateRange(df ? df.value : "", dt ? dt.value : "");
}

// Popup "Your trip details" (dari tripbar Edit + navbar Reset). Field-nya sama kaya
// yang sekarang inline di search form homepage (date + guests + pickup + currency).
function showTripDetails() {
  const existing = document.getElementById("tripdetails-modal");
  if (existing) existing.remove();
  const modal = document.createElement("div");
  modal.className = "modal welcome-modal";
  modal.id = "tripdetails-modal";
  modal.innerHTML =
    '<div class="modal__box welcome__box">' +
      '<button class="modal__close" data-close aria-label="Close">&times;</button>' +
      '<img class="modal__logo" src="assets/images/logo.webp" alt="The Cahyana Logo" width="1005" height="324" />' +
      '<h2 class="welcome__title">Your trip details</h2>' +
      '<p class="welcome__text">Set your group size, pickup, and date - we\'ll use it across your booking.</p>' +
      tripFieldsHTML(true) +
      '<div class="welcome__actions">' +
        '<button type="button" class="modal__btn" id="trip-save">Save</button>' +
      "</div>" +
    "</div>";
  document.body.appendChild(modal);
  const curWrap = modal.querySelector("[data-cur]");
  if (curWrap) wireCurDropdown(curWrap);
  enhanceFieldsIn(modal); // guests/pickup/tanggal di editor ini -> custom dropdown juga
  const close = () => modal.classList.remove("active");
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-close]")) close();
  });
  modal.querySelector("#trip-save").addEventListener("click", () => { saveTripPrefs(modal); close(); });
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add("active")));
}

// Popup form create account (dari welcome & tombol navbar). No password — 3 field.
function showCreateAccount() {
  const existing = document.getElementById("create-modal");
  if (existing) existing.remove();
  const modal = document.createElement("div");
  modal.className = "modal welcome-modal";
  modal.id = "create-modal";
  modal.innerHTML =
    '<div class="modal__box welcome__box">' +
      '<button class="modal__close" data-close aria-label="Close">&times;</button>' +
      '<img class="modal__logo" src="assets/images/logo.webp" alt="The Cahyana Logo" width="1005" height="324" />' +
      '<h2 class="welcome__title">Create your account</h2>' +
      '<p class="welcome__text">No password - we\'ll recognise you by email &amp; phone. Same details as your booking.</p>' +
      '<div class="welcome__field"><label for="acct-name">Name</label><input id="acct-name" type="text" autocomplete="name" /></div>' +
      '<div class="welcome__field"><label for="acct-email">Email</label><input id="acct-email" type="email" autocomplete="email" /></div>' +
      '<div class="welcome__field"><label for="acct-phone">Phone</label><input id="acct-phone" type="tel" autocomplete="tel" /></div>' +
      '<p class="welcome__msg" data-msg hidden></p>' +
      '<div class="welcome__actions">' +
        '<button type="button" class="modal__btn" id="acct-create-btn">Create Account</button>' +
      "</div>" +
      '<p class="welcome__alt">Already have an account? <button type="button" class="linklike" id="create-to-signin">Sign in</button></p>' +
    "</div>";
  document.body.appendChild(modal);
  const close = () => modal.classList.remove("active");
  const msg = modal.querySelector("[data-msg]");
  const showErr = (t) => { msg.textContent = t; msg.hidden = false; msg.className = "welcome__msg error"; };
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest("[data-close]")) close(); });
  modal.querySelector("#create-to-signin").addEventListener("click", () => { close(); showSignIn(); });
  const btn = modal.querySelector("#acct-create-btn");
  btn.addEventListener("click", async () => {
    const name = modal.querySelector("#acct-name").value.trim();
    const email = modal.querySelector("#acct-email").value.trim();
    const phone = modal.querySelector("#acct-phone").value.trim();
    if (!name) return showErr("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return showErr("Please enter a valid email address.");
    if (!phone) return showErr("Please enter your phone number.");
    btn.disabled = true; btn.textContent = "Creating...";
    const ok = await acctCreate({ name, email, phone });
    btn.disabled = false; btn.textContent = "Create Account";
    if (ok) close();
    else showErr("Couldn't create account right now. Please try again later.");
  });
  // double rAF: pastiin base state (opacity 0) ke-paint dulu -> transisi entry jalan
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add("active")));
}

// Popup Sign in (magic link): user isi email -> backend kirim link sign-in ke email.
// Di bawah ada link ke form Create Account (buat yang belum punya akun).
function showSignIn() {
  const existing = document.getElementById("signin-modal");
  if (existing) existing.remove();
  const modal = document.createElement("div");
  modal.className = "modal welcome-modal";
  modal.id = "signin-modal";
  modal.innerHTML =
    '<div class="modal__box welcome__box">' +
      '<button class="modal__close" data-close aria-label="Close">&times;</button>' +
      '<img class="modal__logo" src="assets/images/logo.webp" alt="The Cahyana Logo" width="1005" height="324" />' +
      '<h2 class="welcome__title">Sign in</h2>' +
      "<p class=\"welcome__text\">Enter your email and we'll send you a secure sign-in link. No password needed.</p>" +
      '<div class="welcome__field"><label for="signin-email">Email</label><input id="signin-email" type="email" autocomplete="email" /></div>' +
      '<p class="welcome__msg" data-msg hidden></p>' +
      '<div class="welcome__actions">' +
        '<button type="button" class="modal__btn" id="signin-btn">Email me a sign-in link</button>' +
      "</div>" +
      '<p class="welcome__alt">New here? <button type="button" class="linklike" id="signin-to-create">Create an account</button></p>' +
    "</div>";
  document.body.appendChild(modal);
  const close = () => modal.classList.remove("active");
  const msg = modal.querySelector("[data-msg]");
  const showMsg = (t, ok) => { msg.textContent = t; msg.hidden = false; msg.className = "welcome__msg " + (ok ? "success" : "error"); };
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest("[data-close]")) close(); });
  modal.querySelector("#signin-to-create").addEventListener("click", () => { close(); showCreateAccount(); });
  const btn = modal.querySelector("#signin-btn");
  btn.addEventListener("click", async () => {
    const email = modal.querySelector("#signin-email").value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return showMsg("Please enter a valid email address.", false);
    btn.disabled = true; btn.textContent = "Sending...";
    const ok = await acctRequestLogin(email);
    btn.disabled = false; btn.textContent = "Email me a sign-in link";
    if (ok) {
      showMsg("Check your email for a sign-in link. If you have an account with us, it's on the way.", true);
      modal.querySelector("#signin-email").disabled = true;
      btn.disabled = true;
    } else {
      showMsg("Couldn't send right now. Please try again later.", false);
    }
  });
  // double rAF: pastiin base state (opacity 0) ke-paint dulu -> transisi entry jalan
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add("active")));
}

// Init akun: render state awal + wire tombol auth (Sign in/up / Log out) via delegation,
// lalu cek sesi dari token (async, fail-soft) & render ulang.
async function initAccount() {
  renderAccount();
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-acct-auth]");
    if (!btn) return;
    e.preventDefault();
    if (btn.dataset.mode === "logout") acctLogout();
    else showSignIn();
  });
  await acctFetchSession();
  await acctRefreshUpcoming();
  renderAccount();
}

// Escape teks buat innerHTML (aman dari karakter HTML).
function escHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// Pesan "belum punya akun" + tombol Create Account (dipakai My Trips & Settings).
function accountGate(title, text) {
  return (
    '<div class="acctpage__gate">' +
      "<h2>" + escHtml(title) + "</h2>" +
      "<p>" + escHtml(text) + "</p>" +
      '<button type="button" class="modal__btn" data-gate-create>Create Account</button>' +
    "</div>"
  );
}
function wireGate(root) {
  const b = root.querySelector("[data-gate-create]");
  if (b) b.addEventListener("click", showCreateAccount);
}

/* ==================== My Trips cart page (Fase C) ==================== */

// Build lines + buka checkout dari state cart (isi guests default). Fase E ganti ke Xendit.
function cartCheckout(rerender) {
  if (!window.__openBooking) return;
  const st = itnLoad();
  // Hari kosong (tanpa item) — sisa slot dari sync rentang tanggal nginep — JANGAN diitung/dikirim.
  // My Trips nyembunyiin hari kosong (cartFlatten skip), jadi kalau ikut keitung di sini
  // muncul mismatch: cart keliatan 1 item tapi label bayar "3 days". Filter dulu.
  const days = (st.days || []).filter((d) => d.items && d.items.length);
  const transfers = st.transfers || [], chs = st.charters || [];
  if (!days.length && !transfers.length && !chs.length) return;
  // Semua baris WAJIB ada tanggal (tombol Make Payment juga di-disable — ini jaring kedua).
  if (days.concat(transfers, chs).some((r) => !r.date)) return;
  let usd = 0, idr = 0;
  const lines = [
    ...days.map((d, i) => {
      const p = cartDayPrice(d); usd += p.usd; idr += p.idr;
      return { type: "tour", service: cartDayTitle(d), date: d.date || "", guests: cartGuestsOf(d),
        pickup: d.pickup || "", dropoff: d.dropoff || "", usd: p.usd, idr: p.idr, day_no: i + 1, eligible: true };
    }),
    ...transfers.map((tr) => {
      const p = cartTransferPrice(tr); usd += p.usd; idr += p.idr;
      return { type: "transfer", service: cartTransferTitle(tr), date: tr.date || "", time: tr.time || "", guests: cartGuestsOf(tr),
        pickup: tr.pickup || "", dropoff: tr.dropoff || "", usd: p.usd, idr: p.idr, day_no: null, eligible: true };
    }),
    ...chs.map((ch) => {
      const p = cartCharterPrice(ch); usd += p.usd; idr += p.idr;
      return { type: "charter", service: cartCharterTitle(ch), date: ch.date || "", time: ch.time || "", guests: cartGuestsOf(ch),
        pickup: ch.pickup || "", dropoff: ch.dropoff || "", usd: p.usd, idr: p.idr, day_no: null, eligible: false };
    })
  ];
  const nD = days.length, nT = transfers.length, nC = chs.length;
  const parts = [];
  if (nD) parts.push(nD + " day" + (nD > 1 ? "s" : ""));
  if (nT) parts.push(nT + " transfer" + (nT > 1 ? "s" : ""));
  if (nC) parts.push(nC + " charter");
  const dayDates = days.map((d) => d.date).filter(Boolean);
  const dateRange = dayDates.length
    ? fmtDayDate(dayDates[0]) + (dayDates.length > 1 ? " - " + fmtDayDate(dayDates[dayDates.length - 1]) : "")
    : "";
  const detailLines = [
    ...days.map((d, i) => "Day " + (i + 1) + " · " + (d.date ? fmtDayDate(d.date) : "date TBD") + " · " + cartDayTitle(d)),
    ...transfers.map((tr) => "Transfer · " + (tr.date ? fmtDayDate(tr.date) : "date TBD") + (tr.time ? " · " + fmtTime(tr.time) : "") + " · " + cartTransferTitle(tr)),
    ...chs.map((ch) => "Charter · " + (ch.date ? fmtDayDate(ch.date) : "date TBD") + (ch.time ? " · " + fmtTime(ch.time) : "") + " · " + cartCharterTitle(ch))
  ];
  const ref = activeReferral();
  window.__openBooking({
    type: "itinerary",
    service: "My Trip (" + parts.join(" + ") + ")",
    guests: String(currentGuests || DISPLAY_GUESTS),
    date: dateRange,
    price: { usd, idr },
    pickup: "",
    pickupOptional: true,
    dropoffRequired: false,
    detailLines: detailLines,
    detailsTitle: "Trip details",
    lines: lines,
    referral: ref ? ref.code : "",
    onSuccess: () => {
      itnSave({ days: [], transfers: [], charters: [] });
      if (rerender) rerender();
    }
  });
}

// Halaman My Trips (cart): tab slider [Your Trip + paket suggested], kartu flat per item,
// total, Make Payment. Tab paket = browse doang; tiap barisnya bisa di-heart masuk/keluar cart.
function initMyTripsCart() {
  const root = document.querySelector("[data-mytrips-cart]");
  if (!root) return;
  let activeTab = "custom";
  let receiptOpen = false; // rincian harga: default ketutup
  let justPaid = false;    // true abis submit booking - ganti empty-state jadi upsell
  let bookedNames = [];    // nama item yg baru dipesan (dikecualiin dari rekomendasi)
  // Booked (udah bayar, upcoming) + Past (udah lewat, history) dari /api/bookings/mine.
  const bookings = { upcoming: [], history: [], loaded: false };

  // Kartu trip booked/past = gaya .mtc-item yg SAMA kayak kartu cart (foto icon + judul +
  // desc + tanggal + harga), tapi read-only (gak ada tombol hapus/heart). Foto diambil dari
  // ITEM_CARD by nama; kalau gak ketemu (mis. "Custom Itinerary") -> icon kategori.
  const bookingCardHTML = (t) => {
    const firstService = (t.lines && t.lines[0] && t.lines[0].service) || t.name;
    const card = ITEM_CARD[t.name] || ITEM_CARD[firstService] || {};
    const iconHTML = card.img
      ? '<span class="mtc-item__icon mtc-item__icon--photo" style="background-image:url(assets/images/' + card.img + ')"></span>'
      : '<span class="mtc-item__icon">' + cartIcon("tour") + "</span>";
    const dateStr = t.start_date
      ? (t.end_date && t.end_date !== t.start_date
          ? fmtGroupDate(t.start_date) + " – " + fmtGroupDate(t.end_date)
          : fmtGroupDate(t.start_date))
      : "Date TBD";
    const statusLabel = t.upcoming
      ? (t.status ? t.status.charAt(0).toUpperCase() + t.status.slice(1) : "Booked")
      : "Completed";
    // Past trip yang masih ada tour belum direview (t.review_items, dari
    // /api/bookings/mine) dapet SATU tombol "Leave a Review" - kalau booking-nya
    // custom itinerary (beberapa tour beda), modal yang munculin pilihan "review
    // yang mana" (data-items = daftar tour, dipisah "|").
    const reviewItems = t.review_items || [];
    const reviewHTML = reviewItems.length
      ? '<div class="mtc-review"><button type="button" class="modal__btn mtc-review__btn" data-review-btn data-ref="' +
        escHtml(t.ref) + '" data-items="' + escHtml(reviewItems.join("|")) + '">Leave a Review</button></div>'
      : "";
    return '<div class="mtc-item mtc-item--booked">' + iconHTML +
      '<div class="mtc-item__body">' +
        '<p class="mtc-item__title">' + escHtml(t.name) + "</p>" +
        '<p class="mtc-item__desc">' + escHtml(statusLabel + " · " + (t.guests || "-") + " guests") + "</p>" +
        '<p class="mtc-item__date">' + escHtml(dateStr) + (t.ref ? " · " + escHtml(t.ref) : "") + "</p>" +
      "</div>" +
      '<div class="mtc-item__price">' + cartPriceTag(t.price_usd, t.price_idr) + "</div>" +
    "</div>" + reviewHTML;
  };

  // Satu kartu item. opts.removable = tombol x (tab cart); opts.heart = toggle (tab paket).
  const rowCardHTML = (r, opts, pos) => {
    const o = opts || {};
    const iconHTML = r.img
      ? '<span class="mtc-item__icon mtc-item__icon--photo" style="background-image:url(assets/images/' + r.img + ')"></span>'
      : '<span class="mtc-item__icon">' + cartIcon(r.kind) + "</span>";
    let action = "";
    if (o.removable) {
      action = '<button type="button" class="mtc-item__del" data-del-type="' + r.ref.type +
        '" data-del-idx="' + r.ref.idx + '" aria-label="Remove">&times;</button>';
    } else if (o.heart) {
      action = '<button type="button" class="mtc-item__heart' + (r.inCart ? " is-on" : "") +
        '" data-heart-type="' + r.ref.type + '" data-heart-idx="' + r.ref.idx +
        '" aria-pressed="' + (r.inCart ? "true" : "false") +
        '" aria-label="' + (r.inCart ? "Remove from your trip" : "Add to your trip") + '">' +
        cartHeartIcon(r.inCart) + "</button>";
    }
    return '<div class="mtc-item">' + iconHTML +
      '<div class="mtc-item__body">' +
        '<p class="mtc-item__title">' + escHtml(r.title) + "</p>" +
        '<p class="mtc-item__desc">' + escHtml(r.desc) + "</p>" +
        (o.removable
          ? '<button type="button" class="mtc-item__datebtn' + (r.date ? "" : " is-empty") +
            '" data-date-pos="' + pos + '" aria-label="' + (r.date ? "Change date for " : "Set date for ") +
            escHtml(r.title) + '">' + escHtml(r.date ? fmtGroupDate(r.date) : "Set date") + "</button>"
          : '<p class="mtc-item__date">' + escHtml(fmtGroupDate(r.date)) + "</p>") +
      "</div>" +
      '<div class="mtc-item__price">' + cartPriceTag(r.usd, r.idr) + "</div>" +
      action + "</div>";
  };

  // Flat list: gak ada header grup tanggal, tanggal nempel di kartunya masing-masing.
  const listHTML = (rows, opts) => rows.map((r, i) => rowCardHTML(r, opts, i)).join("");

  // Upsell "You might also like" abis booking selesai - reuse pool RELATED_ITEMS +
  // style .related yang udah dipakai di halaman detail (initRelated), biar konsisten,
  // bukan bikin section/data baru. excludeNames = item yg baru aja dipesan.
  // Utamain zone yg BEDA dari yg baru dipesan (variasi), baru isi sisanya.
  function relatedUpsellHTML(excludeNames) {
    const norm = (n) => String(n).replace(/&amp;/g, "&");
    const excluded = new Set(excludeNames.map(norm));
    const booked = RELATED_ITEMS.filter((it) => excluded.has(norm(it.name)));
    const bookedZones = new Set(booked.map((it) => it.zone));
    const pool = RELATED_ITEMS.filter((it) => !excluded.has(norm(it.name)));
    const otherZone = pool.filter((it) => !bookedZones.has(it.zone));
    const rest = pool.filter((it) => bookedZones.has(it.zone));
    const picks = otherZone.concat(rest).slice(0, 4);
    if (!picks.length) return "";
    const cards = picks.map((it) => {
      // "$" + it.p = fallback statis doang (pola sama kayak initRelated) - data-price
      // bikin renderPrices() nimpa ini pas dipanggil abis section ini kesisip ke DOM.
      const priceHtml = it.p
        ? '<div class="experience__footer"><div class="experience__price"><span class="price-from">from</span> <span class="price" data-price="' + it.priceName + '">$' + it.p + "</span></div></div>"
        : "";
      return '<a class="experience__card" href="' + it.href + '">' +
        '<div class="experience__image"><img src="assets/images/' + it.img + '" alt="' + it.name + '" loading="lazy" width="600" height="600" /></div>' +
        '<div class="experience__body"><h3 class="experience__name">' + it.name + "</h3>" +
        '<div class="experience__meta"><span>' + it.meta + "</span></div>" + priceHtml + "</div></a>";
    }).join("");
    // "tourprog" = class scope kartu Atelier (.tourprog .experience__card: 4:3 photo,
    // body 2-baris title/rating + meta/price) - reuse scope yang udah dipakai
    // tour.html/activities.html/destinations.html, bukan nulis rule visual baru.
    // Grid DITARUH DI LUAR ".related": .related punya rule kartu lama sendiri
    // (foto square + title-overlay-di-foto, buat konteks initRelated di halaman
    // detail) yang bentrok kalau kartu yang sama juga kena ".tourprog". ".related"
    // di sini cuma buat judul + garis pembatas gold-nya, gak nyentuh grid.
    return '<section class="mtc-related tourprog">' +
      '<div class="related"><h2 class="related__title">You might also like</h2></div>' +
      '<div class="experience__grid experience__grid--home4">' + cards + "</div>" +
    "</section>";
  }

  // Rincian harga per item (1 baris = 1 item). Ketutup default; kebuka lewat toggle.
  // Harga per baris pakai cartPriceTag yang sama kayak kartu — jadi kalau ada
  // referral, coretan harga aslinya ikut kebawa & angkanya konsisten sama total.
  const receiptHTML = (rows, open) =>
    '<div class="mtc-receipt">' +
      '<button type="button" class="mtc-receipt__toggle" data-receipt aria-expanded="' + (open ? "true" : "false") + '">' +
        '<span>Price breakdown</span>' +
        '<svg class="mtc-receipt__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>' +
      "</button>" +
      (open
        ? '<ul class="mtc-receipt__list">' + rows.map((r) =>
            '<li class="mtc-receipt__line"><span class="mtc-receipt__name">' + escHtml(r.title) + "</span>" +
            '<span class="mtc-receipt__amt">' + cartPriceTag(r.usd, r.idr) + "</span></li>").join("") + "</ul>"
        : "") +
    "</div>";

  const totalHTML = (rows, label) =>
    '<div class="mtc-total"><span class="mtc-total__label">' + escHtml(label || "Total") + "</span>" +
    '<span class="mtc-total__val">' + cartPriceTagSum(rows) + "</span></div>";

  const panelHTML = () => {
    if (activeTab === "custom") {
      const rows = cartFlatten(itnLoad());
      if (!rows.length && justPaid) {
        // Abis submit booking: cart dikosongin (cartCheckout onSuccess). Upsell doang di
        // sini, BUKAN bagian transaksi (beda dari policy line yg nempel di tombol bayar).
        return '<div class="mtc-empty">' +
          '<p class="mtc-empty__lead">Booking submitted.</p>' +
          '<p class="mtc-empty__sub">We will email you shortly to confirm.</p>' +
        "</div>" + relatedUpsellHTML(bookedNames);
      }
      if (!rows.length) {
        return '<div class="mtc-empty">' +
          '<p class="mtc-empty__lead">Nothing added yet.</p>' +
          '<p class="mtc-empty__sub">Tap <strong>Book</strong> on any tour, experience or destination to start planning your trip.</p>' +
        "</div>";
      }
      const undated = rows.filter((r) => !r.date).length;
      // Policy line: satu baris, link ke halaman policy yg UDAH ADA di footer -
      // jangan duplikat isi policy-nya di sini.
      const policyLine = '<p class="mtc-note mtc-policy">By clicking <strong>Make Payment</strong>, you agree to our ' +
        '<a href="cancellation-policy.html">cancellation policy</a> and <a href="terms-conditions.html">terms</a>.</p>';
      // Job 5: kartu (main) + total/receipt/policy/bayar (side) dipisah jadi 2 blok.
      // Mobile: numpuk (main dulu, side belakangan - urutan DOM ini apa adanya).
      // Desktop: .mtc-layout jadi row, .mtc-layout__side sticky (lihat CSS).
      const sideHTML = receiptHTML(rows, receiptOpen) +
        totalHTML(rows) +
        policyLine +
        '<button type="button" class="modal__btn mtc-pay" data-pay' + (undated ? " disabled" : "") + ">Make Payment</button>" +
        (undated ? '<p class="mtc-note mtc-note--warn">' + undated + (undated > 1 ? " items still need" : " item still needs") + " a date.</p>" : "") +
        '<p class="mtc-note">' + "You'll add your name &amp; contact details at payment - that also creates your account so you can log in later with the same email." + "</p>";
      return '<div class="mtc-layout">' +
        '<div class="mtc-layout__main"><div class="mtc-list" data-removable>' + listHTML(rows, { removable: true }) + "</div></div>" +
        '<aside class="mtc-layout__side">' + sideHTML + "</aside>" +
      "</div>";
    }
    // Tab Booked / Past: trip dari /api/bookings/mine (read-only), kartu gaya .mtc-item.
    const isPast = activeTab === "past";
    const arr = isPast ? bookings.history : bookings.upcoming;
    if (!bookings.loaded) {
      return '<div class="mtc-empty"><p class="mtc-empty__sub">Loading your trips…</p></div>';
    }
    if (!currentAccount) {
      return '<div class="mtc-empty">' +
        '<p class="mtc-empty__lead">Sign in to see your trips.</p>' +
        '<p class="mtc-empty__sub">Open the account menu and sign in with your email - your booked and past trips show up here.</p>' +
      "</div>";
    }
    if (!arr.length) {
      return '<div class="mtc-empty">' +
        '<p class="mtc-empty__lead">' + (isPast ? "No past trips yet." : "No booked trips yet.") + "</p>" +
        '<p class="mtc-empty__sub">' + (isPast
          ? "Trips you&rsquo;ve already taken will appear here."
          : "Once you make a payment, your booked trip shows up here.") + "</p>" +
      "</div>";
    }
    // Past tab: tombol "Leave a Review" udah nempel per kartu (bookingCardHTML,
    // 1 per tour yang belum direview) - bukan 1 tombol umum buat seluruh tab,
    // karena Past Trip bisa punya beberapa trip/tour berbeda sekaligus.
    return '<div class="mtc-list">' + arr.map(bookingCardHTML).join("") + "</div>";
  };

  function render() {
    // 3 tab tetap: My Trip (cart blm bayar) / Booked Trip (udah bayar) / Past Trip (udah lewat).
    const tabs = [
      { id: "custom", label: "My Trip" },
      { id: "booked", label: "Booked Trip" },
      { id: "past", label: "Past Trip" },
    ];
    const ref = activeReferral();
    root.innerHTML =
      (ref ? '<div class="mtc-ref">Referral code <strong>' + escHtml(ref.code) + "</strong> applied.</div>" : "") +
      '<div class="mtc-tabs" role="tablist">' +
        tabs.map((t) => '<button type="button" class="mtc-tab' + (t.id === activeTab ? " is-on" : "") +
          '" data-tab="' + t.id + '" role="tab">' + escHtml(t.label) + "</button>").join("") +
      "</div>" +
      '<div class="mtc-panel">' + panelHTML() + "</div>";

    root.querySelectorAll(".mtc-tab").forEach((tab) => {
      tab.addEventListener("click", () => { activeTab = tab.dataset.tab; render(); });
    });
    root.querySelectorAll("[data-del-type]").forEach((b) => {
      b.addEventListener("click", () => { cartRemove(b.dataset.delType, parseInt(b.dataset.delIdx)); render(); });
    });
    root.querySelectorAll("[data-date-pos]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pos = parseInt(btn.dataset.datePos, 10);
        const cur = cartFlatten(itnLoad())[pos];
        if (!cur) return;
        bookDatePopup(cur.title, (date) => {
          const st = itnLoad();
          cartCascadeFrom(st, pos, date);
          const save = () => { itnSave(st); render(); };
          if (cartHasClash(st)) {
            cartConfirm("Two full-day tours?",
              "That puts two full-day tours on the same date. Keep both?", "Keep both", save);
            return;
          }
          save();
        }, cur.date);
      });
    });
    root.querySelectorAll("[data-review-btn]").forEach((b) => {
      b.addEventListener("click", () => {
        openReviewModal({ ref: b.dataset.ref, items: b.dataset.items.split("|"), name: currentAccount ? currentAccount.name : "" });
      });
    });
    const rec = root.querySelector("[data-receipt]");
    if (rec) rec.addEventListener("click", () => { receiptOpen = !receiptOpen; render(); });
    const pay = root.querySelector("[data-pay]");
    if (pay) pay.addEventListener("click", () => {
      bookedNames = (itnLoad().days || []).flatMap((d) => d.items || []);
      cartCheckout(() => { justPaid = true; render(); });
    });
    // Tab aktif ketarik ke view tanpa nge-scroll halaman (innerHTML reset scrollLeft).
    const tabsEl = root.querySelector(".mtc-tabs");
    const onTab = root.querySelector(".mtc-tab.is-on");
    if (tabsEl && onTab) tabsEl.scrollLeft = Math.max(0, onTab.offsetLeft - 12);
    // Upsell abis bayar pakai data-price span (pola initRelated) - isi harganya di sini
    // karena section ini disisip belakangan, bukan pas initPage() (renderPrices udah lewat).
    if (root.querySelector(".mtc-related")) renderPrices();
    // Grid rekomendasi baru = .experience__grid--home4 yg belum pernah kena wiring
    // slider (initTourSlider skip yg udah ke-wrap .slider-holder) - panggil ulang biar
    // gak jadi CSS grid rigid (aturan: semua card grid pakai satu mekanisme slider).
    initTourSlider();
  }

  window.__myTripsRefresh = render; // dipanggil pas referral di-apply/clear
  render();

  // Booked & Past ditarik async dari /api/bookings/mine, render ulang pas dateng.
  // (Sama endpoint yg dulu dipakai section "Booked & paid" - sekarang jadi 2 tab.)
  (async () => {
    await acctFetchSession();
    if (currentAccount) {
      try {
        const r = await fetch(`${API_BASE}/bookings/mine`, { headers: { Authorization: `Bearer ${getToken()}` } });
        if (r.ok) { const d = await r.json(); bookings.upcoming = d.upcoming || []; bookings.history = d.history || []; }
      } catch (e) {}
    }
    bookings.loaded = true;
    hasUpcoming = bookings.upcoming.length > 0; renderAccount();
    render();
  })();
}

// Halaman Settings: edit nama/email/phone + prefs -> PATCH /api/account.
async function initSettings() {
  const root = document.querySelector("[data-settings]");
  if (!root) return;
  await acctFetchSession();
  if (!currentAccount) {
    root.innerHTML = accountGate("Create your account", "You don't have an account yet. Create one to manage your details and trip preferences.");
    wireGate(root);
    return;
  }
  const a = currentAccount;
  let gopts = "";
  for (let n = 1; n <= 10; n++) gopts += '<option value="' + n + '"' + (String(a.guest_count_pref) === String(n) ? " selected" : "") + ">" + n + "</option>";
  root.innerHTML =
    '<form class="acctform" id="settings-form">' +
      '<label class="acctform__label" for="set-name">Name</label><input class="acctform__inp" id="set-name" type="text" value="' + escHtml(a.name) + '" />' +
      '<label class="acctform__label" for="set-email">Email</label><input class="acctform__inp" id="set-email" type="email" value="' + escHtml(a.email) + '" />' +
      '<label class="acctform__label" for="set-phone">Phone</label><input class="acctform__inp" id="set-phone" type="tel" value="' + escHtml(a.phone) + '" />' +
      '<label class="acctform__label" for="set-guests">Saved guest count</label><select class="acctform__inp" id="set-guests">' + gopts + "</select>" +
      '<label class="acctform__label" for="set-stay">Saved stay area</label><select class="acctform__inp" id="set-stay">' + pickupOptionsHTML(a.stay_area_pref || "ubud") + "</select>" +
      '<p class="welcome__msg" data-msg hidden></p>' +
      '<button type="submit" class="modal__btn" id="set-save">Save Changes</button>' +
    "</form>";
  const form = root.querySelector("#settings-form");
  const msg = root.querySelector("[data-msg]");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      name: root.querySelector("#set-name").value.trim(),
      email: root.querySelector("#set-email").value.trim(),
      phone: root.querySelector("#set-phone").value.trim(),
      guest_count_pref: root.querySelector("#set-guests").value,
      stay_area_pref: root.querySelector("#set-stay").value === "ubud" ? "" : root.querySelector("#set-stay").value,
    };
    const btn = root.querySelector("#set-save");
    btn.disabled = true; btn.textContent = "Saving…";
    try {
      const r = await fetch(`${API_BASE}/account`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (r.ok && d.account) {
        currentAccount = d.account; renderAccount();
        msg.textContent = "Saved!"; msg.hidden = false; msg.className = "welcome__msg success";
      } else { throw new Error(); }
    } catch (err) {
      msg.textContent = "Couldn't save right now. Please try again later."; msg.hidden = false; msg.className = "welcome__msg error";
    }
    btn.disabled = false; btn.textContent = "Save Changes";
  });
}

// Trust stat homepage: jumlah akun yang pernah dibuat. Sembunyi kalau 0 / API down
// (no fake). Fail-soft.
async function initTrustStat() {
  const el = document.querySelector("[data-trust-stat]");
  if (!el) return;
  try {
    const r = await fetch(`${API_BASE}/accounts/count`);
    if (!r.ok) return;
    const d = await r.json();
    const n = Number(d.count) || 0;
    if (n > 0) {
      const num = el.querySelector("[data-accounts-count]");
      if (num) num.textContent = String(n);
      el.hidden = false;
    }
  } catch (e) {}
}

// Badan card highlight bisa diklik -> ke halaman programnya.
// Tombol/link di dalamnya (Book, Add to itinerary) tetap jalan sendiri.
function initHighlightLink() {
  document.querySelectorAll(".highlight__container").forEach((box) => {
    const link = box.querySelector(".highlight__btn[href]");
    const href = link && link.getAttribute("href");
    if (!href || href.startsWith("#")) return; // anchor doang, bukan halaman
    box.classList.add("is-clickable");
    box.addEventListener("click", (e) => {
      if (e.target.closest("a, button")) return;
      window.location.href = href;
    });
  });
}

// Toggle Standard / Exclusive. Di-INJECT otomatis (bukan ditulis di tiap HTML):
// - di tiap card tour (setelah deskripsi, di atas harga)
// - di halaman detail (di atas "Tour Details")
// Standard = harga driver-only. Exclusive = harga standard + tiket per orang.
function initTourType() {
  const holders = [];

  function build(name, priceEl, mount, place, variant) {
    if (!name || !priceEl || !tourExclusive[name]) return;
    const wrap = document.createElement("div");
    wrap.className = "tour-type tour-type--" + variant;
    wrap.innerHTML =
      '<div class="tour-type__toggle" role="tablist" aria-label="Tour type">' +
        '<button type="button" class="tour-type__btn is-active" role="tab" data-mode="standard">Standard</button>' +
        '<button type="button" class="tour-type__btn" role="tab" data-mode="exclusive">Exclusive</button>' +
      '</div>' +
      '<small class="tour-type__note"></small>';
    if (place === "after") mount.insertAdjacentElement("afterend", wrap);
    else mount.insertBefore(wrap, mount.firstElementChild);
    // Di card, seluruh area toggle nggak boleh nge-trigger navigasi card (cuma foto/badan)
    if (variant === "card") wrap.addEventListener("click", (e) => e.stopPropagation());

    // Di halaman detail: kontainer "Tour Details" yang list Included/Excluded-nya
    // ikut berubah (baris tiket pindah Excluded <-> Included) lewat class .is-exclusive.
    const infoBox = variant === "detail" ? wrap.closest(".info__container") : null;

    const note = wrap.querySelector(".tour-type__note");
    const btns = wrap.querySelectorAll(".tour-type__btn");

    function updateNote(mode) {
      note.textContent = mode === "exclusive"
        ? "Includes entrance tickets · price for " + (currentGuests || DISPLAY_GUESTS) + " pax"
        : "Driver only · entrance tickets not included";
    }
    function apply(mode, render) {
      btns.forEach((b) => b.classList.toggle("is-active", b.dataset.mode === mode));
      priceEl.dataset.mode = mode;
      if (infoBox) infoBox.classList.toggle("is-exclusive", mode === "exclusive");
      updateNote(mode);
      if (render) renderPrices();
    }
    btns.forEach((b) => b.addEventListener("click", (e) => {
      // Jangan sampai klik toggle ikut nge-trigger navigasi card (badan card
      // clickable di initItineraryButtons). Cuma foto/badan card yang navigasi.
      e.stopPropagation();
      apply(b.dataset.mode, true);
      // Di halaman detail: sinkron pilihan ke booking form (biar Book Now match)
      if (variant === "detail" && window.__setBookingMode) window.__setBookingMode(b.dataset.mode, true);
    }));
    apply("standard", false); // default: Standard (harga diisi renderPrices di initCurrency)
    holders.push(() => updateNote(priceEl.dataset.mode));
  }

  // Toggle generik buat halaman listing (tour.html): nggak nyentuh harga sama sekali,
  // cuma nge-swap baris tiket Included/Excluded biar user paham beda Standard vs Exclusive.
  function buildGeneric(box, mount) {
    const wrap = document.createElement("div");
    wrap.className = "tour-type tour-type--detail";
    wrap.innerHTML =
      '<div class="tour-type__toggle" role="tablist" aria-label="Tour type">' +
        '<button type="button" class="tour-type__btn is-active" role="tab" data-mode="standard">Standard</button>' +
        '<button type="button" class="tour-type__btn" role="tab" data-mode="exclusive">Exclusive</button>' +
      "</div>" +
      '<small class="tour-type__note"></small>';
    mount.insertAdjacentElement("afterend", wrap);

    const note = wrap.querySelector(".tour-type__note");
    const btns = wrap.querySelectorAll(".tour-type__btn");
    function apply(mode) {
      btns.forEach((b) => b.classList.toggle("is-active", b.dataset.mode === mode));
      box.classList.toggle("is-exclusive", mode === "exclusive");
      note.textContent = mode === "exclusive"
        ? "Entrance tickets included - see each tour for the price"
        : "Driver only - entrance tickets paid at each site";
    }
    btns.forEach((b) => b.addEventListener("click", () => apply(b.dataset.mode)));
    apply("standard");
  }

  // Blok gold 2-segmen "Experience / Performance" buat card experience & performance.
  // Bentuknya sama kayak toggle Standard/Exclusive tapi STATIS (disabled, nggak bisa diklik):
  // Performance aktif utk kecak/barong, Experience utk lainnya.
  function buildTag(name, mount) {
    const info = itemInfo(name);
    if (!info || (info.cat !== "experience" && info.cat !== "performance")) return;
    const wrap = document.createElement("div");
    wrap.className = "tour-type tour-type--card";
    // Experience & performance: toggle Standard/Exclusive tapi STATIS (disabled) -
    // dikunci di Exclusive (semua udah all-inclusive), nggak bisa diubah.
    wrap.innerHTML =
      '<div class="tour-type__toggle tour-type__toggle--static" role="group" aria-label="Type">' +
        '<button type="button" class="tour-type__btn" disabled>Standard</button>' +
        '<button type="button" class="tour-type__btn is-active" disabled>Exclusive</button>' +
      "</div>" +
      '<small class="tour-type__note">Exclusive only &middot; all-inclusive</small>';
    mount.insertAdjacentElement("afterend", wrap);
    wrap.addEventListener("click", (e) => e.stopPropagation()); // jgn ikut navigasi card
  }

  // Unit harga di card: tour/combo = "/car", experience/performance = "/person".
  // Ditaruh sebagai sibling <span> di sebelah harga -> nggak ketimpa renderPrices.
  function addPriceUnit(priceEl, cat) {
    const unit = cat === "tour" || cat === "combo" || cat === "place" ? "per car"
      : cat === "experience" || cat === "performance" ? "per person" : "";
    if (!unit || priceEl.parentElement.querySelector(".price-unit")) return;
    const u = document.createElement("span");
    u.className = "price-unit";
    u.textContent = unit;
    priceEl.insertAdjacentElement("afterend", u);
  }

  // Card di homepage & tour.html + card highlight (setelah deskripsi):
  // tour -> toggle Standard/Exclusive; experience/performance -> blok gold statis. Semua -> unit harga.
  document.querySelectorAll(".experience__card:not(.itn-prog), .highlight__container").forEach((card) => {
    const priceEl = card.querySelector("[data-price]");
    const desc = card.querySelector(".experience__desc, .highlight__desc");
    if (!priceEl || !desc) return;
    const name = priceEl.dataset.price;
    const info = itemInfo(name);
    if (info) addPriceUnit(priceEl, info.cat);
    if (tourExclusive[name]) build(name, priceEl, desc, "after", "card");
    else buildTag(name, desc);
  });

  // Halaman detail: box "Price" di Tour Details / Good to Know -> tambah unit (per car/person),
  // lalu (kalau tour/combo) inject toggle Standard/Exclusive tepat di bawah judul.
  document.querySelectorAll(".info__container").forEach((box) => {
    const priceEl = box.querySelector("[data-price]");
    const title = box.querySelector(".section__title");
    // Halaman listing (tour.html): nggak ada harga tunggal -> toggle generik yang
    // cuma nge-swap baris tiket Included/Excluded lewat class .is-exclusive.
    if (!priceEl) {
      if (box.dataset.tourType === "generic" && title) buildGeneric(box, title);
      return;
    }
    const info = itemInfo(priceEl.dataset.price);
    if (info) addPriceUnit(priceEl, info.cat);
    if (title) build(priceEl.dataset.price, priceEl, title, "after", "detail");
  });

  // Dipanggil pas jumlah orang ganti -> perbarui catatan "for N pax"
  // (harga-nya sendiri sudah di-refresh lewat renderPrices di setGuests).
  window.__ttypeRefresh = function () { holders.forEach((fn) => fn()); };
}

// UX modal global: tutup pakai Escape + lock scroll background pas ada modal kebuka.
// Berlaku ke SEMUA modal (.modal.active), termasuk yang di-inject via JS.
function initModalUX() {
  // Escape -> tutup semua modal yang lagi kebuka.
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".modal.active").forEach((m) => m.classList.remove("active"));
  });

  // Scroll-lock: ada modal kebuka -> kunci scroll body; nggak ada -> lepas lagi.
  // Cukup overflow:hidden. JANGAN reposisi body (position:fixed + top:-scrollY) ->
  // itu yang bikin layar "loncat/ke-scroll" pas modal/dropdown dibuka (apalagi
  // kalau udah scroll ke bawah dulu). Modal-nya udah position:fixed jadi tetep nempel.
  const syncScrollLock = () => {
    const anyOpen = !!document.querySelector(".modal.active");
    document.body.style.overflow = anyOpen ? "hidden" : "";
  };
  new MutationObserver(syncScrollLock).observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["class"]
  });
}

// Tiap harga transfer (data-price yg ada di prices.transfer) dikasih unit "per car"
// di belakangnya - biar jelas harga per mobil, konsisten di semua tampilan transfer.
function initTransferUnits() {
  document.querySelectorAll("[data-price]").forEach((el) => {
    if (!prices.transfer[el.dataset.price]) return;
    if (el.parentElement.querySelector(".price-unit")) return;
    const u = document.createElement("span");
    u.className = "price-unit";
    u.textContent = "per car";
    el.insertAdjacentElement("afterend", u);
  });
}

// Pindahin judul ke DALAM foto (overlay bawah + gradient). Berlaku card tour &
// experience (guide di-skip), card villa, dan highlight tour/experience/transfer.
// CSS .photo-titled yg nata gradient + teks putih.
function initCardTitleOverlay() {
  const move = (cardSel, imgSel, titleSel) => {
    document.querySelectorAll(cardSel).forEach((card) => {
      const img = card.querySelector(imgSel);
      const title = card.querySelector(titleSel);
      if (!img || !title || img.contains(title)) return;
      img.appendChild(title);
      img.classList.add("photo-titled");
    });
  };
  // Semua .experience__card = SATU style (foto atas + judul di body, card style A).
  // Overlay judul-di-foto udah dibuang (Wayan: card cuma 1 komponen, DRY). Villa
  // card TETAP overlay (komponen beda, bukan .experience__card).
  move(".villa__card", ".villa__image", ".villa__name");
}

/* ==================== 5. APP ENTRY ==================== */

/* Homepage hero = "search bar" buat mulai explore Bali.
   - toggle Standard/Exclusive (Exclusive naikin range ~EXCLUSIVE_FEE)
   - dropdown kategori (icon + nama kiri, price range rata kanan, currency-aware)
   - date opsional, tombol Explore -> ke halaman kategori.
   Booking beneran tetep di halaman program (nggak diubah). */
// Kunci scroll body pas bottom-sheet kebuka (HP) + balikin posisi pas nutup.
// Pakai position:fixed biar reliable di iOS (overflow:hidden aja suka bocor).
function hsScrollLock(on) {
  // Cukup overflow:hidden (di CSS .hs-locked). JANGAN reposisi body (position:fixed +
  // top:-scrollY) -> itu yang bikin layar "loncat/gerak" pas dropdown dibuka di HP.
  // Bottom-sheet-nya udah position:fixed jadi tetap nempel walau background kebuka.
  document.body.classList.toggle("hs-locked", !!on);
}

// Mobile hero: form "Plan your trip" disembunyiin, dibuka lewat tombol -> bottom-sheet
// slide-up. Desktop TIDAK kena (tombol di-hide CSS, form tetep inline di kanan). Field
// di dalam (guests/pickup) tetep buka sub-sheet-nya sendiri di ATAS sheet ini (z-index).
function initHeroPlanSheet() {
  const btn = document.querySelector("[data-plan-open]");
  const sheet = document.querySelector(".hero__search");
  if (!btn || !sheet) return;
  // Scrim ditaruh DI DALAM .hero__inner (yang punya z-index:1 = stacking context) bareng
  // sheet-nya, biar sheet (z45) nangkring di atas scrim (z44). Kalau di body, sheet ke-trap
  // di context .hero__inner & malah ketutup scrim. Sub-panel field (guests/pickup) tetep
  // reparent ke body (z55/60) -> di atas SEMUA ini, jadi tetep bisa dibuka dari dalam sheet.
  const inner = sheet.closest(".hero__inner") || document.body;
  let ov = inner.querySelector(":scope > .hero-sheet-ov");
  if (!ov) { ov = document.createElement("div"); ov.className = "hero-sheet-ov"; inner.appendChild(ov); }
  const isMobile = () => window.matchMedia("(max-width: 992px)").matches;
  const closeSheet = () => {
    sheet.classList.remove("is-open");
    ov.classList.remove("is-open");
    hsScrollLock(false);
  };
  const openSheet = () => {
    if (!isMobile()) return;
    sheet.scrollTop = 0;
    sheet.classList.add("is-open");
    ov.classList.add("is-open");
    hsScrollLock(true);
  };
  // Tombol close (× pojok) di-inject sekali; grab handle-nya dari CSS ::before.
  if (!sheet.querySelector(".hero__search-close")) {
    const close = document.createElement("button");
    close.type = "button";
    close.className = "hero__search-close";
    close.setAttribute("aria-label", "Close");
    close.innerHTML = "&times;";
    sheet.insertBefore(close, sheet.firstChild);
    close.addEventListener("click", closeSheet);
  }
  btn.addEventListener("click", openSheet);
  ov.addEventListener("click", closeSheet);
  // Swipe ke bawah buat nutup (cuma kalau konten sheet udah di paling atas).
  let startY = null;
  sheet.addEventListener("touchstart", (e) => { startY = sheet.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
  sheet.addEventListener("touchmove", (e) => {
    if (startY === null) return;
    if (e.touches[0].clientY - startY > 70) { closeSheet(); startY = null; }
  }, { passive: true });
  sheet.addEventListener("touchend", () => { startY = null; });
  // Balik ke lebar desktop -> reset (biar form inline gak ke-hide/ke-transform sisa sheet).
  window.addEventListener("resize", () => { if (!isMobile()) closeSheet(); });
}

function initHeroSearch() {
  const root = document.getElementById("hero-search");
  if (!root) return;
  const ddBtn = root.querySelector("[data-explore-btn]");
  const ddLabel = root.querySelector("[data-explore-label]");
  const ddPanel = root.querySelector("[data-explore-panel]");
  const dateBtn = root.querySelector("[data-date-btn]");
  const dateLabel = root.querySelector("[data-date-label]");
  const datePanel = root.querySelector("[data-date-panel]");
  // Catatan: search form SENGAJA gak pakai popup date (Wayan) - kalender search (kalau ada)
  // tetep dropdown nempel field di desktop. Popup date cuma buat booking + field lain.
  const calBody = root.querySelector("[data-cal-body]");
  const calHint = root.querySelector("[data-cal-hint]");
  const calApply = root.querySelector("[data-cal-apply]");
  const goBtn = root.querySelector("[data-explore-go]");
  let selectedHref = null;

  // Kumpulan harga {usd,idr} per kategori (dari data.js). null = tanpa harga (itinerary).
  function catPrices(cat) {
    switch (cat) {
      case "tour": return [...Object.values(prices.tour), ...Object.values(prices.combo)];
      case "transfer": return Object.values(prices.transfer);
      case "experience": return Object.values(prices.experience);
      case "charter": return [CHARTER.half, CHARTER.full];
      case "destination": return Object.values(prices.place);
      default: return null; // itinerary
    }
  }
  function rangeText(cat) {
    const arr = catPrices(cat);
    if (!arr || !arr.length) return "Build your own";
    const usd = arr.map((p) => p.usd);
    const idr = arr.map((p) => p.idr);
    const loUsd = Math.min(...usd), hiUsd = Math.max(...usd);
    const lo = fmtMoney(loUsd, Math.min(...idr));
    if (loUsd === hiUsd) return "from " + lo;
    const hiNum = toCurrency(hiUsd, Math.max(...idr));
    return lo + "–" + hiNum.toLocaleString(currentCurrency === "IDR" ? "id-ID" : "en-US");
  }
  function updateRanges() {
    root.querySelectorAll("[data-explore-pr]").forEach((el) => {
      el.textContent = rangeText(el.dataset.explorePr);
    });
  }
  updateRanges();
  window.__exploreRefresh = updateRanges;

  // ---- Panel / bottom-sheet (dropdown & kalender pakai mekanisme sama) ----
  let overlay = document.querySelector(".hs-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "hs-overlay";
    document.body.appendChild(overlay);
  }
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
  // Sheet HP: panel di-portal ke <body> biar lolos dari stacking-context hero
  // (kalau nggak, overlay body-level nutupin panel). Desktop: balik ke field-nya.
  const anchors = new Map();
  function restore(panel) {
    const a = anchors.get(panel);
    if (a && panel.parentElement === document.body) a.parent.insertBefore(panel, a.next);
  }
  let openPanelEl = null, openControlEl = null;
  function closePanels() {
    const had = !!openPanelEl; // cuma lepas lock kalau MEMANG ada panel search kebuka
    if (openPanelEl) {
      openPanelEl.classList.remove("open");
      restore(openPanelEl);
      openPanelEl = null;
    }
    if (openControlEl) { openControlEl.classList.remove("is-open"); openControlEl.setAttribute("aria-expanded", "false"); openControlEl = null; }
    overlay.classList.remove("open");
    if (had) hsScrollLock(false);
  }
  function openPanel(panel, control) {
    if (openPanelEl === panel) { closePanels(); return; }
    closePanels();
    // Search form: HP = bottom-sheet, desktop = dropdown nempel (SENGAJA gak pakai popup).
    if (isMobile()) {
      if (!anchors.has(panel)) anchors.set(panel, { parent: panel.parentElement, next: panel.nextSibling });
      document.body.appendChild(panel);
      overlay.classList.add("open");
      hsScrollLock(true);
    } else {
      restore(panel);
    }
    panel.classList.add("open");
    control.classList.add("is-open");
    control.setAttribute("aria-expanded", "true");
    openPanelEl = panel;
    openControlEl = control;
  }
  window.addEventListener("resize", closePanels);

  // ---- Guests & Pickup: custom dropdown (styling sama kaya Explore) di atas <select>
  //      asli. Select tetap sumber state (di-wire initGuestPicker/initAccountMenu);
  //      di sini cuma layer visual + nyetir value select-nya. ----
  function enhanceSelect(sel, title) {
    if (!sel || sel.dataset.enhanced) return;
    sel.dataset.enhanced = "1";
    sel.style.display = "none";
    const field = sel.closest(".hsearch__field");
    if (field) field.classList.add("hsearch__dd");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hs-control";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML =
      '<span class="hs-control__val"></span>' +
      '<svg class="hs-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg>';
    const val = btn.querySelector(".hs-control__val");
    const panel = document.createElement("div");
    panel.className = "hs-panel hs-panel--menu";
    panel.innerHTML =
      '<div class="hs-panel__head"><h3>' + title + "</h3>" +
      '<button type="button" class="hs-panel__close" aria-label="Close">&times;</button></div>' +
      '<div class="hs-panel__body"></div>';
    const body = panel.querySelector(".hs-panel__body");
    sel.insertAdjacentElement("beforebegin", btn);
    btn.insertAdjacentElement("afterend", panel);

    const syncLabel = () => {
      const o = sel.options[sel.selectedIndex];
      val.textContent = o ? o.textContent.trim() : "";
    };
    const rebuild = () => {
      body.innerHTML = "";
      [...sel.options].forEach((o) => {
        if (o.value === "reset") return;
        const b = document.createElement("button");
        b.type = "button";
        b.className = "hs-opt hs-opt--menu";
        b.textContent = o.textContent.trim();
        if (o.selected) b.classList.add("is-sel");
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          if (sel.value !== o.value) {
            sel.value = o.value;
            sel.dispatchEvent(new Event("change"));
          }
          syncLabel();
          closePanels();
        });
        body.appendChild(b);
      });
    };
    btn.addEventListener("click", (e) => { e.stopPropagation(); rebuild(); openPanel(panel, btn); });
    panel.querySelector(".hs-panel__close").addEventListener("click", (e) => { e.stopPropagation(); closePanels(); });
    sel.addEventListener("change", syncLabel);
    syncLabel();
  }
  enhanceSelect(root.querySelector("[data-guest-select]"), "Guests");
  enhanceSelect(root.querySelector("[data-stay-select]"), "Pickup area");

  // ---- Dropdown kategori ----
  ddBtn.addEventListener("click", (e) => { e.stopPropagation(); openPanel(ddPanel, ddBtn); });
  root.querySelectorAll("[data-explore-opt]").forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedHref = opt.dataset.href;
      ddLabel.textContent = opt.dataset.name;
      ddLabel.classList.remove("placeholder");
      root.querySelectorAll("[data-explore-opt]").forEach((o) => o.classList.remove("is-sel"));
      opt.classList.add("is-sel");
      closePanels();
    });
  });
  // Navigasi keyboard: Enter/↓ buka, ↑↓ sorot, Enter pilih, Esc tutup
  const ddOpts = Array.from(root.querySelectorAll("[data-explore-opt]"));
  let ddKbd = -1;
  const ddPaint = () => { ddOpts.forEach((o, i) => o.classList.toggle("is-kbd", i === ddKbd)); if (ddOpts[ddKbd]) ddOpts[ddKbd].scrollIntoView({ block: "nearest" }); };
  ddBtn.addEventListener("keydown", (e) => {
    const open = ddPanel.classList.contains("open");
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault(); openPanel(ddPanel, ddBtn);
      ddKbd = Math.max(0, ddOpts.findIndex((o) => o.classList.contains("is-sel"))); ddPaint(); return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); ddKbd = Math.min(ddOpts.length - 1, ddKbd + 1); ddPaint(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); ddKbd = Math.max(0, ddKbd - 1); ddPaint(); }
    else if (e.key === "Enter") { e.preventDefault(); if (ddOpts[ddKbd]) { ddOpts[ddKbd].click(); ddBtn.focus(); } }
    else if (e.key === "Escape") { e.preventDefault(); closePanels(); ddBtn.focus(); }
  });

  // ---- Kalender range tanggal (klik 1 = mulai, klik 2 = selesai) ----
  const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const pad = (n) => String(n).padStart(2, "0");
  const toStr = (o) => o.y + "-" + pad(o.m + 1) + "-" + pad(o.d);
  const parseD = (s) => { const p = (s || "").split("-"); return p.length === 3 ? { y: +p[0], m: +p[1] - 1, d: +p[2] } : null; };
  const keyOf = (o) => o.y * 10000 + o.m * 100 + o.d;
  const now = new Date();
  const TODAY = { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
  // Field tanggal search form udah diganti referral (booking per-item). Wiring kalender
  // ini cuma jalan kalau elemennya masih ada.
  if (dateBtn && datePanel && calBody && calApply) {
  let rangeStart = parseD(currentDateFrom);
  let rangeEnd = parseD(currentDateTo);
  if (rangeStart && rangeEnd && keyOf(rangeEnd) === keyOf(rangeStart)) rangeEnd = null;

  function monthEl(y, m) {
    const el = document.createElement("div");
    el.className = "hs-cal__m";
    const cap = document.createElement("div");
    cap.className = "hs-cal__cap";
    cap.textContent = MON[m] + " " + y;
    el.appendChild(cap);
    const g = document.createElement("div");
    g.className = "hs-cal__grid";
    DOW.forEach((d) => { const h = document.createElement("div"); h.className = "hs-cal__dow"; h.textContent = d; g.appendChild(h); });
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    for (let i = 0; i < first; i++) { const o = document.createElement("div"); o.className = "hs-cal__d is-off"; g.appendChild(o); }
    for (let d = 1; d <= days; d++) {
      const cell = { y: y, m: m, d: d };
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hs-cal__d";
      b.textContent = d;
      const past = keyOf(cell) < keyOf(TODAY);
      if (past) b.classList.add("is-off");
      if (cell.y === TODAY.y && cell.m === TODAY.m && cell.d === TODAY.d) b.classList.add("today");
      if (rangeStart && rangeEnd) {
        if (keyOf(cell) === keyOf(rangeStart) && keyOf(cell) === keyOf(rangeEnd)) b.classList.add("pt-solo");
        else if (keyOf(cell) === keyOf(rangeStart)) b.classList.add("pt-start");
        else if (keyOf(cell) === keyOf(rangeEnd)) b.classList.add("pt-end");
        else if (keyOf(cell) > keyOf(rangeStart) && keyOf(cell) < keyOf(rangeEnd)) b.classList.add("in-range");
      } else if (rangeStart && keyOf(cell) === keyOf(rangeStart)) b.classList.add("pt-solo");
      if (!past) b.addEventListener("click", (e) => { e.stopPropagation(); pickDate(cell); });
      g.appendChild(b);
    }
    el.appendChild(g);
    return el;
  }
  function renderCal() {
    calBody.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "hs-cal__months";
    for (let k = 0; k < 13; k++) { let mm = TODAY.m + k, yy = TODAY.y; while (mm > 11) { mm -= 12; yy++; } wrap.appendChild(monthEl(yy, mm)); }
    calBody.appendChild(wrap);
    updateHint();
  }
  function updateHint() {
    if (!rangeStart) { calHint.textContent = "Add your start date"; return; }
    if (!rangeEnd) { calHint.textContent = "Now add your end date"; return; }
    calHint.textContent = fmtDateRange(toStr(rangeStart), toStr(rangeEnd));
  }
  function pickDate(cell) {
    if (!rangeStart || (rangeStart && rangeEnd)) { rangeStart = cell; rangeEnd = null; }
    else if (keyOf(cell) < keyOf(rangeStart)) { rangeStart = cell; }
    else { rangeEnd = cell; }
    renderCal();
  }
  function refreshDateLabel() {
    const dr = fmtDateRange(currentDateFrom, currentDateTo);
    if (dr) { dateLabel.textContent = dr; dateLabel.classList.remove("placeholder"); }
    else { dateLabel.textContent = "Add dates"; dateLabel.classList.add("placeholder"); }
  }
  refreshDateLabel();
  dateBtn.addEventListener("click", (e) => { e.stopPropagation(); renderCal(); openPanel(datePanel, dateBtn); });
  calApply.addEventListener("click", (e) => {
    e.stopPropagation();
    setDateRange(rangeStart ? toStr(rangeStart) : "", rangeEnd ? toStr(rangeEnd) : "");
    refreshDateLabel();
    closePanels();
  });
  } // end if(dateBtn) date-panel wiring

  // ---- Tutup: tombol close (sheet), overlay, klik luar, Escape ----
  root.querySelectorAll("[data-hs-close]").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); closePanels(); }));
  overlay.addEventListener("click", closePanels);
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".hs-panel") && !e.target.closest(".hs-control")) closePanels();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePanels(); });

  // ---- Explore -> ke halaman kategori (kalau belum pilih, buka dropdown) ----
  goBtn.addEventListener("click", () => {
    if (selectedHref) window.location.href = selectedHref;
    else openPanel(ddPanel, ddBtn);
  });
}

/* Bar "Guests · Pickup · Date" di halaman kategori/detail (bukan homepage).
   Keisi = tampil nilai, kosong = ajakan isi. Diklik -> popup Your trip details.
   Fixed di bawah navbar (nggak ganggu flow -> no CLS). */
function initTripBar() {
  // Halaman booking (punya form booking) -> bar Guests/Pickup (klik = editor trip).
  // Halaman NON-booking (home, guide, listing, dll) -> bar promo/event dari PROMO
  //   (data.js), cuma muncul kalau PROMO.active && PROMO.text keisi.
  const hasBooking = document.getElementById("booking-placeholder") || document.getElementById("book-modal-placeholder");
  const promoOn = typeof PROMO !== "undefined" && PROMO && PROMO.active && PROMO.text;
  if (!hasBooking && !promoOn) return;
  const promoMode = !hasBooking;
  const asLink = promoMode && !!PROMO.href;

  const bar = document.createElement(promoMode ? (asLink ? "a" : "div") : "button");
  bar.className = "tripbar" + (promoMode ? " tripbar--promo" : "");
  bar.id = "tripbar";
  if (!promoMode) { bar.type = "button"; bar.setAttribute("aria-label", "Set trip details"); }
  if (asLink) bar.href = PROMO.href;

  // Tripbar nyatu di dalam navbar (host di partial navbar). Nempel di bawah bar navbar
  // secara natural -> nggak perlu hitung top manual lagi. Fallback ke body kalau host
  // belum ada (jaga-jaga).
  const host = document.getElementById("tripbar-host");
  if (host) {
    host.appendChild(bar);
  } else {
    const navPh = document.getElementById("navbar-placeholder");
    document.body.insertBefore(bar, navPh ? navPh.nextSibling : document.body.firstChild);
  }

  if (promoMode) {
    const cta = PROMO.cta ? '<span class="tripbar__edit">' + PROMO.cta + "</span>" : "";
    bar.innerHTML =
      '<svg class="tripbar__ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>' +
      "<span>" + PROMO.text + "</span>" + cta;
    return;
  }

  bar.innerHTML =
    '<svg class="tripbar__ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>' +
    '<span data-tripbar-text></span>' +
    '<span class="tripbar__edit" data-tripbar-cta></span>';

  function render() {
    const txt = bar.querySelector("[data-tripbar-text]");
    const cta = bar.querySelector("[data-tripbar-cta]");
    if (currentGuests > 0 || currentStay || currentDateFrom) {
      const g = currentGuests || DISPLAY_GUESTS;
      const parts = [
        "<b>" + g + " guest" + (g > 1 ? "s" : "") + "</b>",
        "<b>" + (currentStay ? pickupLabelOf(currentStay) : "Ubud &amp; nearby") + "</b>",
      ];
      const dr = fmtDateRange(currentDateFrom, currentDateTo);
      if (dr) parts.push("<b>" + dr + "</b>");
      txt.innerHTML = parts.join('<span class="tripbar__sep">·</span>');
      cta.textContent = "Edit";
    } else {
      txt.innerHTML = '<span class="tripbar__muted">Add guests</span><span class="tripbar__sep">·</span><span class="tripbar__muted">Add pickup location</span>';
      cta.textContent = "Set now";
    }
  }
  render();
  window.__tripbarRefresh = render;
  bar.addEventListener("click", showTripDetails);
}

// Info popover "Standard vs Exclusive" (icon "i" di booking & search form).
// Klik icon = buka/tutup; klik di luar / Escape = tutup. Cuma 1 popover kebuka.
function initInfoPopovers() {
  const btns = document.querySelectorAll("[data-binfo]");
  if (!btns.length) return;
  function closeAll(except) {
    document.querySelectorAll(".binfo__pop.open").forEach((pop) => {
      if (pop === except) return;
      pop.classList.remove("open");
      const b = pop.parentElement.querySelector("[data-binfo]");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }
  btns.forEach((btn) => {
    const pop = btn.parentElement.querySelector(".binfo__pop");
    if (!pop) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const willOpen = !pop.classList.contains("open");
      closeAll(pop);
      pop.classList.toggle("open", willOpen);
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".binfo")) closeAll(null);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll(null);
  });
}

// Booking form: dropdown & date "full custom" (panel desktop / bottom-sheet HP),
// SAMA kaya search form. Teknik "enhance native": UI custom cuma nyetir <select> /
// <input date> asli (sumber kebenaran), jadi logika harga initBooking utuh.
// ===== Enhancer field reusable (dropdown + date) =====
// Nyetir <select>/<input date> asli yg disembunyiin, UI custom (.hs-control + .hs-panel):
// desktop = dropdown ngambang di bawah kontrol, HP = bottom-sheet. Dipakai booking form
// + semua select/date lain (navbar/charter/transfer/itinerary) biar SATU gaya konsisten.
// Refreshers global -> label ikut ke-update pas value diubah programmatik (setGuests dll).
const __cselRefreshers = [];
function cselRefreshAll() { __cselRefreshers.forEach((fn) => { try { fn(); } catch (e) {} }); }
// Grup = ancestor yang jadi anchor panel (position:relative). Booking punya .booking__group;
// field lain di-bungkus otomatis di .csel-group.
function cselGroupOf(el) {
  let g = el.closest(".booking__group");
  if (g) { g.classList.add("bk-enh"); return g; }
  g = el.closest(".csel-group");
  if (g) return g;
  const w = document.createElement("span");
  w.className = "csel-group";
  el.parentNode.insertBefore(w, el);
  w.appendChild(el);
  return w;
}

function makeFieldEnhancer() {
  // overlay + kontrol panel (dipakai bareng; booking gak barengan sama search di 1 halaman)
  let overlay = document.querySelector(".hs-overlay");
  if (!overlay) { overlay = document.createElement("div"); overlay.className = "hs-overlay"; document.body.appendChild(overlay); }
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
  const anchors = new Map();
  let openPanelEl = null, openCtrlEl = null;
  const restore = (p) => { const a = anchors.get(p); if (a && p.parentElement === document.body) a.parent.insertBefore(p, a.next); };
  function closeAll() {
    const had = !!openPanelEl; // cuma lepas lock kalau memang ada panel booking kebuka
    if (openPanelEl) { openPanelEl.classList.remove("open", "hs-panel--elevated"); restore(openPanelEl); openPanelEl = null; }
    if (openCtrlEl) { openCtrlEl.classList.remove("is-open"); openCtrlEl.setAttribute("aria-expanded", "false"); openCtrlEl = null; }
    overlay.classList.remove("open", "hs-overlay--elevated");
    if (had) hsScrollLock(false);
  }
  function openPanel(panel, ctrl) {
    if (openPanelEl === panel) { closeAll(); return; }
    closeAll();
    // popup = kalender: di desktop pun tampil sebagai kartu ke-center + overlay (bukan
    // dropdown nempel di field) - reparent ke body biar position:fixed-nya lepas dari ancestor.
    const asPopup = panel.classList.contains("hs-panel--popup");
    if (isMobile() || asPopup) {
      if (!anchors.has(panel)) anchors.set(panel, { parent: panel.parentElement, next: panel.nextSibling });
      document.body.appendChild(panel); overlay.classList.add("open"); hsScrollLock(true);
      // dibuka dari dalam modal (mis. editor trip) -> angkat di atas modal (z-index 200)
      if (ctrl.closest(".modal")) { panel.classList.add("hs-panel--elevated"); overlay.classList.add("hs-overlay--elevated"); }
    } else restore(panel);
    panel.classList.add("open");
    ctrl.classList.add("is-open"); ctrl.setAttribute("aria-expanded", "true");
    openPanelEl = panel; openCtrlEl = ctrl;
  }

  const refreshers = [];
  const refreshAll = () => refreshers.forEach((fn) => fn());
  const CHEV = '<svg class="hs-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

  function makePanel(title) {
    const panel = document.createElement("div");
    panel.className = "hs-panel bk-panel";
    panel.innerHTML = '<div class="hs-panel__head"><h3>' + title + '</h3><button type="button" class="hs-panel__close" aria-label="Close">&times;</button></div>';
    panel.querySelector(".hs-panel__close").addEventListener("click", (e) => { e.stopPropagation(); closeAll(); });
    return panel;
  }

  function enhanceSelect(sel, title, opts) {
    if (!sel || sel.dataset.enhanced) return;
    opts = opts || {};
    sel.dataset.enhanced = "1";
    const group = cselGroupOf(sel);
    sel.classList.add("bk-native");
    const ctrl = document.createElement("button");
    ctrl.type = "button";
    ctrl.className = "hs-control bk-control";
    ctrl.setAttribute("aria-haspopup", "listbox");
    ctrl.setAttribute("aria-expanded", "false");
    ctrl.innerHTML = '<span class="hs-control__val" data-val></span>' + CHEV;
    const panel = makePanel(title);
    // Search box (opt-in, buat dropdown panjang kayak Country): ketik -> filter opsi
    // per prefix KATA (mis. "i" -> India, Indonesia, Iceland...), pilih -> ke-save (Wayan).
    let searchInput = null;
    if (opts.search) {
      const sw = document.createElement("div");
      sw.className = "hs-search-wrap";
      sw.innerHTML = '<input type="text" class="hs-search" placeholder="' + (opts.searchPlaceholder || "Type to search") + '" autocomplete="off" />';
      panel.appendChild(sw);
      searchInput = sw.querySelector(".hs-search");
      searchInput.addEventListener("click", (e) => e.stopPropagation());
      searchInput.addEventListener("input", () => applyFilter());
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); const first = body.querySelector(".hs-opt:not([hidden])"); if (first) first.click(); }
        else if (e.key === "Escape") { e.preventDefault(); closeAll(); ctrl.focus(); }
      });
    }
    const body = document.createElement("div");
    body.className = "hs-panel__body";
    panel.appendChild(body);
    sel.after(ctrl); ctrl.after(panel);
    const valEl = ctrl.querySelector("[data-val]");
    function applyFilter() {
      // Prefix nama negara (Wayan: ketik "i" -> India, Indonesia, Iceland... yg DIAWALI "i",
      // bukan yg cuma ngandung kata "Island"). Cocok sama cara orang ngetik nama negara.
      const q = searchInput ? searchInput.value.trim().toLowerCase() : "";
      body.querySelectorAll(".hs-opt").forEach((btn) => {
        const nm = (btn.dataset.nm || "").toLowerCase();
        btn.hidden = !!q && !nm.startsWith(q);
      });
    }
    function refresh() {
      const opt = sel.options[sel.selectedIndex];
      const ph = !sel.value || (opt && opt.disabled);
      const flag = opt && opt.dataset ? opt.dataset.flag : "";
      // Opsi berbendera (mis. Country) -> tampil bendera + nama; selain itu teks polos.
      if (flag) {
        valEl.innerHTML = '<img class="hs-opt__flag" src="assets/flags/' + flag + '.svg" alt="" />' +
          '<span class="hs-opt__nm">' + escHtml(opt.textContent) + "</span>";
        valEl.classList.add("hs-control__val--flag");
      } else {
        valEl.textContent = opt ? opt.textContent : "";
        valEl.classList.remove("hs-control__val--flag");
      }
      valEl.classList.toggle("placeholder", !!ph);
    }
    function build() {
      body.innerHTML = "";
      Array.from(sel.options).forEach((o) => {
        if (o.disabled && o.value === "") return; // skip placeholder
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "hs-opt bk-opt" + (o.value === sel.value ? " is-sel" : "");
        btn.dataset.nm = o.textContent; // buat filter search
        const oFlag = o.dataset ? o.dataset.flag : "";
        btn.innerHTML = (oFlag ? '<img class="hs-opt__flag" src="assets/flags/' + oFlag + '.svg" alt="" />' : "") +
          '<span class="hs-opt__nm">' + o.textContent + "</span>";
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          sel.value = o.value;
          sel.dispatchEvent(new Event("change"));
          refresh(); refreshAll(); closeAll();
        });
        body.appendChild(btn);
      });
      applyFilter(); // hormatin isi search yg lagi diketik (kalau ada)
    }
    ctrl.addEventListener("click", (e) => {
      e.stopPropagation();
      if (searchInput) searchInput.value = "";
      build();
      openPanel(panel, ctrl);
      if (searchInput) setTimeout(() => searchInput.focus(), 60);
    });
    // Navigasi keyboard: Enter/↓ buka, ↑↓ sorot, Enter pilih, Esc tutup
    let kbd = -1;
    const kOpts = () => Array.from(body.querySelectorAll(".bk-opt")).filter((o) => !o.hidden);
    const kPaint = () => { const os = kOpts(); os.forEach((o, i) => o.classList.toggle("is-kbd", i === kbd)); if (os[kbd]) os[kbd].scrollIntoView({ block: "nearest" }); };
    ctrl.addEventListener("keydown", (e) => {
      const open = panel.classList.contains("open");
      if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
        e.preventDefault(); build(); openPanel(panel, ctrl);
        const os = kOpts(); kbd = Math.max(0, os.findIndex((o) => o.classList.contains("is-sel"))); kPaint(); return;
      }
      if (!open) return;
      const os = kOpts();
      if (e.key === "ArrowDown") { e.preventDefault(); kbd = Math.min(os.length - 1, kbd + 1); kPaint(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); kbd = Math.max(0, kbd - 1); kPaint(); }
      else if (e.key === "Enter") { e.preventDefault(); if (os[kbd]) { os[kbd].click(); ctrl.focus(); } }
      else if (e.key === "Escape") { e.preventDefault(); closeAll(); ctrl.focus(); }
    });
    sel.addEventListener("change", refresh);
    refreshers.push(refresh); __cselRefreshers.push(refresh);
    refresh();
  }

  function enhanceDate(inp, title) {
    if (!inp || inp.dataset.enhanced) return;
    inp.dataset.enhanced = "1";
    const group = cselGroupOf(inp);
    inp.classList.add("bk-native");
    const ctrl = document.createElement("button");
    ctrl.type = "button";
    ctrl.className = "hs-control bk-control";
    ctrl.setAttribute("aria-expanded", "false");
    ctrl.innerHTML = '<span class="hs-control__val placeholder" data-val>Select date</span>' +
      '<svg class="hs-chev hs-chev--cal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>';
    const panel = makePanel(title);
    // Kalender = popup ke-center di desktop juga (bukan dropdown nempel field) - reuse
    // gaya .bookdate-panel (Book Now). hs-panel--popup = flag buat openPanel.
    panel.classList.add("bk-panel--cal", "bookdate-panel", "hs-panel--popup");
    const calBody = document.createElement("div");
    calBody.className = "hs-cal bk-cal";
    const foot = document.createElement("div");
    foot.className = "hs-cal__foot";
    foot.innerHTML = '<span class="hs-cal__hint" data-hint>Pick a date</span><button type="button" class="hs-cal__apply" data-apply>Apply</button>';
    panel.appendChild(calBody); panel.appendChild(foot);
    inp.after(ctrl); ctrl.after(panel);
    const valEl = ctrl.querySelector("[data-val]");
    const hint = foot.querySelector("[data-hint]");
    const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const MONS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const pad = (n) => String(n).padStart(2, "0");
    const parseD = (s) => { const p = (s || "").split("-"); return p.length === 3 ? { y: +p[0], m: +p[1] - 1, d: +p[2] } : null; };
    const keyOf = (o) => o.y * 10000 + o.m * 100 + o.d;
    const now = new Date();
    const TODAY = { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
    let sel = parseD(inp.value);
    function refresh() {
      const s = parseD(inp.value);
      if (s) { valEl.textContent = MONS[s.m] + " " + s.d + ", " + s.y; valEl.classList.remove("placeholder"); }
      else { valEl.textContent = "Select date"; valEl.classList.add("placeholder"); }
    }
    function monthEl(y, m) {
      const el = document.createElement("div");
      el.className = "hs-cal__m";
      const cap = document.createElement("div");
      cap.className = "hs-cal__cap"; cap.textContent = MON[m] + " " + y; el.appendChild(cap);
      const g = document.createElement("div"); g.className = "hs-cal__grid";
      DOW.forEach((d) => { const h = document.createElement("div"); h.className = "hs-cal__dow"; h.textContent = d; g.appendChild(h); });
      const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
      for (let i = 0; i < first; i++) { const o = document.createElement("div"); o.className = "hs-cal__d is-off"; g.appendChild(o); }
      for (let d = 1; d <= days; d++) {
        const cell = { y: y, m: m, d: d };
        const b = document.createElement("button");
        b.type = "button"; b.className = "hs-cal__d"; b.textContent = d;
        const past = keyOf(cell) < keyOf(TODAY);
        if (past) b.classList.add("is-off");
        if (cell.y === TODAY.y && cell.m === TODAY.m && cell.d === TODAY.d) b.classList.add("today");
        if (sel && keyOf(cell) === keyOf(sel)) b.classList.add("sel");
        if (!past) b.addEventListener("click", (e) => { e.stopPropagation(); sel = cell; render(); hint.textContent = MONS[sel.m] + " " + sel.d; });
        g.appendChild(b);
      }
      el.appendChild(g); return el;
    }
    function render() {
      calBody.innerHTML = "";
      const wrap = document.createElement("div"); wrap.className = "hs-cal__months";
      for (let k = 0; k < 13; k++) { let mm = TODAY.m + k, yy = TODAY.y; while (mm > 11) { mm -= 12; yy++; } wrap.appendChild(monthEl(yy, mm)); }
      calBody.appendChild(wrap);
      hint.textContent = sel ? MONS[sel.m] + " " + sel.d : "Pick a date";
    }
    foot.querySelector("[data-apply]").addEventListener("click", (e) => {
      e.stopPropagation();
      if (sel) { inp.value = sel.y + "-" + pad(sel.m + 1) + "-" + pad(sel.d); inp.dispatchEvent(new Event("input", { bubbles: true })); inp.dispatchEvent(new Event("change")); refresh(); }
      closeAll();
    });
    ctrl.addEventListener("click", (e) => { e.stopPropagation(); sel = parseD(inp.value); render(); openPanel(panel, ctrl); });
    inp.addEventListener("change", () => { sel = parseD(inp.value); refresh(); });
    refreshers.push(refresh); __cselRefreshers.push(refresh);
    refresh();
  }

  // Date + TIME (input[type=datetime-local]) -> custom picker kita: kalender + baris slot
  // jam (pill, tiap 30 menit) di footer sticky. Nulis balik "YYYY-MM-DDTHH:MM" ke input
  // native + fire input & change (biar validasi tombol yg dengerin "input" ikut jalan).
  // Dipakai buat Flight date & time di airport-transfer (gantiin picker bawaan browser).
  function enhanceDateTime(inp, title) {
    if (!inp || inp.dataset.enhanced) return;
    inp.dataset.enhanced = "1";
    const group = cselGroupOf(inp);
    inp.classList.add("bk-native");
    const ctrl = document.createElement("button");
    ctrl.type = "button";
    ctrl.className = "hs-control bk-control";
    ctrl.setAttribute("aria-expanded", "false");
    ctrl.innerHTML = '<span class="hs-control__val placeholder" data-val>Select date &amp; time</span>' +
      '<svg class="hs-chev hs-chev--cal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>';
    const panel = makePanel(title);
    panel.classList.add("bk-panel--cal", "bookdate-panel", "hs-panel--popup");
    const calBody = document.createElement("div");
    calBody.className = "hs-cal bk-cal";
    const foot = document.createElement("div");
    foot.className = "hs-cal__foot dt-foot";
    foot.innerHTML = '<div class="dt-times" data-times></div>' +
      '<div class="dt-footrow"><span class="hs-cal__hint" data-hint>Pick date &amp; time</span><button type="button" class="hs-cal__apply" data-apply>Apply</button></div>';
    panel.appendChild(calBody); panel.appendChild(foot);
    inp.after(ctrl); ctrl.after(panel);
    const valEl = ctrl.querySelector("[data-val]");
    const hint = foot.querySelector("[data-hint]");
    const timesEl = foot.querySelector("[data-times]");
    const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const MONS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const pad = (n) => String(n).padStart(2, "0");
    const parseDT = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(s || ""); return m ? { y: +m[1], m: +m[2] - 1, d: +m[3], H: +m[4], M: +m[5] } : null; };
    const keyOf = (o) => o.y * 10000 + o.m * 100 + o.d;
    const now = new Date();
    const TODAY = { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
    let selD = null, selT = null; // {y,m,d} + {H,M}
    const tLabel = (t) => fmtTime(pad(t.H) + ":" + pad(t.M));
    function fromInput() { const p = parseDT(inp.value); if (p) { selD = { y: p.y, m: p.m, d: p.d }; selT = { H: p.H, M: p.M }; } else { selD = null; selT = null; } }
    function refresh() {
      const p = parseDT(inp.value);
      if (p) { valEl.textContent = MONS[p.m] + " " + p.d + ", " + p.y + " · " + fmtTime(pad(p.H) + ":" + pad(p.M)); valEl.classList.remove("placeholder"); }
      else { valEl.textContent = "Select date & time"; valEl.classList.add("placeholder"); }
    }
    function syncHint() { hint.textContent = (selD ? MONS[selD.m] + " " + selD.d : "Pick a date") + (selT ? " · " + tLabel(selT) : " · pick a time"); }
    function monthEl(y, m) {
      const el = document.createElement("div");
      el.className = "hs-cal__m";
      const cap = document.createElement("div");
      cap.className = "hs-cal__cap"; cap.textContent = MON[m] + " " + y; el.appendChild(cap);
      const g = document.createElement("div"); g.className = "hs-cal__grid";
      DOW.forEach((d) => { const h = document.createElement("div"); h.className = "hs-cal__dow"; h.textContent = d; g.appendChild(h); });
      const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
      for (let i = 0; i < first; i++) { const o = document.createElement("div"); o.className = "hs-cal__d is-off"; g.appendChild(o); }
      for (let d = 1; d <= days; d++) {
        const cell = { y: y, m: m, d: d };
        const b = document.createElement("button");
        b.type = "button"; b.className = "hs-cal__d"; b.textContent = d;
        const past = keyOf(cell) < keyOf(TODAY);
        if (past) b.classList.add("is-off");
        if (cell.y === TODAY.y && cell.m === TODAY.m && cell.d === TODAY.d) b.classList.add("today");
        if (selD && keyOf(cell) === keyOf(selD)) b.classList.add("sel");
        if (!past) b.addEventListener("click", (e) => { e.stopPropagation(); selD = cell; renderCal(); syncHint(); });
        g.appendChild(b);
      }
      el.appendChild(g); return el;
    }
    function renderCal() {
      calBody.innerHTML = "";
      const wrap = document.createElement("div"); wrap.className = "hs-cal__months";
      for (let k = 0; k < 13; k++) { let mm = TODAY.m + k, yy = TODAY.y; while (mm > 11) { mm -= 12; yy++; } wrap.appendChild(monthEl(yy, mm)); }
      calBody.appendChild(wrap);
    }
    function renderTimes() {
      timesEl.innerHTML = "";
      for (let h = 0; h < 24; h++) for (let mm = 0; mm < 60; mm += 30) {
        const b = document.createElement("button");
        b.type = "button"; b.className = "dt-time"; b.textContent = fmtTime(pad(h) + ":" + pad(mm));
        if (selT && selT.H === h && selT.M === mm) b.classList.add("is-sel");
        b.addEventListener("click", (e) => { e.stopPropagation(); selT = { H: h, M: mm }; renderTimes(); syncHint(); });
        timesEl.appendChild(b);
      }
      const cur = timesEl.querySelector(".is-sel"); if (cur) cur.scrollIntoView({ block: "nearest", inline: "center" });
    }
    function renderAll() { renderCal(); renderTimes(); syncHint(); }
    foot.querySelector("[data-apply]").addEventListener("click", (e) => {
      e.stopPropagation();
      if (!selD || !selT) { syncHint(); return; } // wajib dua-duanya
      inp.value = selD.y + "-" + pad(selD.m + 1) + "-" + pad(selD.d) + "T" + pad(selT.H) + ":" + pad(selT.M);
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      inp.dispatchEvent(new Event("change"));
      refresh(); closeAll();
    });
    ctrl.addEventListener("click", (e) => { e.stopPropagation(); fromInput(); renderAll(); openPanel(panel, ctrl); });
    inp.addEventListener("change", () => { fromInput(); refresh(); });
    refreshers.push(refresh); __cselRefreshers.push(refresh);
    refresh();
  }

  overlay.addEventListener("click", closeAll);
  document.addEventListener("click", (e) => { if (!e.target.closest(".hs-panel") && !e.target.closest(".hs-control")) closeAll(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
  window.addEventListener("resize", closeAll);
  return { enhanceSelect, enhanceDate, enhanceDateTime, closeAll };
}

// Booking form (halaman detail bookable): service/item/pickup + tanggal -> custom.
function initBookingCustomControls() {
  const selService = document.getElementById("service");
  if (!selService) return; // bukan halaman booking
  const fe = makeFieldEnhancer();
  fe.enhanceSelect(document.getElementById("stay-area"), "Pickup area");
  fe.enhanceSelect(selService, "Service");
  fe.enhanceSelect(document.getElementById("service-item"), "Select service");
  fe.enhanceDate(document.getElementById("date"), "Select date");
}

// Enhancer global singleton -> dipakai bareng initCustomSelects + field yg muncul belakangan
// (mis. editor "Your trip details" yg di-build on-demand). Sekali bikin, listener gak numpuk.
let __globalEnhancer = null;
function globalEnhancer() { if (!__globalEnhancer) __globalEnhancer = makeFieldEnhancer(); return __globalEnhancer; }

// Semua select/date SISA (navbar akun, charter, transfer, itinerary) -> custom juga,
// biar gak ada dropdown native yg jelek di manapun (desktop + HP). Dijalankan SETELAH
// init masing-masing feature (biar opsi select udah keisi). Skip yg udah di-enhance
// (booking form + search homepage nyetir enhancer-nya sendiri).
function initCustomSelects() {
  const targets = [];
  const add = (el, title, kind) => { if (el && !el.dataset.enhanced) targets.push({ el, title, kind }); };
  add(document.getElementById("ch-pickup"), "Pick-up area", "sel");
  add(document.getElementById("ch-guests"), "Guests", "sel");
  add(document.getElementById("ch-date"), "Select date", "date");
  add(document.getElementById("at-direction"), "Direction", "sel");
  add(document.getElementById("at-guests"), "Guests", "sel");
  add(document.getElementById("at-date"), "Select date", "date");
  add(document.getElementById("at-flight-time"), "Flight date & time", "datetime");
  add(document.getElementById("sg-days"), "Days", "sel");
  add(document.getElementById("sg-guests"), "Guests", "sel");
  add(document.getElementById("trip-start"), "Start date", "date");
  document.querySelectorAll("[data-tp-from]").forEach((el) => add(el, "From", "sel"));
  document.querySelectorAll("[data-tp-to]").forEach((el) => add(el, "To", "sel"));
  document.querySelectorAll("[data-guest-select]").forEach((el) => add(el, "Guests", "sel"));
  document.querySelectorAll("[data-stay-select]").forEach((el) => add(el, "Pick-up area", "sel"));
  if (!targets.length) return;
  const fe = globalEnhancer();
  targets.forEach((t) => {
    if (t.kind === "date") fe.enhanceDate(t.el, t.title);
    else if (t.kind === "datetime") fe.enhanceDateTime(t.el, t.title);
    else fe.enhanceSelect(t.el, t.title);
  });
}

// Field di dalam sebuah root yg di-build on-demand (modal editor trip, popup service
// itinerary, form override per-hari) -> ikut di-custom-in biar GAK ada picker native
// browser (date iOS/select jelek) di manapun. Judul panel diambil dari <label> di
// pembungkus .field kalau ada (mis. Area/Direction/Duration), fallback ke default.
function enhanceFieldsIn(root) {
  if (!root) return;
  const fe = globalEnhancer();
  const labelOf = (el) => {
    const f = el.closest(".field");
    const l = f && f.querySelector("label");
    return l ? l.textContent.trim() : "";
  };
  root.querySelectorAll('input[type="date"]').forEach((el) => fe.enhanceDate(el, el.id === "trip-date-to" ? "To" : "Select date"));
  root.querySelectorAll("select").forEach((el) => {
    const t = el.matches("[data-stay-select]") ? "Pick-up area" : (labelOf(el) || "Guests");
    fe.enhanceSelect(el, t);
  });
}

// Glance redesign: kalau section "At a Glance / Tour Details" punya harga bookable
// (.price[data-price]), harga itu jadi HERO (gede, di tengah, coret kecil pojok kiri +
// unit /car//person + pill save) & fakta lain jadi 3 box di bawahnya. Halaman attraction
// (cuma "Entrance" fee, tanpa .price) nggak kesentuh.
function initGlanceHero() {
  document.querySelectorAll(".info__facts").forEach((facts) => {
    const priceFact = [...facts.children].find((f) => f.querySelector(".price[data-price]"));
    if (!priceFact) return;
    facts.classList.add("info__facts--hero");
    priceFact.classList.add("info__fact--price");
    const priceEl = priceFact.querySelector(".price[data-price]");
    // unit "per car"/"per person" (format SAMA kaya card). Reuse .price-unit yg
    // udah ada (dari addPriceUnit) biar nggak dobel.
    const info = itemInfo(priceEl.dataset.price);
    const cat = info ? info.cat : "";
    const unit = (cat === "tour" || cat === "combo" || cat === "place") ? "per car"
      : (cat === "experience" || cat === "performance") ? "per person" : "";
    if (unit) {
      let unitEl = priceFact.querySelector(".price-unit");
      if (!unitEl) {
        unitEl = document.createElement("span");
        unitEl.className = "price-unit";
        priceEl.insertAdjacentElement("afterend", unitEl);
      }
      unitEl.textContent = unit;
    }
    // pill "You save X%" (diisi/di-hide updateGlanceSave)
    const strong = priceFact.querySelector("strong");
    if (strong && !priceFact.querySelector("[data-glance-save]")) {
      const s = document.createElement("span");
      s.className = "glance-save";
      s.setAttribute("data-glance-save", "");
      s.hidden = true;
      strong.insertAdjacentElement("afterend", s);
    }
  });
  updateGlanceSave();
}

// Desktop: turunin sidebar biar sejajar sama FOTO pertama di konten (bukan sama
// title section). Diukur sekali (offset dari atas layout ke foto pertama), disimpen
// di CSS var --side-offset yang cuma kepakai di media desktop (mobile aman).
function alignSideToFirstPhoto(layout, main, side) {
  if (!window.matchMedia("(min-width: 993px)").matches) return;
  const photo = main.querySelector(".stop__image, .experience__image, .stop img, img");
  if (!photo) return;
  const off = Math.round(photo.getBoundingClientRect().top - side.getBoundingClientRect().top);
  if (off > 0) layout.style.setProperty("--side-offset", off + "px");
}

// Judul section di kolom kiri (mis. "What You'll Do") harus ke tengah LAYAR
// penuh, bukan cuma tengah kolom konten (kolom kiri lebih sempit karena ada
// sidebar "Build Your Trip" di kanan, lebarnya nggak proporsional/nggak bisa
// dihitung lewat CSS % biasa - lebar sidebar campuran 34% & max-width 380px).
// Diukur & digeser pakai transform, sama kayak alignSideToFirstPhoto di atas.
function centerBreakoutTitles(main) {
  const titles = main.querySelectorAll(".section__title");
  const apply = () => {
    if (!window.matchMedia("(min-width: 993px)").matches) {
      titles.forEach((el) => el.style.removeProperty("--title-shift"));
      return;
    }
    titles.forEach((el) => {
      const r = el.getBoundingClientRect();
      const shift = Math.round(window.innerWidth / 2 - (r.left + r.width / 2));
      el.style.setProperty("--title-shift", shift + "px");
    });
  };
  apply();
  window.addEventListener("resize", apply);
}

// Scroll ke kartu booking sidebar + kasih glow. Dipakai CTA hero & book-bar HP.
// Manual (bukan href="#booking") karena <base href="/"> bikin anchor loncat ke home.
// Offset navbar fixed (~64px) biar judul kartu nggak ketutup.
function scrollToBookCard(card) {
  if (!card) return;
  const top = card.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  card.classList.remove("booksidebar--glow");
  void card.offsetWidth; // reflow: restart animasi tiap klik
  card.classList.add("booksidebar--glow");
  setTimeout(() => card.classList.remove("booksidebar--glow"), 3000);
}

// Halaman detail bookable: gabung form "Build Your Trip" + checklist Included/Excluded
// + Ask jadi SATU kartu sidebar. Desktop = 2 kolom (kartu sticky kanan). Mobile = satu
// kolom, kartu di paling bawah setelah konten. Form-nya dipindah keluar dari modal;
// presets (data-item/default) udah keburu dibaca initBooking sebelum fungsi ini jalan.
function initBookSidebar() {
  const info = document.querySelector("section.info");
  if (!info || !info.querySelector(".info__cta")) return; // cuma halaman detail bookable
  // hero = subhero (default) atau tour-hero split 50:50 (halaman yg pakai layout baru)
  const subhero = document.querySelector("section.tour-hero, section.subhero");
  const bookingPh = document.getElementById("booking-placeholder");
  if (!subhero || !bookingPh) return;

  // --- Ambil data fakta dari .info SEBELUM dibongkar (buat glance list) ---
  const factVal = (prefix) => {
    const f = [...info.querySelectorAll(".info__fact")].find((el) => {
      const s = el.querySelector("span");
      return s && s.textContent.trim().toLowerCase().startsWith(prefix);
    });
    return f && f.querySelector("strong") ? f.querySelector("strong").textContent.trim() : "";
  };
  const duration = factVal("duration");
  const pickup = factVal("pick");
  const itemName = bookingPh.dataset.item || "";
  const info0 = typeof itemInfo === "function" ? itemInfo(itemName) : null;
  const cat = info0 ? info0.cat : "tour";
  const perPerson = cat === "experience" || cat === "performance";
  const capacity = perPerson ? "Per person ticket" : "Private · up to 5 pax";

  // --- Layout 2 kolom setelah subhero ---
  const layout = document.createElement("div");
  layout.className = "tour-layout tour-layout--book";
  const main = document.createElement("div"); main.className = "tour-layout__main";
  const side = document.createElement("div"); side.className = "tour-layout__side";
  layout.append(main, side);
  subhero.after(layout);

  // Section konten setelah layout -> kolom kiri (kecuali .info yg mau dibongkar)
  const sections = [];
  let n = layout.nextElementSibling;
  while (n && n.tagName === "SECTION") { const next = n.nextElementSibling; sections.push(n); n = next; }
  sections.forEach((s) => { if (s !== info) main.appendChild(s); });

  // --- Kartu booking gabungan ---
  const card = document.createElement("div");
  card.className = "booksidebar";
  side.appendChild(card);

  // 1) Form booking (pindahin placeholder-nya; presets + wiring ikut node)
  card.appendChild(bookingPh);
  const bookingSection = document.getElementById("booking");
  if (bookingSection) bookingSection.classList.add("booking--sidebar");

  // Urutan field: Pickup, Date, Program, Select program -> di grid 2 kolom jadi
  // baris1 Pickup|Date, baris2 Program|Select program. Date dipindah ke sebelah Pickup.
  const dateGroup = document.getElementById("date") && document.getElementById("date").closest(".booking__group");
  const pickupGroup = document.getElementById("stay-area") && document.getElementById("stay-area").closest(".booking__group");
  if (dateGroup && pickupGroup) pickupGroup.after(dateGroup);
  // Label ikut referensi: "Service" -> "Program", "Select Service" -> "Select program"
  const relabel = (id, txt) => {
    const el = document.getElementById(id);
    const lb = el && el.closest(".booking__group") && el.closest(".booking__group").querySelector("label");
    if (lb) lb.textContent = txt;
  };
  relabel("stay-area", "Pickup area");
  relabel("service", "Program");
  relabel("service-item", "Select program");

  // Harga besar di tengah + unit "per car"/"per person" di bawah angka
  const priceEl = document.getElementById("price");
  if (priceEl && priceEl.parentElement && !priceEl.parentElement.querySelector(".price-unit")) {
    const unit = perPerson ? "per person" : "per car";
    const u = document.createElement("div");
    u.className = "price-unit";
    u.textContent = unit;
    priceEl.after(u);
  }

  // Tombol: Book Now (-> My Trips) + Add to My Trip (nambah, tetap di halaman). Dua-duanya dari partial.

  // 2) Spec list (durasi / kapasitas / pickup) — data asli halaman + ikon (SVG Step-1)
  const CLK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  const PPL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M2 20c0-3.3 3.1-5 7-5s7 1.7 7 5"/><path d="M17 8a3 3 0 0 1 0 6"/><path d="M22 20c0-2.5-1.6-4.1-4-4.7"/></svg>';
  const PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-5.5 7-12a7 7 0 0 0-14 0c0 6.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';
  const rows = [];
  if (duration) rows.push([CLK, duration]);
  rows.push([PPL, capacity]);
  if (pickup) rows.push([PIN, pickup + " pick-up"]);
  const specs = document.createElement("ul");
  specs.className = "booksidebar__specs";
  specs.innerHTML = rows.map(([ic, tx]) => "<li>" + ic + tx + "</li>").join("");
  card.appendChild(specs);

  // 3) "What's included" = panel slide-over yang NUTUPIN form (kartu tinggi tetap,
  //    nggak nambah panjang). Trigger di bawah; klik -> panel naik nutupin form,
  //    klik lagi / tombol tutup -> panel turun. Konten tetap di HTML (SEO aman).
  const yes = info.querySelector(".info__list--yes");
  if (yes) {
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "booksidebar__incl-trigger";
    trigger.innerHTML = "<span>What&apos;s included</span><span class=\"booksidebar__chev\"></span>";
    card.appendChild(trigger);

    const panel = document.createElement("div");
    panel.className = "booksidebar__panel";
    const head = document.createElement("div");
    head.className = "booksidebar__panel-head";
    head.innerHTML = "<span>What&apos;s included</span>";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "booksidebar__panel-close";
    close.setAttribute("aria-label", "Close");
    close.innerHTML = "&times;";
    head.appendChild(close);
    panel.append(head, yes);
    card.appendChild(panel);

    trigger.addEventListener("click", () => card.classList.toggle("incl-open"));
    close.addEventListener("click", () => card.classList.remove("incl-open"));
    window.__bookListsSync = (mode) =>
      panel.classList.toggle("is-exclusive", mode === "exclusive");
    window.__bookListsSync("standard");
  }

  // Buang .info lama + wrapper modal (form udah pindah ke kartu)
  info.remove();
  const bm = document.getElementById("book-modal-placeholder");
  if (bm) bm.remove();

  // CTA hero "Book this program" -> scroll ke form + kasih glow di kartu sbentar.
  // WAJIB preventDefault: link-nya <a href="#booking">, tapi halaman pake <base href="/">
  // jadi "#booking" ke-resolve ke ROOT situs (= home) -> tanpa ini malah loncat ke homepage.
  const heroCta = document.querySelector(".tour-hero__cta");
  if (heroCta) heroCta.addEventListener("click", (e) => { e.preventDefault(); scrollToBookCard(card); });

  // sejajarin sidebar sama foto pertama (stop 1), bukan sama title
  alignSideToFirstPhoto(layout, main, side);
  centerBreakoutTitles(main);
}

// Slider manual di foto hero: pakai foto-foto KONTEN (stop) program itu. Tiap slide
// ada judul kecil + "(…)" biar user tau fotonya ada lanjutannya. Nav: panah, dot, swipe.
function initTourHeroSlider() {
  const box = document.querySelector(".tour-hero__image");
  if (!box) return;
  const imgs = [...document.querySelectorAll(".stop__image img, .experience__image img")];
  // caption slider = nama tempat singkat, BUKAN deskripsi.
  // - halaman attraction (experience/destination): semua foto subjeknya sama -> pakai nama halaman dari slug file.
  // - halaman tour (multi-stop): pakai nama stop, dibersihin (buang "(...)", potong ekor koma/" - "/" & ...").
  const isAttraction = /\/attractions\//.test(location.pathname);
  const slugName = () =>
    (location.pathname.split("/").pop() || "")
      .replace(/\.html$/, "")
      .split("-")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");
  const cleanStop = (t) => {
    let s = t.replace(/\s+/g, " ").trim();
    s = s.replace(/\s*\([^)]*\)/g, "");        // buang "(...)"
    s = s.split(/\s*[,:]\s*/)[0];              // potong di koma / titik dua
    s = s.split(/\s+[-–—]\s+/)[0];             // potong ekor setelah " - "
    // potong ekor " & ..." cuma kalau kedua sisi >= 2 kata (biar "Barong & Keris Dance" tetap utuh)
    const amp = s.split(/\s+&\s+/);
    if (amp.length > 1 && amp[0].trim().split(" ").length >= 2 && amp.slice(1).join(" ").trim().split(" ").length >= 2) s = amp[0];
    s = s.trim().split(" ").slice(0, 5).join(" "); // maks 5 kata
    return s.replace(/\s*[&\-–—]$/, "").trim();    // rapihin ekor
  };
  const subject = isAttraction ? slugName() : "";
  const slides = imgs
    .map((img) => ({
      src: img.getAttribute("src"),
      title: isAttraction
        ? subject
        : cleanStop(img.closest(".stop, .experience__card")?.querySelector(".stop__name, .experience__name")?.textContent || ""),
    }))
    .filter((s) => s.src);
  if (slides.length < 2) return; // butuh minimal 2 foto buat slider

  box.classList.add("hero-slider");
  box.style.backgroundImage = "";
  box.innerHTML =
    slides
      .map((s, i) => `<div class="hero-slide${i === 0 ? " is-active" : ""}" style="background-image:url(${s.src})"></div>`)
      .join("") +
    '<div class="hero-slider__cap"><span class="hero-slider__title"></span></div>' +
    '<div class="hero-slider__arrows">' +
    '<button type="button" class="hero-slider__arrow hero-slider__arrow--prev" aria-label="Previous photo">&lsaquo;</button>' +
    '<button type="button" class="hero-slider__arrow hero-slider__arrow--next" aria-label="Next photo">&rsaquo;</button>' +
    "</div>" +
    '<div class="hero-slider__dots"></div>';

  const slideEls = [...box.querySelectorAll(".hero-slide")];
  const titleEl = box.querySelector(".hero-slider__title");
  const dotsWrap = box.querySelector(".hero-slider__dots");
  const DOT_MAX = 5; // max 5 titik: cuma indikator geser, aktif lebih besar, tepi mengecil
  let cur = 0;
  const renderDots = () => {
    const total = slides.length;
    const count = Math.min(DOT_MAX, total);
    const start = total > DOT_MAX ? Math.min(Math.max(cur - 2, 0), total - DOT_MAX) : 0;
    let html = "";
    for (let j = 0; j < count; j++) {
      const idx = start + j;
      let cls = "hero-slider__dot";
      if (idx === cur) cls += " is-active";
      else if (total > DOT_MAX && ((j === 0 && start > 0) || (j === count - 1 && start + count < total))) cls += " is-edge";
      html += `<span class="${cls}"></span>`;
    }
    dotsWrap.innerHTML = html;
  };
  const go = (n) => {
    cur = (n + slides.length) % slides.length;
    slideEls.forEach((el, i) => el.classList.toggle("is-active", i === cur));
    if (titleEl) titleEl.textContent = slides[cur].title;
    renderDots();
  };
  go(0);
  box.querySelector(".hero-slider__arrow--prev").addEventListener("click", () => go(cur - 1));
  box.querySelector(".hero-slider__arrow--next").addEventListener("click", () => go(cur + 1));
  // swipe (HP): cuma reaksi kalau gesture DOMINAN horizontal (biar geser samping
  // nggak ke-baca scroll turun). touch-action:pan-y di CSS nahan scroll vertikal tetap jalan.
  let x0 = null, y0 = null;
  box.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.8) go(cur + (dx < 0 ? 1 : -1));
    x0 = null;
    y0 = null;
  });
}

// Bar harga + tombol nempel di bawah (MOBILE, halaman hero baru). Aturan: JANGAN
// ada 2 tombol book barengan -> bar cuma muncul kalau CTA hero UDAH lewat DAN form
// booking BELUM keliatan. Pas salah satunya keliatan -> bar sembunyi.
function initBookBar() {
  if (!document.querySelector(".tour-hero")) return; // cuma halaman hero baru
  const card = document.querySelector(".booksidebar");
  const form = document.getElementById("booking");
  const ph = document.getElementById("booking-placeholder");
  const item = ph && ph.dataset.item;
  if (!card || !form || !item) return;
  const cta = document.querySelector(".tour-hero__cta");
  const unit = (document.querySelector(".booksidebar .price-unit") || {}).textContent || "";

  const WA_ICON = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.5 2.1 7.9L.5 31.5l7.8-2c2.3 1.3 5 1.9 7.7 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.3c-2.5 0-4.9-.7-7-1.9l-.5-.3-4.6 1.2 1.2-4.5-.3-.5C3.6 20.6 2.9 18.3 2.9 16 2.9 8.8 8.8 2.9 16 2.9c7.2 0 13.1 5.9 13.1 13.1S23.2 28.8 16 28.8zm7.2-9.6c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.7.2-.2.2-.4.4-.6.1-.3 0-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.7h-.7c-.2 0-.6.1-.9.5-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.4 3.7 5.8 5.1.8.3 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 2-1 2.3-1.9.3-.9.3-1.7.2-1.9-.1-.1-.3-.2-.7-.4z"/></svg>';
  const bar = document.createElement("div");
  bar.className = "book-bar";
  bar.innerHTML =
    `<div class="book-bar__price"><span class="book-bar__from">from</span> ` +
    `<span class="price" data-price="${item}"></span>` +
    (unit ? ` <span class="book-bar__unit">${unit.trim()}</span>` : "") +
    `</div>` +
    `<div class="book-bar__actions">` +
    `<a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener" class="book-bar__wa" aria-label="Chat on WhatsApp">${WA_ICON}</a>` +
    `<a href="#booking" class="book-bar__btn">Book now</a>` +
    `</div>`;
  document.body.appendChild(bar);
  if (typeof renderPrices === "function") renderPrices(); // isi harga di bar

  // klik = scroll ke form + glow kartu (sama kaya CTA hero). preventDefault: sama alasan
  // kayak hero CTA - <a href="#booking"> + <base href="/"> = loncat ke home kalau gak dicegah.
  bar.querySelector(".book-bar__btn").addEventListener("click", (e) => { e.preventDefault(); scrollToBookCard(card); });

  // muncul cuma kalau CTA hero & form dua-duanya nggak keliatan
  let ctaOn = false, formOn = false;
  const sync = () => {
    const show = !ctaOn && !formOn;
    bar.classList.toggle("is-show", show);
    document.body.classList.toggle("book-bar-open", show);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.target === cta) ctaOn = e.isIntersecting;
      else formOn = e.isIntersecting;
    });
    sync();
  });
  if (cta) io.observe(cta);
  io.observe(form);
  sync();
}


/* DESKTOP listing (tour/activities/transfer): Tour Details + FAQ digabung jadi
   satu card 2 kolom di bawah kartu — Details kiri, FAQ kanan, garis pemisah
   di tengah. Desktop-only (JS gate >=993px + semua CSS di media query). */
function initDetailsFaqRow() {
  if (!window.matchMedia("(min-width: 993px)").matches) return; // desktop saja
  const info = document.querySelector("section.info");
  if (!info || info.querySelector(".info__cta")) return; // listing saja (skip detail)
  if (!info.querySelector(".info__facts")) return; // butuh Tour Details gaya facts (skip charter prose)
  const faq = document.querySelector("section.faq"); // partial FAQ udah ke-inject
  if (!faq) return;
  const row = document.createElement("div");
  row.className = "detailsfaq";
  info.before(row);
  row.appendChild(info); // pane kiri = Tour Details / Good to Know
  row.appendChild(faq); // pane kanan = FAQ
}

/* ---------- Booking-link dinamis (konteks tour induk) ----------
   Stop di halaman tour nge-link ke halaman attraction pakai ?from=<nama tour>.
   Halaman attraction baca ?from -> override item yang di-book + Add to trip + label,
   biar attraction yang muncul di >1 tour nge-book tour yang bener. Tanpa param =
   fallback ke data-item default halaman (behavior lama). */
function tourContextFrom() {
  const from = new URLSearchParams(location.search).get("from");
  return from && Object.values(PAGE_ITEM).includes(from) ? from : "";
}
function applyTourContext() {
  const from = tourContextFrom();
  if (!from) return;
  const holder = document.getElementById("book-modal-placeholder");
  const prev = holder && holder.dataset.item;
  if (holder) holder.dataset.item = from;
  document.querySelectorAll('[data-open="book-modal"]').forEach((btn) => {
    if (prev && btn.textContent.trim() === "Book " + prev) btn.textContent = "Book " + from;
  });
  document.querySelectorAll("[data-add-item]").forEach((btn) => {
    if (!prev || btn.dataset.addItem === prev) btn.dataset.addItem = from;
  });
}
function initStopContext() {
  const page = location.pathname.split("/").pop() || "index.html";
  const item = PAGE_ITEM[page];
  if (!item) return; // cuma jalan di halaman program (tour landing)
  document.querySelectorAll("a.stop--link[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || !/\.html$/.test(href) || href.indexOf("?") !== -1) return;
    a.setAttribute("href", href + "?from=" + encodeURIComponent(item));
  });
}

// Listing pages (tour/experience/destination): filter kategori (client-side, semua card
// tetap di HTML buat SEO). Card di-filter lewat data-zone; "all" = tampilin semua.
// Halaman detail: section "You might also like" (4 kartu terkait) sebelum footer.
// Terkait = zone sama duluan, sisa slot diisi harga terdekat dari tipe yang sama.
function initRelated() {
  const file = location.pathname.split("/").pop();
  const me = RELATED_ITEMS.find((it) => it.href.split("/").pop() === file);
  if (!me) return; // bukan halaman detail yang kemap
  const mount = document.getElementById("footer-placeholder");
  if (!mount) return;
  const pool = RELATED_ITEMS.filter((it) => it.type === me.type && it !== me);
  const sameZone = pool.filter((it) => it.zone === me.zone);
  const rest = pool
    .filter((it) => it.zone !== me.zone)
    .sort((a, b) => Math.abs(a.p - me.p) - Math.abs(b.p - me.p));
  const picks = sameZone.concat(rest).slice(0, 4);
  if (picks.length < 4) return;
  // halaman attraction hidup di /attractions/ -> link & foto butuh prefix naik satu level
  const pre = location.pathname.indexOf("/attractions/") !== -1 ? "../" : "";
  const all = RELATED_ALL[me.type];
  const cards = picks.map((it) => {
    const price = it.p
      ? '<div class="experience__footer"><div class="experience__price"><span class="price-from">from</span> <span class="price" data-price="' + it.priceName + '">$' + it.p + "</span></div></div>"
      : "";
    return '<a class="experience__card" href="' + pre + it.href + '">' +
      '<div class="experience__image"><img src="' + pre + "assets/images/" + it.img + '" alt="' + it.name + '" loading="lazy" width="600" height="600" /></div>' +
      '<div class="experience__body"><h3 class="experience__name">' + it.name + "</h3>" +
      '<div class="experience__meta"><span>' + it.meta + "</span></div>" + price + "</div></a>";
  }).join("");
  const sec = document.createElement("section");
  sec.className = "related";
  sec.innerHTML =
    '<h2 class="related__title">You might also like</h2>' +
    '<div class="experience__grid experience__grid--home4">' + cards + "</div>" +
    '<p class="related__all"><a href="' + pre + all[0] + '">' + all[1] + " &rsaquo;</a></p>";
  mount.parentNode.insertBefore(sec, mount);
}

// Listing pages: balikin posisi scroll pas user balik (Back) dari halaman detail.
// Restore bawaan browser sering meleset di sini karena partial (navbar/footer)
// di-inject telat — tinggi halaman berubah setelah restore-nya jalan.
function initScrollRestore() {
  if (!document.querySelector(".catsec")) return; // cuma listing pages
  const key = "cue_scroll_" + location.pathname;
  // simpan posisi terakhir tiap ninggalin halaman (klik kartu = navigasi pergi)
  window.addEventListener("pagehide", () => {
    try { sessionStorage.setItem(key, String(window.scrollY)); } catch (e) {}
  });
  // restore CUMA kalau datengnya lewat tombol Back/Forward
  const navEntry = performance.getEntriesByType("navigation")[0];
  if (!navEntry || navEntry.type !== "back_forward") return;
  let y = 0;
  try { y = parseInt(sessionStorage.getItem(key)) || 0; } catch (e) {}
  if (!y) return;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  // layout masih gerak (partial/foto) -> ulang beberapa kali sampe stabil
  const go = () => window.scrollTo(0, y);
  go();
  requestAnimationFrame(go);
  window.addEventListener("load", () => { go(); setTimeout(go, 250); });
}

// Listing pages (tour/activities/destinations): tab kategori = anchor link.
// Bar-nya sticky di bawah navbar, klik = smooth scroll ke section-nya, dan
// tab aktif ngikutin section yang lagi keliatan (scrollspy). Nggak nge-filter.
function initZoneAnchors() {
  const bar = document.querySelector(".lhead");
  const wrap = document.querySelector(".zone-filter");
  if (!bar || !wrap) return;
  const links = Array.from(wrap.querySelectorAll('a.zone-chip[href^="#"]'));
  if (!links.length) return;
  const secs = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if (!secs.length) return;

  // Posisi sticky = tinggi navbar fixed beneran (termasuk tripbar di dalamnya),
  // biar tetep pas walau promo bar lagi off.
  const nav = document.querySelector(".navbar");
  const navH = () => (nav ? nav.offsetHeight : 96);
  const setOffsets = () => {
    bar.style.top = navH() + "px";
    const jump = navH() + bar.offsetHeight + 10;
    secs.forEach((s) => { s.style.scrollMarginTop = jump + "px"; });
  };
  setOffsets();
  window.addEventListener("resize", setOffsets);
  // Tripbar di-inject SETELAH init ini jalan -> ukur ulang pas semuanya kelar
  window.addEventListener("load", setOffsets);
  setTimeout(setOffsets, 400);

  // Klik tab -> smooth scroll ke section (URL hash ikut keupdate tanpa lompat)
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      const sec = document.querySelector(a.getAttribute("href"));
      if (!sec) return;
      e.preventDefault();
      sec.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", a.getAttribute("href"));
    });
  });

  // Scrollspy: tab aktif = section terakhir yang udah lewat garis probe.
  // Posisi section dihitung pakai getBoundingClientRect() (relatif viewport + scrollY),
  // BUKAN s.offsetTop - offsetTop relatif ke offsetParent terdekat yang position-nya
  // non-static (mis. section.experience--alt), bukan ke dokumen, jadi kalau ada
  // ancestor kebetulan positioned, angkanya salah total & chip pertama ke-aktif
  // dari awal walau masih di hero. cur mulai null: kalau probe belum nyampe section
  // pertama, jangan ada chip yang ke-highlight duluan.
  const spy = () => {
    const probe = window.scrollY + navH() + bar.offsetHeight + 40;
    let cur = null;
    secs.forEach((s) => {
      const top = s.getBoundingClientRect().top + window.scrollY;
      if (top <= probe) cur = s;
    });
    links.forEach((a) => a.classList.toggle("is-active", !!cur && a.getAttribute("href") === "#" + cur.id));
  };
  window.addEventListener("scroll", spy, { passive: true });
  spy();
}

// Homepage "Explore" section: tab kategori (Tours/Experiences/Transfers/Charter)
// -> tampilin satu panel, sembunyiin sisanya. Kartu di panel tersembunyi tetap
// ke-wire (booking/harga) karena querySelector-nya global, cuma di-hidden aja.
function initExploreTabs() {
  const sec = document.querySelector("#explore");
  if (!sec) return;
  const tabs = sec.querySelectorAll(".xtab");
  const panels = sec.querySelectorAll(".xpanel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.toggle("is-on", t === tab));
      const key = tab.dataset.xtab;
      panels.forEach((pnl) => { pnl.hidden = pnl.dataset.xpanel !== key; });
    });
  });
}

async function initPage() {
  captureMagicToken();
  applyTourContext(); // override data-item dari ?from SEBELUM loadPartials nyalin ke modal
  await loadPartials();
  initStopContext();
  initNavbar();
  initBookingConfirm();
  initBooking();
  initBookSidebar(); // pindah form booking ke kartu sidebar SEBELUM init lain sentuh .info
  initTourHeroSlider(); // hero jadi slider foto konten (stops) - setelah stops di DOM
  initBookBar(); // bar harga+tombol nempel bawah (mobile) - setelah sidebar kebangun
  initSlider();
  initTourSlider();
  initExploreTabs();
  initZoneAnchors();
  initScrollRestore();
  initRelated();
  initGuideHome();
  initGuidePage();
  initTransferPicker();
  initContact();
  initItinerary();
  initSuggested();
  initModals();
  initModalUX();
  initReviews();
  initAllReviews();
  initTourReviews();
  initReviewCta();
  initReviewTriggers();
  initDrivers();
  initWhatsApp();
  initReveal();
  itnUpdateBadge();
  initItineraryButtons();
  initCharter();
  initAirportTransfer();
  initTourType();
  initInfoPopovers();
  initTripBar();
  initCurrency();
  initGuestPicker();
  initAccountMenu();
  // setelah guest/pickup select terisi nilainya, baru bangun custom dropdown search
  initHeroSearch();
  initHeroPlanSheet(); // HP: form search jadi bottom-sheet lewat tombol "Plan your trip"
  initReferral();
  initAccount();
  initMyTripsCart();
  initAboutGallery();
  initSettings();
  initTrustStat();
  initHighlightLink();
  initTransferUnits();
  initCardTitleOverlay();
  initBookingCustomControls();
  initCustomSelects(); // sisa select/date (navbar/charter/transfer/itinerary) -> custom; PALING akhir
  initGlanceHero();
  initDetailsFaqRow();
}

document.addEventListener("DOMContentLoaded", initPage);
