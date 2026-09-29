import { TOUR_CONTENT } from '@/content/tours';
import { LISTINGS } from '@/content/shared/listings';
import { HIDDEN_TOURS, tourPath } from '@/lib/routes';

// Which live tours stop at each attraction (from refIds); skips parked tours and multi-day packages. Server-only.
const parked = new Set(HIDDEN_TOURS);
function isPackage({ items }) { return (items || []).some((i) => i.type === 'sub'); }

const INDEX = {};
Object.entries(TOUR_CONTENT).forEach(([slug, t]) => {
  if (parked.has(slug) || isPackage(t)) return;
  (t.items || []).forEach((it) => {
    if (!it.refId) return;
    (INDEX[it.refId] = INDEX[it.refId] || []).push({ slug, href: tourPath(slug), name: t.bookItem });
  });
});

export function toursForAttraction(slug) {
  return INDEX[slug] || [];
}

// 'Included in |A and B|' label; ExperienceCard splits on the pipes to bold the names. Undefined when none.
export function inclLabel(slug) {
  const names = toursForAttraction(slug).map((t) => t.name);
  if (!names.length) return undefined;
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  return `Included in |${list}|`;
}

// Fills blank fields on attraction cards from their pages (stops, time, driver); server-only, prices stay on cards.
export function withAttractionCards(listing, attractions = {}) {
  function walk(node) {
    if (Array.isArray(node)) return node.map(walk);
    if (!node || typeof node !== 'object') return node;
    const next = {};
    Object.entries(node).forEach(([k, v]) => { next[k] = walk(v); });
    const m = /^\/attractions\/(.+)\.html$/.exec(next.href || '');
    if (next.variant === 'incl') {
      const label = m ? inclLabel(m[1]) : undefined;
      if (label) next.inclText = label;
      else delete next.inclText;
    }
    // Key off the href, not `variant`, since not every attraction card carries a variant.
    if (m) {
      const place = attractions[m[1]];
      if (place) {
        // Destination cards: time takes the meta slot and the area moves to its own line; experiences keep their meta.
        if (next.metaIcon === 'pin' || !next.meta) {
          if (next.metaIcon === 'pin' && next.meta && !next.area) next.area = next.meta;
          // Destinations label it 'Time here', experiences 'Duration'; match both or a card loses its time.
          const timeHere = ((place.hooks || []).find((h) => /time here|duration/i.test(h.label))
            || (place.facts || []).find((f) => /time here|duration/i.test(f.label))
            || {}).value;
          if (timeHere) {
            next.meta = timeHere;
            next.metaIcon = 'clock';
          }
        }
        if (next.stops == null) next.stops = 1;
        if (next.priv == null) next.priv = true;
        if (!next.priceName && place.bookItem) next.priceName = place.bookItem;
      }
    }
    return next;
  }
  return walk(listing);
}

// Tours containing each attraction (packages included), priced from the listing card, not the stale `facts` Price row.
const TOUR_CARDS = {};
(function collect(node) {
  if (Array.isArray(node)) return node.forEach(collect);
  if (!node || typeof node !== 'object') return;
  if (typeof node.href === 'string' && node.priceName) TOUR_CARDS[node.href] = node;
  Object.values(node).forEach(collect);
})(LISTINGS.tour);

// Card fallback prices by item name across all listings; the book bar reads these before the catalog arrives.
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
Object.entries(TOUR_CONTENT).forEach(([slug, t]) => {
  if (parked.has(slug)) return;
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
  (t.items || []).forEach((it) => {
    if (!it.refId) return;
    (CONTAINS[it.refId] = CONTAINS[it.refId] || []).push(entry);
  });
});

// Day tours sort before multi-day packages.
export function toursContaining(refId) {
  return (CONTAINS[refId] || []).slice().sort((a, b) => Number(a.isPackage) - Number(b.isPackage));
}

// A tour's stops resolved to attraction pages for the card grid; photo and name come from the attraction.
export function tourDestinations(tourSlug, attractions) {
  const t = TOUR_CONTENT[tourSlug];
  if (!t) return [];
  const out = [];
  (t.items || []).forEach((it) => {
    if (!it.refId || out.some((x) => x.refId === it.refId)) return;
    const a = attractions[it.refId];
    if (!a) return;
    out.push({
      refId: it.refId,
      href: `/attractions/${it.refId}.html`,
      name: a.title,
      img: it.img || a.heroBg,
      alt: it.alt || a.title,
      // Card meta = the attraction's own Area, same as on the Destinations listing.
      meta: ((a.hooks || []).find((h) => h.label === 'Area') || (a.facts || []).find((f) => f.label === 'Area') || {}).value || '',
    });
  });
  return out;
}
