import { TOUR_CONTENT } from '@/content/tours';
import { LISTINGS } from '@/content/shared/listings';
import { HIDDEN_TOURS, tourPath } from '@/lib/routes';

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

export function inclLabel(slug) {
  const names = toursForAttraction(slug).map((t) => t.name);
  if (!names.length) return undefined;
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  return `Included in |${list}|`;
}

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
    if (m) {
      const place = attractions[m[1]];
      if (place) {
        if (next.metaIcon === 'pin' || !next.meta) {
          if (next.metaIcon === 'pin' && next.meta && !next.area) next.area = next.meta;
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

const TOUR_CARDS = {};
(function collect(node) {
  if (Array.isArray(node)) return node.forEach(collect);
  if (!node || typeof node !== 'object') return;
  if (typeof node.href === 'string' && node.priceName) TOUR_CARDS[node.href] = node;
  Object.values(node).forEach(collect);
})(LISTINGS.tour);

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

export function toursContaining(refId) {
  return (CONTAINS[refId] || []).slice().sort((a, b) => Number(a.isPackage) - Number(b.isPackage));
}

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
      meta: ((a.hooks || []).find((h) => h.label === 'Area') || (a.facts || []).find((f) => f.label === 'Area') || {}).value || '',
    });
  });
  return out;
}
