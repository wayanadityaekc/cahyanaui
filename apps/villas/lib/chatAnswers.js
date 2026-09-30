// Villa chat answers from this site's own FAQ and villa data only; anything else is handed to Wayan.
import { FAQ } from '@/content/company';
import { VILLAS } from '@/lib/villas';
import {
  TOPICS, HUMAN_WORDS, SERVICE_WORDS, PRICE_WORDS, GREETINGS, THANKS, CHAT_COPY,
} from '@/content/chat';

const FAQ_ITEMS = FAQ.flatMap((group) => group.items);

// Throws when a topic's FAQ question no longer exists, so a topic cannot silently point at a deleted entry.
function faqAnswer(question) {
  const hit = FAQ_ITEMS.find(([asked]) => asked === question);
  if (!hit) throw new Error(`chat: no FAQ entry titled "${question}"`);
  return hit[1];
}

// Checked once at load, not on the first guest who happens to ask.
TOPICS.forEach((topic) => { if (topic.faq) faqAnswer(topic.faq); });

const STOP = new Set([
  'the', 'a', 'an', 'is', 'are', 'do', 'does', 'did', 'can', 'i', 'we', 'you',
  'my', 'me', 'to', 'for', 'of', 'in', 'on', 'at', 'and', 'or', 'it', 'be',
  'how', 'what', 'when', 'where', 'much', 'many', 'with', 'from', 'your', 'us',
  'please', 'hi', 'hello', 'there', 'want', 'would', 'like', 'need', 'about',
  'have', 'has', 'get', 'got', 'this', 'that', 'any', 'all',
]);

function norm(text) { return String(text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim(); }
function words(text) { return norm(text).split(' ').filter((word) => word.length > 2 && !STOP.has(word)); }

// A phrase is found in the normalised text; a single word must be one of the question's own words.
function mentions(term, text, questionWords) {
  return term.includes(' ') ? text.includes(term) : questionWords.includes(term);
}

function villaNote(villa) {
  return `Up to ${villa.guests} guests · ${villa.bedrooms} bedrooms`;
}

function villaRow(villa, format) {
  return {
    label: villa.name,
    note: villaNote(villa),
    price: `${format(villa.nightlyRateIdr)} / night`,
    href: `/villas/${villa.slug}`,
  };
}

// ---- builders: answers the FAQ does not cover because they are data ----

function villaPrices({ format }) {
  return {
    text: 'These are the nightly rates shown on each villa page, before the service fee. Rates change by season, and the exact total shows once you pick your dates:',
    rows: Object.values(VILLAS).map((villa) => villaRow(villa, format)),
  };
}

// Restated from the Live Dinner page's own facts; the price there is "Ask us", so none is given here.
function liveDinner() {
  return {
    text: 'A chef shops that afternoon, arrives around five and cooks in your villa kitchen, for 2 to 6 guests. Book it a day ahead. Menus run from a dinner for two to a Balinese feast or a BBQ by the pool, with vegetarian and vegan versions.',
    link: { href: '/services/live-dinner', label: 'Live Dinner' },
  };
}

const BUILDERS = { villaPrices, liveDinner };

// A question naming one villa gets that villa's facts, and its rate if it asks about price.
function villaAnswer(question, questionWords, ctx) {
  const text = norm(question);
  const villa = Object.values(VILLAS).find((candidate) => text.includes(norm(candidate.name)) || text.includes(candidate.slug.split('-')[1]));
  if (!villa) return null;
  const askedPrice = PRICE_WORDS.some((term) => mentions(term, text, questionWords)) || text.includes('night');
  if (askedPrice) {
    return {
      kind: 'answer',
      text: `${villa.name} is ${ctx.format(villa.nightlyRateIdr)} a night before the service fee, as shown on its page. The exact total shows once you pick your dates.`,
      link: { href: `/villas/${villa.slug}`, label: 'View villa' },
    };
  }
  return null;
}

function matchTopic(question) {
  const text = norm(question);
  const questionWords = words(question);
  let best = null;
  TOPICS.forEach((topic) => {
    let score = 0;
    let strong = false;
    topic.words.forEach((term) => {
      // A phrase is worth more than a word.
      if (mentions(term, text, questionWords)) score += term.includes(' ') ? 3 : 1;
    });
    (topic.strong || []).forEach((term) => {
      if (mentions(term, text, questionWords)) { strong = true; score += 3; }
    });
    if (!score) return;
    // A topic matching one of its own distinctive words beats one that only matched generic words.
    const better = !best || (strong && !best.strong) || (strong === best.strong && score > best.score);
    if (better) best = { topic, score, strong };
  });
  // A score of at least 2; one generic word alone is noise.
  return best && best.score >= 2 ? best.topic : null;
}

function answerTopic(topic, ctx) {
  if (topic.faq) return { text: faqAnswer(topic.faq), link: topic.link || null };
  const build = BUILDERS[topic.build];
  if (!build) throw new Error(`chat: topic ${topic.id} names no builder`);
  return build(ctx);
}

// Entry point: { kind: 'answer', text, rows?, link? } or { kind: 'handoff', text }; there is no third outcome.
export function answerFor(question, ctx = {}) {
  const context = { format: (usd) => `$${usd}`, ...ctx };
  const raw = String(question || '').trim();
  if (!raw) return { kind: 'answer', text: CHAT_COPY.greeting };

  const text = norm(raw);
  if (GREETINGS.includes(text)) return { kind: 'answer', text: CHAT_COPY.helloAnon };
  if (THANKS.includes(text)) return { kind: 'answer', text: CHAT_COPY.thanks };

  // Situations, and anything scooter, go to a person before any lookup can answer them.
  const questionWords = words(raw);
  if (HUMAN_WORDS.some((term) => mentions(term, text, questionWords))) return { kind: 'handoff', text: CHAT_COPY.handoff };

  // Every service page lists its price as "Ask us", so a service price question is Wayan's.
  const aboutService = SERVICE_WORDS.some((term) => mentions(term, text, questionWords));
  const aboutPrice = PRICE_WORDS.some((term) => mentions(term, text, questionWords));
  if (aboutService && aboutPrice) return { kind: 'handoff', text: CHAT_COPY.handoff };

  const villa = villaAnswer(raw, questionWords, context);
  if (villa) return villa;

  const topic = matchTopic(raw);
  if (topic) return { kind: 'answer', ...answerTopic(topic, context) };

  // Nothing matched, so hand off to Wayan; no word-list "off topic" decline.
  return { kind: 'handoff', text: CHAT_COPY.handoff };
}
