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

function findFaqAnswer(question) {
  const hit = FAQ.find((faq) => faq.q === question);
  if (!hit) throw new Error(`chat: no FAQ entry titled "${question}"`);
  return stripTags(hit.a);
}

let INDEX = null;
export function itemIndex() {
  if (INDEX) return INDEX;
  const out = [];
  Object.keys(LISTINGS).forEach((section) => {
    (LISTINGS[section].cats || []).forEach((cat) => {
      (cat.cards || []).forEach((card) => {
        if (!card.name || !card.href) return;
        out.push({
          name: card.name,
          href: card.href,
          meta: card.meta || '',
          priceName: card.priceName || '',
          fallback: card.priceFallback || '',
          stops: card.stops || 0,
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

function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function extractWords(text) {
  return normalizeText(text)
    .split(' ')
    .filter((word) => word.length > 2 && !STOP.has(word));
}

function priceOf({ priceName, fallback }, context) {
  const live = priceName && context.lookup ? context.lookup(priceName) : null;
  return (live && live.standard && live.standard.display) || fallback || '';
}

function buildTourPrices(context) {
  const picks = itemIndex()
    .filter((item) => item.section === 'tour')
    .slice(0, 4)
    .map((item) => ({ label: item.name, note: item.meta, price: priceOf(item, context), href: item.href }));
  return {
    text: 'Day tours are priced per car for up to 5 people, so a bigger group pays less each. A few of ours:',
    rows: picks,
    link: { href: '/tour.html', label: 'All tours' },
  };
}

function findAirportPrice({ catalog }) {
  const airportTransfer = catalog
    ? (catalog.transfers || []).find((transfer) => /airport/i.test(transfer.route))
    : null;
  const price = airportTransfer ? airportTransfer.display : '';
  return {
    text: price
      ? `Airport pickup to Ubud is ${price} per car, up to 5 people with luggage. Your driver meets you at arrivals, and we ask for your flight number so the timing follows your actual landing.`
      : 'We run airport pickups to Ubud and back, and we ask for your flight number so the timing follows your actual landing.',
    link: { href: '/airport-transfer.html', label: 'Airport transfer' },
  };
}

function buildCharterPrices({ catalog }) {
  const rows = (CHARTER.durations || [])
    .map((duration) => {
      const charter = catalog
        ? (catalog.charters || []).find((candidate) => candidate.duration === duration.dur)
        : null;
      return {
        label: duration.name,
        note: duration.sub,
        price: (charter && charter.display) || '',
        href: '/charter.html',
      };
    })
    .filter((row) => row.price);
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

const BUILDERS = {
  tourPrices: buildTourPrices,
  airportPrice: findAirportPrice,
  charterPrices: buildCharterPrices,
  startTimes,
};

function matchItem(question) {
  const questionWords = extractWords(question);
  if (!questionWords.length) return null;
  let best = null;
  itemIndex().forEach((item) => {
    const iw = extractWords(item.name);
    if (!iw.length) return;
    let hits = 0;
    iw.forEach((word) => {
      if (questionWords.includes(word)) hits += 1;
    });
    const hasStrongMatch = iw.some((word) => word.length >= 7 && questionWords.includes(word));
    if (hits >= 2 || (hits === 1 && hasStrongMatch)) {
      const score = hits + (hasStrongMatch ? 1 : 0);
      if (!best || score > best.score) best = { item, score };
    }
  });
  return best ? best.item : null;
}

function matchTopic(question) {
  const normalizedQuestion = normalizeText(question);
  const questionWords = extractWords(question);
  let best = null;
  TOPICS.forEach((topic) => {
    let score = 0;
    let strong = false;
    topic.words.forEach((word) => {
      if (word.includes(' ')) {
        if (normalizedQuestion.includes(word)) score += 3;
      } else if (questionWords.includes(word)) score += 1;
    });
    (topic.strong || []).forEach((word) => {
      if (word.includes(' ') ? normalizedQuestion.includes(word) : questionWords.includes(word)) {
        strong = true;
        score += 3;
      }
    });
    if (!score) return;
    const better = !best || (strong && !best.strong) || (strong === best.strong && score > best.score);
    if (better) best = { topic: topic, score, strong };
  });
  return best && best.score >= 2 ? best.topic : null;
}

function answerTopic(topic, context) {
  if (topic.faq) return { text: findFaqAnswer(topic.faq) };
  const build = BUILDERS[topic.build];
  if (!build) throw new Error(`chat: topic ${topic.id} names no builder`);
  return build(context);
}

export function answerFor(question, context = {}) {
  const text = String(question || '').trim();
  if (!text) return { kind: 'answer', text: CHAT_COPY.greeting };

  const bare = normalizeText(text);
  if (GREETINGS.includes(bare)) return { kind: 'answer', text: CHAT_COPY.hello };
  if (THANKS.includes(bare)) return { kind: 'answer', text: CHAT_COPY.thanks };

  const normalizedText = normalizeText(text);
  const qw0 = extractWords(text);
  const isAskingForHuman = HUMAN_WORDS.some((word) =>
    word.includes(' ') ? normalizedText.includes(word) : qw0.includes(word),
  );
  if (isAskingForHuman) return { kind: 'handoff', text: CHAT_COPY.handoff };

  const item = matchItem(text);
  if (item) {
    const price = priceOf(item, context);
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
  if (topic) return { kind: 'answer', ...answerTopic(topic, context) };

  return { kind: 'handoff', text: CHAT_COPY.handoff };
}
