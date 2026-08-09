#!/usr/bin/env node
/* Audit kesehatan situs - jalanin: node tools/audit.js
   Mesin ngecek yang KONSISTEN/STRUKTURAL (lu nggak perlu baca), lalu nge-flag yang
   PERLU MATA LU (fakta/keputusan yang mesin nggak bisa nilai).
   Read-only: nggak ngubah file apa pun. */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const ROOT = path.join(__dirname, "..");
const R = (p) => path.join(ROOT, p);

const htmlFiles = [];
for (const dir of ["", "attractions", "guide", "partials"]) {
  fs.readdirSync(R(dir || ".")).filter((f) => f.endsWith(".html")).forEach((f) => htmlFiles.push((dir ? dir + "/" : "") + f));
}
const pageFiles = htmlFiles.filter((f) => !f.startsWith("partials/"));
const read = (f) => fs.readFileSync(R(f), "utf8");
let allSrc = htmlFiles.map(read).join("\n") + read("style.css") + read("script.js") + read("data.js");

const PASS = [], FLAG = [], EYES = [];
const ok = (m) => PASS.push(m);
const bad = (m) => FLAG.push(m);
const eye = (m) => EYES.push(m);

// ---------- STRUKTURAL (mesin) ----------

// 1. node --check + CSS braces
try { execSync("node --check " + R("script.js")); execSync("node --check " + R("data.js")); ok("script.js & data.js: sintaks valid"); }
catch (e) { bad("script.js/data.js: SINTAKS ERROR - " + String(e).slice(0, 80)); }
const css = read("style.css");
const ob = (css.match(/\{/g) || []).length, cb = (css.match(/\}/g) || []).length;
ob === cb ? ok("style.css: kurung { } balanced (" + ob + ")") : bad("style.css: kurung TIMPANG " + ob + " buka / " + cb + " tutup");

// 2. cache version seragam
const vers = {};
pageFiles.forEach((f) => { const m = read(f).match(/style\.css\?v=(\d+)/); if (m) (vers[m[1]] = vers[m[1]] || []).push(f); });
const vkeys = Object.keys(vers);
vkeys.length === 1 ? ok("cache ?v= seragam di semua halaman (v" + vkeys[0] + ")")
  : bad("cache ?v= NGGAK seragam: " + vkeys.map((v) => "v" + v + " (" + vers[v].length + ")").join(", "));

// 3. broken image refs
const refs = [...new Set((allSrc.match(/assets\/images\/[A-Za-z0-9._-]+/g) || []))];
const broken = refs.filter((r) => !fs.existsSync(R(r.split("?")[0])) && !["assets/images/xxx.webp", "assets/images/ubud.webp"].includes(r));
broken.length ? bad("foto broken (dipanggil tapi file hilang): " + broken.map((b) => b.replace("assets/images/", "")).join(", "))
  : ok("referensi foto: 0 broken (" + refs.length + " foto dipakai)");

