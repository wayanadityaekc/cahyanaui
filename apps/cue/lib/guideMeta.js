import { GUIDE_HUB } from '@/content/shared/guide-hub';

// Guide hero facts from existing data; the photo is the guide's hub card image (no invented content).
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

// Reading time from the article's own words at 200 wpm.
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
