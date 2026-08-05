#!/usr/bin/env node
/* Sinkronisasi schema robot (JSON-LD) - jalankan ulang kapan pun kontennya berubah:
     node tools/sync-schema.js
   Yang di-generate (semua idempotent, ditandai id= biar update di tempat):
   1. FAQPage  (id="schema-faq")        - dari partial FAQ tiap halaman (FAQ di-inject
      catatan: itinerary.html SENGAJA di-skip - partial "FAQ"-nya berisi contoh
      itinerary, bukan tanya-jawab, jadi nggak layak markup FAQPage.
      JS, jadi tanpa ini robot non-JS nggak pernah liat isinya).
   2. TouristAttraction (id="schema-attraction") - halaman tempat wisata di attractions/
      yang bukan halaman program (nggak ada di PAGE_ITEM).
   3. Event (id="schema-event") - Kecak Ubud: Selasa & Minggu 19:00 (konfirmasi Wayan).
   4. Event (id="schema-event") - Kecak Uluwatu: tiap hari pas sunset. startTime sengaja
      nggak diisi (jam pasti belum dikonfirmasi Wayan) - tambahin kalau udah ada.
      Offers juga nggak diisi (harga tiket masih [ISI WAYAN]).
   HTML-only: nggak perlu bump ?v= / PARTIALS_VERSION. */

const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const BASE = "https://cahyanaubudexperience.com/";

const src = fs.readFileSync(path.join(ROOT, "script.js"), "utf8");
const PAGE_ITEM = eval("(" + src.match(/const PAGE_ITEM = (\{[\s\S]*?\n\});/)[1] + ")");

const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const strip = (h) =>
  h.replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&rsquo;|&lsquo;/g, "'").replace(/&middot;/g, "-")
    .replace(/&rarr;/g, "->").replace(/&rsaquo;/g, ">")
    .replace(/\s+/g, " ").trim();
const meta = (s, name) => {
  const m = s.match(new RegExp('<meta[^>]*name="' + name + '"[^>]*content="([^"]*)"'));
  return m ? m[1] : "";
};
const canonical = (s, fallback) => {
  const m = s.match(/rel="canonical"[^>]*href="([^"]*)"/);
  return m ? m[1] : fallback;
};

// Inject/replace <script id=...> sebelum </head>
function put(file, id, obj) {
  let s = read(file);
  const tag = '<script type="application/ld+json" id="' + id + '">' + JSON.stringify(obj) + "</" + "script>";
  const re = new RegExp('<script type="application/ld\\+json" id="' + id + '">[\\s\\S]*?<\\/script>');
  s = re.test(s) ? s.replace(re, tag) : s.replace("</head>", "  " + tag + "\n</head>");
  fs.writeFileSync(path.join(ROOT, file), s);
}

