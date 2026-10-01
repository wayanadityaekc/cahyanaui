#!/usr/bin/env node
// GATE (villa version of CUE's check-detail): every villa page keeps the shape that sells the stay.
// Per villa in lib/villas.js: the booking panel, the flush mobile book bar, an h1 with the villa name, a LodgingBusiness JSON-LD with an IDR Offer at the villa's own rate, and a BreadcrumbList that ends on this page.
const fs = require('fs');
const path = require('path');
const { importApp } = require('./app-import');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'out');
const SITE = 'https://ubudprivatevillas.com';
if (!fs.existsSync(OUT)) { console.error('out/ missing - run the build first'); process.exit(2); }

function decode(value) {
  return value.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/<!-- -->/g, '');
}

// Every JSON-LD node on the page, arrays and @graph flattened.
function jsonLdNodes(html, problems) {
  const nodes = [];
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].forEach((match) => {
    try {
      const data = JSON.parse(match[1]);
      [data].flat().forEach((node) => { nodes.push(...(node['@graph'] || [node])); });
    } catch (e) {
      problems.push(`a JSON-LD block does not parse (${e.message})`);
    }
  });
  return nodes;
}

function hasType(node, type) {
  return [node['@type']].flat().includes(type);
}

// The booking panel has no data hook: it is the <aside> that holds this villa's date field and the Book now button.
function bookingPanel(html, slug) {
  return [...html.matchAll(/<aside\b[\s\S]*?<\/aside>/g)].map((match) => match[0])
    .find((aside) => aside.includes(`id="${slug}-dates"`) && aside.includes('Book now'));
}

function checkVilla(villa) {
  const url = `/villas/${villa.slug}/`;
  const file = path.join(OUT, 'villas', villa.slug, 'index.html');
  if (!fs.existsSync(file)) return [`${url} was not built`];
  const html = fs.readFileSync(file, 'utf8');
  const problems = [];

  if (!bookingPanel(html, villa.slug)) problems.push(`no booking panel (an <aside> holding id="${villa.slug}-dates" and "Book now")`);
  if (!html.includes('id="availability"')) problems.push('no Availability section (id="availability") for the big calendar');

  const bars = [...html.matchAll(/<div[^>]*class="([^"]*\bstickybar\b[^"]*)"[^>]*>/g)];
  if (bars.length !== 1) problems.push(`expected exactly 1 .stickybar book bar, found ${bars.length}`);
  else if (!/\binset-x-0\b/.test(bars[0][1]) || !/\bbottom-0\b/.test(bars[0][1])) problems.push('the .stickybar is not the flush variant (inset-x-0 bottom-0)');
  // Before dates are picked the bar says "Pick dates" (it scrolls to the calendar); after, "Book now".
  else if (!/Pick dates|Book now/.test(html.slice(bars[0].index, bars[0].index + 4000))) problems.push('the .stickybar has no booking button (Pick dates / Book now)');

  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((match) => decode(match[1].replace(/<[^>]+>/g, '')).trim());
  if (h1s.length !== 1) problems.push(`expected exactly 1 h1, found ${h1s.length}`);
  else if (!h1s[0].includes(villa.name)) problems.push(`h1 "${h1s[0]}" does not name ${villa.name}`);

  const nodes = jsonLdNodes(html, problems);
  const lodging = nodes.find((node) => hasType(node, 'LodgingBusiness') && node.name === villa.name);
  if (!lodging) problems.push(`no LodgingBusiness JSON-LD named "${villa.name}"`);
  else {
    const offers = [lodging.makesOffer, lodging.offers].flat().filter(Boolean);
    const offer = offers.find((item) => hasType(item, 'Offer') && item.priceCurrency === 'IDR');
    if (!offer) problems.push('LodgingBusiness has no Offer in IDR');
    else if (Number(offer.price) !== villa.nightlyRateIdr) problems.push(`Offer price ${offer.price} is not the nightly rate ${villa.nightlyRateIdr}`);
    if (lodging.url !== `${SITE}${url}`) problems.push(`LodgingBusiness url ${lodging.url} is not ${SITE}${url}`);
  }

  const crumbs = nodes.find((node) => hasType(node, 'BreadcrumbList'));
  const items = crumbs ? crumbs.itemListElement || [] : [];
  if (!crumbs) problems.push('no BreadcrumbList JSON-LD');
  else if (items.length < 2) problems.push(`BreadcrumbList has ${items.length} item(s), expected Home and the villa`);
  else if (items[items.length - 1].item !== `${SITE}${url}`) problems.push(`BreadcrumbList ends on ${items[items.length - 1].item}, not this page`);

  return problems;
}

async function main() {
  try {
    const { VILLA_LIST } = await importApp('lib/villas.js');
    if (!VILLA_LIST || !VILLA_LIST.length) {
      console.error('DETAIL CHECK FAILED - lib/villas.js gave 0 villas, so nothing was checked.');
      process.exit(1);
    }
    // A built villa folder that lib/villas.js no longer knows is a page nobody checks.
    const builtSlugs = fs.existsSync(path.join(OUT, 'villas')) ? fs.readdirSync(path.join(OUT, 'villas')) : [];
    const known = new Set(VILLA_LIST.map((villa) => villa.slug));
    let failing = 0;
    builtSlugs.filter((slug) => !known.has(slug)).forEach((slug) => {
      console.error(`  /villas/${slug}/: built but not in lib/villas.js`);
      failing++;
    });
    VILLA_LIST.forEach((villa) => {
      const problems = checkVilla(villa);
      if (!problems.length) return;
      failing++;
      console.error(`  /villas/${villa.slug}/: ${problems.join('; ')}`);
    });
    console.log(`Villa pages checked  : ${VILLA_LIST.length}`);
    console.log(`Failing              : ${failing}`);
    if (failing) {
      console.error('\nDETAIL CHECK FAILED');
      process.exit(1);
    }
    console.log('\nDetail check passed.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
