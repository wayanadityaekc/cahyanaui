// The chat's brain. No model, no network of its own: every answer is either an
// FAQ entry the site already publishes or a figure read from the live catalog.
//
// WHY THAT MATTERS MORE THAN IT SOUNDS. This site sells on clear, upfront
// pricing. An assistant that composes a plausible-looking price is the one
// failure that damages the actual product, so this file is built so that it
// CANNOT compose one: it either has a catalog figure to show or it says it
// does not know and offers Wayan.
import { FAQ } from '@/content/shared/faq';
import { LISTINGS } from '@/content/shared/listings';
import { CHARTER } from '@/content/shared/charter';
import { TOPICS, HUMAN_WORDS, GREETINGS, THANKS, CHAT_COPY } from '@/content/shared/chat';

// FAQ answers are stored as HTML because the FAQ page renders them. A chat
// bubble wants sentences, so the tags come off - but the text inside <strong>
// stays, because that is where the numbers live ("$10 deposit").
function stripTags(html) {
  return String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Keyed by the question text, and it THROWS when that text no longer exists.
// A topic quietly pointing at a deleted FAQ entry would answer nothing at all,
// which is exactly the kind of failure nobody notices for months.
function faqAnswer(question) {
  const hit = FAQ.find((f) => f.q === question);
  if (!hit) throw new Error(`chat: no FAQ entry titled "${question}"`);
  return stripTags(hit.a);
}

// Everything the site sells, flattened into one searchable list. Built once.
let INDEX = null;
export function itemIndex() {
  if (INDEX) return INDEX;
  const out = [];
  Object.keys(LISTINGS).forEach((section) => {
    (LISTINGS[section].cats || []).forEach((cat) => {
      (cat.cards || []).forEach((c) => {
        if (!c.name || !c.href) return;
        out.push({
          name: c.name, href: c.href, meta: c.meta || '',
          priceName: c.priceName || '', fallback: c.priceFallback || '',
          stops: c.stops || 0, section,
        });
      });
    });
  });
  INDEX = out;
  return out;
}

const STOP = new Set([
  'the', 'a', 'an', 'is', 'are', 'do', 'does', 'did', 'can', 'i', 'we', 'you',
  'my', 'me', 'to', 'for', 'of', 'in', 'on', 'at', 'and', 'or', 'it', 'be',
  'how', 'what', 'when', 'where', 'much', 'many', 'with', 'from', 'your', 'us',
  'please', 'hi', 'hello', 'there', 'want', 'would', 'like', 'need', 'about',
  'have', 'has', 'get', 'got', 'this', 'that', 'any', 'all',
]);

function norm(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim(); }
function words(s) { return norm(s).split(' ').filter((w) => w.length > 2 && !STOP.has(w)); }

// A price the guest can trust, or nothing. `fallback` is the figure printed on
// the card in the same build, so it is never invented - but the catalog wins
// whenever it has answered, because that is what the guest is actually charged.
function priceOf({ priceName, fallback }, ctx) {
  const live = priceName && ctx.lookup ? ctx.lookup(priceName) : null;
  return (live && live.standard && live.standard.display) || fallback || '';
}

// ---- builders: answers that FAQ does not cover because they are data ----

function tourPrices(ctx) {
  const picks = itemIndex()
    .filter((i) => i.section === 'tour')
    .slice(0, 4)
    .map((i) => ({ label: i.name, note: i.meta, price: priceOf(i, ctx), href: i.href }));
  return {
    text: 'Day tours are priced per car for up to 5 people, so a bigger group pays less each. A few of ours:',
    rows: picks,
    link: { href: '/tour.html', label: 'All tours' },
  };
}

function airportPrice({ catalog }) {
  const t = catalog ? (catalog.transfers || []).find((x) => /airport/i.test(x.route)) : null;
  const price = t ? t.display : '';
  return {
    text: price
      ? `Airport pickup to Ubud is ${price} per car, up to 5 people with luggage. Your driver meets you at arrivals, and we ask for your flight number so the timing follows your actual landing.`
      : 'We run airport pickups to Ubud and back, and we ask for your flight number so the timing follows your actual landing.',
    link: { href: '/airport-transfer.html', label: 'Airport transfer' },
  };
}

function charterPrices({ catalog }) {
  const rows = (CHARTER.durations || []).map((d) => {
    const c = catalog ? (catalog.charters || []).find((x) => x.duration === d.dur) : null;
    return { label: d.name, note: d.sub, price: (c && c.display) || '', href: '/charter.html' };
  }).filter((r) => r.price);
  return {
    text: rows.length
      ? 'You can take the car and driver for the day and decide the route as you go:'
      : 'You can take the car and driver for the day and decide the route as you go.',
    rows,
    link: { href: '/charter.html', label: 'Book charter' },
  };
}

// These are the site's own scheduling rules, not a guess about traffic.
function startTimes() {
  return {
    text:
      'Most day tours start at 8:00, 8:30 or 9:00 in the morning. Some are fixed by what you are going to see: Lempuyang runs from 3:00 for the light at the gates, Batur trekking and the sunrise jeep leave at 2:00 or 3:00, and Kecak starts at 19:00. Transfers and charters you can set to any hour.',
    link: { href: '/tour.html', label: 'All tours' },
  };
}

const BUILDERS = { tourPrices, airportPrice, charterPrices, startTimes };

// ---- matching ----

// One named thing the guest asked about, or null. Scored on how much of the
// item's own name the question repeats, so "monkey forest" finds the Ubud tour
// while a bare "tour" matches nothing (and falls through to the price topic).
function matchItem(q) {
  const qw = words(q);
  if (!qw.length) return null;
  let best = null;
  itemIndex().forEach((item) => {
    const iw = words(item.name);
    if (!iw.length) return;
    let hits = 0;
    iw.forEach((w) => { if (qw.includes(w)) hits += 1; });
    // Needs at least two of the item's own words, or one word long enough to be
    // distinctive ("lempuyang", "jatiluwih"). One short shared word is noise.
    const strong = iw.some((w) => w.length >= 7 && qw.includes(w));
    if (hits >= 2 || (hits === 1 && strong)) {
      const score = hits + (strong ? 1 : 0);
      if (!best || score > best.score) best = { item, score };
    }
  });
  return best ? best.item : null;
}

function matchTopic(q) {
  const n = norm(q);
  const qw = words(q);
  let best = null;
  TOPICS.forEach((t) => {
    let score = 0;
    let strong = false;
    t.words.forEach((w) => {
      if (w.includes(' ')) {
        if (n.includes(w)) score += 3;          // a phrase is worth more than a word
      } else if (qw.includes(w)) score += 1;
    });
    (t.strong || []).forEach((w) => {
      if (w.includes(' ') ? n.includes(w) : qw.includes(w)) { strong = true; score += 3; }
    });
    if (!score) return;
    // A topic that matched one of ITS OWN distinctive words beats one that only
    // caught generic vocabulary, whatever the raw scores are. Without this,
    // "how much is the airport pickup" answers with the tour price list:
    // "how much" outscores "airport" and the guest is told the wrong number.
    const better = !best
      || (strong && !best.strong)
      || (strong === best.strong && score > best.score);
    if (better) best = { topic: t, score, strong };
  });
  // One generic word on its own is noise, not a question. Needs a phrase, a
  // distinctive word, or two generic words agreeing.
  return best && best.score >= 2 ? best.topic : null;
}

function answerTopic(topic, ctx) {
  if (topic.faq) return { text: faqAnswer(topic.faq) };
  const build = BUILDERS[topic.build];
  if (!build) throw new Error(`chat: topic ${topic.id} names no builder`);
  return build(ctx);
}

/**
 * The only entry point. Returns one of:
 *   { kind: 'answer',  text, rows?, link? }
 *   { kind: 'handoff', text }   - not answerable here, so it goes to Wayan
 *
 * There is no third outcome. A question this file cannot answer is a question
 * for a person, whatever it was about (Sep 2026, Wayan: "kalo pertanyaan aneh
 * langsung connect ke gua aja"). The polite decline that used to sit here read
 * as a closed door to the one guest who most needed answering.
 */
export function answerFor(question, ctx = {}) {
  const q = String(question || '').trim();
  // Only reachable from a caller that is not the panel; the panel drops empties.
  if (!q) return { kind: 'answer', text: CHAT_COPY.greeting };

  const bare = norm(q);
  if (GREETINGS.includes(bare)) return { kind: 'answer', text: CHAT_COPY.hello };
  if (THANKS.includes(bare)) return { kind: 'answer', text: CHAT_COPY.thanks };

  // A situation, not a lookup. Checked before anything else can answer it:
  // "my wife is in a wheelchair, can she do the tour" matched the price topic
  // and got a price list back, which reads as not having listened at all.
  const n = norm(q);
  const qw0 = words(q);
  const human = HUMAN_WORDS.some((w) => (w.includes(' ') ? n.includes(w) : qw0.includes(w)));
  if (human) return { kind: 'handoff', text: CHAT_COPY.handoff };

  const item = matchItem(q);
  if (item) {
    const price = priceOf(item, ctx);
    const bits = [item.meta, item.stops ? `${item.stops} stops` : ''].filter(Boolean).join(' · ');
    return {
      kind: 'answer',
      text: price
        ? `${item.name} is ${price}${item.section === 'tour' || item.section === 'destinations' ? ' per car for up to 5 people' : ''}.${bits ? ` ${bits}.` : ''}`
        : `${item.name}${bits ? ` - ${bits}.` : '.'}`,
      link: { href: item.href, label: 'View details' },
    };
  }

  const topic = matchTopic(q);
  if (topic) return { kind: 'answer', ...answerTopic(topic, ctx) };

  // Nothing matched, so it goes to Wayan. We deliberately do NOT try to judge
  // whether the question was "about us" first: that judgement was a word list,
  // and a word list gets the odd question wrong in the expensive direction -
  // the guest whose question does not sound like the other ones is exactly the
  // guest worth talking to.
  return { kind: 'handoff', text: CHAT_COPY.handoff };
}
