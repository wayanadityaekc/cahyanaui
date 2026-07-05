// Load shared partials first, then wire up whatever exists on this page
document.addEventListener("DOMContentLoaded", initPage);

async function initPage() {
  await loadPartials();
  initNavbar();
  initBooking();
  initSlider();
  initAccordion();
  initContact();
}

// Inject each shared partial into its placeholder, if present on this page
async function loadPartials() {
  const partials = [
    { id: "navbar-placeholder", file: "partials/navbar.html" },
    { id: "booking-placeholder", file: "partials/booking.html" },
    { id: "why-placeholder", file: "partials/why.html" },
    { id: "footer-placeholder", file: "partials/footer.html" }
  ];
  for (const part of partials) {
    const holder = document.getElementById(part.id);
    if (!holder) continue;
    const res = await fetch(part.file);
    holder.innerHTML = await res.text();
  }
}

// Navbar: hamburger toggle plus active-link highlight for the current page
function initNavbar() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", () => navMenu.classList.toggle("active"));

  const current = location.pathname.split("/").pop() || "index.html";
  navMenu.querySelectorAll("a").forEach((link) => {
    if (link.getAttribute("href") === current) link.classList.add("active");
  });
}

// --- Shared booking data ---

const services = {
  tour: ["Ubud Tour", "East Bali Tour", "West Bali Tour", "South Bali Tour", "North Bali Tour"],
  experience: ["ATV", "Rafting", "Swing", "Jeep Sunrise", "Mount Batur Trekking", "Cooking Class"],
  performance: ["Kecak Dance", "Barong Dance"],
  transfer: ["Airport – Ubud", "Denpasar Area – Ubud", "Tanah Lot Area – Ubud", "Canggu Area – Ubud", "Amed Area – Ubud", "Buleleng Area – Ubud", "Candidasa Area – Ubud", "Kintamani Area – Ubud", "Besakih Area – Ubud"]
};

const prices = {
  tour: { "Ubud Tour": { usd: 45, idr: 700000 }, "East Bali Tour": { usd: 55, idr: 850000 }, "West Bali Tour": { usd: 60, idr: 950000 }, "South Bali Tour": { usd: 50, idr: 800000 }, "North Bali Tour": { usd: 65, idr: 1000000 } },
  experience: { "ATV": { usd: 40, idr: 620000 }, "Rafting": { usd: 35, idr: 550000 }, "Swing": { usd: 25, idr: 400000 }, "Jeep Sunrise": { usd: 50, idr: 780000 }, "Mount Batur Trekking": { usd: 55, idr: 850000 }, "Cooking Class": { usd: 35, idr: 550000 } },
  performance: { "Kecak Dance": { usd: 10, idr: 150000 }, "Barong Dance": { usd: 10, idr: 150000 } },
  transfer: { "Airport – Ubud": { usd: 20, idr: 300000 }, "Denpasar Area – Ubud": { usd: 20, idr: 300000 }, "Tanah Lot Area – Ubud": { usd: 30, idr: 450000 }, "Canggu Area – Ubud": { usd: 28, idr: 430000 }, "Amed Area – Ubud": { usd: 45, idr: 700000 }, "Buleleng Area – Ubud": { usd: 50, idr: 780000 }, "Candidasa Area – Ubud": { usd: 38, idr: 580000 }, "Kintamani Area – Ubud": { usd: 30, idr: 450000 }, "Besakih Area – Ubud": { usd: 35, idr: 550000 } }
};

const transport = {
  "ATV": { usd: 3, idr: 50000 }, "Rafting": { usd: 3, idr: 50000 }, "Swing": { usd: 3, idr: 50000 },
  "Jeep Sunrise": { usd: 7, idr: 100000 }, "Mount Batur Trekking": { usd: 7, idr: 100000 },
  "Cooking Class": { usd: 0, idr: 0 }, "Kecak Dance": { usd: 0, idr: 0 }, "Barong Dance": { usd: 0, idr: 0 }
};

const tourDetails = [
  "Price includes car, driver, and petrol",
  "Entrance tickets are not included",
  "Free cold water on board",
  "Flexible stops — no extra charge for stops under 1 hour",
  "Book now, pay after — no upfront payment"
];
const experienceDetails = [
  "Price is per person (entrance ticket)",
  "Free mineral water",
  "Includes transport — driver takes you there, waits, and drives you home",
  "Book now, pay after — no upfront payment"
];

