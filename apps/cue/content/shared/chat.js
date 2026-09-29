// Chat routing and the chat's own lines; answers come from FAQ or the live catalog, never copied here.

// Suggestion chips, phrased the way a guest would type them.
export const SUGGESTIONS = [
  'How much is a day tour?',
  'What time do tours start?',
  'Do you pick up from my hotel?',
  'Is the price per person or per car?',
  'How do I pay?',
  'What if I need to cancel?',
];

// Each topic names an exact FAQ question or a catalog builder; a stale faq string throws at load.
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

// Situations only a person should answer; err toward adding words here (they hand over to Wayan).
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

// Greetings and thanks get a friendly canned reply instead of a handoff.
export const GREETINGS = ['hi', 'hey', 'hello', 'halo', 'hai', 'good morning', 'good afternoon', 'good evening', 'morning', 'evening'];
export const THANKS = ['thanks', 'thank you', 'thankyou', 'makasih', 'terima kasih', 'ok thanks', 'cheers', 'great thanks'];

// Wayan's reply window in Bali time; both sentences that mention it follow these numbers.
export const REPLY_HOURS = { from: 8, to: 21, tz: 'Asia/Makassar', label: '8am and 9pm Bali time' };

// True when Bali time is inside the reply window, wherever the guest is.
export function wayanIsAround(now = new Date()) {
  const h = Number(new Intl.DateTimeFormat('en-GB', {
    timeZone: REPLY_HOURS.tz, hour: '2-digit', hour12: false,
  }).format(now));
  return h >= REPLY_HOURS.from && h < REPLY_HOURS.to;
}

export const CHAT_COPY = {
  title: 'Cahyana Support',
  // Panel header: says up front that it answers instantly and hands the rest to Wayan.
  sub: 'Instant answers. Wayan takes the rest.',
  greeting:
    "Hi! Ask me about our tours, prices, pickup or payment and I'll answer straight from our price list. Anything I can't answer goes to Wayan.",
  placeholder: 'Ask about tours, prices, pickup...',
  // Reply for anything the code can't answer; there is deliberately no decline message.
  handoff:
    "That one is better answered by Wayan himself - he knows the roads, the timing and what is realistic on the day.",
  moreCta: 'Ask something else',
  // Sign-in offer, worded as a gain since chatting works without it.
  signedOut: 'Chatting as a guest.',
  signIn: 'Sign in',
  // Greeting by name, shown once as soon as the name is known.
  hello: 'Hi {name}! What can I help you with?',
  thanks: "You're welcome. Anything else you want to check before you book?",
  // Handover asks nothing first; email is only asked if the chat can't finish live.
  connecting: 'Will connect you to Wayan for this one. Give me a moment.',
  connected: 'You are with Wayan now.',
  // Email offer, shown only outside hours or after a quiet wait; skippable.
  emailAsk: 'Want his answer by email too, in case you close this?',
  emailField: 'Your email',
  emailSend: 'Send',
  emailSkip: 'No thanks',
  emailDone: 'Got it. He will reach you there.',
  emailBad: 'That does not look like an email address.',
  // Two versions of the same fact, picked by the clock.
  hoursOpen: `He usually replies between ${REPLY_HOURS.label}. Keep this open and his answer lands right here.`,
  hoursClosed: `It is outside his hours in Bali right now, so he is probably asleep. He answers from ${REPLY_HOURS.from}am Bali time.`,
  connectedStrip: 'You are talking to Wayan now.',
  // Live presence (dashboard socket open) outranks the reply-hours lines above.
  ownerHere: 'Wayan is online right now.',
  hoursHere: 'He is at the dashboard right now, so this should be quick.',
  // Typing indicator names Wayan instead of showing bare dots.
  typing: 'Wayan is typing',
  // How long to wait, inside his hours, before offering email at all.
  quietMs: 120000,
  threadGone: 'That conversation has expired. Ask again and I will start a new one.',
};
