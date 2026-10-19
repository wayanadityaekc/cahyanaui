#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "out");
if (!fs.existsSync(OUT)) { console.error("out/ missing - run the build first"); process.exit(2); }

function walk(dir, test) {
  const found = [];
  (function w(d) {
    fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
      if (e.name === "_next") return;
      const p = path.join(d, e.name);
      if (e.isDirectory()) w(p);
      else if (test(e.name)) found.push(p);
    });
  })(dir);
  return found;
}

const pages = walk(OUT, (n) => n.endsWith(".html"));
const referenced = new Set();
const RX = [/(?:src|href)="(\/assets\/[^"?#&]+)/g, /url\((?:&#x27;|')?(\/assets\/[^'")#?&]+)/g];
pages.forEach((p) => {
  const s = fs.readFileSync(p, "utf8");
  RX.forEach((rx) => { [...s.matchAll(rx)].forEach((m) => { referenced.add(decodeURIComponent(m[1])); }); });
});

const missing = [];
referenced.forEach((r) => {
  if (!fs.existsSync(path.join(OUT, r.replace(/^\//, "")))) missing.push(r);
});

console.log(`Pages scanned        : ${pages.length}`);
console.log(`Assets referenced    : ${referenced.size}`);
console.log(`Referenced but absent: ${missing.length}`);
if (missing.length) {
  console.error("\nMISSING ASSETS:");
  missing.slice(0, 30).forEach((m) => console.error(`  ${m}`));
  if (missing.length > 30) console.error(`  ... and ${missing.length - 30} more`);
  process.exit(1);
}
const noIcon = pages.filter((p) => !/rel="icon"/.test(fs.readFileSync(p, "utf8")));
console.log(`Pages without a favicon: ${noIcon.length}`);
if (noIcon.length) {
  console.error("\nPAGES MISSING THE FAVICON LINK:");
  noIcon.slice(0, 10).forEach((p) => console.error(`  ${p.replace(`${OUT}/`, "")}`));
  process.exit(1);
}

console.log("\nEvery referenced asset exists.");
