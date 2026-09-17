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
const API = path.join(API_REPO, "pricing-data.js");

// A stale clone makes this check lie in the most convincing way: it reports
// drift against prices that were fixed hours ago, or calls a destination
// "not sold" because the commit that priced it has not been pulled. That has
// already happened once (a whole category read as unpriced). So say so.
function behindUpstream() {
  const git = (...args) => execFileSync("git", ["-C", API_REPO, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  try {
    try { git("fetch", "-q", "origin", "main"); } catch { /* offline: fall back to the last fetch */ }
    const n = Number(git("rev-list", "--count", "HEAD..origin/main"));
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0; // not a git checkout, or no origin - nothing to compare against
  }
}

const cards = (node, out = []) => {
  if (Array.isArray(node)) { node.forEach((n) => cards(n, out)); return out; }
  if (!node || typeof node !== "object") return out;
  if (node.priceName) out.push(node);
  Object.values(node).forEach((v) => cards(v, out));
  return out;
};

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

  const { prices } = require(API);
  const api = {};
  for (const cat of Object.keys(prices)) for (const [name, v] of Object.entries(prices[cat])) api[name] = v;

  const { LISTINGS } = await import("../content/shared/listings.js");

  const drift = [];
  const unknown = [];
  const missing = [];
  let ok = 0;

  for (const [listing, data] of Object.entries(LISTINGS)) {
    for (const card of cards(data)) {
      const live = api[card.priceName];
      if (!live) { unknown.push(`${listing}: "${card.priceName}" (${card.href}) is not sold by the API`); continue; }
      if (!card.priceFallback) { missing.push(`${listing}: "${card.priceName}" has no priceFallback, so it shows blank until the catalog loads`); continue; }
      const shown = Number(String(card.priceFallback).replace(/[^0-9]/g, ""));
      if (shown !== live.usd) drift.push(`${listing}: "${card.priceName}" card says $${shown}, API says $${live.usd}`);
      else ok++;
    }
  }

  console.log(`Cards checked        : ${ok + drift.length + unknown.length + missing.length}`);
  console.log(`Matching the API     : ${ok}`);
  console.log(`Drifted              : ${drift.length}`);
  console.log(`No price in the API  : ${unknown.length}`);
  console.log(`No fallback on card  : ${missing.length}`);
  for (const line of [...drift, ...unknown, ...missing]) console.log(`   - ${line}`);

  if (drift.length || unknown.length || missing.length) {
    console.log("\nFix: copy the API's usd value into the card's priceFallback in content/shared/listings.js.");
    return 1;
  }
  console.log("\nEvery card price matches the API.");
  return 0;
}

main().then((code) => process.exit(code), (err) => { console.error(err); process.exit(2); });
