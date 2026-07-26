/* ==================== 1. CONFIG & DATA ==================== */

// -- site config
// Naikin angka ini tiap kali isi file di folder partials/ diubah,
// biar browser narik versi baru dan bukan yang nyangkut di cache.
const PARTIALS_VERSION = 25;

const WHATSAPP_NUMBER = "61401657862";

const SHEET_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_URL";

const API_ENDPOINT = "https://cahyana-api-production.up.railway.app/api/inquiry";

const REFERRAL_CODE = "gowithcahyana";

// -- pricing data
const prices = {
  tour: { "Ubud Tour": { usd: 45, idr: 700000 }, "East Bali Tour": { usd: 55, idr: 850000 }, "West Bali Tour": { usd: 60, idr: 950000 }, "South Bali Tour": { usd: 50, idr: 800000 }, "North Bali Tour": { usd: 65, idr: 1000000 } },
  experience: { "ATV": { usd: 40, idr: 620000 }, "Rafting": { usd: 35, idr: 550000 }, "Swing": { usd: 25, idr: 400000 }, "Jeep Sunrise": { usd: 50, idr: 780000 }, "Mount Batur Trekking": { usd: 55, idr: 850000 }, "Cooking Class": { usd: 35, idr: 550000 } },
  performance: { "Kecak Dance": { usd: 10, idr: 150000 }, "Barong Dance": { usd: 10, idr: 150000 } },
  transfer: { "Airport – Ubud": { usd: 20, idr: 300000 }, "Denpasar Area – Ubud": { usd: 20, idr: 300000 }, "Tanah Lot Area – Ubud": { usd: 30, idr: 450000 }, "Canggu Area – Ubud": { usd: 28, idr: 430000 }, "Amed Area – Ubud": { usd: 45, idr: 700000 }, "Buleleng Area – Ubud": { usd: 50, idr: 780000 }, "Candidasa Area – Ubud": { usd: 38, idr: 580000 }, "Kintamani Area – Ubud": { usd: 30, idr: 450000 }, "Besakih Area – Ubud": { usd: 35, idr: 550000 } },
  villa: { "Cahyana Tibuah": { usd: 80, idr: 1250000 }, "Cahyana House": { usd: 95, idr: 1480000 } },
  // Program combo (harga & isi placeholder - silakan diubah)
  combo: { "Ubud Culture Day": { usd: 55, idr: 850000 }, "South Coast & Sunset Kecak": { usd: 65, idr: 1000000 }, "Batur Sunrise & Adrenaline": { usd: 85, idr: 1300000 }, "Taste of Ubud": { usd: 50, idr: 780000 } }
};

// Charter mobil (harga PLACEHOLDER - silakan diubah). Half/Full day = harga dasar,
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
  "Cooking Class": { usd: 0, idr: 0 }, "Kecak Dance": { usd: 0, idr: 0 }, "Barong Dance": { usd: 0, idr: 0 }
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
  "attractions/kecak-dance.html": "Kecak Dance",
  "attractions/barong-dance.html": "Barong Dance",
  "ubud-culture-day.html": "Ubud Culture Day",
  "south-coast-sunset-kecak.html": "South Coast & Sunset Kecak",
  "batur-sunrise-adrenaline.html": "Batur Sunrise & Adrenaline",
  "taste-of-ubud.html": "Taste of Ubud"
};

// -- itinerary store key
const ITN_KEY = "cue_itinerary_v1";

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

