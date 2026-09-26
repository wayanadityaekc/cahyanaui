// What the chat can answer, and the words a guest is likely to use for it.
//
// THE COPY IS NOT WRITTEN HERE. Every answer either comes from `FAQ` (the same
// 15 entries the FAQ page shows) or is built from the live catalog. That is
// deliberate: a second copy of "how does payment work" would drift from the
// page within a month, and the site's own rule is one source per fact.
//
// So what lives here is the ROUTING - which words point at which answer - plus
// the handful of sentences the chat itself says (greeting, handoff, off-topic).

// The questions offered as chips. Phrased the way a guest would actually type
// them to a person, not as menu labels ("Pricing"), because the chips are what
// make this read as support rather than as a FAQ with extra steps.
export const SUGGESTIONS = [
  'How much is a day tour?',
  'What time do tours start?',
  'Do you pick up from my hotel?',
  'Is the price per person or per car?',
  'How do I pay?',
  'What if I need to cancel?',
];

// Each topic points at an existing FAQ question by its EXACT text, or names a
// builder that reads the live catalog. A `faq` string that no longer matches
// throws at load rather than silently answering nothing - same rule the guide
// cards follow.
export const TOPICS = [
  { id: 'price-tour', build: 'tourPrices',
    strong: ['day tour', 'tour price', 'how much is a tour'],
    words: ['how much', 'price', 'prices', 'cost', 'costs', 'rate', 'rates', 'tour', 'tours', 'day tour', 'expensive', 'cheap'] },

  { id: 'price-airport', build: 'airportPrice',
    strong: ['airport', 'ngurah rai', 'dps', 'flight'],
    words: ['airport', 'flight', 'arrival', 'arrive', 'landing', 'land', 'pickup from airport', 'ngurah rai', 'dps'] },

  { id: 'charter', build: 'charterPrices',
    strong: ['charter', 'full day', 'half day', 'whole day', 'hourly', 'by the hour'],
    words: ['charter', 'hire', 'full day', 'half day', 'whole day', 'by the hour', 'hourly', 'private driver', 'own driver'] },

  { id: 'start-time', build: 'startTimes',
    strong: ['what time', 'start time', 'starting time', 'depart', 'departure'],
    words: ['what time', 'start', 'starts', 'starting', 'pick me up at', 'time', 'times', 'early', 'sunrise', 'morning', 'depart', 'departure'] },

  { id: 'per-car', faq: 'Are prices per person or per car?',
    strong: ['per person', 'per car', 'per head'],
    words: ['per person', 'per car', 'per head', 'each', 'group', 'how many people', 'passengers', 'seats'] },

  { id: 'payment', faq: 'How does payment work?',
    strong: ['deposit', 'payment', 'pay'],
    words: ['pay', 'payment', 'deposit', 'card', 'cash', 'transfer money', 'paypal', 'upfront', 'in advance'] },

  { id: 'cancel', faq: 'What if I need to cancel?',
    strong: ['cancel', 'cancellation', 'refund', 'reschedule'],
    words: ['cancel', 'cancellation', 'refund', 'change date', 'reschedule', 'postpone'] },

  { id: 'pickup', faq: 'Where do you pick up from?',
    strong: ['pick up', 'pickup', 'collect'],
    words: ['pick up', 'pickup', 'hotel', 'villa', 'accommodation', 'where do you', 'collect', 'meet'] },

  { id: 'outside-ubud', faq: "Is there an extra fee if I'm staying outside Ubud?",
    strong: ['outside ubud', 'surcharge', 'extra fee', 'staying in'],
    words: ['outside ubud', 'canggu', 'seminyak', 'kuta', 'sanur', 'nusa dua', 'uluwatu area', 'extra fee', 'surcharge', 'staying in'] },

  { id: 'included', faq: "What's included in the price?",
    strong: ['included', 'includes', 'entrance', 'ticket', 'tickets'],
    words: ['included', 'include', 'includes', 'what do i get', 'ticket', 'tickets', 'entrance', 'lunch', 'fuel', 'petrol', 'parking'] },

  { id: 'book', faq: 'How do I book a tour or driver in Bali?',
    strong: ['book', 'booking', 'reserve', 'reservation'],
    words: ['book', 'booking', 'reserve', 'reservation', 'how do i book', 'sign up'] },

  { id: 'itinerary', faq: 'Can I build my own multi-day itinerary?',
    strong: ['itinerary', 'multi day', 'planner'],
    words: ['itinerary', 'multi day', 'multiple days', 'several days', 'plan', 'planner', 'custom', 'customise', 'customize', '3 days', 'week'] },

  { id: 'car', faq: 'What kind of car will I get?',
    strong: ['vehicle', 'aircon', 'air conditioning', 'child seat', 'luggage'],
    words: ['car', 'vehicle', 'van', 'aircon', 'air conditioning', 'seatbelt', 'child seat', 'luggage', 'suitcase'] },

  { id: 'english', faq: 'Does my driver speak English?',
    strong: ['english', 'language'],
    words: ['english', 'speak', 'language', 'guide', 'talk'] },

  { id: 'temple-dress', faq: 'What should I wear when visiting temples?',
    strong: ['sarong', 'dress code', 'what should i wear', 'temple dress'],
    words: ['wear', 'dress', 'sarong', 'clothes', 'clothing', 'shorts', 'temple dress'] },

  { id: 'change-plan', faq: 'Can I change the plan once the tour has started?',
    strong: ['change the plan', 'change plan', 'add a stop'],
    words: ['change the plan', 'change plan', 'skip', 'add a stop', 'flexible', 'decide later'] },

  { id: 'short-notice', faq: 'Can I book on short notice or the same day?',
    strong: ['same day', 'short notice', 'last minute'],
    words: ['today', 'tomorrow', 'same day', 'short notice', 'last minute', 'tonight'] },

  { id: 'currency', faq: 'What currency can I pay in?',
    strong: ['currency', 'rupiah', 'money changer', 'exchange'],
    words: ['currency', 'rupiah', 'idr', 'usd', 'dollar', 'euro', 'aud', 'pound', 'exchange', 'atm', 'money changer'] },

  { id: 'commission', faq: 'Do you charge a booking fee or commission?',
    strong: ['commission', 'booking fee', 'hidden', 'service charge'],
    words: ['fee', 'fees', 'commission', 'hidden', 'extra charge', 'service charge'] },
];

