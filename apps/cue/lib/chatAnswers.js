import { FAQ } from '@/content/shared/faq';
import { LISTINGS } from '@/content/shared/listings';
import { CHARTER } from '@/content/shared/charter';
import { TOPICS, HUMAN_WORDS, GREETINGS, THANKS, CHAT_COPY } from '@/content/shared/chat';

function stripTags(html) {
  return String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function faqAnswer(question) {
  const hit = FAQ.find((f) => f.q === question);
  if (!hit) throw new Error(`chat: no FAQ entry titled "${question}"`);
  return stripTags(hit.a);
}

let INDEX = null;
export function itemIndex() {
  if (INDEX) return INDEX;
  const out = [];
  Object.keys(LISTINGS).forEach((section) => {
    (LISTINGS[section].cats || []).forEach((cat) => {
      (cat.cards || []).forEach((c) => {
        if (!c.name || !c.href) return;
        out.push({
          name: c.name,
          href: c.href,
          meta: c.meta || '',
          priceName: c.priceName || '',
          fallback: c.priceFallback || '',
          stops: c.stops || 0,
          section,
        });
      });
    });
  });
  INDEX = out;
  return out;
}

const STOP = new Set([
  'the',
  'a',
  'an',
  'is',
  'are',
  'do',
  'does',
  'did',
  'can',
  'i',
  'we',
  'you',
  'my',
  'me',
  'to',
  'for',
  'of',
  'in',
  'on',
  'at',
  'and',
  'or',
  'it',
  'be',
  'how',
  'what',
  'when',
  'where',
  'much',
  'many',
  'with',
  'from',
  'your',
  'us',
  'please',
  'hi',
  'hello',
  'there',
  'want',
  'would',
  'like',
  'need',
  'about',
  'have',
  'has',
  'get',
  'got',
  'this',
  'that',
  'any',
  'all',
]);

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function words(s) {
  return norm(s)
    .split(' ')
    .filter((w) => w.length > 2 && !STOP.has(w));
}

function priceOf({ priceName, fallback }, ctx) {
  const live = priceName && ctx.lookup ? ctx.lookup(priceName) : null;
  return (live && live.standard && live.standard.display) || fallback || '';
}

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
  const rows = (CHARTER.durations || [])
    .map((d) => {
      const c = catalog ? (catalog.charters || []).find((x) => x.duration === d.dur) : null;
      return { label: d.name, note: d.sub, price: (c && c.display) || '', href: '/charter.html' };
    })
    .filter((r) => r.price);
  return {
    text: rows.length
      ? 'You can take the car and driver for the day and decide the route as you go:'
      : 'You can take the car and driver for the day and decide the route as you go.',
    rows,
    link: { href: '/charter.html', label: 'Book charter' },
  };
}

function startTimes() {
  return {
    text: 'Most day tours start at 8:00, 8:30 or 9:00 in the morning. Some are fixed by what you are going to see: Lempuyang runs from 3:00 for the light at the gates, Batur trekking and the sunrise jeep leave at 2:00 or 3:00, and Kecak starts at 19:00. Transfers and charters you can set to any hour.',
    link: { href: '/tour.html', label: 'All tours' },
  };
}

const BUILDERS = { tourPrices, airportPrice, charterPrices, startTimes };

function matchItem(question) {
  const questionWords = words(question);
  if (!questionWords.length) return null;
  let best = null;
  itemIndex().forEach((item) => {
    const iw = words(item.name);
    if (!iw.length) return;
    let hits = 0;
    iw.forEach((w) => {
      if (questionWords.includes(w)) hits += 1;
    });
    const strong = iw.some((w) => w.length >= 7 && questionWords.includes(w));
    if (hits >= 2 || (hits === 1 && strong)) {
      const score = hits + (strong ? 1 : 0);
      if (!best || score > best.score) best = { item, score };
    }
  });
  return best ? best.item : null;
}

function matchTopic(question) {
  const n = norm(question);
  const questionWords = words(question);
  let best = null;
  TOPICS.forEach((t) => {
    let score = 0;
    let strong = false;
    t.words.forEach((w) => {
      if (w.includes(' ')) {
        if (n.includes(w)) score += 3;
      } else if (questionWords.includes(w)) score += 1;
    });
    (t.strong || []).forEach((w) => {
      if (w.includes(' ') ? n.includes(w) : questionWords.includes(w)) {
        strong = true;
        score += 3;
      }
    });
    if (!score) return;
    const better = !best || (strong && !best.strong) || (strong === best.strong && score > best.score);
    if (better) best = { topic: t, score, strong };
  });
  return best && best.score >= 2 ? best.topic : null;
}

function answerTopic(topic, ctx) {
  if (topic.faq) return { text: faqAnswer(topic.faq) };
  const build = BUILDERS[topic.build];
  if (!build) throw new Error(`chat: topic ${topic.id} names no builder`);
  return build(ctx);
}

export function answerFor(question, ctx = {}) {
  const text = String(question || '').trim();
  if (!text) return { kind: 'answer', text: CHAT_COPY.greeting };

  const bare = norm(text);
  if (GREETINGS.includes(bare)) return { kind: 'answer', text: CHAT_COPY.hello };
  if (THANKS.includes(bare)) return { kind: 'answer', text: CHAT_COPY.thanks };

  const n = norm(text);
  const qw0 = words(text);
  const human = HUMAN_WORDS.some((w) => (w.includes(' ') ? n.includes(w) : qw0.includes(w)));
  if (human) return { kind: 'handoff', text: CHAT_COPY.handoff };

  const item = matchItem(text);
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

  const topic = matchTopic(text);
  if (topic) return { kind: 'answer', ...answerTopic(topic, ctx) };

  return { kind: 'handoff', text: CHAT_COPY.handoff };
}
