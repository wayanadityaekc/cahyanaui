/* ==================== 1. CONFIG & DATA ==================== */

// -- site config
// Naikin angka ini tiap kali isi file di folder partials/ diubah,
// biar browser narik versi baru dan bukan yang nyangkut di cache.
const PARTIALS_VERSION = 33;

const WHATSAPP_NUMBER = "61401657862";

const SHEET_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_URL";

const API_ENDPOINT = "https://cahyana-api-production.up.railway.app/api/inquiry";

const REFERRAL_CODE = "gowithcahyana";

// -- pricing data
const prices = {
  tour: { "Ubud Tour": { usd: 45, idr: 700000 }, "East Bali Tour": { usd: 55, idr: 850000 }, "West Bali Tour": { usd: 60, idr: 950000 }, "South Bali Tour": { usd: 50, idr: 800000 }, "North Bali Tour": { usd: 65, idr: 1000000 } },
  experience: { "ATV": { usd: 40, idr: 620000 }, "Rafting": { usd: 35, idr: 550000 }, "Swing": { usd: 25, idr: 400000 }, "Jeep Sunrise": { usd: 50, idr: 780000 }, "Mount Batur Trekking": { usd: 55, idr: 850000 }, "Cooking Class": { usd: 35, idr: 550000 }, "Watersport": { usd: 45, idr: 700000 } },
  performance: { "Kecak Dance": { usd: 10, idr: 150000 }, "Barong Dance": { usd: 10, idr: 150000 } },
  transfer: { "Airport – Ubud": { usd: 20, idr: 300000 }, "Denpasar Area – Ubud": { usd: 20, idr: 300000 }, "Tanah Lot Area – Ubud": { usd: 30, idr: 450000 }, "Canggu Area – Ubud": { usd: 28, idr: 430000 }, "Kuta Area – Ubud": { usd: 25, idr: 400000 }, "Amed Area – Ubud": { usd: 45, idr: 700000 }, "Buleleng Area – Ubud": { usd: 50, idr: 780000 }, "Candidasa Area – Ubud": { usd: 38, idr: 580000 }, "Kintamani Area – Ubud": { usd: 30, idr: 450000 }, "Seminyak Area – Ubud": { usd: 30, idr: 450000 } },
  villa: { "Cahyana Tibuah": { usd: 80, idr: 1250000 }, "Cahyana House": { usd: 95, idr: 1480000 } },
  // Program combo (harga & isi placeholder - silakan diubah)
  combo: { "Ubud Culture Day": { usd: 55, idr: 850000 }, "South Coast & Sunset Kecak": { usd: 65, idr: 1000000 }, "Batur Sunrise & Adrenaline": { usd: 85, idr: 1300000 }, "Taste of Ubud": { usd: 50, idr: 780000 } }
};

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
const tourExclusive = {
  "Ubud Tour": { usd: 20, idr: 300000 },
  "East Bali Tour": { usd: 22, idr: 340000 },
  "West Bali Tour": { usd: 24, idr: 370000 },
  "South Bali Tour": { usd: 20, idr: 300000 },
  "North Bali Tour": { usd: 26, idr: 400000 },
  "Ubud Culture Day": { usd: 18, idr: 280000 },
  "South Coast & Sunset Kecak": { usd: 22, idr: 340000 },
  "Batur Sunrise & Adrenaline": { usd: 40, idr: 620000 },
  "Taste of Ubud": { usd: 15, idr: 230000 }
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

let currentCurrency = localStorage.getItem("cue_currency") || "USD";
if (!CURRENCIES.includes(currentCurrency)) currentCurrency = "USD";

// -- jumlah orang global (dipakai buat harga Exclusive & sinkron booking form)
// 0 = user belum pilih. Kalau belum dipilih, harga Exclusive di card ditampilin
// pakai DISPLAY_GUESTS sebagai perkiraan (+ catatan "for N pax").
const DISPLAY_GUESTS = 2;
let currentGuests = parseInt(localStorage.getItem("cue_guests"), 10) || 0;

// -- page -> itinerary program map
// Peta halaman detail -> nama program di itinerary (biar tombol Add di card
// mana pun tau program apa yang ditambahin, walau teks card beda)
const PAGE_ITEM = {
  "ubud-tour.html": "Ubud Tour",
  "east-bali-tour.html": "East Bali Tour",
  "west-bali-tour.html": "West Bali Tour",
  "south-bali-tour.html": "South Bali Tour",
  "north-bali-tour.html": "North Bali Tour",
  "attractions/atv-ride.html": "ATV",
  "attractions/rafting.html": "Rafting",
  "attractions/jungle-swing.html": "Swing",
  "attractions/jeep-sunrise.html": "Jeep Sunrise",
  "attractions/mount-batur-trekking.html": "Mount Batur Trekking",
  "attractions/cooking-class.html": "Cooking Class",
  "attractions/watersport.html": "Watersport",
  "attractions/kecak-dance.html": "Kecak Dance",
  "attractions/barong-dance.html": "Barong Dance",
  "ubud-culture-day.html": "Ubud Culture Day",
  "south-coast-sunset-kecak.html": "South Coast & Sunset Kecak",
  "batur-sunrise-adrenaline.html": "Batur Sunrise & Adrenaline",
  "taste-of-ubud.html": "Taste of Ubud"
};

// -- Kartu visual per program di builder itinerary: foto (sama kaya homepage) + 1 kalimat desc.
// Key HARUS sama persis dg nama di `prices`. Dipakai renderDayCard buat render .experience__card.
const ITEM_CARD = {
  "Ubud Tour": { img: "riceterrace-tgll.jpg", desc: "Rice terraces, sacred temples, and the monkey forest in one full day." },
  "East Bali Tour": { img: "lempuyang.jpg", desc: "Water palaces, bamboo forests, and the dramatic gates of Lempuyang." },
  "West Bali Tour": { img: "tanah-lot.jpg", desc: "Tanah Lot, Jatiluwih rice terraces, and Bali's temple-dotted west." },
  "South Bali Tour": { img: "uluwatu-temple.jpg", desc: "Cliff temples, white-sand beaches, and golden sunsets on the coast." },
  "North Bali Tour": { img: "tamblingan.jpg", desc: "Waterfalls, twin lakes, and quiet temples across Bali's north." },
  "Ubud Culture Day": { img: "rahwana.jpg", desc: "Temples, rice terraces, a royal palace, and a traditional dance." },
  "South Coast & Sunset Kecak": { img: "uluwatu.jpg", desc: "Cliff temples and southern beaches, ending with the sunset Kecak fire dance." },
  "Batur Sunrise & Adrenaline": { img: "man-batur-sunrise.jpg", desc: "Sunrise at Mount Batur, then a jungle ATV ride — the ultimate adventure." },
  "Taste of Ubud": { img: "cooking-class.jpg", desc: "Morning market, coffee tasting, and a hands-on Balinese cooking class." },
  "ATV": { img: "atv.jpg", desc: "Quad-bike through jungle trails, mud, and tunnels." },
  "Rafting": { img: "rafting.jpg", desc: "White-water rafting down the scenic Ayung River." },
  "Swing": { img: "swing.jpg", desc: "Soar over the jungle on Bali's famous swing." },
  "Jeep Sunrise": { img: "mount-batur-sunrise.webp", desc: "A sunrise 4x4 adventure to the Mount Batur viewpoints." },
  "Mount Batur Trekking": { img: "mount-batur.webp", desc: "A dawn hike to the summit of an active volcano." },
  "Cooking Class": { img: "cooking-class.jpg", desc: "Cook authentic Balinese dishes with a local family." },
  "Watersport": { img: "watersport.jpg", desc: "Jet ski, banana boat, and parasailing off Bali's southern coast." },
  "Kecak Dance": { img: "kecak.jpg", desc: "Bali's hypnotic fire-and-chant ritual, performed at sunset." },
  "Barong Dance": { img: "barong.jpg", desc: "The ancient dance-drama of good versus evil." }
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
  "Ubud Tour", "Ubud Culture Day", "Batur Sunrise & Adrenaline", "East Bali Tour",
  "South Coast & Sunset Kecak", "West Bali Tour", "North Bali Tour"
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
    if (el.dataset.mode === "exclusive") {
      const ex = exclusivePrice(name);
      if (ex) { el.textContent = fmtMoney(ex.usd, ex.idr); return; }
    }
    const info = itemInfo(name);
    const base = info ? info.price : prices.transfer[name];
    if (base) el.textContent = fmtMoney(base.usd, base.idr);
  });
}