// Words that mean "this is about us" even when no topic matched well enough to
// answer. They decide handoff vs polite decline: a question using our own
// vocabulary is a real question we just cannot answer, and it goes to Wayan.
export const IN_SCOPE_WORDS = [
  'tour', 'tours', 'driver', 'transfer', 'charter', 'trip', 'booking', 'book',
  'price', 'cost', 'pay', 'deposit', 'cancel', 'pickup', 'pick', 'itinerary',
  'bali', 'ubud', 'waterfall', 'temple', 'rice', 'terrace', 'volcano', 'batur',
  'kecak', 'lempuyang', 'besakih', 'tegalalang', 'monkey', 'uluwatu', 'jatiluwih',
  'sunrise', 'snorkel', 'rafting', 'atv', 'swing', 'guide', 'airport', 'car',
  'hotel', 'villa', 'guest', 'guests', 'people', 'day', 'days', 'time', 'schedule',
];

// Questions only a person should answer. These are situations, not lookups -
// and answering one with a price list is worse than not answering at all,
// because it reads as "we did not listen".
//
// The list errs toward handing over: a word missing here costs a guest one
// canned answer they would not have had at all before this existed, while a
// word wrongly included just sends a question to Wayan, which is where the
// hard ones belong anyway.
export const HUMAN_WORDS = [
  'wheelchair', 'disabled', 'disability', 'accessible', 'accessibility',
  'baby', 'infant', 'toddler', 'newborn', 'stroller', 'pram', 'pregnant',
  'pregnancy', 'elderly', 'grandmother', 'grandfather', 'walking stick',
  'allergy', 'allergic', 'asthma', 'medication', 'medical', 'injury',
  'injured', 'surgery', 'sick', 'illness', 'condition', 'vertigo',
  'vegetarian', 'vegan', 'halal', 'kosher', 'diet',
  'wedding', 'honeymoon', 'proposal', 'funeral', 'ceremony', 'birthday',
  'drone', 'filming', 'photoshoot', 'photographer',
  'pet', 'dog', 'cat',
  'afraid', 'scared', 'fear', 'safe for', 'is it safe', 'suitable',
  'complaint', 'complain', 'problem with', 'went wrong', 'lost', 'left behind',
];

