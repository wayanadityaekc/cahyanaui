// Villa chat routing and the chat's own lines; answers come from this site's FAQ and villa data, never CUE's tours.

// Suggestion chips, phrased the way a guest would type them.
export const SUGGESTIONS = [
  'How many people can stay?',
  'What does a night cost?',
  'Do I pay a deposit?',
  'What if I need to cancel?',
  'What time is check-in?',
  'Is breakfast included?',
];

// Each topic names an exact FAQ question (content/company.js) or a builder; a stale faq string throws at load.
export const TOPICS = [
  { id: 'villa-prices', build: 'villaPrices',
    strong: ['per night', 'a night', 'nightly', 'night cost', 'room rate'],
    words: ['how much', 'price', 'prices', 'cost', 'costs', 'rate', 'rates', 'night', 'nights', 'expensive', 'cheap'] },

  { id: 'price-shown', faq: 'Is the price on the site what I pay?',
    strong: ['service fee', 'hidden', 'what i pay', 'final price', 'extra fee'],
    words: ['fee', 'fees', 'hidden', 'total', 'season', 'seasonal'] },

  { id: 'sleeps', faq: 'How many people can each villa sleep?',
    strong: ['how many people', 'how many guests', 'sleep', 'sleeps', 'bedrooms'],
    words: ['people', 'guests', 'bedroom', 'bedrooms', 'beds', 'family', 'group', 'capacity', 'stay'] },

  { id: 'pool', faq: 'Does each villa really have its own pool?',
    strong: ['pool', 'swimming'],
    words: ['pool', 'swim', 'swimming', 'private pool'] },

  { id: 'kitchen', faq: 'Is there a kitchen?',
    strong: ['kitchen', 'cook'],
    words: ['kitchen', 'cook', 'cooking', 'fridge'] },

  { id: 'difference', faq: 'What is the difference between the two?',
    strong: ['difference', 'which villa', 'compare', 'which one'],
    words: ['difference', 'different', 'compare', 'better', 'choose', 'quieter'] },

  { id: 'book', faq: 'How do I book?',
    strong: ['how do i book', 'book', 'booking', 'reserve', 'reservation'],
    words: ['book', 'booking', 'reserve', 'reservation'] },

  { id: 'currency', faq: 'Can I pay in my own currency?',
    strong: ['currency', 'rupiah', 'dollars', 'euro'],
    words: ['currency', 'rupiah', 'idr', 'usd', 'dollar', 'euro', 'aud', 'pound', 'gbp'] },

  { id: 'airbnb', faq: 'Do you take bookings outside Airbnb?',
    strong: ['airbnb', 'book direct'],
    words: ['airbnb', 'direct', 'listing'] },

  { id: 'payment', faq: 'Do I pay a deposit, or the whole thing?',
    strong: ['deposit', 'pay in full', 'full payment', 'upfront'],
    words: ['deposit', 'pay', 'payment', 'upfront', 'advance', 'full'] },

  { id: 'cancel', faq: 'What if I need to cancel?',
    strong: ['cancel', 'cancellation', 'refund'],
    words: ['cancel', 'cancellation', 'refund'] },

  { id: 'move-dates', faq: 'Can I move my dates instead of cancelling?',
    strong: ['move my dates', 'change my dates', 'change dates', 'reschedule', 'postpone'],
    words: ['move', 'change', 'reschedule', 'postpone', 'dates'] },

  { id: 'check-times', faq: 'What time is check-in and check-out?',
    strong: ['check in', 'check out', 'checkin', 'checkout'],
    words: ['check in', 'check out', 'checkin', 'checkout', 'arrive', 'arrival', 'leave', 'late', 'early'] },

  { id: 'breakfast', faq: 'Is breakfast included?', link: { href: '/services/breakfast', label: 'Breakfast' },
    strong: ['breakfast'],
    words: ['breakfast', 'morning', 'floating breakfast'] },

  { id: 'massage', faq: 'Can I get a massage at the villa?', link: { href: '/services/spa', label: 'Spa & Massage' },
    strong: ['massage', 'spa', 'therapist'],
    words: ['massage', 'spa', 'therapist', 'treatment', 'reflexology'] },

  { id: 'dinner', build: 'liveDinner',
    strong: ['dinner', 'chef', 'cooking class'],
    words: ['dinner', 'chef', 'meal', 'bbq', 'feast', 'cooking class'] },

  { id: 'driver', faq: 'Can you arrange a driver or airport pickup?',
    strong: ['driver', 'airport pickup', 'pick me up', 'pickup', 'pick up', 'transfer'],
    words: ['driver', 'pickup', 'pick up', 'pick me up', 'transfer', 'taxi', 'car'] },

  { id: 'airport-far', faq: 'How far is the airport?',
    strong: ['how far', 'from the airport', 'to the airport'],
    words: ['airport', 'far', 'distance', 'dps', 'ngurah rai'] },

  { id: 'location', faq: 'Where exactly are the villas?',
    strong: ['where are', 'where is', 'located', 'location', 'address'],
    words: ['location', 'located', 'address', 'north ubud', 'gianyar', 'map'] },

  { id: 'getting-around', faq: 'Do I need a scooter or car to stay here?',
    strong: ['walking distance', 'walk to', 'need a car', 'get around'],
    words: ['walk', 'walking', 'around', 'cafes', 'warung', 'restaurants'] },
];

