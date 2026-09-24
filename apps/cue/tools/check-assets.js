#!/usr/bin/env node
// Every asset the built pages reference must exist on disk, and every asset on
// disk should be referenced by something. A missing image is invisible in the
// class diff and only shows up as a broken picture in a browser.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "out");
if (!fs.existsSync(OUT)) { console.error("out/ missing - run the build first"); process.exit(2); }

const walk = (dir, test) => {
  const found = [];
  (function w(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name === "_next") continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) w(p);
      else if (test(e.name)) found.push(p);
    }
  })(dir);
  return found;
};

const pages = walk(OUT, (n) => n.endsWith(".html"));
const referenced = new Set();
// &-stop matters: an inline style writes url(&#x27;/assets/...&#x27;), so the
// entity would otherwise be swallowed into the filename.
const RX = [/(?:src|href)="(\/assets\/[^"?#&]+)/g, /url\((?:&#x27;|')?(\/assets\/[^'")#?&]+)/g];
for (const p of pages) {
  const s = fs.readFileSync(p, "utf8");
  for (const rx of RX) for (const m of s.matchAll(rx)) referenced.add(decodeURIComponent(m[1]));
}

const missing = [];
for (const r of referenced) {
  if (!fs.existsSync(path.join(OUT, r.replace(/^\//, "")))) missing.push(r);
}

console.log(`Pages scanned        : ${pages.length}`);
console.log(`Assets referenced    : ${referenced.size}`);
console.log(`Referenced but absent: ${missing.length}`);
if (missing.length) {
  console.error("\nMISSING ASSETS:");
  missing.slice(0, 30).forEach((m) => console.error("  " + m));
  if (missing.length > 30) console.error(`  ... and ${missing.length - 30} more`);
  process.exit(1);
}
// The export dropped the favicon links once already, which browsers answer by
// requesting /favicon.ico and 404ing - invisible except as a blank tab icon.
const noIcon = pages.filter((p) => !/rel="icon"/.test(fs.readFileSync(p, "utf8")));
console.log(`Pages without a favicon: ${noIcon.length}`);
if (noIcon.length) {
  console.error("\nPAGES MISSING THE FAVICON LINK:");
  noIcon.slice(0, 10).forEach((p) => console.error("  " + p.replace(OUT + "/", "")));
  process.exit(1);
}

console.log("\nEvery referenced asset exists.");