// Ganti currency: simpan + render ulang semua harga (static + booking + itinerary)
function setCurrency(cur) {
  if (!CURRENCIES.includes(cur)) return;
  currentCurrency = cur;
  localStorage.setItem("cue_currency", cur);
  renderPrices();
  const svc = document.getElementById("service-item");
  if (svc && svc.value) svc.dispatchEvent(new Event("change"));
  if (window.__itnRerender) window.__itnRerender();
  if (window.__chRefresh) window.__chRefresh();
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
  // sinkron ke guest-select di navbar
  document.querySelectorAll("[data-guest-select]").forEach((s) => {
    if (parseInt(s.value, 10) !== n) s.value = String(n);
  });
  // sinkron ke field Guests di booking form
  const gf = document.getElementById("guest");
  if (gf && parseInt(gf.value, 10) !== n) {
    gf.value = String(n);
    if (window.__bookingRefresh) window.__bookingRefresh();
  }
}

// Reset dari opsi "Reset" di dropdown navbar: hapus jumlah orang + flag popup yang
// tersimpan, balikin semua field ke default, lalu tampilkan popup lagi biar user
// pilih ulang.
function resetGuests() {
  currentGuests = 0;
  localStorage.removeItem("cue_guests");
  localStorage.removeItem("cue_welcomed");
  document.querySelectorAll("[data-guest-select]").forEach((s) => { s.value = String(DISPLAY_GUESTS); });
  const gf = document.getElementById("guest");
  if (gf) gf.value = "";
  renderPrices();
  if (window.__ttypeRefresh) window.__ttypeRefresh();
  if (window.__bookingRefresh) window.__bookingRefresh();
  showWelcome();
}

// -- itinerary store
function carPrice(base, guests) {
  const mult = guests > 5 ? 2 : 1;
  return { usd: base.usd * mult, idr: base.idr * mult };
}

// cari kategori & harga sebuah program dari struktur prices
function itemInfo(name) {
  for (const cat of ["tour", "experience", "performance", "villa", "combo"]) {
    if (prices[cat] && prices[cat][name]) return { cat, price: prices[cat][name] };
  }
  return null;
}

// Harga Exclusive buat N orang = harga standard (per mobil, ×2 kalau >5)
// + suplemen tiket per orang × N. Return null kalau program nggak punya versi Exclusive.
function exclusivePrice(name, guests) {
  const info = itemInfo(name);
  const sup = tourExclusive[name];
  if (!info || !sup) return null;
  const g = guests || currentGuests || DISPLAY_GUESTS;
  const car = carPrice(info.price, g);
  return { usd: car.usd + sup.usd * g, idr: car.idr + sup.idr * g };
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
      '<h3 class="modal__title">Added to your itinerary</h3>' +
      '<p class="modal__sub">What would you like to do next?</p>' +
      '<button class="modal__btn" id="itn-added-go">Go to itinerary</button>' +
      '<button class="modal__btn modal__btn--ghost" id="itn-added-continue">Continue exploring</button>' +
      "</div>";
    document.body.appendChild(m);
    m.addEventListener("click", (e) => {
      if (e.target === m) m.classList.remove("active");
    });
    m.querySelector("#itn-added-go").addEventListener(
      "click",
      () => (window.location.href = "itinerary.html")
    );
    m.querySelector("#itn-added-continue").addEventListener("click", () =>
      m.classList.remove("active")
    );
  }
  m.classList.add("active");
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
    { id: "book-confirm-placeholder", file: "partials/book-confirm.html" },
    { id: "drivers-placeholder", file: "partials/drivers.html" },
    { id: "reviews-placeholder", file: "partials/reviews.html" },
    { id: "faq-placeholder", file: "partials/faq.html" },
    { id: "footer-placeholder", file: "partials/footer.html" }
  ];
  for (const part of partials) {
    const holder = document.getElementById(part.id);
    if (!holder) continue;
    // halaman boleh override file lewat data-src (misal FAQ beda per halaman)
    const file = holder.dataset.src || part.file;
    const res = await fetch(`${file}?v=${PARTIALS_VERSION}`);
    holder.innerHTML = await res.text();
    // book-modal: turunin data-default/data-item halaman ke #booking-placeholder di dalamnya
    if (part.id === "book-modal-placeholder") {
      const inner = holder.querySelector("#booking-placeholder");
      if (inner) {
        if (holder.dataset.default) inner.dataset.default = holder.dataset.default;
        if (holder.dataset.item) inner.dataset.item = holder.dataset.item;
      }
    }
  }
}

