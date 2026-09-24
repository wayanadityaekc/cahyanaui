import { GUIDE_HUB } from '@/content/shared/guide-hub';

// Facts for a guide article's hero, all pulled from data the site already holds -
// nothing invented (CLAUDE.md: no fake content).
//
// The guide pages themselves only carry a gradient `heroStyle` (14 of 15 have no
// photo of their own), but every guide ALREADY has a real photo and a curated label
// on its hub card. The split hero needs a photo, so it reuses that one: it is the
// image that represents this guide everywhere else on the site.
const CARD = {};
(function collect(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(collect); return; }
  if (node.href && node.img) CARD[node.href] = { img: node.img, tag: node.tag };
  Object.values(node).forEach(collect);
})(GUIDE_HUB);

export function guideCard(slug) {
  return CARD[`/guide/${slug}.html`] || null;
}

// Reading time from the article's own words, at 200 wpm - derived, not guessed.
// Blocks carry either `html` (paragraphs, lists) or plain `text`.
export function readMinutes(body = []) {
  const words = body
    .map((b) => b.html || b.text || (Array.isArray(b.items) ? b.items.join(' ') : ''))
    .join(' ')
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Category = the guide-hub category this article is filed under (the active tab).
export function guideCategory(tabs = []) {
  const hit = tabs.find((t) => t.active);
  return hit ? hit.label : null;
}
