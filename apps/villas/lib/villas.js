// CEK WAYAN: placeholder service fee %, confirm the real figure.
export const SERVICE_FEE_RATE = 0.05;

// All copy here is real (ported from the old site); nightly rates are rupiah, set by Wayan (Sep 2026).
export const VILLAS = {
  'cahyana-house': {
    slug: 'cahyana-house',
    name: 'Cahyana House',
    badge: 'Most Popular',
    tagline: 'North Ubud · Entire house',
    nightlyRateIdr: 2500000,
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    beds: '3 king',
    rating: '4.96',
    reviews: 221,
    host: 'PT Cahyana Ubud Experience · replies within an hour',
    shortDesc: 'A spacious villa with a private pool and tropical garden. Perfect for couples or small families.',
    // Real photo of this villa, reused from CUE's own asset (not a stock shot).
    heroImg: '/images/cahyana-house.webp',
    cardImg: '/images/cahyana-house.webp',
    gallery: [
      { src: '/images/cahyana-house.webp', alt: 'Cahyana House pool and garden at dusk' },
      { src: '/images/cahyana-house-pool-aerial-diagonal.jpg', alt: 'Cahyana House private pool seen from above, with sunbeds and tropical garden' },
      { src: '/images/cahyana-house-pool-tropical-garden.jpg', alt: 'Cahyana House pool framed by tropical plants' },
      { src: '/images/cahyana-house-balcony-teak-chairs-1.jpg', alt: 'Cahyana House bedroom terrace with teak chairs' },
      { src: '/images/cahyana-house-bathroom-stone-basin-1-1161.jpg', alt: 'Cahyana House bathroom with a river-stone basin' },
      { src: '/images/cahyana-house-entrance-teak-door.jpg', alt: 'Cahyana House entrance and teak door in the garden' },
      { src: '/images/cahyana-house-garden-stone-table-1.jpg', alt: 'Cahyana House garden with a stone table' },
    ],
    amenities: ['Private Pool', 'Full Kitchen', 'Smart TV', 'Ensuite Bathrooms', 'Home Garden', 'Motorbike Parking'],
    about: [
      "This spacious 3-bedroom house sits north of Ubud, offering a quiet escape while staying close to everything. It's surrounded by Balinese village life - a temple, rice fields, restaurants and the local market are all nearby.",
      'Airbnb marks it as extra spacious and one of the few places in the area with a pool. Guests mention the smooth check-in more than almost anything else.',
    ],
    spaceList: [
      { title: 'Three bedrooms', desc: 'Each with a king bed and a direct view of the pool.' },
      { title: 'Ensuite bathrooms', desc: 'One in every bedroom, 3 bathrooms in total.' },
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
      { label: 'Host', value: 'PT Cahyana Ubud Experience · replies within an hour' },
    ],
  },

  'cahyana-tibuah': {
    slug: 'cahyana-tibuah',
    name: 'Cahyana Tibuah',
    badge: null,
    tagline: 'North Ubud · Entire villa',
    nightlyRateIdr: 1700000,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    beds: '2 king',
    rating: '4.96',
    reviews: 85,
    host: 'Wayan · Superhost, replies within an hour, speaks English & Indonesian',
    shortDesc: 'A serene escape with a private pool, open living space and a calming view of the tropical garden.',
    // Real photo of this villa, reused from CUE's own asset (not a stock shot).
    heroImg: '/images/cahyana-tibuah.webp',
    cardImg: '/images/cahyana-tibuah.webp',
    gallery: [
      { src: '/images/cahyana-tibuah.webp', alt: 'Cahyana Tibuah, the pool at dusk' },
      { src: '/images/cahyana-tibuah-pool-day-garden-view-1.jpg', alt: 'Cahyana Tibuah - private pool and tropical garden by day (1)' },
      { src: '/images/cahyana-tibuah-pool-day-garden-view-2.jpg', alt: 'Cahyana Tibuah - private pool and tropical garden by day (2)' },
      { src: '/images/cahyana-tibuah-pool-day-loungers-1.jpg', alt: 'Cahyana Tibuah - sun loungers beside the private pool (1)' },
      { src: '/images/cahyana-tibuah-pool-day-loungers-2.jpg', alt: 'Cahyana Tibuah - sun loungers beside the private pool (2)' },
      { src: '/images/cahyana-tibuah-pool-day-terrace-loungers.jpg', alt: 'Cahyana Tibuah - sun loungers beside the private pool' },
      { src: '/images/cahyana-tibuah-pool-day-villa-facade.jpg', alt: 'Cahyana Tibuah - the villa seen across the pool by day' },
      { src: '/images/cahyana-tibuah-pool-dusk-palms-1.jpg', alt: 'Cahyana Tibuah - the pool and palms at dusk (1)' },
      { src: '/images/cahyana-tibuah-pool-dusk-palms-2.jpg', alt: 'Cahyana Tibuah - the pool and palms at dusk (2)' },
      { src: '/images/cahyana-tibuah-pool-dusk-villa-exterior.jpg', alt: 'Cahyana Tibuah - the villa exterior at dusk' },
      { src: '/images/cahyana-tibuah-pool-dusk-villa-lit.jpg', alt: 'Cahyana Tibuah - the villa lit at dusk above the pool' },
      { src: '/images/cahyana-tibuah-pool-night-garden-1.jpg', alt: 'Cahyana Tibuah - the pool and garden at night (1)' },
      { src: '/images/cahyana-tibuah-pool-night-garden-2.jpg', alt: 'Cahyana Tibuah - the pool and garden at night (2)' },
      { src: '/images/cahyana-tibuah-pool-night-terrace.jpg', alt: 'Cahyana Tibuah - the pool terrace at night' },
      { src: '/images/cahyana-tibuah-pool-sunloungers-pair.jpg', alt: 'Cahyana Tibuah - a pair of sun loungers by the pool' },
      { src: '/images/cahyana-tibuah-pool.jpg', alt: 'Cahyana Tibuah - the private pool' },
      { src: '/images/cahyana-tibuah-pool2.jpg', alt: 'Cahyana Tibuah - the private pool (2)' },
      { src: '/images/cahyana-tibuah-sunlounger-pool-garden.jpg', alt: 'Cahyana Tibuah - a pair of sun loungers by the pool (2)' },
      { src: '/images/cahyana-tibuah-sunlounger-towel-detail.jpg', alt: 'Cahyana Tibuah - a folded towel on a sun lounger' },
      { src: '/images/cahyana-tibuah-entrance-courtyard-door.jpg', alt: 'Cahyana Tibuah - the courtyard entrance door' },
      { src: '/images/cahyana-tibuah-entrance-doors-driveway.jpg', alt: 'Cahyana Tibuah - the entrance doors from the driveway' },
      { src: '/images/cahyana-tibuah-front.jpg', alt: 'Cahyana Tibuah - the front of the villa' },
      { src: '/images/cahyana-tibuah-villa-entrance-door-pool.jpg', alt: 'Cahyana Tibuah - the entrance door beside the pool' },
      { src: '/images/cahyana-tibuah-dining-table-teak.jpg', alt: 'Cahyana Tibuah - the teak dining table' },
      { src: '/images/cahyana-tibuah-kitchen-cabinets-fridge.jpg', alt: 'Cahyana Tibuah - the kitchen cabinets and fridge' },
      { src: '/images/cahyana-tibuah-kitchen-dining-area.jpg', alt: 'Cahyana Tibuah - the kitchen and dining area' },
      { src: '/images/cahyana-tibuah-kitchen-gas-hob.jpg', alt: 'Cahyana Tibuah - the kitchen gas hob' },
      { src: '/images/cahyana-tibuah-kitchen-wall-cabinets.jpg', alt: 'Cahyana Tibuah - the kitchen wall cabinets' },
      { src: '/images/cahyana-tibuah-living-room-dining-table.jpg', alt: 'Cahyana Tibuah - the living room dining table' },
      { src: '/images/cahyana-tibuah-living-room-sofa-coffee-table-1.jpg', alt: 'Cahyana Tibuah - the living room sofa and coffee table (1)' },
      { src: '/images/cahyana-tibuah-living-room-sofa-coffee-table-2.jpg', alt: 'Cahyana Tibuah - the living room sofa and coffee table (2)' },
      { src: '/images/cahyana-tibuah-living-room-teak-sofa-1.jpg', alt: 'Cahyana Tibuah - the living room teak sofa (1)' },
      { src: '/images/cahyana-tibuah-living-room-teak-sofa-2.jpg', alt: 'Cahyana Tibuah - the living room teak sofa (2)' },
      { src: '/images/cahyana-tibuah-bed-towel-elephants-closeup.jpg', alt: 'Cahyana Tibuah - elephant towel art, close up' },
      { src: '/images/cahyana-tibuah-bed-towel-swan-rose-petals.jpg', alt: 'Cahyana Tibuah - swan towel art and rose petals on the bed' },
      { src: '/images/cahyana-tibuah-bedroom-canopy-bed-towel-elephants.jpg', alt: 'Cahyana Tibuah - towel art on the canopy bed' },
      { src: '/images/cahyana-tibuah-bedroom-canopy-bench-1.jpg', alt: 'Cahyana Tibuah - the canopy bed and bench (1)' },
      { src: '/images/cahyana-tibuah-bedroom-canopy-bench-2.jpg', alt: 'Cahyana Tibuah - the canopy bed and bench (2)' },
      { src: '/images/cahyana-tibuah-bedroom-canopy-bench-3.jpg', alt: 'Cahyana Tibuah - the canopy bed and bench (3)' },
      { src: '/images/cahyana-tibuah-bedroom-canopy-bench-4.jpg', alt: 'Cahyana Tibuah - the canopy bed and bench (4)' },
      { src: '/images/cahyana-tibuah-bedroom-canopy-bench-5.jpg', alt: 'Cahyana Tibuah - the canopy bed and bench (5)' },
      { src: '/images/cahyana-tibuah-bedroom-canopy-pool-view-1.jpg', alt: 'Cahyana Tibuah - the canopy bed facing the pool (1)' },
      { src: '/images/cahyana-tibuah-bedroom-canopy-pool-view-2.jpg', alt: 'Cahyana Tibuah - the canopy bed facing the pool (2)' },
      { src: '/images/cahyana-tibuah-bedroom-canopy-pool-view-3.jpg', alt: 'Cahyana Tibuah - the canopy bed facing the pool (3)' },
      { src: '/images/cahyana-tibuah-bedroom-canopy-pool-view-4.jpg', alt: 'Cahyana Tibuah - the canopy bed facing the pool (4)' },
      { src: '/images/cahyana-tibuah-bedroom-canopy-towel-art.jpg', alt: 'Cahyana Tibuah - towel art on the canopy bed (2)' },
      { src: '/images/cahyana-tibuah-bedroom-towel-swans-1.jpg', alt: 'Cahyana Tibuah - swan towel art on the bed (1)' },
      { src: '/images/cahyana-tibuah-bedroom-towel-swans-2.jpg', alt: 'Cahyana Tibuah - swan towel art on the bed (2)' },
      { src: '/images/cahyana-tibuah-bedside-table-teak.jpg', alt: 'Cahyana Tibuah - the teak bedside table' },
      { src: '/images/cahyana-tibuah-bathroom-hair-dryer.jpg', alt: 'Cahyana Tibuah - the hair dryer in the bathroom' },
      { src: '/images/cahyana-tibuah-bathroom-marble-basin-1.jpg', alt: 'Cahyana Tibuah - the bathroom marble basin (1)' },
      { src: '/images/cahyana-tibuah-bathroom-marble-basin-2.jpg', alt: 'Cahyana Tibuah - the bathroom marble basin (2)' },
      { src: '/images/cahyana-tibuah-bathroom-marble-toilet.jpg', alt: 'Cahyana Tibuah - the marble bathroom' },
      { src: '/images/cahyana-tibuah-bathroom-marble-wardrobe-1.jpg', alt: 'Cahyana Tibuah - the bathroom wardrobe in marble (1)' },
      { src: '/images/cahyana-tibuah-bathroom-marble-wardrobe-2.jpg', alt: 'Cahyana Tibuah - the bathroom wardrobe in marble (2)' },
      { src: '/images/cahyana-tibuah-bathroom-marble-wardrobe-3.jpg', alt: 'Cahyana Tibuah - the bathroom wardrobe in marble (3)' },
      { src: '/images/cahyana-tibuah-bathroom-rain-shower.jpg', alt: 'Cahyana Tibuah - the rain shower' },
      { src: '/images/cahyana-tibuah-bathroom-stone-basin-1.jpg', alt: 'Cahyana Tibuah - the bathroom river-stone basin (1)' },
      { src: '/images/cahyana-tibuah-bathroom-stone-basin-2.jpg', alt: 'Cahyana Tibuah - the bathroom river-stone basin (2)' },
      { src: '/images/cahyana-tibuah-bathroom-stone-basin-3.jpg', alt: 'Cahyana Tibuah - the bathroom river-stone basin (3)' },
      { src: '/images/cahyana-tibuah-bathroom-towel-shelf-1.jpg', alt: 'Cahyana Tibuah - folded towels on the bathroom shelf (1)' },
      { src: '/images/cahyana-tibuah-bathroom-towel-shelf-2.jpg', alt: 'Cahyana Tibuah - folded towels on the bathroom shelf (2)' },
      { src: '/images/cahyana-tibuah-outdoor-shower-head.jpg', alt: 'Cahyana Tibuah - the outdoor shower head' },
      { src: '/images/cahyana-tibuah-outdoor-shower-stone-wall.jpg', alt: 'Cahyana Tibuah - the outdoor shower against a stone wall' },
      { src: '/images/cahyana-tibuah-wall-art-framed-prints.jpg', alt: 'Cahyana Tibuah - framed prints on the wall' },
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
  const nightlyIdr = villa.nightlyRateIdr;
  const subtotalIdr = nightlyIdr * nights;
  // Rounded up to whole thousands, like every rupiah price on CUE.
  const serviceFeeIdr = Math.ceil((subtotalIdr * SERVICE_FEE_RATE) / 1000) * 1000;
  return { villa, nights, nightlyIdr, subtotalIdr, serviceFeeIdr, totalIdr: subtotalIdr + serviceFeeIdr };
}