/* ==================== 4. INIT (per fitur, dipanggil dari initPage) ==================== */

function initNavbar() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", () => navMenu.classList.toggle("active"));

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
  const modalDetails = el("modal-details"), detailsToggle = el("details-toggle"), detailsList = el("details-list");
  const bookSubmit = el("book-submit"), discussWa = el("discuss-wa");
  const modalClose = el("modal-close"), successClose = el("success-close");

  let ctx = null; // konteks booking yang lagi dikonfirmasi

  const renderInto = (elx, usd, idr) => { elx.innerHTML = priceHTML(usd, idr); };

  // opts: { type, service, guests, date, price:{usd,idr}, pickup, pickupOptional,
  //         dropoffRequired, referralEligible, detailLines, items }
  window.__openBooking = function (o) {
    ctx = { ...o, base: { ...o.price }, final: { ...o.price }, discount: false };
    sumGuest.textContent = o.guests || "-";
    sumService.textContent = o.service;
    sumDate.textContent = o.date || "-";
    renderInto(sumPrice, ctx.final.usd, ctx.final.idr);
    nameI.value = ""; phoneI.value = ""; emailI.value = "";
    pickupI.value = o.pickup || "";
    dropoffI.value = "";
    referralI.value = ""; refMsg.textContent = ""; refMsg.className = "modal__referral-msg";
    pickupLabel.textContent = o.pickupOptional ? "Pick-up Location (optional)" : "Pick-up Location";
    dropoffLabel.textContent = o.dropoffRequired ? "Drop-off Location" : "Drop-off Location (optional)";
    if (o.detailLines && o.detailLines.length) {
      detailsList.innerHTML = "";
      o.detailLines.forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line;
        detailsList.appendChild(li);
      });
      modalDetails.style.display = "";
    } else {
      modalDetails.style.display = "none";
    }
    modalDetails.classList.remove("active");
    modalForm.style.display = "block";
    modalSuccess.style.display = "none";
    modal.classList.add("active");
  };

  applyRef.addEventListener("click", () => {
    if (!ctx) return;
    const code = referralI.value.trim().toLowerCase();
    const noDiscount = (msg) => {
      ctx.final = { ...ctx.base }; ctx.discount = false;
      renderInto(sumPrice, ctx.final.usd, ctx.final.idr);
      refMsg.textContent = msg; refMsg.className = "modal__referral-msg error";
    };
    if (code !== REFERRAL_CODE) return noDiscount("Invalid referral code.");
    if (!ctx.referralEligible) return noDiscount("Referral only valid for tours & transfers.");
    ctx.final = { usd: Math.round(ctx.base.usd * 0.9), idr: Math.round(ctx.base.idr * 0.9) };
    ctx.discount = true;
    renderInto(sumPrice, ctx.final.usd, ctx.final.idr);
    refMsg.textContent = "Referral applied - 10% off!"; refMsg.className = "modal__referral-msg success";
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
    return {
      type: ctx.type,
      name: nameI.value,
      phone: phoneI.value,
      email: emailI.value,
      pickup: pickupI.value,
      dropoff: dropoffI.value,
      referral: ctx.discount ? referralI.value : "",
      guests: String(ctx.guests || ""),
      service: ctx.service,
      date: ctx.date || "",
      price: priceText(),
      items: ctx.items || ""
    };
  }

  bookSubmit.addEventListener("click", () => {
    if (!ctx || !validate()) return;
    fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload())
    });
    if (typeof ctx.onSuccess === "function") ctx.onSuccess();
    modalForm.style.display = "none";
    modalSuccess.style.display = "block";
  });

  discussWa.addEventListener("click", () => {
    if (!ctx || !validate()) return;
    const p = payload();
    const msg =
      `Hello, I'd like to book:\n` +
      `Service: ${p.service}\n` + `Name: ${p.name}\n` + `Phone: ${p.phone}\n` + `Email: ${p.email}\n` +
      `Pick-up: ${p.pickup || "-"}\n` + `Drop-off: ${p.dropoff || "-"}\n` + `Referral: ${p.referral || "-"}\n` +
      `Guests: ${p.guests || "-"}\n` + `Date: ${p.date || "-"}\n` + `Price: ${p.price}` +
      (p.items ? `\nItinerary: ${p.items}` : "");
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

  const guestField = document.getElementById("guest");
  const serviceSelect = document.getElementById("service");
  const serviceItemSelect = document.getElementById("service-item");
  const dateField = document.getElementById("date");
  dateField.min = todayStr(); // blokir tanggal lampau di date picker
  const priceField = document.getElementById("price");
  const priceNote = document.getElementById("price-note");

  let currentPrice = null;
  let bookingMode = "standard"; // Standard / Exclusive (cuma buat tour & combo)

  const bookingType = document.getElementById("booking-type");
  const typeBtns = bookingType ? bookingType.querySelectorAll(".booking__type-btn") : [];

  function setBookingMode(mode, recalc) {
    bookingMode = mode === "exclusive" ? "exclusive" : "standard";
    typeBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.mode === bookingMode));
    if (recalc) calculatePrice();
  }
  window.__setBookingMode = setBookingMode; // dipanggil dari toggle di halaman detail

  function calculatePrice() {
    const category = serviceSelect.value, item = serviceItemSelect.value, guests = parseInt(guestField.value);
    // Toggle Standard/Exclusive selalu tampil (biar tinggi form konsisten), tapi
    // di-nonaktifin (redup) kalau service-nya bukan tour/combo yg punya Exclusive.
    const hasExclusive = category === "tour" && !!tourExclusive[item];
    if (bookingType) {
      bookingType.classList.toggle("is-disabled", !hasExclusive);
      typeBtns.forEach((b) => (b.disabled = !hasExclusive));
    }
    if (!hasExclusive && bookingMode !== "standard") setBookingMode("standard", false);
    if (!category || !item || !guests) return;
    let usd, idr, note;
    if (category === "tour") {
      // tour wilayah ATAU combo - dua-duanya per mobil, bisa Standard / Exclusive
      const info = itemInfo(item);
      if (!info) return;
      if (bookingMode === "exclusive" && tourExclusive[item]) {
        const ex = exclusivePrice(item, guests);
        usd = ex.usd; idr = ex.idr;
        note = "Exclusive · entrance tickets included · " + guests + " pax";
      } else {
        const p = carPrice(info.price, guests);
        usd = p.usd; idr = p.idr;
        note = guests > 5 ? "2 cars needed for more than 5 pax"
          : (hasExclusive ? "Standard · driver only · max 5 pax" : "Price per car · max 5 pax");
      }
    } else if (category === "transfer") {
      const base = prices.transfer[item];
      if (!base) return;
      const p = carPrice(base, guests);
      usd = p.usd; idr = p.idr;
      note = guests > 5 ? "2 cars needed for more than 5 pax" : "Price per car · max 5 pax";
    } else {
      const base = prices[category][item];
      if (!base) return;
      const t = transport[item] || { usd: 0, idr: 0 };
      usd = base.usd * guests + t.usd; idr = base.idr * guests + t.idr;
      note = t.idr > 0 ? `Ticket per person + transport ${CUR_SYMBOL.IDR}${t.idr.toLocaleString("id-ID")}` : "Ticket per person · free transport";
    }
    currentPrice = { usd, idr, category, exclusive: bookingMode === "exclusive" && hasExclusive };
    priceField.innerHTML = priceHTML(usd, idr);
    priceNote.textContent = note;
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
  // Ganti Guests di booking = update jumlah orang global (harga Exclusive di card
  // ikut nyesuain), lalu hitung ulang harga booking. (Reset dilakukan dari navbar.)
  guestField.addEventListener("change", () => {
    setGuests(guestField.value);
    calculatePrice();
  });
  serviceItemSelect.addEventListener("change", () => { setBookingMode("standard", false); calculatePrice(); });

  // Samain nilai awal Guests booking dgn guest-select navbar (default DISPLAY_GUESTS
  // kalau belum pilih) -> dua-duanya selalu match sejak load.
  guestField.value = String(currentGuests || DISPLAY_GUESTS);

  bookNowBtn.addEventListener("click", () => {
    if (!guestField.value || !serviceItemSelect.value || !dateField.value) {
      alert("Please choose guests, a service, and a date first."); return;
    }
    const today = todayStr();
    if (dateField.value < today) { showPastDate(); return; }
    if (dateField.value === today) { showSameDayWa(guestField.value, serviceItemSelect.value, dateField.value); return; }
    if (!currentPrice || !window.__openBooking) return;
    const category = currentPrice.category;
    const item = serviceItemSelect.value;
    const isExcl = currentPrice.exclusive;
    // Tour/combo ditandai (Standard)/(Exclusive) biar jelas di konfirmasi & WhatsApp
    const label = (category === "tour" && tourExclusive[item])
      ? `${item} (${isExcl ? "Exclusive" : "Standard"})`
      : item;
    window.__openBooking({
      type: category,
      service: label,
      guests: guestField.value,
      date: dateField.value,
      price: { usd: currentPrice.usd, idr: currentPrice.idr },
      pickup: "",
      pickupOptional: category === "performance",
      dropoffRequired: category === "transfer",
      referralEligible: category === "tour" || category === "transfer",
      detailLines: (category === "tour" || category === "transfer")
        ? (isExcl ? tourDetailsExclusive : tourDetails)
        : experienceDetails
    });
  });

  // Overlap + preset service/item dari halaman program (data-default / data-item)
  const holder = document.getElementById("booking-placeholder");
  const section = document.getElementById("booking");
  if (holder && holder.dataset.overlap === "true" && section) section.classList.add("booking--overlap");
  const def = (holder && holder.dataset.default) || (section && section.dataset.default) || "";
  if (def) { serviceSelect.value = def; serviceSelect.dispatchEvent(new Event("change")); }
  const presetItem = holder && holder.dataset.item;
  if (presetItem) { serviceItemSelect.value = presetItem; serviceItemSelect.dispatchEvent(new Event("change")); }
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
function initTourSlider() {
  document.querySelectorAll(".experience__grid--slider").forEach((slider) => {
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
function initGuideHome() {
  const menu = document.querySelector(".guide-home__menu");
  if (!menu) return;
  const items = menu.querySelectorAll(".ghmenu__item");
  const panels = document.querySelectorAll(".guide-home__panels .ghpanel");
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const cat = item.dataset.cat;
      items.forEach((x) => {
        const on = x === item;
        x.classList.toggle("active", on);
        x.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach((p) => p.classList.toggle("active", p.dataset.cat === cat));
    });
  });
}

function initAccordion() {
  const routeHeads = document.querySelectorAll(".route__head");
  if (!routeHeads.length) return;
  routeHeads.forEach((head) => head.addEventListener("click", () => head.parentElement.classList.toggle("active")));
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
  function renderDays() {
    daysWrap.innerHTML = "";
    if (!state.days.length) {
      daysWrap.innerHTML = `<p class="itn__empty">No days yet. Tap "Add to your trip", pick a category, choose on the next page - it comes right back here.</p>`;
      return;
    }
    state.days.forEach((d, i) => daysWrap.appendChild(renderDayCard(d, i)));
  }

  function renderDayCard(d, i) {
    const card = document.createElement("div");
    card.className = "itn-day";
    const p = dayPrice(d);
    const done = dayComplete(d);

    // Kartu program = .experience__card homepage (foto + nama + desc) + tombol × hapus.
    // 1 hari = 1 program (dukung >1 buat state lama: dirender grid).
    const cardsHTML = d.items.length
      ? d.items
          .map((name, idx) => {
            const info = ITEM_CARD[name] || {};
            const bg = info.img ? `background-image:url('assets/images/${info.img}')` : "";
            const desc = info.desc || "";
            return `<article class="experience__card itn-prog">
              <div class="experience__image" style="${bg}">
                <button class="itn-prog__rm" type="button" data-rmitem="${idx}" aria-label="Remove ${name}">&times;</button>
              </div>
              <div class="experience__body">
                <h3 class="experience__name">${name}</h3>
                ${desc ? `<p class="experience__desc">${desc}</p>` : ""}
              </div>
            </article>`;
          })
          .join("")
      : `<div class="itn-day__empty">Empty day. <button class="itn-day__emptyrm" type="button" data-rmday="${i}">Remove</button></div>`;

    // Baris Standard/Exclusive per program yang punya versi Exclusive (di area form).
    const typesHTML = d.items
      .map((name, idx) => {
        if (!tourExclusive[name]) return "";
        const mode = itemMode(d, idx);
        const nameLbl = d.items.length > 1 ? `<span class="itn-type__name">${name}</span>` : "";
        return `<div class="itn-type" data-idx="${idx}">
          ${nameLbl}
          <span class="itn-item-type">
            <button type="button" class="itn-item-type__btn ${mode === "standard" ? "is-active" : ""}" data-mode="standard">Standard</button>
            <button type="button" class="itn-item-type__btn ${mode === "exclusive" ? "is-active" : ""}" data-mode="exclusive">Exclusive</button>
          </span>
        </div>`;
      })
      .filter(Boolean).join("");

    // Link "View details" ke halaman program (pojok kiri baris harga)
    const viewsHTML = d.items
      .map((name) => ITEM_URL[name]
        ? `<a class="itn-day__view" href="${ITEM_URL[name]}" target="_blank" rel="noopener">${d.items.length > 1 ? name + " - " : ""}View details &rsaquo;</a>`
        : "")
      .filter(Boolean).join("");

    card.innerHTML = `
      <div class="itn-day__head">
        <h4 class="itn-day__title">Day ${i + 1}</h4>
        <span class="itn-day__status ${done ? "done" : ""}">${done ? "Complete" : "Incomplete"}</span>
      </div>
      <div class="itn-day__cards">${cardsHTML}</div>
      <div class="itn-day__form">
        ${typesHTML ? `<div class="itn-day__types">${typesHTML}</div>` : ""}
        <div class="itn-day__fields">
          <div class="field"><label>Date</label><input type="date" class="f-date" min="${todayStr()}" value="${d.date}" /></div>
          <div class="field"><label>Guests</label><select class="f-guests">${guestOptions(d.guests)}</select></div>
          <div class="field"><label>Pick-up</label><input type="text" class="f-pickup" placeholder="Hotel / villa / area" value="${d.pickup || ""}" /></div>
          <div class="field"><label>Drop-off</label><input type="text" class="f-dropoff" placeholder="Hotel / villa / area" value="${d.dropoff || ""}" /></div>
        </div>
        <div class="itn-day__price"><span class="itn-day__views">${viewsHTML}</span><span class="amount">${priceHTML(p.usd, p.idr)}</span></div>
      </div>
    `;
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
    card.querySelector(".f-date").addEventListener("change", (e) => {
      if (e.target.value && e.target.value < todayStr()) {
        showPastDate();
        e.target.value = d.date || ""; // balikin ke nilai valid sebelumnya
        return;
      }
      d.date = e.target.value;
      cascadeDates(i); // hari pertama diisi -> hari berikutnya auto +1
      save();
      rerender();
    });
    card.querySelector(".f-guests").addEventListener("change", (e) => {
      d.guests = e.target.value;
      propagateGuests(e.target.value); // isi sekali -> nyebar ke hari/transfer/charter kosong
      save();
      rerender();
    });
    card.querySelector(".f-pickup").addEventListener("input", (e) => { d.pickup = e.target.value; save(); });
    card.querySelector(".f-pickup").addEventListener("change", (e) => {
      d.pickup = e.target.value; propagateLocation(e.target.value); save(); rerender();
    });
    card.querySelector(".f-dropoff").addEventListener("input", (e) => { d.dropoff = e.target.value; save(); });
    card.querySelector(".f-dropoff").addEventListener("change", (e) => {
      d.dropoff = e.target.value; propagateLocation(e.target.value); save(); rerender();
    });
    return card;
  }

  // ---------- render transfer ----------
  function renderTransfers() {
    const box = document.getElementById("itn-transfers-list");
    if (!box) return;
    box.innerHTML = "";
    const chs = state.charters || [];
    if (!state.transfers.length && !chs.length) {
      box.innerHTML = `<p class="itn__empty">No transfers or charter yet.</p>`;
      return;
    }
    state.transfers.forEach((tr, i) => box.appendChild(renderTransferCard(tr, i)));
    chs.forEach((ch, i) => box.appendChild(renderCharterCard(ch, i)));
  }

  function renderTransferCard(tr, i) {
    const card = document.createElement("div");
    card.className = "itn-day itn-transfer";
    const p = transferPrice(tr);
    const area = tr.route.replace(" – Ubud", "");
    const toActive = tr.direction !== "from";
    card.innerHTML = `
      <div class="itn-day__head">
        <h4 class="itn-day__title">${toActive ? area + " → Ubud" : "Ubud → " + area}</h4>
        <button class="itn-day__remove" type="button" data-rmtransfer="${i}" aria-label="Remove transfer">&times;</button>
      </div>
      <div class="itn-transfer__dir">
        <button class="dirbtn ${toActive ? "active" : ""}" type="button" data-dir="to">${area} → Ubud</button>
        <button class="dirbtn ${!toActive ? "active" : ""}" type="button" data-dir="from">Ubud → ${area}</button>
      </div>
      <div class="itn-day__fields">
        <div class="field"><label>Date</label><input type="date" class="f-date" min="${todayStr()}" value="${tr.date}" /></div>
        <div class="field"><label>Guests</label><select class="f-guests">${guestOptions(tr.guests)}</select></div>
        <div class="field"><label>Pick-up</label><input type="text" class="f-pickup" placeholder="Hotel / villa / area" value="${tr.pickup || ""}" /></div>
        <div class="field"><label>Drop-off</label><input type="text" class="f-dropoff" placeholder="Hotel / villa / area" value="${tr.dropoff || ""}" /></div>
      </div>
      <div class="itn-day__price"><span>Transfer price</span><span class="amount">${priceHTML(p.usd, p.idr)}</span></div>
    `;
    card.querySelectorAll("[data-dir]").forEach((b) =>
      b.addEventListener("click", () => {
        tr.direction = b.dataset.dir;
        save();
        rerender();
      })
    );
    card.querySelector("[data-rmtransfer]").addEventListener("click", () => {
      state.transfers.splice(i, 1);
      save();
      rerender();
    });
    card.querySelector(".f-date").addEventListener("change", (e) => {
      if (e.target.value && e.target.value < todayStr()) {
        showPastDate();
        e.target.value = tr.date || ""; // balikin ke nilai valid sebelumnya
        return;
      }
      tr.date = e.target.value;
      save();
      rerender();
    });
    card.querySelector(".f-guests").addEventListener("change", (e) => {
      tr.guests = e.target.value;
      save();
      rerender();
    });
    card.querySelector(".f-pickup").addEventListener("input", (e) => { tr.pickup = e.target.value; save(); });
    card.querySelector(".f-pickup").addEventListener("change", (e) => {
      tr.pickup = e.target.value; propagateLocation(e.target.value); save(); rerender();
    });
    card.querySelector(".f-dropoff").addEventListener("input", (e) => { tr.dropoff = e.target.value; save(); });
    card.querySelector(".f-dropoff").addEventListener("change", (e) => {
      tr.dropoff = e.target.value; propagateLocation(e.target.value); save(); rerender();
    });
    return card;
  }

  // Kartu charter (di panel Transfers & Charter). Field kerja inline kayak transfer,
  // tapi charter punya: area pickup (dropdown), durasi (half/full/extended), extra jam.
  function renderCharterCard(ch, i) {
    const card = document.createElement("div");
    card.className = "itn-day itn-transfer itn-charter";
    const p = charterPrice(ch.area, ch.dur, ch.extra);
    card.innerHTML = `
      <div class="itn-day__head">
        <h4 class="itn-day__title">Private Car Charter</h4>
        <button class="itn-day__remove" type="button" data-rmcharter="${i}" aria-label="Remove charter">&times;</button>
      </div>
      <div class="itn-charter__field field">
        <label>Pick-up area</label>
        <select class="f-area">${charterAreaOptions(ch.area)}</select>
      </div>
      <div class="itn-charter__dur">
        <button class="dirbtn ${ch.dur === "half" ? "active" : ""}" type="button" data-dur="half">Half Day</button>
        <button class="dirbtn ${ch.dur === "full" ? "active" : ""}" type="button" data-dur="full">Full Day</button>
        <button class="dirbtn ${ch.dur === "extended" ? "active" : ""}" type="button" data-dur="extended">Extended</button>
      </div>
      ${ch.dur === "extended"
        ? `<div class="itn-charter__field field"><label>Extra hours after 10</label><input type="number" class="f-extra" min="1" max="6" value="${ch.extra || 1}" /></div>`
        : ""}
      <div class="itn-day__fields">
        <div class="field"><label>Date</label><input type="date" class="f-date" min="${todayStr()}" value="${ch.date}" /></div>
        <div class="field"><label>Guests</label><select class="f-guests">${guestOptions(ch.guests)}</select></div>
        <div class="field"><label>Pick-up</label><input type="text" class="f-pickup" placeholder="Hotel / villa" value="${ch.pickup || ""}" /></div>
        <div class="field"><label>Drop-off</label><input type="text" class="f-dropoff" placeholder="Where to (optional)" value="${ch.dropoff || ""}" /></div>
      </div>
      <div class="itn-day__price"><span>Charter price</span><span class="amount">${priceHTML(p.usd, p.idr)}</span></div>
    `;
    card.querySelector("[data-rmcharter]").addEventListener("click", () => {
      state.charters.splice(i, 1);
      save();
      rerender();
    });
    card.querySelector(".f-area").addEventListener("change", (e) => {
      ch.area = e.target.value;
      save();
      rerender();
    });
    card.querySelectorAll("[data-dur]").forEach((b) =>
      b.addEventListener("click", () => {
        ch.dur = b.dataset.dur;
        if (ch.dur === "extended" && !ch.extra) ch.extra = 1;
        save();
        rerender();
      })
    );
    const extraEl = card.querySelector(".f-extra");
    if (extraEl)
      extraEl.addEventListener("input", (e) => {
        ch.extra = parseInt(e.target.value) || 1;
        save();
        rerender();
      });
    card.querySelector(".f-date").addEventListener("change", (e) => {
      if (e.target.value && e.target.value < todayStr()) {
        showPastDate();
        e.target.value = ch.date || "";
        return;
      }
      ch.date = e.target.value;
      save();
      rerender();
    });
    card.querySelector(".f-guests").addEventListener("change", (e) => {
      ch.guests = e.target.value;
      save();
      rerender();
    });
    card.querySelector(".f-pickup").addEventListener("input", (e) => { ch.pickup = e.target.value; save(); });
    card.querySelector(".f-pickup").addEventListener("change", (e) => {
      ch.pickup = e.target.value; propagateLocation(e.target.value); save(); rerender();
    });
    card.querySelector(".f-dropoff").addEventListener("input", (e) => { ch.dropoff = e.target.value; save(); });
    return card;
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
    let label = `Total - ${nDays} day${nDays === 1 ? "" : "s"}`;
    if (nTr) label += ` + ${nTr} transfer${nTr === 1 ? "" : "s"}`;
    if (nCh) label += ` + ${nCh} charter`;
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
  }
  window.__itnRerender = rerender; // biar ganti currency bisa re-render itinerary
  // Ganti seluruh isi itinerary (dipakai "Use this package"). Set state closure +
  // simpan + render, biar builder langsung update tanpa reload halaman.
  window.__itnReplaceState = function (st) {
    state = st;
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
      state.charters.push({ area: "", dur: "", extra: 1, date: "", guests: "", pickup: "", dropoff: "" });
      save();
      rerender();
      if (pickModal) pickModal.classList.remove("active");
    });

  const clearBtn = document.getElementById("itn-clear");
  if (clearBtn)
    clearBtn.addEventListener("click", () => {
      if (!itnCount(state)) return;
      if (!confirm("Clear the whole itinerary?")) return;
      state = { days: [], transfers: [], charters: [] };
      save();
      rerender();
    });

  // ---------- Book -> modal konfirmasi bersama (window.__openBooking) ----------
  function dayLine(d) {
    let s = d.items
      .map((name, idx) => name + (itemMode(d, idx) === "exclusive" ? " (Exclusive)" : ""))
      .join(" + ");
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
    // rincian per hari + transfer + charter -> dikirim ke backend lewat field `items`
    const items = [
      ...state.days.map(
        (d, i) => `Day ${i + 1} (${d.date}, ${d.guests} pax): ${dayLine(d)}`
      ),
      ...state.transfers.map(
        (tr) => `Transfer (${tr.date}, ${tr.guests} pax): ${transferLine(tr)} [pickup: ${tr.pickup}, dropoff: ${tr.dropoff}]`
      ),
      ...chs.map(
        (ch) => `Charter (${ch.date}, ${ch.guests} pax): ${charterDurLabel(ch)} from ${ch.area}${ch.pickup ? ` [pickup: ${ch.pickup}]` : ""}${ch.dropoff ? ` [to: ${ch.dropoff}]` : ""}`
      )
    ].join(" | ");
    const nDays = state.days.length, nTr = state.transfers.length, nCh = chs.length;
    const parts = [];
    if (nDays) parts.push(`${nDays} day${nDays > 1 ? "s" : ""}`);
    if (nTr) parts.push(`${nTr} transfer${nTr > 1 ? "s" : ""}`);
    if (nCh) parts.push(`${nCh} charter`);
    window.__openBooking({
      type: "itinerary",
      service: `Custom Itinerary (${parts.join(" + ")})`,
      guests: "",
      date: "",
      price: { usd, idr },
      pickup: "",
      pickupOptional: true,
      dropoffRequired: false,
      referralEligible: false,
      detailLines: null,
      items: items,
      onSuccess: () => {
        state = { days: [], transfers: [], charters: [] };
        save();
        rerender();
      }
    });
  });

  rerender();
}

