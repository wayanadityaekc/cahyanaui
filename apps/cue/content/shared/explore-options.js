import { Bus, CarFront, CarTaxiFront, MapPin, TreePalm } from 'lucide-react';

// The "All Programs" (/programs.html) entry is intentionally omitted here - the
// page exists but is not ready to publish, so it stays unlinked and noindexed.
export const EXPLORE_OPTIONS = [
  {
    href: '/tour.html',
    name: 'Tour programs',
    sub: 'Full-day private tours',
    cat: 'tour',
    Icon: Bus,
  },
  {
    href: '/transfer.html',
    name: 'Transfers',
    sub: 'Airport & area routes',
    cat: 'transfer',
    Icon: CarFront,
  },
  {
    href: '/activities.html',
    name: 'Experiences',
    sub: 'ATV, rafting, swing & more',
    cat: 'experience',
    Icon: TreePalm,
  },
  {
    href: '/charter.html',
    name: 'Charter',
    sub: 'Car + driver, your route',
    cat: 'charter',
    Icon: CarTaxiFront,
  },
  {
    href: '/destinations.html',
    name: 'Destinations',
    sub: 'Temples, beaches & rice terraces',
    cat: 'destination',
    Icon: MapPin,
  },
];
