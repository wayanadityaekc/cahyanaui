// The hand-off to Cahyana Ubud Experience - the sister brand, same family, that
// runs the drivers and tours.
//
// NO PRICES HERE, deliberately. Every tour price already lives in CUE's own
// catalog, and CUE's notes are explicit that a copied price goes stale the day
// the real one moves - it has happened to them four times. A card that says
// what the thing is and links to where the live price is cannot be wrong.
//
// FOUR TOURS, NOT THE CATALOG (Wayan): Ubud tour, Ubud culture, charter,
// airport transfer. These are the ones a guest ALREADY STAYING IN UBUD actually
// books - the rest of CUE's catalog is a different decision on a different day,
// and putting it here turns a villa booking into a browse.

import { CUE_LINK } from '@/lib/constants';

const cue = (path) => `${CUE_LINK}${path}`;

export const CUE_TOURS = [
  {
    id: 'ubud-tour',
    label: 'Ubud Tour',
    blurb: 'Rice terraces, a temple, a waterfall. The full day most guests do first.',
    href: cue('/ubud-tour.html'),
  },
  {
    id: 'ubud-culture',
    label: 'Ubud Culture Day',
    blurb: 'Monkey Forest, the palace and the market, at a slower pace.',
    href: cue('/ubud-culture-day.html'),
  },
  {
    id: 'charter',
    label: 'Private Car Charter',
    blurb: 'A car and a driver for the day. You pick where it goes.',
    href: cue('/charter.html'),
  },
  {
    id: 'airport-transfer',
    label: 'Airport Transfer',
    blurb: 'Met at arrivals and driven to the villa, flight number and all.',
    href: cue('/airport-transfer.html'),
  },
];

/**
 * The homepage row. MIXED ON PURPOSE - two of ours and one of CUE's - because
 * that is how a guest thinks about it: things to add to the stay, not things
 * belonging to two companies. Each card says where it goes.
 *
 * Airport pickup leads the row: it is the only one with a deadline attached to
 * it, and the one a guest regrets not booking.
 */
export const STAY_ADDONS = [
  {
    id: 'airport-pickup',
    eyebrow: 'Getting here',
    label: 'Airport pickup',
    blurb: 'Someone waiting at arrivals with your name, and a fixed price before you land.',
    href: cue('/airport-transfer.html'),
    external: true,
    img: 'https://picsum.photos/seed/airport9/1200/900',
    alt: 'Driver waiting at Bali airport arrivals',
    cta: 'Airport transfer',
  },
  {
    id: 'spa',
    eyebrow: 'At your villa',
    label: 'Spa & Massage',
    blurb: 'A Balinese massage on your own terrace, booked for whenever suits you.',
    href: '/services/spa',
    img: 'https://picsum.photos/seed/spa9/1200/900',
    alt: 'Massage set up on a villa terrace in Ubud',
    cta: 'Spa & Massage',
  },
  {
    id: 'tour',
    eyebrow: 'While you are here',
    label: 'A day with a driver',
    blurb: 'Rice terraces, temples, waterfalls - with the same family that hosts you.',
    href: cue('/ubud-tour.html'),
    external: true,
    img: 'https://picsum.photos/seed/ubudwalk9/1200/900',
    alt: 'Rice terraces near Ubud',
    cta: 'See the tours',
  },
];

export const EXPLORE_MORE = {
  eyebrow: 'Same family',
  title: 'More to do in Bali',
  lede: 'Drivers, day tours and transfers across the island are run by Cahyana Ubud Experience - the same family that hosts you here, with every price upfront.',
  cta: 'Explore tours in Bali',
  href: CUE_LINK,
};