// ---------- 1. FAQPage dari partial FAQ ----------
const FAQ_PAGES = {
  "index.html": "partials/faq-home.html",
  "tour.html": "partials/faq-tour.html",
  "transfer.html": "partials/faq-transfer.html",
  "activities.html": "partials/faq-activities.html",
  "about-us.html": "partials/faq.html"
};
let nFaq = 0;
Object.entries(FAQ_PAGES).forEach(([page, partial]) => {
  const p = read(partial);
  const items = [];
  const re = /<summary class="faq__q">([\s\S]*?)<\/summary>\s*<div class="faq__a">([\s\S]*?)<\/div>/g;
  let m;
  while ((m = re.exec(p))) {
    items.push({
      "@type": "Question",
      "name": strip(m[1]),
      "acceptedAnswer": { "@type": "Answer", "text": strip(m[2]) }
    });
  }
  if (!items.length) { console.log("SKIP (0 FAQ):", partial); return; }
  put(page, "schema-faq", { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": items });
  nFaq++;
});

// ---------- 1b. FAQPage dari FAQ INLINE (halaman tour & charter nulis FAQ
//              langsung di HTML-nya, bukan lewat partial) ----------
let nFaqInline = 0;
fs.readdirSync(ROOT).filter((f) => f.endsWith(".html") && !FAQ_PAGES[f]).forEach((page) => {
  const s = read(page);
  const items = [];
  const re = /<summary class="faq__q">([\s\S]*?)<\/summary>\s*<div class="faq__a">([\s\S]*?)<\/div>/g;
  let m;
  while ((m = re.exec(s))) {
    items.push({
      "@type": "Question",
      "name": strip(m[1]),
      "acceptedAnswer": { "@type": "Answer", "text": strip(m[2]) }
    });
  }
  if (!items.length) return;
  put(page, "schema-faq", { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": items });
  nFaqInline++;
});

// ---------- 2. TouristAttraction (halaman tempat, bukan program) ----------
let nAttr = 0;
fs.readdirSync(path.join(ROOT, "attractions"))
  .filter((f) => f.endsWith(".html") && !PAGE_ITEM["attractions/" + f])
  .forEach((f) => {
    const rel = "attractions/" + f;
    const s = read(rel);
    const h1 = s.match(/<h1 class="subhero__title">([\s\S]*?)<\/h1>/);
    if (!h1) { console.log("SKIP (no h1):", rel); return; }
    const imgM = s.match(/url\((assets\/images\/[^)"']+)\)/);
    put(rel, "schema-attraction", {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": strip(h1[1]),
      "description": meta(s, "description"),
      "url": canonical(s, BASE + rel),
      "image": imgM ? BASE + imgM[1] : BASE + "assets/icons/preview.jpg",
      "address": { "@type": "PostalAddress", "addressRegion": "Bali", "addressCountry": "ID" }
    });
    nAttr++;
  });

// ---------- 3. Event: Kecak Ubud (Selasa & Minggu 19:00) ----------
{
  const rel = "attractions/kecak-dance.html";
  const s = read(rel);
  put(rel, "schema-event", {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Kecak Fire Dance in Ubud",
    "description": meta(s, "description"),
    "image": BASE + "assets/images/kecak.jpg",
    "eventSchedule": {
      "@type": "Schedule",
      "byDay": ["https://schema.org/Tuesday", "https://schema.org/Sunday"],
      "startTime": "19:00",
      "scheduleTimezone": "Asia/Makassar"
    },
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "Ubud, Bali",
      "address": { "@type": "PostalAddress", "addressLocality": "Ubud", "addressRegion": "Bali", "addressCountry": "ID" }
    },
    "offers": {
      "@type": "Offer",
      "price": "10",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": canonical(s, BASE + rel)
    },
    "organizer": { "@type": "Organization", "name": "Cahyana Ubud Experience", "url": BASE }
  });
}

// ---------- 4. Event: Kecak Uluwatu (tiap hari pas sunset, jam pasti belum ada) ----------
{
  const rel = "attractions/uluwatu-kecak.html";
  const s = read(rel);
  put(rel, "schema-event", {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Uluwatu Kecak Fire Dance",
    "description": meta(s, "description"),
    "image": BASE + "assets/images/kecak-fire-dance.webp",
    "eventSchedule": {
      "@type": "Schedule",
      "byDay": [
        "https://schema.org/Monday", "https://schema.org/Tuesday", "https://schema.org/Wednesday",
        "https://schema.org/Thursday", "https://schema.org/Friday", "https://schema.org/Saturday",
        "https://schema.org/Sunday"
      ],
      "scheduleTimezone": "Asia/Makassar"
    },
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "Uluwatu Temple, Bali",
      "address": { "@type": "PostalAddress", "addressLocality": "Uluwatu", "addressRegion": "Bali", "addressCountry": "ID" }
    },
    "organizer": { "@type": "Organization", "name": "Cahyana Ubud Experience", "url": BASE }
  });
}

console.log(`sync-schema: ${nFaq} FAQPage (partial) + ${nFaqInline} FAQPage (inline), ${nAttr} TouristAttraction, 2 Event (Kecak Ubud + Uluwatu)`);