// A bare "hi" is not an off-topic question, and answering it with "I'd rather
// not guess at that" reads as a door closing. It gets the opening line again
// plus the chips, which is what a person would do.
export const GREETINGS = ['hi', 'hey', 'hello', 'halo', 'hai', 'good morning', 'good afternoon', 'good evening', 'morning', 'evening'];
export const THANKS = ['thanks', 'thank you', 'thankyou', 'makasih', 'terima kasih', 'ok thanks', 'cheers', 'great thanks'];

// When Wayan actually answers (Sep 2026, Wayan: "jam segitu aja dulu coba").
// Bali time, because that is the clock he is on - a guest in Europe asking at
// 3pm their time is asking at 9pm his.
//
// This is not a promise of a reply inside the window, it is the honest shape of
// the day: outside it the panel says he is probably asleep instead of leaving a
// guest watching a screen that never changes. Change the numbers here and both
// sentences follow.
export const REPLY_HOURS = { from: 8, to: 21, tz: 'Asia/Makassar', label: '8am and 9pm Bali time' };

// True when Bali is inside the window right now. Computed from the guest's own
// clock converted to Bali, so it is right wherever they are.
export function wayanIsAround(now = new Date()) {
  const h = Number(new Intl.DateTimeFormat('en-GB', {
    timeZone: REPLY_HOURS.tz, hour: '2-digit', hour12: false,
  }).format(now));
  return h >= REPLY_HOURS.from && h < REPLY_HOURS.to;
}

export const CHAT_COPY = {
  title: 'Cahyana Support',
  // Honest about what this is. It answers instantly from the site's own data,
  // and hands over when it cannot - saying so up front is what stops a guest
  // typing a paragraph and feeling ignored.
  sub: 'Instant answers. Wayan takes the rest.',
  greeting:
    "Hi! Ask me about our tours, prices, pickup or payment and I'll answer straight from our price list. Anything I can't answer goes to Wayan.",
  placeholder: 'Ask about tours, prices, pickup...',
  // Used when the question is clearly about us but has no canned answer.
  handoff:
    "That one is better answered by Wayan himself - he knows the roads, the timing and what is realistic on the day.",
  // Used when the question has nothing to do with what we sell. Polite, short,
  // and it does not pretend to be sorry twice.
  offtopic:
    "I can only help with Cahyana tours, transfers and bookings, so I'd rather not guess at that one.",
  offtopicNudge: 'Here is what I can help with:',
  handoffCta: 'Connect with Wayan',
  moreCta: 'Ask something else',
  hello: 'Hi! What can I help you with?',
  thanks: "You're welcome. Anything else you want to check before you book?",
  // The handover form. Short on purpose: the guest already typed their
  // question, so asking for a second one would be asking twice.
  handoffIntro: 'I can pass this to Wayan. Leave an email and he can reach you even if you close this.',
  handoffName: 'Your name',
  handoffEmail: 'Email (optional)',
  handoffSend: 'Send to Wayan',
  handoffSent: 'Sent. Wayan has it.',
  // Two versions of the same fact, picked by the clock.
  hoursOpen: `He usually replies between ${REPLY_HOURS.label}. Keep this open and his answer lands right here.`,
  hoursClosed: `It is outside ${REPLY_HOURS.label} in Bali now, so he is probably asleep. He answers in the morning, and your email means you will get it either way.`,
  connected: 'You are talking to Wayan now.',
  handoffAlt: 'Or message on WhatsApp',
  threadGone: 'That conversation has expired. Ask again and I will start a new one.',
};
