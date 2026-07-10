
document.addEventListener("DOMContentLoaded", initPage);

async function initPage() {
  await loadPartials();
  initNavbar();
  initBooking();
  initSlider();
  initAccordion();
  initContact();
  initItinerary();
}

async function loadPartials() {
  const partials = [
    { id: "navbar-placeholder", file: "partials/navbar.html" },
    { id: "booking-placeholder", file: "partials/booking.html" },
    { id: "footer-placeholder", file: "partials/footer.html" }
  ];
  for (const part of partials) {
    const holder = document.getElementById(part.id);
    if (!holder) continue;
    const res = await fetch(part.file);
    holder.innerHTML = await res.text();
  }
}

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
const WHATSAPP_NUMBER = "62XXXXXXXXXX"; 
const SHEET_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_URL"; 

// Format harga jadi HTML (dipakai booking & itinerary)
const priceHTML = (usd, idr) => `<span class="price-usd">USD ${usd}</span><span class="price-idr">/ IDR ${idr.toLocaleString("id-ID")}</span>`;

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
    el.innerHTML = priceHTML(usd, idr);
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
    Object.keys(prices[serviceSelect.value]).forEach((item) => {
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

  const holder = document.getElementById("booking-placeholder");
  const section = document.getElementById("booking");
  if (holder && holder.dataset.overlap === "true" && section) section.classList.add("booking--overlap");
  const def = (holder && holder.dataset.default) || (section && section.dataset.default) || "";
  if (def) { serviceSelect.value = def; serviceSelect.dispatchEvent(new Event("change")); }
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
  const wrap = document.getElementById("itn-days");
  if (!wrap) return;

  const itnSlots = {
    early: ["Jeep Sunrise", "Mount Batur Trekking"],
    day: ["ATV", "Rafting", "Swing", "Barong Dance", "Cooking Class"],
    evening: ["Kecak Dance"]
  };
  const actPrices = { ...prices.experience, ...prices.performance };
  const MAX_DAYS = 7;

  let days = [];

  function newDay(i) {
    return { date: "", guests: "", plan: i % 2 === 0 ? "tour" : "activities", tour: "", kecakAddon: false, acts: [], transfers: [] };
  }

  function carPrice(base, guests) {
    const mult = guests > 5 ? 2 : 1;
    return { usd: base.usd * mult, idr: base.idr * mult };
  }

  function dayPrice(d) {
    let usd = 0, idr = 0;
    const g = parseInt(d.guests) || 0;
    if (!g) return { usd, idr };
    if (d.plan === "tour" && d.tour) {
      const p = carPrice(prices.tour[d.tour], g);
      usd += p.usd; idr += p.idr;
      if (d.kecakAddon) { usd += actPrices["Kecak Dance"].usd * g; idr += actPrices["Kecak Dance"].idr * g; }
    }
    if (d.plan === "activities") {
      d.acts.forEach((a) => {
        const t = transport[a] || { usd: 0, idr: 0 };
        usd += actPrices[a].usd * g + t.usd;
        idr += actPrices[a].idr * g + t.idr;
      });
    }
    d.transfers.forEach((r) => {
      const p = carPrice(prices.transfer[r], g);
      usd += p.usd; idr += p.idr;
    });
    return { usd, idr };
  }

  function dayComplete(d) {
    const g = parseInt(d.guests) || 0;
    if (!d.date || !g) return false;
    if (d.plan === "tour") return !!d.tour;
    return d.acts.length >= 1;
  }

  function slotOf(name) {
    for (const s in itnSlots) if (itnSlots[s].includes(name)) return s;
    return null;
  }

  function render() {
    wrap.innerHTML = "";
    days.forEach((d, i) => wrap.appendChild(renderDay(d, i)));
    renderSummary();
  }

  function renderDay(d, i) {
    const isLast = i === days.length - 1;
    const card = document.createElement("div");
    card.className = "day";
    const done = dayComplete(d);
    const p = dayPrice(d);

    let guestOpts = '<option value="" disabled ' + (d.guests ? "" : "selected") + '>Select guests</option>';
    for (let n = 1; n <= 10; n++) guestOpts += `<option value="${n}" ${d.guests == n ? "selected" : ""}>${n}</option>`;

    let tourOpts = '<option value="" disabled ' + (d.tour ? "" : "selected") + '>Choose a tour</option>';
    Object.keys(prices.tour).forEach((t) => { tourOpts += `<option ${d.tour === t ? "selected" : ""}>${t}</option>`; });

    const usedSlots = d.acts.map(slotOf);
    const chipsHTML = Object.entries(itnSlots).map(([slot, list]) => {
      const chips = list.map((a) => {
        const sel = d.acts.includes(a);
        const blocked = !sel && (d.acts.length >= 2 || usedSlots.includes(slot));
        return `<button class="chip ${sel ? "selected" : ""}" data-act="${a}" ${blocked ? "disabled" : ""}>${a}</button>`;
      }).join("");
      const label = slot === "early" ? "Early Morning" : slot === "day" ? "Daytime" : "Evening";
      return `<div class="slot"><div class="slot__name">${label}</div><div class="chips">${chips}</div></div>`;
    }).join("");

    let trOpts = '<option value="" disabled selected>Add a transfer (optional)</option>';
    Object.keys(prices.transfer).forEach((r) => { trOpts += `<option>${r}</option>`; });

    card.innerHTML = `
      <div class="day__head">
        <h3 class="day__title">Day ${i + 1}</h3>
        <span class="day__status ${done ? "done" : ""}">${done ? "\u2713 Complete" : "Incomplete"}</span>
      </div>
      ${i > 0 && isLast ? '<button class="day__remove" title="Remove this day">\u2715 remove</button>' : ""}

      <div class="field">
        <label>Date</label>
        <input type="date" class="f-date" value="${d.date}" />
      </div>
      <div class="field">
        <label>Guests</label>
        <select class="f-guests">${guestOpts}</select>
      </div>

      <div class="plantabs">
        <button class="plantab ${d.plan === "tour" ? "active" : ""}" data-plan="tour">Tour Program</button>
        <button class="plantab ${d.plan === "activities" ? "active" : ""}" data-plan="activities">Activities &amp; Performances</button>
      </div>

      ${d.plan === "tour" ? `
        <div class="field">
          <label>Select Tour</label>
          <select class="f-tour">${tourOpts}</select>
        </div>
        <div class="addon">
          <input type="checkbox" id="itn-kecak-${i}" class="f-kecak" ${d.kecakAddon ? "checked" : ""} />
          <label for="itn-kecak-${i}">Add Kecak Dance in the evening <small>+ USD 10 / IDR 150.000 per person</small></label>
        </div>
      ` : `
        ${chipsHTML}
        <p class="hint">Pick up to 2 activities \u2014 each must be in a different time slot.</p>
      `}

      <div class="field" style="margin-top:1.1rem;">
        <label>Route Transfer</label>
        <div class="transferadd">
          <select class="f-transfer">${trOpts}</select>
          <button class="f-transfer-add">Add</button>
        </div>
      </div>

      <div class="day__price">
        <span>Day ${i + 1} price</span>
        <span class="amount">${priceHTML(p.usd, p.idr)}</span>
      </div>
    `;

    card.querySelector(".f-date").addEventListener("change", (e) => { d.date = e.target.value; render(); });
    card.querySelector(".f-guests").addEventListener("change", (e) => { d.guests = e.target.value; render(); });
    card.querySelectorAll(".plantab").forEach((b) => b.addEventListener("click", () => {
      d.plan = b.dataset.plan;
      d.tour = ""; d.kecakAddon = false; d.acts = [];
      render();
    }));
    const tourSel = card.querySelector(".f-tour");
    if (tourSel) tourSel.addEventListener("change", (e) => { d.tour = e.target.value; render(); });
    const kecak = card.querySelector(".f-kecak");
    if (kecak) kecak.addEventListener("change", (e) => { d.kecakAddon = e.target.checked; render(); });
    card.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => {
      const a = c.dataset.act;
      if (d.acts.includes(a)) d.acts = d.acts.filter((x) => x !== a);
      else d.acts.push(a);
      render();
    }));
    card.querySelector(".f-transfer-add").addEventListener("click", () => {
      const sel = card.querySelector(".f-transfer");
      if (!sel.value) return;
      d.transfers.push(sel.value);
      render();
    });
    const rm = card.querySelector(".day__remove");
    if (rm) rm.addEventListener("click", () => { days.pop(); render(); });

    return card;
  }

  function renderSummary() {
    const n = days.length;
    const allDone = days.every(dayComplete);
    const lastDone = dayComplete(days[n - 1]);

    const tl = document.getElementById("itn-transfers");
    tl.innerHTML = "";
    days.forEach((d, i) => {
      const g = parseInt(d.guests) || 1;
      d.transfers.forEach((r, j) => {
        const p = carPrice(prices.transfer[r], g);
        const li = document.createElement("li");
        li.innerHTML = `<span>Day ${i + 1} \u00b7 ${r}</span><span class="amount">${priceHTML(p.usd, p.idr)}</span><button data-day="${i}" data-idx="${j}">\u2715</button>`;
        li.querySelector("button").addEventListener("click", (e) => {
          days[+e.target.dataset.day].transfers.splice(+e.target.dataset.idx, 1);
          render();
        });
        tl.appendChild(li);
      });
    });

    let usd = 0, idr = 0;
    days.forEach((d) => { const p = dayPrice(d); usd += p.usd; idr += p.idr; });
    document.getElementById("itn-title").textContent = `Itinerary \u2014 ${n} Day${n > 1 ? "s" : ""} Price`;
    document.getElementById("itn-total-label").textContent = `Total (${n} day${n > 1 ? "s" : ""})`;
    document.getElementById("itn-total").innerHTML = priceHTML(usd, idr);

    document.getElementById("itn-book").disabled = !allDone;
    const addBtn = document.getElementById("itn-addday");
    addBtn.disabled = !lastDone || n >= MAX_DAYS;
    addBtn.textContent = n >= MAX_DAYS ? "Maximum 7 days reached" : "+ Add More Day";
  }

  document.getElementById("itn-addday").addEventListener("click", () => {
    if (days.length < MAX_DAYS) { days.push(newDay(days.length)); render(); }
  });

  const modal = document.getElementById("itn-modal");
  const modalForm = document.getElementById("itn-form");
  const modalSuccess = document.getElementById("itn-success");

  function dayLine(d) {
    let items = d.plan === "tour"
      ? d.tour + (d.kecakAddon ? " + Kecak Dance" : "")
      : d.acts.join(" + ");
    if (d.transfers.length) items += " \u00b7 " + d.transfers.join(", ");
    return items;
  }

  document.getElementById("itn-book").addEventListener("click", () => {
    const box = document.getElementById("itn-summary");
    box.innerHTML = "";
    let usd = 0, idr = 0;
    days.forEach((d, i) => {
      const p = dayPrice(d); usd += p.usd; idr += p.idr;
      box.innerHTML += `<div class="modal__row"><span>Day ${i + 1} \u00b7 ${d.date} (${d.guests} pax)</span><span>${dayLine(d)}</span></div>`;
    });
    box.innerHTML += `<div class="modal__row"><span>Total</span><span>${priceHTML(usd, idr)}</span></div>`;
    modal.classList.add("active");
  });

  function resetModal() { modal.classList.remove("active"); modalForm.style.display = "block"; modalSuccess.style.display = "none"; }
  document.getElementById("itn-close").addEventListener("click", resetModal);
  document.getElementById("itn-done").addEventListener("click", resetModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) resetModal(); });

  document.getElementById("itn-submit").addEventListener("click", () => {
    const name = document.getElementById("itn-name"), phone = document.getElementById("itn-phone"),
          email = document.getElementById("itn-email"), pickup = document.getElementById("itn-pickup");
    if (!name.value.trim()) { alert("Please enter your name."); return; }
    if (!phone.value.trim()) { alert("Please enter your phone number."); return; }
    if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) { alert("Please enter a valid email address."); return; }
    if (!pickup.value.trim()) { alert("Please enter your pick-up location."); return; }

    let usd = 0, idr = 0;
    days.forEach((d) => { const p = dayPrice(d); usd += p.usd; idr += p.idr; });
    const detail = days.map((d, i) => `Day ${i + 1} (${d.date}, ${d.guests} pax): ${dayLine(d)}`).join(" | ");

    const data = new URLSearchParams({
      type: "itinerary",
      name: name.value, phone: phone.value, email: email.value, pickup: pickup.value,
      service: detail,
      guests: days.map((d) => d.guests).join(","),
      date: days.map((d) => d.date).join(","),
      price: `USD ${usd} / IDR ${idr.toLocaleString("id-ID")}`
    });
    fetch(SHEET_ENDPOINT, { method: "POST", mode: "no-cors", body: data });

    modalForm.style.display = "none";
    modalSuccess.style.display = "block";
  });

  days.push(newDay(0));
  render();
}