// 4. card sync (homepage / listing / itinerary)
function cards(file) {
  const s = read(file), out = {};
  s.split(/class="experience__card/).slice(1).forEach((part) => {
    if (/guide-home__card/.test(part.slice(0, 80))) return;
    const chunk = part.slice(0, 1200);
    const img = (chunk.match(/assets\/images\/([A-Za-z0-9._-]+)/) || [])[1];
    const nm = (chunk.match(/experience__name">\s*([\s\S]*?)\s*<\/h3>/) || [])[1];
    if (img && nm) out[nm.replace(/\s+/g, " ").replace(/&amp;/g, "&").trim()] = img;
  });
  return out;
}
const home = cards("index.html"), listing = { ...cards("tour.html"), ...cards("activities.html") };
const item = {};
[...read("script.js").matchAll(/"([^"]+)":\s*\{\s*img:\s*"([^"]*)"/g)].forEach((m) => { if (m[2]) item[m[1].replace(/&amp;/g, "&")] = m[2]; });
const cardMiss = [];
[...new Set([...Object.keys(home), ...Object.keys(listing), ...Object.keys(item)])].forEach((n) => {
  const vals = [home[n], listing[n], item[n]].filter(Boolean);
  if (new Set(vals).size > 1) cardMiss.push(n);
});
cardMiss.length ? bad("card foto NGGAK sync (homepage/listing/itinerary beda): " + cardMiss.join(", "))
  : ok("card foto sync di homepage/listing/itinerary");

// 5. price span coverage - tiap [data-price="X"] harus ada key-nya di `prices`
const priceKeys = [...read("data.js").matchAll(/"([^"]+)":\s*\{\s*usd:/g)].map((m) => m[1]);
// cuma dari HTML (bukan komentar di JS), & decode &amp; -> & biar match key data.js
const htmlSrc = htmlFiles.map(read).join("\n");
const dataPriceNames = [...new Set([...htmlSrc.matchAll(/data-price="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&")))];
const noPrice = dataPriceNames.filter((n) => !priceKeys.includes(n));
noPrice.length ? bad("[data-price] tanpa harga di data.js: " + noPrice.join(", "))
  : ok("semua span harga (" + dataPriceNames.length + ") punya sumber di data.js");

// 6. schema & static price drift (jalanin sync tools, cek ada file berubah nggak, lalu revert)
function driftCheck(tool, label) {
  try {
    execSync("node " + R("tools/" + tool), { stdio: "ignore" });
    const changed = execSync("git -C " + ROOT + " status --porcelain", { encoding: "utf8" })
      .split("\n").filter((l) => l && !l.includes("tools/audit.js")).length;
    if (changed) { bad(label + ": ADA yang belum ke-regenerate (jalanin `node tools/" + tool + "` lalu commit)"); execSync("git -C " + ROOT + " checkout -- . 2>/dev/null || true"); }
    else ok(label + ": up-to-date");
  } catch (e) { bad(label + ": gagal cek (" + String(e).slice(0, 50) + ")"); }
}
// simpan status git dulu (audit read-only) - cuma jalan kalau working tree bersih
const dirty = execSync("git -C " + ROOT + " status --porcelain", { encoding: "utf8" }).split("\n").filter((l) => l && !l.includes("tools/audit.js")).length;
if (dirty) { FLAG.push("(skip cek drift schema/harga: working tree ada perubahan belum di-commit)"); }
else { driftCheck("sync-prices.js", "Harga statis HTML (vs data.js)"); driftCheck("sync-schema.js", "Schema JSON-LD (vs konten)"); }

// 7. meta title/description duplikat antar halaman
const titles = {}, descs = {};
pageFiles.forEach((f) => {
  const s = read(f);
  const t = (s.match(/<title>\s*([\s\S]*?)\s*<\/title>/) || [])[1];
  const d = (s.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/) || [])[1];
  if (t) (titles[t.replace(/\s+/g, " ").trim()] = titles[t.replace(/\s+/g, " ").trim()] || []).push(f);
  if (d) (descs[d] = descs[d] || []).push(f);
});
const dupT = Object.entries(titles).filter(([, v]) => v.length > 1);
const dupD = Object.entries(descs).filter(([, v]) => v.length > 1);
dupT.length ? bad("title DOBEL di " + dupT.length + " grup halaman (mis: " + dupT[0][1].slice(0, 3).join(", ") + ")") : ok("title unik tiap halaman");
dupD.length ? bad("meta description DOBEL di " + dupD.length + " grup halaman") : ok("meta description unik tiap halaman");

// ---------- PERLU MATA LU (fakta / keputusan) ----------
const count = (re) => (allSrc.match(re) || []).length;
const cekWayan = (read("data.js").match(/CEK WAYAN/g) || []).length;
if (cekWayan) eye(cekWayan + "x harga bertanda `CEK WAYAN` di data.js — harga operator hasil riset, LU koreksi angkanya");
const isiWayan = count(/\[ISI WAYAN\]/g);
if (isiWayan) eye(isiWayan + "x placeholder `[ISI WAYAN]` (halaman legal dll) — isi detail aslinya");
const todo = htmlFiles.reduce((s, f) => s + (read(f).match(/TODO: foto/g) || []).length, 0);
if (todo) eye(todo + " slot foto placeholder (`TODO: foto`) masih gradient — nunggu foto asli");
const hashLinks = htmlFiles.reduce((s, f) => s + (read(f).match(/href="#"/g) || []).length, 0);
if (hashLinks) eye(hashLinks + 'x link mati `href="#"` (villa & sosmed) — isi URL aslinya');
const previewOg = pageFiles.filter((f) => /og:image[\s\S]{0,80}?preview\.jpg/.test(read(f))).length;
if (previewOg) eye(previewOg + " halaman og:image masih `preview.jpg` (default) — ganti foto share per halaman kalau mau");
// foto nganggur
const usedNames = new Set(refs.map((r) => r.replace("assets/images/", "")));
const unused = fs.readdirSync(R("assets/images")).filter((f) => /\.(jpe?g|webp|png)$/i.test(f) && !allSrc.includes(f));
if (unused.length) eye(unused.length + " foto nganggur di folder (nggak dipakai): " + unused.slice(0, 6).join(", ") + (unused.length > 6 ? " …" : ""));

// ---------- OUTPUT ----------
const line = "─".repeat(64);
console.log("\n" + line + "\n  AUDIT KESEHATAN SITUS — Cahyana Ubud Experience\n" + line);
console.log("\n✅ AMAN (" + PASS.length + ") — mesin udah cek, lu NGGAK perlu baca:");
PASS.forEach((m) => console.log("   ✓ " + m));
console.log("\n" + (FLAG.length ? "🔴" : "✅") + " PERLU DIBENERIN (" + FLAG.length + ")" + (FLAG.length ? ":" : " — nihil, semua konsisten"));
FLAG.forEach((m) => console.log("   ✗ " + m));
console.log("\n👀 PERLU MATA LU (" + EYES.length + ") — fakta/keputusan, mesin nggak bisa nilai:");
EYES.forEach((m) => console.log("   • " + m));
console.log("\n" + line);
console.log("  Ringkas: " + PASS.length + " aman · " + FLAG.length + " perlu fix · " + EYES.length + " perlu review lu");
console.log(line + "\n");
process.exit(FLAG.length ? 1 : 0);
