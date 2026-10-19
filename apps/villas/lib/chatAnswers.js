import { FAQ } from '@/content/company';
import { VILLAS } from '@/lib/villas';
import { TOPICS, HUMAN_WORDS, SERVICE_WORDS, PRICE_WORDS, GREETINGS, THANKS, CHAT_COPY } from '@/content/chat';

const PHRASE_TERM_SCORE = 3;
const STRONG_TERM_SCORE = 3;

const FAQ_ITEMS = FAQ.flatMap((group) => group.items);

function findFaqAnswer(question) {
  const hit = FAQ_ITEMS.find(([asked]) => asked === question);
  if (!hit) throw new Error(`chat: no FAQ entry titled "${question}"`);
  return hit[1];
}

TOPICS.forEach((topic) => {
  if (topic.faq) findFaqAnswer(topic.faq);
});

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

function hasMention(term, text, questionWords) {
  return term.includes(' ') ? text.includes(term) : questionWords.includes(term);
}

function buildVillaNote(villa) {
  return `Up to ${villa.guests} guests · ${villa.bedrooms} bedrooms`;
}

function buildVillaRow(villa, format) {
  return {
    label: villa.name,
    note: buildVillaNote(villa),
    price: `${format(villa.nightlyRateIdr)} / night`,
    href: `/villas/${villa.slug}`,
  };
}

function buildVillaPrices({ format }) {
  return {
    text: 'These are the nightly rates shown on each villa page, with no service fee on top. The exact total shows once you pick your dates:',
    rows: Object.values(VILLAS).map((villa) => buildVillaRow(villa, format)),
  };
}

function buildLiveDinnerAnswer() {
  return {
    text: 'A chef shops that afternoon, arrives around five and cooks in your villa kitchen, for 2 to 6 guests. Book it a day ahead. Menus run from a dinner for two to a Balinese feast or a BBQ by the pool, with vegetarian and vegan versions.',
    link: { href: '/services/live-dinner', label: 'Live Dinner' },
  };
}

const BUILDERS = { villaPrices: buildVillaPrices, liveDinner: buildLiveDinnerAnswer };

function buildVillaAnswer(question, questionWords, chatContext) {
  const text = normalizeText(question);
  const villa = Object.values(VILLAS).find(
    (candidate) => text.includes(normalizeText(candidate.name)) || text.includes(candidate.slug.split('-')[1]),
  );
  if (!villa) return null;
  const hasAskedPrice = PRICE_WORDS.some((term) => hasMention(term, text, questionWords)) || text.includes('night');
  if (hasAskedPrice) {
    return {
      kind: 'answer',
      text: `${villa.name} is ${chatContext.format(villa.nightlyRateIdr)} a night, as shown on its page, with no service fee on top. The exact total shows once you pick your dates.`,
      link: { href: `/villas/${villa.slug}`, label: 'View villa' },
    };
  }
  return null;
}

function matchTopic(question) {
  const text = normalizeText(question);
  const questionWords = extractWords(question);
  let best = null;
  TOPICS.forEach((topic) => {
    let score = 0;
    let strong = false;
    topic.words.forEach((term) => {
      if (hasMention(term, text, questionWords)) score += term.includes(' ') ? PHRASE_TERM_SCORE : 1;
    });
    (topic.strong || []).forEach((term) => {
      if (!hasMention(term, text, questionWords)) return;
      strong = true;
      score += STRONG_TERM_SCORE;
    });
    if (!score) return;
    const better = !best || (strong && !best.strong) || (strong === best.strong && score > best.score);
    if (better) best = { topic, score, strong };
  });
  return best && best.score >= 2 ? best.topic : null;
}

function answerTopic(topic, chatContext) {
  if (topic.faq) return { text: findFaqAnswer(topic.faq), link: topic.link || null };
  const build = BUILDERS[topic.build];
  if (!build) throw new Error(`chat: topic ${topic.id} names no builder`);
  return build(chatContext);
}

export function answerFor(question, chatContext = {}) {
  const context = { format: (usd) => `$${usd}`, ...chatContext };
  const raw = String(question || '').trim();
  if (!raw) return { kind: 'answer', text: CHAT_COPY.greeting };

  const text = normalizeText(raw);
  if (GREETINGS.includes(text)) return { kind: 'answer', text: CHAT_COPY.helloAnon };
  if (THANKS.includes(text)) return { kind: 'answer', text: CHAT_COPY.thanks };

  const questionWords = extractWords(raw);
  if (HUMAN_WORDS.some((term) => hasMention(term, text, questionWords)))
    return { kind: 'handoff', text: CHAT_COPY.handoff };

  const isAskingAboutService = SERVICE_WORDS.some((term) => hasMention(term, text, questionWords));
  const isAskingAboutPrice = PRICE_WORDS.some((term) => hasMention(term, text, questionWords));
  if (isAskingAboutService && isAskingAboutPrice) return { kind: 'handoff', text: CHAT_COPY.handoff };

  const villa = buildVillaAnswer(raw, questionWords, context);
  if (villa) return villa;

  const topic = matchTopic(raw);
  if (topic) return { kind: 'answer', ...answerTopic(topic, context) };

  return { kind: 'handoff', text: CHAT_COPY.handoff };
}
