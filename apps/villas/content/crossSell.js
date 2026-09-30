import { CUE_LINK } from '@/lib/constants';

function cue(path) { return `${CUE_LINK}${path}`; }

// No prices on purpose: copied prices go stale, so each card links to the live price on CUE. Four tours only (Wayan).
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

// CEK WAYAN: photos hidden until Wayan supplies real ones; each card shows the dark fallback.
// Homepage row, ours and CUE's mixed on purpose; airport pickup leads because it is the one guests regret missing.
export const STAY_ADDONS = [
  {
    id: 'airport-pickup',
    eyebrow: 'Getting here',
    label: 'Airport pickup',
    blurb: 'Someone waiting at arrivals with your name, and a fixed price before you land.',
    href: cue('/airport-transfer.html'),
    external: true,
    cta: 'Airport transfer',
  },
  {
    id: 'spa',
    eyebrow: 'At your villa',
    label: 'Spa & Massage',
    blurb: 'A Balinese massage on your own terrace, booked for whenever suits you.',
    href: '/services/spa',
    cta: 'Spa & Massage',
  },
  {
    id: 'tour',
    eyebrow: 'While you are here',
    label: 'A day with a driver',
    blurb: 'Rice terraces, temples, waterfalls - with the same family that hosts you.',
    href: cue('/ubud-tour.html'),
    external: true,
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