// Generic popup handling: [data-open="id"] opens, .modal__close / [data-close] / backdrop closes
function initModals() {
  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
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

// Guest review form (inside the write-review popup)
function initReviews() {
  const sendBtn = document.getElementById("rv-send");
  if (!sendBtn) return;

  const form = document.getElementById("review-form");
  const success = document.getElementById("review-success");
  const nameField = document.getElementById("rv-name");
  const emailField = document.getElementById("rv-email");
  const serviceField = document.getElementById("rv-service");
  const driverField = document.getElementById("rv-driver");
  const messageField = document.getElementById("rv-message");
  const stars = document.querySelectorAll("#rv-rating .rating__star");

  let rating = 0;

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      rating = parseInt(star.dataset.value);
      stars.forEach((s) => s.classList.toggle("active", parseInt(s.dataset.value) <= rating));
    });
  });

  sendBtn.addEventListener("click", () => {
    if (!nameField.value.trim()) { alert("Please enter your name."); return; }
    if (!/^\S+@\S+\.\S+$/.test(emailField.value.trim())) { alert("Please enter a valid email address."); return; }
    if (!serviceField.value) { alert("Please select which service you used."); return; }
    if (!rating) { alert("Please give a star rating."); return; }
    if (!messageField.value.trim()) { alert("Please write your review."); return; }

    const data = new URLSearchParams({
      type: "review",
      name: nameField.value,
      email: emailField.value,
      service: serviceField.value,
      driver: driverField ? driverField.value : "",
      rating: String(rating),
      message: messageField.value
    });
    fetch(SHEET_ENDPOINT, { method: "POST", mode: "no-cors", body: data });

    form.style.display = "none";
    success.style.display = "block";
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
  const mRating = document.getElementById("driver-modal-rating");
  const mDesc = document.getElementById("driver-modal-desc");
  const mReviews = document.getElementById("driver-modal-reviews");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const detail = card.querySelector(".driver-card__detail");
      mName.textContent = card.dataset.name || "";
      mTagline.textContent = card.dataset.tagline || "";
      mRating.innerHTML = card.querySelector(".driver-card__rating").innerHTML;
      mDesc.textContent = detail ? (detail.dataset.desc || "") : "";
      mReviews.innerHTML = detail ? detail.querySelector(".driver-detail__reviews").innerHTML : "";
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
    ".quicknav__card",
    ".section__title",
    ".guide-lead",
    ".guide-article p",
    ".guide-article ul"
  ];
  const els = document.querySelectorAll(selectors.join(","));
  if (!els.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-visible");
        observer.unobserve(el);
        // Buang lagi class reveal setelah animasi kelar, biar hover
        // pakai transisi milik card-nya sendiri (bukan transisi reveal).
        setTimeout(() => {
          el.classList.remove("reveal", "is-visible");
          el.style.transitionDelay = "";
        }, 900);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  // Stagger: elemen sebaris/segrup muncul berurutan, bukan barengan.
  const groupCount = new Map();
  els.forEach((el) => {
    if (el.closest(".modal")) return; // lewati isi popup (biar nggak ke-stuck hidden)
    const parent = el.parentElement;
    const idx = groupCount.get(parent) || 0;
    groupCount.set(parent, idx + 1);
    el.style.transitionDelay = Math.min(idx, 5) * 0.07 + "s";
    el.classList.add("reveal");
    observer.observe(el);
  });
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
  document.querySelectorAll(".experience__card").forEach((card) => {
    const link = card.querySelector("a[href]");
    const href = link ? link.getAttribute("href") : null;
    const hasPage = href && PAGE_ITEM[href];
    // item dari halaman detail (via arrow) ATAU dari data-program (combo tanpa detail)
    const item = hasPage ? PAGE_ITEM[href] : card.dataset.program;
    if (!item) return;

    // (a) kalau punya halaman detail: badan card clickable, arrow dibuang
    if (hasPage) {
      link.remove();
      card.classList.add("card-clickable");
      card.addEventListener("click", (e) => {
        if (e.target.closest(".card-add")) return;
        window.location.href = href;
      });
    }

    // (b) tombol Add to itinerary
    const body = card.querySelector(".experience__body") || card;
    if (!body.querySelector(".card-add")) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "card-add";
      btn.textContent = "+ Add to itinerary";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        tryAddItem(item);
      });
      body.appendChild(btn);
    }
  });

  // Tombol Add to itinerary eksplisit (highlight card, dsb.)
  document.querySelectorAll("[data-add-item]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      tryAddItem(btn.dataset.addItem);
    });
  });
  document.querySelectorAll("[data-add-transfer]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (itnAddTransfer(btn.dataset.addTransfer)) showAddedPopup();
    });
  });

  // transfer.html: tombol "Add to itinerary" di DALAM accordion (bawah harga)
  document.querySelectorAll(".route__item").forEach((item) => {
    const priceBox = item.querySelector(".route__price");
    if (!priceBox || priceBox.querySelector(".route__add")) return;
    const label = item.querySelector(".route__head span");
    if (!label) return;
    const route = label.textContent.trim();
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "route__add";
    btn.textContent = "+ Add to itinerary";
    btn.addEventListener("click", () => {
      if (itnAddTransfer(route)) showAddedPopup();
    });
    priceBox.appendChild(btn);
  });
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
      service: "Charter — " + label,
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