// Format jadi teks: "USD 45" / "IDR 700.000" / "AUD 69"
function fmtMoney(usd, idr, cur) {
  cur = cur || currentCurrency;
  const v = toCurrency(usd, idr, cur);
  return cur + " " + v.toLocaleString(cur === "IDR" ? "id-ID" : "en-US");
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
  const gf = document.getElementById("guest");
  if (gf && parseInt(gf.value, 10) !== n) {
    gf.value = String(n);
    if (window.__bookingRefresh) window.__bookingRefresh();
  }
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

function itnLoad() {
  try {
    const s = JSON.parse(localStorage.getItem(ITN_KEY));
    if (s && Array.isArray(s.days) && Array.isArray(s.transfers)) return s;
  } catch (e) {}
  return { days: [], transfers: [] };
}

function itnSave(state) {
  localStorage.setItem(ITN_KEY, JSON.stringify(state));
  itnUpdateBadge(state);
}

function itnCount(state) {
  const st = state || itnLoad();
  let n = 0;
  st.days.forEach((d) => (n += d.items.length));
  return n + st.transfers.length;
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
    // Di mobile submenu Program dibuka default biar langsung keliatan
    if (window.matchMedia("(max-width: 992px)").matches) {
      drop.classList.add("open");
      dropToggle.setAttribute("aria-expanded", "true");
    }
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

  function priceText() { return `USD ${ctx.final.usd} / IDR ${ctx.final.idr.toLocaleString("id-ID")}`; }

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
      note = t.idr > 0 ? `Ticket per person + transport IDR ${t.idr.toLocaleString("id-ID")}` : "Ticket per person · free transport";
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
  // ikut nyesuain), lalu hitung ulang harga booking.
  // Opsi "Reset": hapus jumlah orang tersimpan + flag welcome, reload -> popup muncul lagi.
  guestField.addEventListener("change", () => {
    if (guestField.value === "reset") {
      localStorage.removeItem("cue_welcomed");
      localStorage.removeItem("cue_guests");
      location.reload();
      return;
    }
    setGuests(guestField.value);
    calculatePrice();
  });
  serviceItemSelect.addEventListener("change", () => { setBookingMode("standard", false); calculatePrice(); });

  // Kalau user sudah pilih jumlah orang (dari popup / kunjungan sebelumnya),
  // isi field Guests otomatis biar sinkron.
  if (currentGuests) guestField.value = String(currentGuests);

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

function initSlider() {
  const slider = document.getElementById("slider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".slider__slide");
  const dots = slider.querySelectorAll(".slider__dot");
  const prev = document.getElementById("slider-prev");
  const next = document.getElementById("slider-next");
  let current = 0;

  function show(index) {
    slides.forEach((s) => s.classList.remove("active"));
    dots.forEach((d) => d.classList.remove("active"));
    slides[index].classList.add("active");
    dots[index].classList.add("active");
    current = index;
  }

  next.addEventListener("click", () => show((current + 1) % slides.length));
  prev.addEventListener("click", () => show((current - 1 + slides.length) % slides.length));
  dots.forEach((dot, index) => dot.addEventListener("click", () => show(index)));
  setInterval(() => show((current + 1) % slides.length), 5000);
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

  function guestOptions(val) {
    let o = `<option value="" disabled ${val ? "" : "selected"}>Guests</option>`;
    for (let n = 1; n <= 10; n++)
      o += `<option value="${n}" ${val == n ? "selected" : ""}>${n}</option>`;
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
    const itemsHTML = d.items.length
      ? d.items
          .map((name, idx) => {
            // Toggle Standard/Exclusive per item, cuma buat tour/combo yg punya versi Exclusive
            const mode = itemMode(d, idx);
            const typeHTML = tourExclusive[name]
              ? `<div class="itn-item-type" data-idx="${idx}">
                   <button type="button" class="itn-item-type__btn ${mode === "standard" ? "is-active" : ""}" data-mode="standard">Standard</button>
                   <button type="button" class="itn-item-type__btn ${mode === "exclusive" ? "is-active" : ""}" data-mode="exclusive">Exclusive</button>
                 </div>`
              : "";
            return `<li class="itn-day__item">
              <span class="itn-day__item-name">${name}</span>
              ${typeHTML}
              <button class="itn-day__item-rm" type="button" data-rmitem="${idx}" aria-label="Remove ${name}">&times;</button>
            </li>`;
          })
          .join("")
      : `<li class="itn-day__empty">Empty day.</li>`;
    card.innerHTML = `
      <div class="itn-day__head">
        <h4 class="itn-day__title">Day ${i + 1}</h4>
        <span class="itn-day__status ${done ? "done" : ""}">${done ? "Complete" : "Incomplete"}</span>
        <button class="itn-day__remove" type="button" data-rmday="${i}">Remove</button>
      </div>
      <ul class="itn-day__items">${itemsHTML}</ul>
      <div class="itn-day__fields">
        <div class="field"><label>Date</label><input type="date" class="f-date" min="${todayStr()}" value="${d.date}" /></div>
        <div class="field"><label>Guests</label><select class="f-guests">${guestOptions(d.guests)}</select></div>
        <div class="field"><label>Pick-up</label><input type="text" class="f-pickup" placeholder="Hotel / villa / area" value="${d.pickup || ""}" /></div>
        <div class="field"><label>Drop-off</label><input type="text" class="f-dropoff" placeholder="Hotel / villa / area" value="${d.dropoff || ""}" /></div>
      </div>
      <div class="itn-day__price"><span>Day ${i + 1} price</span><span class="amount">${priceHTML(p.usd, p.idr)}</span></div>
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
    // Toggle Standard/Exclusive tiap item
    card.querySelectorAll(".itn-item-type").forEach((box) => {
      const idx = +box.dataset.idx;
      box.querySelectorAll(".itn-item-type__btn").forEach((b) =>
        b.addEventListener("click", () => {
          if (!d.itemModes) d.itemModes = [];
          d.itemModes[idx] = b.dataset.mode;
          save();
          rerender();
        })
      );
    });
    card.querySelector("[data-rmday]").addEventListener("click", () => {
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
      save();
      rerender();
    });
    card.querySelector(".f-guests").addEventListener("change", (e) => {
      d.guests = e.target.value;
      save();
      rerender();
    });
    card.querySelector(".f-pickup").addEventListener("input", (e) => {
      d.pickup = e.target.value;
      save();
    });
    card.querySelector(".f-dropoff").addEventListener("input", (e) => {
      d.dropoff = e.target.value;
      save();
    });
    return card;
  }

  // ---------- render transfer ----------
  function renderTransfers() {
    const box = document.getElementById("itn-transfers-list");
    if (!box) return;
    box.innerHTML = "";
    if (!state.transfers.length) {
      box.innerHTML = `<p class="itn__empty">No transfers yet.</p>`;
      return;
    }
    state.transfers.forEach((tr, i) => box.appendChild(renderTransferCard(tr, i)));
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
        <button class="itn-day__remove" type="button" data-rmtransfer="${i}">Remove</button>
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
    card.querySelector(".f-pickup").addEventListener("input", (e) => {
      tr.pickup = e.target.value;
      save();
    });
    card.querySelector(".f-dropoff").addEventListener("input", (e) => {
      tr.dropoff = e.target.value;
      save();
    });
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
    document.getElementById("itn-total").innerHTML = priceHTML(usd, idr);
    const nDays = state.days.length,
      nTr = state.transfers.length;
    let label = `Total - ${nDays} day${nDays === 1 ? "" : "s"}`;
    if (nTr) label += ` + ${nTr} transfer${nTr === 1 ? "" : "s"}`;
    document.getElementById("itn-total-label").textContent = label;
    const allDone =
      state.days.every(dayComplete) && state.transfers.every(transferComplete);
    document.getElementById("itn-book").disabled = !(nDays || nTr) || !allDone;
  }

  function rerender() {
    renderDays();
    renderTransfers();
    renderSummary();
  }
  window.__itnRerender = rerender; // biar ganti currency bisa re-render itinerary

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

  const clearBtn = document.getElementById("itn-clear");
  if (clearBtn)
    clearBtn.addEventListener("click", () => {
      if (!itnCount(state)) return;
      if (!confirm("Clear the whole itinerary?")) return;
      state = { days: [], transfers: [] };
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
    // rincian per hari + transfer -> dikirim ke backend lewat field `items`
    const items = [
      ...state.days.map(
        (d, i) => `Day ${i + 1} (${d.date}, ${d.guests} pax): ${dayLine(d)}`
      ),
      ...state.transfers.map(
        (tr) => `Transfer (${tr.date}, ${tr.guests} pax): ${transferLine(tr)} [pickup: ${tr.pickup}, dropoff: ${tr.dropoff}]`
      )
    ].join(" | ");
    const nDays = state.days.length, nTr = state.transfers.length;
    const parts = [];
    if (nDays) parts.push(`${nDays} day${nDays > 1 ? "s" : ""}`);
    if (nTr) parts.push(`${nTr} transfer${nTr > 1 ? "s" : ""}`);
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
        state = { days: [], transfers: [] };
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
    ".section__title"
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

  const outside = () => pickup.value && pickup.value !== "Ubud";
  function base(key) {
    if (key === "half") return { usd: CHARTER.half.usd, idr: CHARTER.half.idr };
    if (key === "full") return { usd: CHARTER.full.usd, idr: CHARTER.full.idr };
    const e = parseInt(extraInput.value) || 1;
    return {
      usd: CHARTER.full.usd + e * CHARTER.extHourUsd,
      idr: CHARTER.full.idr + e * CHARTER.extHourIdr
    };
  }
  const withSurcharge = (b) =>
    outside()
      ? { usd: b.usd + CHARTER.surchargeUsd, idr: b.idr + CHARTER.surchargeIdr }
      : b;

  function renderCharter() {
    document.querySelectorAll("[data-ch]").forEach((el) => {
      const p = withSurcharge(base(el.dataset.ch));
      el.textContent = fmtMoney(p.usd, p.idr);
    });
    const totalBox = document.getElementById("ch-total");
    if (st.dur) {
      const p = withSurcharge(base(st.dur));
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
    const p = withSurcharge(base(st.dur));
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

  // Card di homepage & tour.html + card highlight (setelah deskripsi)
  document.querySelectorAll(".experience__card, .highlight__container").forEach((card) => {
    const priceEl = card.querySelector("[data-price]");
    const desc = card.querySelector(".experience__desc, .highlight__desc");
    if (priceEl && desc) build(priceEl.dataset.price, priceEl, desc, "after", "card");
  });

  // Halaman detail: di atas judul "Tour Details"
  document.querySelectorAll(".info__container").forEach((box) => {
    const priceEl = box.querySelector("[data-price]");
    if (priceEl) build(priceEl.dataset.price, priceEl, box, "prepend", "detail");
  });

  // Dipanggil pas jumlah orang ganti -> perbarui catatan "for N pax"
  // (harga-nya sendiri sudah di-refresh lewat renderPrices di setGuests).
  window.__ttypeRefresh = function () { holders.forEach((fn) => fn()); };
}

// Popup selamat datang (muncul sekali, di kunjungan pertama). Minta jumlah orang
// biar harga Exclusive akurat. "Skip" = tutup tanpa set (sistem jalan pakai
// jumlah orang dari booking form). Pilihan tersimpan di localStorage.
function initWelcome() {
  if (localStorage.getItem("cue_welcomed")) return;

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
      '<p class="welcome__text">How many people are traveling? We’ll show you accurate prices for your group — including our <strong>Exclusive</strong> tours where entrance tickets are already bundled in.</p>' +
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

// UX modal global: tutup pakai Escape + lock scroll background pas ada modal kebuka.
// Berlaku ke SEMUA modal (.modal.active), termasuk yang di-inject via JS.
function initModalUX() {
  // Escape -> tutup semua modal yang lagi kebuka.
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".modal.active").forEach((m) => {
      m.classList.remove("active");
      // Welcome popup: tandain udah diliat biar nggak muncul lagi.
      if (m.id === "welcome-modal") localStorage.setItem("cue_welcomed", "1");
    });
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

/* ==================== 5. APP ENTRY ==================== */

async function initPage() {
  await loadPartials();
  initNavbar();
  initBookingConfirm();
  initBooking();
  initSlider();
  initTourSlider();
  initAccordion();
  initContact();
  initItinerary();
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
  initHighlightLink();
  initWelcome();
}

document.addEventListener("DOMContentLoaded", initPage);
