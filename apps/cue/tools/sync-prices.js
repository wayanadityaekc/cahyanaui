#!/usr/bin/env node
/* Sinkronisasi harga - sumber tunggal tetap `prices` di script.js.
   Script ini nulis ulang:
   1. Harga statis di semua <span data-price="Nama"> (fallback buat crawler/AI;
      di browser tetap ditimpa renderPrices() sesuai currency user).
   2. JSON-LD Product (+offers.price USD) di tiap halaman program (PAGE_ITEM),
      ditandai id="schema-product" biar bisa di-update ulang tanpa dobel.

   Jalankan tiap kali harga di script.js berubah:
     node tools/sync-prices.js
   (HTML-only: nggak perlu bump ?v= atau PARTIALS_VERSION.) */

const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(ROOT, "data.js"), "utf8") + fs.readFileSync(path.join(ROOT, "script.js"), "utf8");

// Ambil object literal dari script.js (prices / PAGE_ITEM / ITEM_CARD)
function grab(name) {
  const m = src.match(new RegExp("const " + name + " = (\\{[\\s\\S]*?\\n\\});"));
  if (!m) throw new Error(name + " tidak ketemu di script.js");
  return eval("(" + m[1] + ")");
}
const prices = grab("prices");
const PAGE_ITEM = grab("PAGE_ITEM");
const ITEM_CARD = grab("ITEM_CARD");

// nama -> harga USD, dari semua kategori (tour/combo/experience/performance/villa/transfer)
const usdOf = {};
Object.values(prices).forEach((cat) =>
  Object.entries(cat).forEach(([n, p]) => { usdOf[n] = p.usd; })
);
const unesc = (s) => s.replace(/&amp;/g, "&");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isDirectory())
      return ["partials", "assets", "tools", "node_modules", "out", "docs"].includes(e.name) || e.name.startsWith(".")
        ? []
        : walk(path.join(dir, e.name));
    return e.name.endsWith(".html") ? [path.join(dir, e.name)] : [];
  });
}

let nSpan = 0, nSchema = 0, nFiles = 0;
const unknown = new Set();

walk(ROOT).forEach((F) => {
  let s = fs.readFileSync(F, "utf8");
  const before = s;

  // ---- 1. harga statis di <span data-price> ----
  s = s.replace(
    /(<span[^>]*data-price="([^"]*)"[^>]*>)([^<]*)(<\/span\s*>)/g,
    (m, open, rawName, _content, close) => {
      const name = unesc(rawName);
      if (!(name in usdOf)) { unknown.add(name); return m; }
      nSpan++;
      return open + "$" + usdOf[name] + close;
    }
  );

  // ---- 2. JSON-LD Product di halaman program ----
  const rel = path.relative(ROOT, F).replace(/\\/g, "/");
  const item = PAGE_ITEM[rel];
  if (item && usdOf[item] != null) {
    const descM = s.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/);
    const canonM = s.match(/rel="canonical"[^>]*href="([^"]*)"/);
    const img = ITEM_CARD[item] && ITEM_CARD[item].img
      ? "https://cahyanaubudexperience.com/assets/images/" + ITEM_CARD[item].img
      : "https://cahyanaubudexperience.com/assets/icons/preview.jpg";
    const ld = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": item,
      "description": descM ? descM[1] : "",
      "image": img,
      "brand": { "@type": "Brand", "name": "Cahyana Ubud Experience" },
      "offers": {
        "@type": "Offer",
        "price": String(usdOf[item]),
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": canonM ? canonM[1] : "https://cahyanaubudexperience.com/" + rel
      }
    };
    const tag = '<script type="application/ld+json" id="schema-product">' + JSON.stringify(ld) + "</" + "script>";
    if (s.includes('id="schema-product"')) {
      s = s.replace(/<script type="application\/ld\+json" id="schema-product">[\s\S]*?<\/script>/, tag);
    } else {
      s = s.replace("</head>", "  " + tag + "\n</head>");
    }
    nSchema++;
  }

  if (s !== before) { fs.writeFileSync(F, s); nFiles++; }
});

console.log(`sync-prices: ${nSpan} span harga diisi, ${nSchema} schema Product, ${nFiles} file berubah`);
if (unknown.size)
  console.log("PERHATIAN - data-price tanpa harga di script.js:", [...unknown].join(" | "));
