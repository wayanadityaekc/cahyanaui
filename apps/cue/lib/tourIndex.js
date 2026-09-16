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
// SERVER-SIDE ONLY: pulls in the whole tour dataset. See lib/hiddenItems.js.
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

// Rewrites the "Included in ..." line on every destination card from the index
// above. Called from the destinations page, which is a server component:
// ListingPage itself is 'use client', so importing this there would ship the
// whole tour dataset to the browser.
export function withInclLabels(listing) {
  const walk = (node) => {
    if (Array.isArray(node)) return node.map(walk);
    if (!node || typeof node !== 'object') return node;
    const next = {};
    for (const [k, v] of Object.entries(node)) next[k] = walk(v);
    if (next.variant === 'incl') {
      const m = /^\/attractions\/(.+)\.html$/.exec(next.href || '');
      const label = m ? inclLabel(m[1]) : undefined;
      if (label) next.inclText = label;
      else delete next.inclText;
    }
    return next;
  };
  return walk(listing);
}

// Every tour a guest can actually book that stops at this attraction, for the
// "Visit this place on" card. Unlike inclLabel, multi-day packages ARE included:
// the card has room, and a package is a real way to see the place.
//
// Returns the tour's OWN listing card, straight out of LISTINGS.tour, so the
// card in a destination sidebar is the same card as on the Tours page - photo,
// meta, stop count, price and all - instead of a second, drifting description
// of the same tour.
const TOUR_CARDS = {};
(function collect(node) {
  if (Array.isArray(node)) return node.forEach(collect);
  if (!node || typeof node !== 'object') return;
  if (typeof node.href === 'string' && node.priceName) TOUR_CARDS[node.href] = node;
  Object.values(node).forEach(collect);
})(LISTINGS.tour);

export function visitOptions(slug) {
  const out = [];
  for (const [tourSlug, t] of Object.entries(TOUR_CONTENT)) {
    if (parked.has(tourSlug)) continue;
    if (!(t.items || []).some((i) => i.refId === slug)) continue;
    const href = tourPath(tourSlug);
    const card = TOUR_CARDS[href];
    if (card) out.push({ ...card, isPackage: isPackage(t) });
  }
  // Day tours first, multi-day packages last: the package is the upsell, not
  // the obvious answer to "how do I see this place", and the sidebar's primary
  // button points at the first entry.
  return out.sort((a, b) => Number(a.isPackage) - Number(b.isPackage));
}