// Wiring selector currency (navbar desktop + mobile) + render harga awal
function initCurrency() {
  const sels = document.querySelectorAll("[data-cur-select]");
  sels.forEach((sel) => {
    sel.value = currentCurrency;
    sel.addEventListener("change", () => {
      setCurrency(sel.value);
      document
        .querySelectorAll("[data-cur-select]")
        .forEach((s) => (s.value = currentCurrency));
    });
  });
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

// Popup selamat datang: muncul sekali di kunjungan pertama (kalau belum "welcomed").
function initWelcome() {
  if (localStorage.getItem("cue_welcomed")) return;
  showWelcome();
}

// Bangun + tampilkan popup selamat datang. Minta jumlah orang biar harga Exclusive
// akurat. "Skip" = tutup tanpa set. Dipakai initWelcome (kunjungan pertama) & tombol
// Reset di navbar. Pilihan tersimpan di localStorage.
function showWelcome() {
  const existing = document.getElementById("welcome-modal");
  if (existing) existing.remove();
  const pre = currentGuests || DISPLAY_GUESTS;
  let opts = "";
  for (let n = 1; n <= 10; n++) opts += '<option value="' + n + '"' + (n === pre ? " selected" : "") + ">" + n + "</option>";

  const modal = document.createElement("div");
  modal.className = "modal welcome-modal";
  modal.id = "welcome-modal";
  modal.innerHTML =
    '<div class="modal__box welcome__box">' +
      '<button class="modal__close" data-close aria-label="Close">&times;</button>' +
      '<img class="modal__logo" src="assets/images/logo.webp" alt="The Cahyana Logo" />' +
      '<h2 class="welcome__title">Welcome to Cahyana Ubud Experience</h2>' +
      '<p class="welcome__text">See exactly what your trip costs. Tell us your group size and every tour, transfer, and activity shows your <strong>real total</strong> — upfront, always.</p>' +
      '<div class="welcome__field">' +
        '<label for="welcome-guests">Number of guests</label>' +
        '<select id="welcome-guests">' + opts + "</select>" +
      "</div>" +
      '<div class="welcome__actions">' +
        '<button type="button" class="modal__btn" id="welcome-confirm">Explore</button>' +
      "</div>" +
    "</div>";
  document.body.appendChild(modal);

  const close = () => { modal.classList.remove("active"); localStorage.setItem("cue_welcomed", "1"); };
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-close]")) close();
  });
  modal.querySelector("#welcome-confirm").addEventListener("click", () => {
    setGuests(modal.querySelector("#welcome-guests").value);
    close();
  });
  requestAnimationFrame(() => modal.classList.add("active"));
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
    const unit = cat === "tour" || cat === "combo" ? "per car"
      : cat === "experience" || cat === "performance" ? "per person" : "";
    if (!unit || priceEl.parentElement.querySelector(".price-unit")) return;
    const u = document.createElement("span");
    u.className = "price-unit";
    u.textContent = unit;
    priceEl.insertAdjacentElement("afterend", u);
  }

  // Card di homepage & tour.html + card highlight (setelah deskripsi):
  // tour -> toggle Standard/Exclusive; experience/performance -> blok gold statis. Semua -> unit harga.
  document.querySelectorAll(".experience__card, .highlight__container").forEach((card) => {
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
    if (!priceEl) return;
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
  const syncScrollLock = () => {
    document.body.style.overflow = document.querySelector(".modal.active")
      ? "hidden"
      : "";
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

/* ==================== 5. APP ENTRY ==================== */

async function initPage() {
  await loadPartials();
  initNavbar();
  initBookingConfirm();
  initBooking();
  initSlider();
  initTourSlider();
  initGuideHome();
  initAccordion();
  initContact();
  initItinerary();
  initSuggested();
  initModals();
  initModalUX();
  initReviews();
  initDrivers();
  initWhatsApp();
  initReveal();
  itnUpdateBadge();
  initItineraryButtons();
  initCharter();
  initTourType();
  initCurrency();
  initGuestPicker();
  initHighlightLink();
  initWelcome();
  initTransferUnits();
}

document.addEventListener("DOMContentLoaded", initPage);