const REFERRAL_CODE = "ridewithcahyana";
const WHATSAPP_NUMBER = "62XXXXXXXXXX"; // replace with your real number: 62 + digits, no + and no leading 0
const SHEET_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_URL"; // replace with your deployed Apps Script web app URL

// Booking form + popup (runs only on pages that include the booking form)
function initBooking() {
  const bookNowBtn = document.getElementById("book-now");
  if (!bookNowBtn) return;

  const guestField = document.getElementById("guest");
  const serviceSelect = document.getElementById("service");
  const serviceItemSelect = document.getElementById("service-item");
  const dateField = document.getElementById("date");
  const priceField = document.getElementById("price");
  const priceNote = document.getElementById("price-note");

  const modal = document.getElementById("booking-modal");
  const modalClose = document.getElementById("modal-close");
  const modalForm = document.getElementById("modal-form");
  const modalSuccess = document.getElementById("modal-success");
  const bookerName = document.getElementById("booker-name");
  const bookerPhone = document.getElementById("booker-phone");
  const bookerEmail = document.getElementById("booker-email");
  const pickupInput = document.getElementById("pickup");
  const pickupLabel = document.getElementById("pickup-label");
  const referralInput = document.getElementById("referral");
  const applyReferralBtn = document.getElementById("apply-referral");
  const referralMsg = document.getElementById("referral-msg");
  const sumGuest = document.getElementById("sum-guest");
  const sumService = document.getElementById("sum-service");
  const sumDate = document.getElementById("sum-date");
  const sumPrice = document.getElementById("sum-price");
  const modalDetails = document.getElementById("modal-details");
  const detailsToggle = document.getElementById("details-toggle");
  const detailsList = document.getElementById("details-list");
  const bookSubmit = document.getElementById("book-submit");
  const discussWa = document.getElementById("discuss-wa");
  const successClose = document.getElementById("success-close");

  let currentPrice = null, finalPrice = null, discountApplied = false;

  function renderPrice(el, usd, idr) {
    el.innerHTML = `<span class="price-usd">USD ${usd}</span><span class="price-idr">/ IDR ${idr.toLocaleString("id-ID")}</span>`;
  }

  function calculatePrice() {
    const category = serviceSelect.value, item = serviceItemSelect.value, guests = parseInt(guestField.value);
    if (!category || !item || !guests) return;
    const base = prices[category][item];
    if (!base) return;

    let usd, idr, note;
    if (category === "tour" || category === "transfer") {
      usd = base.usd; idr = base.idr; note = "Price per car · max 5 pax";
      if (guests > 5) { usd *= 2; idr *= 2; note = "2 cars needed for more than 5 pax"; }
    } else {
      const t = transport[item] || { usd: 0, idr: 0 };
      usd = base.usd * guests + t.usd; idr = base.idr * guests + t.idr;
      note = t.idr > 0 ? `Ticket per person + transport IDR ${t.idr.toLocaleString("id-ID")}` : "Ticket per person · free transport";
    }
    currentPrice = { usd, idr, category };
    renderPrice(priceField, usd, idr);
    priceNote.textContent = note;
  }

  function fillDetails(category) {
    const lines = (category === "tour" || category === "transfer") ? tourDetails : experienceDetails;
    detailsList.innerHTML = "";
    lines.forEach((line) => { const li = document.createElement("li"); li.textContent = line; detailsList.appendChild(li); });
  }

  function pickupIsOptional() { return sumService.textContent === "Kecak Dance"; }

  function validateBooking() {
    if (!bookerName.value.trim()) { alert("Please enter your name."); return false; }
    if (!bookerPhone.value.trim()) { alert("Please enter your phone number."); return false; }
    if (!/^\S+@\S+\.\S+$/.test(bookerEmail.value.trim())) { alert("Please enter a valid email address."); return false; }
    if (!pickupIsOptional() && !pickupInput.value.trim()) { alert("Please enter your pick-up location."); return false; }
    return true;
  }

  function priceText() { return `USD ${finalPrice.usd} / IDR ${finalPrice.idr.toLocaleString("id-ID")}`; }

  function resetModal() { modal.classList.remove("active"); modalForm.style.display = "block"; modalSuccess.style.display = "none"; }

  serviceSelect.addEventListener("change", () => {
    serviceItemSelect.innerHTML = "";
    services[serviceSelect.value].forEach((item) => {
      const option = document.createElement("option");
      option.value = item; option.textContent = item;
      serviceItemSelect.appendChild(option);
    });
    calculatePrice();
  });

  guestField.addEventListener("change", calculatePrice);
  serviceItemSelect.addEventListener("change", calculatePrice);

  bookNowBtn.addEventListener("click", () => {
    if (!guestField.value || !serviceItemSelect.value || !dateField.value) { alert("Please choose guests, a service, and a date first."); return; }
    sumGuest.textContent = guestField.value;
    sumService.textContent = serviceItemSelect.value;
    sumDate.textContent = dateField.value;
    finalPrice = { ...currentPrice }; discountApplied = false;
    referralInput.value = ""; referralMsg.textContent = ""; referralMsg.className = "modal__referral-msg";
    renderPrice(sumPrice, finalPrice.usd, finalPrice.idr);
    pickupInput.value = "";
    pickupLabel.textContent = pickupIsOptional() ? "Pick-up Location (optional)" : "Pick-up Location";
    fillDetails(currentPrice.category);
    modalDetails.classList.remove("active");
    modal.classList.add("active");
  });

  applyReferralBtn.addEventListener("click", () => {
    const code = referralInput.value.trim().toLowerCase();
    if (code !== REFERRAL_CODE) {
      finalPrice = { ...currentPrice }; discountApplied = false; renderPrice(sumPrice, finalPrice.usd, finalPrice.idr);
      referralMsg.textContent = "Invalid referral code."; referralMsg.className = "modal__referral-msg error"; return;
    }
    if (currentPrice.category !== "tour" && currentPrice.category !== "transfer") {
      finalPrice = { ...currentPrice }; discountApplied = false; renderPrice(sumPrice, finalPrice.usd, finalPrice.idr);
      referralMsg.textContent = "Referral only valid for tours & transfers."; referralMsg.className = "modal__referral-msg error"; return;
    }
    finalPrice = { usd: Math.round(currentPrice.usd * 0.9), idr: Math.round(currentPrice.idr * 0.9), category: currentPrice.category };
    discountApplied = true; renderPrice(sumPrice, finalPrice.usd, finalPrice.idr);
    referralMsg.textContent = "Referral applied — 10% off!"; referralMsg.className = "modal__referral-msg success";
  });

  detailsToggle.addEventListener("click", () => modalDetails.classList.toggle("active"));
  modalClose.addEventListener("click", resetModal);
  successClose.addEventListener("click", resetModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) resetModal(); });

  bookSubmit.addEventListener("click", () => {
    if (!validateBooking()) return;
    const data = new URLSearchParams({
      name: bookerName.value, phone: bookerPhone.value, email: bookerEmail.value, pickup: pickupInput.value,
      referral: discountApplied ? referralInput.value : "", guests: sumGuest.textContent,
      service: sumService.textContent, date: sumDate.textContent, price: priceText()
    });
    fetch(SHEET_ENDPOINT, { method: "POST", mode: "no-cors", body: data });
    modalForm.style.display = "none"; modalSuccess.style.display = "block";
  });

  discussWa.addEventListener("click", () => {
    if (!validateBooking()) return;
    const message =
      `Hello, I'd like to book:\n` +
      `Name: ${bookerName.value}\n` + `Phone: ${bookerPhone.value}\n` + `Email: ${bookerEmail.value}\n` +
      `Pick-up: ${pickupInput.value || "-"}\n` + `Referral: ${discountApplied ? referralInput.value : "-"}\n` +
      `Guests: ${sumGuest.textContent}\n` + `Service: ${sumService.textContent}\n` +
      `Date: ${sumDate.textContent}\n` + `Price: ${priceText()}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  });

  // Apply the homepage overlap style, then pre-select the category for this page
  const holder = document.getElementById("booking-placeholder");
  const section = document.getElementById("booking");
  if (holder && holder.dataset.overlap === "true" && section) section.classList.add("booking--overlap");
  const def = (holder && holder.dataset.default) || (section && section.dataset.default) || "";
  if (def) { serviceSelect.value = def; serviceSelect.dispatchEvent(new Event("change")); }
}

// Activities slider (runs only where a slider exists)
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

// Route accordion (runs only where routes exist)
function initAccordion() {
  const routeHeads = document.querySelectorAll(".route__head");
  if (!routeHeads.length) return;
  routeHeads.forEach((head) => head.addEventListener("click", () => head.parentElement.classList.toggle("active")));
}

// Contact form (runs only on the contact page)
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
