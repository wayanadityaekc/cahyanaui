import { TOUR_CONTENT } from '@/content/tours';
import { LISTINGS } from '@/content/shared/listings';
import { HIDDEN_TOURS, tourPath } from '@/lib/routes';

// Which tours actually stop at a given attraction, derived from each tour's own
// items (refId). The "Included in ..." labels on destination cards used to be
// typed by hand, which drifted twice: nine of them still named a tour we had
// parked, and Tegenungan still claimed the ATV tour it was removed from.
//
// Multi-day packages are left out on purpose. They are detected by their day
// sub-headings, and they stop at so many places that listing them would put the
// same package on 14 cards and drown the tour a guest is actually looking for.
//
// SERVER-SIDE ONLY: pulls in the whole tour dataset, so it must not be imported
// from a client component (ListingPage is one).
const parked = new Set(HIDDEN_TOURS);
const isPackage = (t) => (t.items || []).some((i) => i.type === 'sub');

const INDEX = {};
for (const [slug, t] of Object.entries(TOUR_CONTENT)) {
  if (parked.has(slug) || isPackage(t)) continue;
  for (const it of t.items || []) {
    if (!it.refId) continue;
    (INDEX[it.refId] = INDEX[it.refId] || []).push({ slug, href: tourPath(slug), name: t.bookItem });
  }
}

export function toursForAttraction(slug) {
  return INDEX[slug] || [];
}

// `Included in |A|` / `Included in |A and B|` - ExperienceCard splits on the
// pipes and bolds the middle, so the names go in one run. Returns undefined
// when nothing live stops there, and the card simply drops the line.
export function inclLabel(slug) {
  const names = toursForAttraction(slug).map((t) => t.name);
  if (!names.length) return undefined;
  const list = names.length === 1 ? names[0] : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
  return `Included in |${list}|`;
}

// Fills in every destination card from the destination's own page: the
// "Included in ..." line from the index above, plus the same meta row the tour
// cards carry (Wayan, Sep 2026 - "di listing destination juga isi dong"). A
// destination is sold as a private trip to that one place, so: one stop, the
// time to spend there (its own "Time here" hook), a private driver, and - via
// priceName - the price and the free-cancellation badge ListingRow hangs off it.
// Nothing here is typed by hand twice; it all comes from the attraction.
//
// `attractions` is passed in rather than imported so this stays callable from a
// page without lib/ deciding which content set it gets. Called from the
// destinations page, a server component: ListingPage itself is 'use client', so
// importing this there would ship the whole tour dataset to the browser.
export function withDestinationCards(listing, attractions = {}) {
  const walk = (node) => {
    if (Array.isArray(node)) return node.map(walk);
    if (!node || typeof node !== 'object') return node;
    const next = {};
    for (const [k, v] of Object.entries(node)) next[k] = walk(v);
    const m = /^\/attractions\/(.+)\.html$/.exec(next.href || '');
    if (next.variant === 'incl') {
      const label = m ? inclLabel(m[1]) : undefined;
      if (label) next.inclText = label;
      else delete next.inclText;
    }
    // Keyed off the href, not `variant` - one card (Tegal Wangi) carries no
    // variant flag, and keying off it left that single card with a bare meta
    // row and no price while its 32 siblings had one.
    if (m) {
      const place = attractions[m[1]];
      if (place) {
        const timeHere = ((place.hooks || []).find((h) => /time here/i.test(h.label))
          || (place.facts || []).find((f) => /time here/i.test(f.label))
          || {}).value;
        // The card's own `meta` is the area ("South Bali"), which the time
        // replaces - the area is already how this page groups its sections.
        if (timeHere) {
          next.meta = timeHere;
          next.metaIcon = 'clock';
        }
        next.stops = 1;
        next.priv = true;
        if (place.bookItem) next.priceName = place.bookItem;
      }
    }
    return next;
  };
  return walk(listing);
}

// -- Tour <-> attraction, the other direction ------------------------------
// Which tours a given attraction appears on, for the comparison box and strip
// on an attraction page. Unlike INDEX above this keeps multi-day packages (a
// package is a real way to visit) and carries what the box has to print.
//
// Prices come from the tour's LISTING card, not from its `facts` - the facts
// "Price" row is stale on 13 of 17 tours and six still carry a collapsed
// "$55 Pick-upUbud & nearby" string. The card fallback matches the API on all
// 17, and is the same number the Tours page shows.
const TOUR_CARDS = {};
(function collect(node) {
  if (Array.isArray(node)) return node.forEach(collect);
  if (!node || typeof node !== 'object') return;
  if (typeof node.href === 'string' && node.priceName) TOUR_CARDS[node.href] = node;
  Object.values(node).forEach(collect);
})(LISTINGS.tour);

// Same card prices, keyed by item name and across every listing (tours,
// activities, destinations). <Price> renders nothing until the live catalog
// arrives, which is fine for a card in a grid but leaves the sticky book bar
// with a hole where its price belongs - on a slow connection, and for as long
// as the API is down. Cards have always passed this build-time number for
// exactly that reason; the bar now does too.
const CARD_PRICE = {};
(function collect(node) {
  if (Array.isArray(node)) return node.forEach(collect);
  if (!node || typeof node !== 'object') return;
  if (node.priceName && node.priceFallback) CARD_PRICE[node.priceName] = node.priceFallback;
  Object.values(node).forEach(collect);
})(LISTINGS);

export function priceFallbackFor(name) {
  return CARD_PRICE[name];
}

const CONTAINS = {};
for (const [slug, t] of Object.entries(TOUR_CONTENT)) {
  if (parked.has(slug)) continue;
  const href = tourPath(slug);
  const card = TOUR_CARDS[href];
  const entry = {
    slug,
    href,
    name: t.bookItem,
    title: t.title,
    stops: (t.items || []).filter((i) => i.type === 'stop').length,
    priceName: card ? card.priceName : t.bookItem,
    priceFallback: card ? card.priceFallback : undefined,
    isPackage: isPackage(t),
  };
  for (const it of t.items || []) {
    if (!it.refId) continue;
    (CONTAINS[it.refId] = CONTAINS[it.refId] || []).push(entry);
  }
}

// Day tours before multi-day packages: the package is the upsell, not the
// obvious answer to "how else can I see this place".
export function toursContaining(refId) {
  return (CONTAINS[refId] || []).slice().sort((a, b) => Number(a.isPackage) - Number(b.isPackage));
}

// The stops of one tour, resolved to their attraction pages, for the card grid
// at the bottom of a tour page. Photo and name come from the attraction so the
// card matches the page it opens; nothing is hand-written.
export function tourDestinations(tourSlug, attractions) {
  const t = TOUR_CONTENT[tourSlug];
  if (!t) return [];
  const out = [];
  for (const it of t.items || []) {
    if (!it.refId || out.some((x) => x.refId === it.refId)) continue;
    const a = attractions[it.refId];
    if (!a) continue;
    out.push({
      refId: it.refId,
      href: `/attractions/${it.refId}.html`,
      name: a.title,
      img: it.img || a.heroBg,
      alt: it.alt || a.title,
      // Area for the card's meta row - the attraction's own hook, so it reads
      // the same as it does on the Destinations listing.
      meta: ((a.hooks || []).find((h) => h.label === 'Area') || (a.facts || []).find((f) => f.label === 'Area') || {}).value || '',
    });
  }
  return out;
}
