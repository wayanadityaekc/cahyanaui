import { GUIDE_HUB } from '@/content/shared/guide-hub';

const READING_WORDS_PER_MINUTE = 200;

const CARD = {};
(function collect(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach(collect);
    return;
  }
  if (node.href && node.img) CARD[node.href] = { img: node.img, tag: node.tag };
  Object.values(node).forEach(collect);
})(GUIDE_HUB);

export function findGuideCard(slug) {
  return CARD[`/guide/${slug}.html`] || null;
}

export function readMinutes(body = []) {
  const words = body
    .map((block) => block.html || block.text || (Array.isArray(block.items) ? block.items.join(' ') : ''))
    .join(' ')
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / READING_WORDS_PER_MINUTE));
}

export function findGuideCategory(tabs = []) {
  const hit = tabs.find((tab) => tab.active);
  return hit ? hit.label : null;
}
