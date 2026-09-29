#!/usr/bin/env node
// Every listing card carries a `priceFallback` - the number shown until the live
// catalog answers, and the one the sticky book bar reads through
// priceFallbackFor(). It is a copy of the API's price, so it can drift: change a
// price in cahyana-api and the card keeps quoting the old one for the first
// moment of every page load.
//
// This compares the two and names anything that has drifted. It is NOT a CI gate
// (that runs on out/ alone and has no sibling repo to read); it is the check to
// run by hand after touching prices - both repos are open in the same session
// anyway. Run: node tools/check-prices.js
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const API_REPO = path.join(ROOT, "..", "cahyana-api");
const API = path.join(API_REPO, "pricing.js");

// A stale clone makes this check lie in the most convincing way: it reports
// drift against prices that were fixed hours ago, or calls a destination
// "not sold" because the commit that priced it has not been pulled. That has
// already happened once (a whole category read as unpriced). So say so.
function behindUpstream() {
  function git(...args) { return execFileSync("git", ["-C", API_REPO, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); }
  try {
    try { git("fetch", "-q", "origin", "main"); } catch (e) { /* offline: fall back to the last fetch */ }
    const n = Number(git("rev-list", "--count", "HEAD..origin/main"));
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch (e) {
    return 0; // not a git checkout, or no origin - nothing to compare against
  }
}

function cards(node, out = []) {
  if (Array.isArray(node)) { node.forEach((n) => cards(n, out)); return out; }
  if (!node || typeof node !== "object") return out;
  if (node.priceName) out.push(node);
  Object.values(node).forEach((v) => cards(v, out));
  return out;
}

// ---------------------------------------------------------------------------
// The copies that live OUTSIDE listings.js.
//
// The sweep above only walks LISTINGS, which is how the homepage airport band
// came to be quoting $20 while the API said $18 - nothing was looking at it.
// These are the other places a price is written down by hand:
//   - the six route cards on /transfer          (content/shared/transfer.js)
//   - the homepage/listing airport band         (components/sections/home/Airport.jsx)
//   - the JSON-LD fallbacks on both pages       (content/shared/schema.js)
//
// The JSON-LD ones matter more than they look: JsonLd patches Product prices
// from the live catalog, but only when the build can REACH it. When it cannot,
// the number written in schema.js is what ships to Google.
function num(v) { return Number(String(v).replace(/[^0-9]/g, "")); }

function readSchemaProducts() {
  const HEAD = "export const PAGE_SCHEMA = ";
  const src = fs.readFileSync(path.join(ROOT, "content/shared/schema.js"), "utf8");
  const obj = JSON.parse(src.slice(HEAD.length).replace(/;\s*$/, ""));
  const out = [];
  Object.entries(obj).forEach(([page, blocks]) => {
    blocks.forEach((b) => {
      if (b && b.json && b.json["@type"] === "Product" && b.json.offers) out.push({ page, block: b });
    });
  });
  return out;
}

async function checkCopies(api) {
  const problems = [];
  let ok = 0;
  function cmp(where, shown, live) {
    if (shown === live) ok++;
    else problems.push(`${where}: says ${shown}, API says ${live}`);
  }

  // 1. /transfer route cards.
  // The data lives in transfer.json since 27 Sep 2026; transfer.js is a one-line
  // ESM re-export Node will not load without an import attribute. Read the data.
  const TRANSFER = require("../content/shared/transfer.json");
  TRANSFER.routes.forEach((r) => {
    const live = api[r.priceName];
    if (!live) { problems.push(`transfer.js: "${r.priceName}" is not sold by the API`); return; }
    cmp(`transfer.js route "${r.name}"`, num(r.priceFallback), live.usd);
  });

  // 2. Homepage/listing airport band.
  const band = fs.readFileSync(path.join(ROOT, "components/sections/home/Airport.jsx"), "utf8");
  const m = band.match(/name="([^"]+)"\s+fallback="([^"]+)"/);
  if (!m) problems.push("Airport.jsx: could not find the <Price name=... fallback=...> band");
  else if (!api[m[1]]) problems.push(`Airport.jsx: "${m[1]}" is not sold by the API`);
  else cmp(`Airport.jsx band "${m[1]}"`, num(m[2]), api[m[1]].usd);

  // 3. JSON-LD fallbacks, read generically off the same hints JsonLd uses.
  const transferUsd = Object.entries(api)
    .filter(([name]) => / – Ubud$/.test(name))
    .map(([, v]) => v.usd)
    .filter((n) => n > 0);
  readSchemaProducts().forEach(({ page, block }) => {
    const o = block.json.offers;
    if (block.priceGroup === "transfers") {
      if (!transferUsd.length) { problems.push("schema.js: no transfer routes found in the API"); return; }
      cmp(`schema.js ${page} lowPrice`, num(o.lowPrice), Math.min(...transferUsd));
      cmp(`schema.js ${page} highPrice`, num(o.highPrice), Math.max(...transferUsd));
      cmp(`schema.js ${page} offerCount`, Number(o.offerCount), transferUsd.length);
      return;
    }
    const key = block.priceKey || block.json.name;
    const live = api[key];
    if (!live) return; // tour Products are covered by the LISTINGS sweep above
    cmp(`schema.js ${page} "${key}"`, num(o.price), live.usd);
  });

  return { ok, problems };
}

async function main() {
  if (!fs.existsSync(API)) {
    console.log("cahyana-api not checked out next to this repo - skipping.");
    console.log(`  looked for: ${API}`);
    return 0;
  }

  const behind = behindUpstream();
  if (behind) {
    console.error(`cahyana-api is ${behind} commit(s) behind origin/main - its prices are stale,`);
    console.error("so anything reported below would be wrong. Pull it first:");
    console.error("  git -C ../cahyana-api merge --ff-only origin/main");
    return 2;
  }

  // What a card SHOWS: the USD catalog at the site's display guest count. Since
  // 29 Sep 2026 USD is not a stored number - it is rupiah x the live rate x 1.03,
  // rounded up to the price ladder (cahyana-api/fx.js). With no database the
  // module prices at its baseline rate, so this compares the COPIES against the
  // API's rule at that rate. On the live site the build ships the real catalog
  // (app/layout.jsx), so these copies only ever show if the build could not
  // reach the API.
  const pricing = require(API);
  const cat = pricing.catalog({ currency: "USD", guests: 2, stay: "" });
  const api = {};
  // Every card copies the catalog's own figure at 2 guests - including
  // experiences and performances, whose price is ticket x guests + transport,
  // so their figure is the 2-guest TOTAL and the page labels it "for 2 guests"
  // (29 Sep 2026; they used to say "per person" over this same number).
  cat.items.forEach((i) => { api[i.name] = { usd: i.standard.display }; });
  cat.transfers.forEach((t) => { api[t.route] = { usd: t.display }; });

  const { LISTINGS } = await import("../content/shared/listings.js");

  const drift = [];
  const unknown = [];
  const missing = [];
  let ok = 0;

  Object.entries(LISTINGS).forEach(([listing, data]) => {
    cards(data).forEach((card) => {
      const live = api[card.priceName];
      if (!live) { unknown.push(`${listing}: "${card.priceName}" (${card.href}) is not sold by the API`); return; }
      if (!card.priceFallback) { missing.push(`${listing}: "${card.priceName}" has no priceFallback, so it shows blank until the catalog loads`); return; }
      const shown = Number(String(card.priceFallback).replace(/[^0-9]/g, ""));
      if (shown !== live.usd) drift.push(`${listing}: "${card.priceName}" card says $${shown}, API says $${live.usd}`);
      else ok++;
    });
  });

  const copies = await checkCopies(api);

  console.log(`Cards checked        : ${ok + drift.length + unknown.length + missing.length}`);
  console.log(`Matching the API     : ${ok}`);
  console.log(`Drifted              : ${drift.length}`);
  console.log(`No price in the API  : ${unknown.length}`);
  console.log(`No fallback on card  : ${missing.length}`);
  console.log(`Other copies checked : ${copies.ok + copies.problems.length}`);
  console.log(`Other copies drifted : ${copies.problems.length}`);
  [...drift, ...unknown, ...missing, ...copies.problems].forEach((line) => { console.log(`   - ${line}`); });

  if (drift.length || unknown.length || missing.length || copies.problems.length) {
    console.log("\nFix: copy the API's usd value into whichever copy drifted - the card's");
    console.log("priceFallback, the band's fallback prop, or the JSON-LD offer in schema.js.");
    return 1;
  }
  console.log("\nEvery price copy matches the API.");
  return 0;
}

(async () => {
  let code;
  try {
    code = await main();
  } catch (e) {
    console.error(e);
    process.exit(2);
  }
  process.exit(code);
})();