// Situations and topics only a person should answer; scooter terms are unconfirmed, so every scooter question goes to Wayan.
export const HUMAN_WORDS = [
  // Tours and day trips are the tour site's; Wayan runs both, so he answers rather than this villa chat.
  'tour', 'tours', 'day trip', 'excursion', 'sightseeing', 'itinerary',
  'scooter', 'scooters', 'motorbike', 'motorbikes', 'motorcycle', 'bike rental', 'moped',
  'available', 'availability', 'free on', 'vacancy', 'dates free',
  'wheelchair', 'disabled', 'disability', 'accessible', 'accessibility',
  'baby', 'infant', 'toddler', 'newborn', 'cot', 'crib', 'pregnant', 'elderly',
  'allergy', 'allergic', 'medication', 'medical', 'injury', 'sick',
  'wedding', 'honeymoon', 'proposal', 'birthday', 'party', 'event',
  'drone', 'filming', 'photoshoot', 'photographer',
  'pet', 'pets', 'dog', 'cat',
  'discount', 'long stay', 'monthly', 'weekly rate',
  'complaint', 'complain', 'problem with', 'went wrong', 'lost', 'left behind', 'broken',
];

// Service prices are "Ask us" on every service page, so a price question about one goes to a person.
export const SERVICE_WORDS = ['breakfast', 'spa', 'massage', 'dinner', 'chef', 'cooking class', 'treatment'];
export const PRICE_WORDS = ['how much', 'price', 'prices', 'cost', 'costs', 'rate', 'rates', 'charge'];

// Greetings and thanks get a friendly canned reply instead of a handoff.
export const GREETINGS = ['hi', 'hey', 'hello', 'halo', 'hai', 'good morning', 'good afternoon', 'good evening', 'morning', 'evening'];
export const THANKS = ['thanks', 'thank you', 'thankyou', 'makasih', 'terima kasih', 'ok thanks', 'cheers', 'great thanks'];

// Wayan's reply window in Bali time, the same hours CUE's chat states; both sentences that mention it follow these numbers.
export const REPLY_HOURS = { from: 8, to: 21, tz: 'Asia/Makassar', label: '8am and 9pm Bali time' };

// True when Bali time is inside the reply window, wherever the guest is.
export function wayanIsAround(now = new Date()) {
  const hour = Number(new Intl.DateTimeFormat('en-GB', {
    timeZone: REPLY_HOURS.tz, hour: '2-digit', hour12: false,
  }).format(now));
  return hour >= REPLY_HOURS.from && hour < REPLY_HOURS.to;
}

export const CHAT_COPY = {
  title: 'Ubud Private Villas',
  sub: 'Instant answers. Wayan takes the rest.',
  greeting:
    "Hi! Ask me about the two villas, rates, check-in, payment or cancelling and I'll answer from what is on this site. Anything I can't answer goes to Wayan.",
  placeholder: 'Ask about the villas, rates, check-in...',
  placeholderLive: 'Write to Wayan...',
  // Reply for anything the site cannot answer itself; there is deliberately no decline message.
  handoff: 'That one is better answered by Wayan himself.',
  signedOut: 'Chatting as a guest.',
  signIn: 'Sign in',
  hello: 'Hi {name}! What can I help you with?',
  helloAnon: 'Hi! What can I help you with?',
  thanks: "You're welcome. Anything else you want to check before you book?",
  connecting: 'I will connect you to Wayan for this one. Give me a moment.',
  connected: 'You are with Wayan now.',
  emailAsk: 'Want his answer by email too, in case you close this?',
  emailField: 'Your email',
  emailSend: 'Send',
  emailSkip: 'No thanks',
  emailDone: 'Got it. He will reach you there.',
  emailBad: 'That does not look like an email address.',
  hoursOpen: `He usually replies between ${REPLY_HOURS.label}. Keep this open and his answer lands right here.`,
  hoursClosed: `It is outside his hours in Bali right now, so he is probably asleep. He answers from ${REPLY_HOURS.from}am Bali time.`,
  connectedStrip: 'You are talking to Wayan now.',
  // Live presence (his dashboard socket is open) outranks the reply-hours lines above.
  ownerHere: 'Wayan is online right now.',
  hoursHere: 'He is at the dashboard right now, so this should be quick.',
  typing: 'Wayan is typing',
  ownerName: 'Wayan',
  quietMs: 120000,
  threadGone: 'That conversation has expired. Ask again and I will start a new one.',
  sendFailed: 'That did not send. Try again in a moment.',
  reachFailed: 'Could not reach Wayan just now.',
  // The switch to WhatsApp, always under the input; live chat stays the default.
  whatsappNote: 'Prefer WhatsApp?',
  whatsappLabel: 'Continue on WhatsApp',
};
