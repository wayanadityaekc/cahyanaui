// Villa data. Ratings, review counts, host names, amenities, and all
// descriptive copy below are the real content already established on this
// site (ported from the original ubudprivatevillas.com HTML) — nothing here
// is invented. The one genuinely new/placeholder field is nightlyRate: the
// old site never had in-house pricing (every booking went straight to the
// live Airbnb calendar), so the flat per-night numbers used to power the new
// on-site booking flow are provisional example figures from Wayan's own
// mockup, clearly flagged below for him to confirm.
export const SERVICE_FEE_RATE = 0.05; // CEK WAYAN — placeholder service fee %, confirm real figure

export const VILLAS = {
  'cahyana-house': {
    slug: 'cahyana-house',
    name: 'Cahyana House',
    badge: 'Most Popular',
    tagline: 'North Ubud · Entire house',
    // CEK WAYAN — placeholder rate from the mockup, confirm real per-night pricing
    nightlyRate: 120,
    guests: 6,
    bedrooms: 3,
    bathrooms: 4.5,
    beds: '3 king',
    rating: '4.96',
    reviews: 221,
    host: 'Made · Superhost, 3 years hosting, replies within an hour',
    registration: 'NIB 2501220013924 · KBLI 55193',
    shortDesc: 'A spacious villa with a private pool and tropical garden. Perfect for couples or small families.',
    heroImg: 'https://picsum.photos/seed/house-hero/1800/900',
    cardImg: 'https://picsum.photos/seed/house-hero/900/700',
    gallery: [
      { src: 'https://picsum.photos/seed/house-hero/1200/900', alt: 'Cahyana House pool and garden' },
      { src: 'https://picsum.photos/seed/h1b/1200/900', alt: 'Cahyana House pool at sunset' },
      { src: 'https://picsum.photos/seed/h2b/1200/900', alt: 'Cahyana House living area with smart TV' },
      { src: 'https://picsum.photos/seed/h3b/1200/900', alt: 'Cahyana House king bedroom facing the pool' },
      { src: 'https://picsum.photos/seed/h4b/1200/900', alt: 'Cahyana House ensuite bathroom' },
      { src: 'https://picsum.photos/seed/h5b/1200/900', alt: 'Cahyana House kitchen and dining area' },
    ],
    amenities: ['Private Pool', 'Full Kitchen', 'Smart TV', 'Ensuite Bathrooms', 'Home Garden', 'Motorbike Parking'],
    about: [
      "This spacious 3-bedroom house sits north of Ubud, offering a quiet escape while staying close to everything. It's surrounded by Balinese village life - a temple, rice fields, restaurants and the local market are all nearby.",
      'Airbnb marks it as extra spacious and one of the few places in the area with a pool. Guests mention the smooth check-in more than almost anything else.',
    ],
    spaceList: [
      { title: 'Three bedrooms', desc: 'Each with a king bed and a direct view of the pool.' },
      { title: 'Ensuite bathrooms', desc: 'One in every bedroom, 4.5 bathrooms in total.' },
      { title: 'Living area', desc: 'Comfortable lounge with a smart TV.' },
      { title: 'Kitchen & dining', desc: 'Fully equipped kitchen with its own dining area.' },
      { title: 'Outside', desc: 'Private pool and home garden.' },
      { title: 'Parking', desc: 'Space for motorbikes on the property.' },
    ],
    gettingAround: [
      { label: 'Ubud Palace', value: '10-minute drive' },
      { label: 'Monkey Forest', value: '10-minute drive' },
      { label: 'Tegallalang', value: '10-minute drive' },
      { label: 'Nearest cafe', value: '2-minute walk' },
      { label: 'Mini market', value: 'A few minutes away' },
    ],
    scores: [
      ['Cleanliness', '5.0'],
      ['Accuracy', '5.0'],
      ['Check-in', '5.0'],
      ['Communication', '5.0'],
      ['Location', '4.8'],
      ['Value', '4.9'],
    ],
    reviewQuote: {
      text: "We had a wonderful stay! The place is very clean, comfortable, and peaceful - perfect for a family getaway. There are many great cafes and restaurants near the villa. The owners, Pak Made and his wife, are incredibly kind.",
      source: 'Airbnb guest',
    },
    goodToKnow: [
      { label: 'Check-in', value: 'Through a Balinese family compound - a real welcome, full privacy inside' },
      { label: 'Geckos', value: 'Small lizards are normal here, harmless, and considered good luck' },
      { label: 'Host', value: 'Made · Superhost, 3 years hosting, replies within an hour' },
      { label: 'Registration', value: 'NIB 2501220013924 · KBLI 55193' },
    ],
  },

  'cahyana-tibuah': {
    slug: 'cahyana-tibuah',
    name: 'Cahyana Tibuah',
    badge: null,
    tagline: 'North Ubud · Entire villa',
    // CEK WAYAN — placeholder rate from the mockup, confirm real per-night pricing
    nightlyRate: 150,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    beds: '2 king',
    rating: '4.96',
    reviews: 85,
    host: 'Wayan · Superhost, replies within an hour, speaks English & Indonesian',
    registration: 'NIB 2501220013924',
    shortDesc: 'A serene escape with a private pool, open living space and a calming view of the tropical garden.',
    heroImg: 'https://picsum.photos/seed/tibuah-hero/1800/900',
    cardImg: 'https://picsum.photos/seed/tibuah-hero/900/700',
    gallery: [
      { src: 'https://picsum.photos/seed/tibuah-hero/1200/900', alt: 'Cahyana Tibuah pool with rice field view' },
      { src: 'https://picsum.photos/seed/t1b/1200/900', alt: 'Cahyana Tibuah pool above the rice field' },
      { src: 'https://picsum.photos/seed/t2b/1200/900', alt: 'Cahyana Tibuah open plan living area' },
      { src: 'https://picsum.photos/seed/t3b/1200/900', alt: 'Cahyana Tibuah king bedroom' },
      { src: 'https://picsum.photos/seed/t4b/1200/900', alt: 'Cahyana Tibuah ensuite bathroom' },
      { src: 'https://picsum.photos/seed/t5b/1200/900', alt: 'Cahyana Tibuah outdoor shower' },
    ],
    amenities: ['Private Pool', 'Full Kitchen', 'Smart TV', 'Ensuite Bathrooms', 'Outdoor Shower', 'Scooter Parking'],
    about: [
      "A private 2-bedroom villa nestled among peaceful rice fields in northern Ubud. The villa is entirely yours, each room comes with its own key, and it sits about a three-minute walk down a small path into the fields.",
      'Airbnb marks it as top rated by guests from Australia - 100% of them gave it five stars in the past year.',
    ],
    spaceList: [
      { title: 'Two bedrooms', desc: 'King beds, both with a direct view of the pool.' },
      { title: 'Ensuite bathrooms', desc: 'One in each bedroom.' },
      { title: 'Living area', desc: 'Open plan lounge, neutral-toned sofa, smart TV.' },
      { title: 'Kitchen & dining', desc: 'Fully equipped kitchen with a dining area.' },
      { title: 'Outside', desc: 'Private pool and an outdoor shower.' },
      { title: 'Parking', desc: 'Scooter parking just outside, car parking near the main street.' },
    ],
    gettingAround: [
      { label: 'Ubud Palace', value: '10-minute drive' },
      { label: 'Monkey Forest', value: '10-minute drive' },
      { label: 'Tegallalang', value: '10-minute drive' },
      { label: 'Nearest restaurant', value: '2 minutes' },
      { label: 'Mini market', value: '3 minutes' },
    ],
    scores: [
      ['Cleanliness', '5.0'],
      ['Accuracy', '5.0'],
      ['Check-in', '5.0'],
      ['Communication', '4.9'],
      ['Location', '4.8'],
      ['Value', '4.9'],
    ],
    reviewQuote: null,
    goodToKnow: [
      { label: 'Access', value: 'Three-minute walk down a small path by the rice fields' },
      { label: 'Privacy', value: 'The villa is entirely yours, each room separately keyed' },
      { label: 'Host', value: 'Wayan · Superhost, replies within an hour, speaks English & Indonesian' },
      { label: 'Registration', value: 'NIB 2501220013924' },
    ],
  },
};

export const VILLA_LIST = Object.values(VILLAS);

export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diff = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export function priceBreakdown(slug, checkIn, checkOut) {
  const villa = VILLAS[slug];
  if (!villa) return null;
  const nights = nightsBetween(checkIn, checkOut);
  const subtotal = villa.nightlyRate * nights;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + serviceFee;
  return { villa, nights, subtotal, serviceFee, total };
}
