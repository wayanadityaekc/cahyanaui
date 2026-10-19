import { TOUR_CONTENT } from '@/content/tours';
import { LISTINGS } from '@/content/shared/listings';
import { HIDDEN_TOURS, tourPath } from '@/lib/routes';

const parked = new Set(HIDDEN_TOURS);
function isPackage({ items }) {
  return (items || []).some((item) => item.type === 'sub');
}

const INDEX = {};
Object.entries(TOUR_CONTENT).forEach(([slug, tour]) => {
  if (parked.has(slug) || isPackage(tour)) return;
  (tour.items || []).forEach((it) => {
    if (!it.refId) return;
    (INDEX[it.refId] = INDEX[it.refId] || []).push({ slug, href: tourPath(slug), name: tour.bookItem });
  });
});

export function toursForAttraction(slug) {
  return INDEX[slug] || [];
}

export function inclLabel(slug) {
  const names = toursForAttraction(slug).map((tour) => tour.name);
  if (!names.length) return undefined;
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  return `Included in |${list}|`;
}

export function withAttractionCards(listing, attractions = {}) {
  function walk(node) {
    if (Array.isArray(node)) return node.map(walk);
    if (!node || typeof node !== 'object') return node;
    const next = {};
    Object.entries(node).forEach(([key, value]) => {
      next[key] = walk(value);
    });
    const match = /^\/attractions\/(.+)\.html$/.exec(next.href || '');
    if (next.variant === 'incl') {
      const label = match ? inclLabel(match[1]) : undefined;
      if (label) next.inclText = label;
      else delete next.inclText;
    }
    if (match) {
      const place = attractions[match[1]];
      if (place) {
        if (next.metaIcon === 'pin' || !next.meta) {
          if (next.metaIcon === 'pin' && next.meta && !next.area) next.area = next.meta;
          const timeHere = (
            (place.hooks || []).find((hook) => /time here|duration/i.test(hook.label)) ||
            (place.facts || []).find((fact) => /time here|duration/i.test(fact.label)) ||
            {}
          ).value;
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
Object.entries(TOUR_CONTENT).forEach(([slug, tour]) => {
  if (parked.has(slug)) return;
  const href = tourPath(slug);
  const card = TOUR_CARDS[href];
  const entry = {
    slug,
    href,
    name: tour.bookItem,
    title: tour.title,
    stops: (tour.items || []).filter((item) => item.type === 'stop').length,
    priceName: card ? card.priceName : tour.bookItem,
    priceFallback: card ? card.priceFallback : undefined,
    isPackage: isPackage(tour),
  };
  (tour.items || []).forEach((it) => {
    if (!it.refId) return;
    (CONTAINS[it.refId] = CONTAINS[it.refId] || []).push(entry);
  });
});

export function toursContaining(refId) {
  return (CONTAINS[refId] || []).slice().sort((a, b) => Number(a.isPackage) - Number(b.isPackage));
}

export function tourDestinations(tourSlug, attractions) {
  const tour = TOUR_CONTENT[tourSlug];
  if (!tour) return [];
  const out = [];
  (tour.items || []).forEach((it) => {
    if (!it.refId || out.some((existing) => existing.refId === it.refId)) return;
    const attraction = attractions[it.refId];
    if (!attraction) return;
    out.push({
      refId: it.refId,
      href: `/attractions/${it.refId}.html`,
      name: attraction.title,
      img: it.img || attraction.heroBg,
      alt: it.alt || attraction.title,
      meta:
        (
          (attraction.hooks || []).find((hook) => hook.label === 'Area') ||
          (attraction.facts || []).find((fact) => fact.label === 'Area') ||
          {}
        ).value || '',
    });
  });
  return out;
}
