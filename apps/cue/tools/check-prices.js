#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const API_REPO = path.join(ROOT, '..', 'cahyana-api');
const API = path.join(API_REPO, 'pricing.js');

function checkIsBehindUpstream() {
  function runGit(...args) {
    return execFileSync('git', ['-C', API_REPO, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  }
  try {
    try {
      runGit('fetch', '-q', 'origin', 'main');
    } catch (e) {}
    const commitsBehind = Number(runGit('rev-list', '--count', 'HEAD..origin/main'));
    return Number.isFinite(commitsBehind) && commitsBehind > 0 ? commitsBehind : 0;
  } catch (e) {
    return 0;
  }
}

function collectCards(node, out = []) {
  if (Array.isArray(node)) {
    node.forEach((childNode) => collectCards(childNode, out));
    return out;
  }
  if (!node || typeof node !== 'object') return out;
  if (node.priceName) out.push(node);
  Object.values(node).forEach((childNode) => collectCards(childNode, out));
  return out;
}

function parseNumber(value) {
  return Number(String(value).replace(/[^0-9]/g, ''));
}

function readSchemaProducts() {
  const HEAD = 'export const PAGE_SCHEMA = ';
  const src = fs.readFileSync(path.join(ROOT, 'content/shared/schema.js'), 'utf8');
  const parsed = JSON.parse(src.slice(HEAD.length).replace(/;\s*$/, ''));
  const priceEntries = [];
  Object.entries(parsed).forEach(([page, blocks]) => {
    blocks.forEach((block) => {
      if (block && block.json && block.json['@type'] === 'Product' && block.json.offers)
        priceEntries.push({ page, block: block });
    });
  });
  return priceEntries;
}

async function checkCopies(api) {
  const problems = [];
  let ok = 0;
  function compareValues(where, shown, live) {
    if (shown === live) ok++;
    else problems.push(`${where}: says ${shown}, API says ${live}`);
  }

  const TRANSFER = require('../content/shared/transfer.json');
  TRANSFER.routes.forEach((route) => {
    const live = api[route.priceName];
    if (!live) {
      problems.push(`transfer.js: "${route.priceName}" is not sold by the API`);
      return;
    }
    compareValues(`transfer.js route "${route.name}"`, parseNumber(route.priceFallback), live.usd);
  });

  const band = fs.readFileSync(path.join(ROOT, 'components/sections/home/Airport.jsx'), 'utf8');
  const match = band.match(/name="([^"]+)"\s+fallback="([^"]+)"/);
  if (!match) problems.push('Airport.jsx: could not find the <Price name=... fallback=...> band');
  else if (!api[match[1]]) problems.push(`Airport.jsx: "${match[1]}" is not sold by the API`);
  else compareValues(`Airport.jsx band "${match[1]}"`, parseNumber(match[2]), api[match[1]].usd);

  const transferPrices = Object.entries(api)
    .filter(([name]) => / – Ubud$/.test(name))
    .map(([, route]) => route.usd)
    .filter((price) => price > 0);
  readSchemaProducts().forEach(({ page, block }) => {
    const offers = block.json.offers;
    if (block.priceGroup === 'transfers') {
      if (!transferPrices.length) {
        problems.push('schema.js: no transfer routes found in the API');
        return;
      }
      compareValues(`schema.js ${page} lowPrice`, parseNumber(offers.lowPrice), Math.min(...transferPrices));
      compareValues(`schema.js ${page} highPrice`, parseNumber(offers.highPrice), Math.max(...transferPrices));
      compareValues(`schema.js ${page} offerCount`, Number(offers.offerCount), transferPrices.length);
      return;
    }
    const key = block.priceKey || block.json.name;
    const live = api[key];
    if (!live) return;
    compareValues(`schema.js ${page} "${key}"`, parseNumber(offers.price), live.usd);
  });

  return { ok, problems };
}

async function main() {
  if (!fs.existsSync(API)) {
    console.log('cahyana-api not checked out next to this repo - skipping.');
    console.log(`  looked for: ${API}`);
    return 0;
  }

  const behind = checkIsBehindUpstream();
  if (behind) {
    console.error(`cahyana-api is ${behind} commit(s) behind origin/main - its prices are stale,`);
    console.error('so anything reported below would be wrong. Pull it first:');
    console.error('  git -C ../cahyana-api merge --ff-only origin/main');
    return 2;
  }

  const pricing = require(API);
  const cat = pricing.catalog({ currency: 'USD', guests: 2, stay: '' });
  const api = {};
  cat.items.forEach((item) => {
    api[item.name] = { usd: item.standard.display };
  });
  cat.transfers.forEach((transfer) => {
    api[transfer.route] = { usd: transfer.display };
  });

  const { LISTINGS } = await import('../content/shared/listings.js');

  const driftRows = [];
  const unknownRows = [];
  const missingRows = [];
  let ok = 0;

  Object.entries(LISTINGS).forEach(([listing, data]) => {
    collectCards(data).forEach((card) => {
      const live = api[card.priceName];
      if (!live) {
        unknownRows.push(`${listing}: "${card.priceName}" (${card.href}) is not sold by the API`);
        return;
      }
      if (!card.priceFallback) {
        missingRows.push(
          `${listing}: "${card.priceName}" has no priceFallback, so it shows blank until the catalog loads`,
        );
        return;
      }
      const shown = Number(String(card.priceFallback).replace(/[^0-9]/g, ''));
      if (shown !== live.usd)
        driftRows.push(`${listing}: "${card.priceName}" card says $${shown}, API says $${live.usd}`);
      else ok++;
    });
  });

  const copies = await checkCopies(api);

  console.log(`Cards checked        : ${ok + driftRows.length + unknownRows.length + missingRows.length}`);
  console.log(`Matching the API     : ${ok}`);
  console.log(`Drifted              : ${driftRows.length}`);
  console.log(`No price in the API  : ${unknownRows.length}`);
  console.log(`No fallback on card  : ${missingRows.length}`);
  console.log(`Other copies checked : ${copies.ok + copies.problems.length}`);
  console.log(`Other copies drifted : ${copies.problems.length}`);
  [...driftRows, ...unknownRows, ...missingRows, ...copies.problems].forEach((line) => {
    console.log(`   - ${line}`);
  });

  if (driftRows.length || unknownRows.length || missingRows.length || copies.problems.length) {
    console.log("\nFix: copy the API's usd value into whichever copy drifted - the card's");
    console.log("priceFallback, the band's fallback prop, or the JSON-LD offer in schema.js.");
    return 1;
  }
  console.log('\nEvery price copy matches the API.');
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
