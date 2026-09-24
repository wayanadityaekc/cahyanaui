import { Bath, Bike, CookingPot, ShowerHead, Trees, Tv, Waves } from 'lucide-react';

// Lucide, per CUE's rule: new icons come from the set, hand-drawn is reserved
// for marks Lucide does not carry (payment logos, currency flags, brand marks).
// Sizes come from the --icon-* ladder; Lucide renders width/height=24, so an
// icon with no explicit size balloons.
//
// Kept to exactly the amenities lib/villas.js really lists — no invented items.
const ICONS = {
  'Private Pool': Waves,
  'Full Kitchen': CookingPot,
  'Smart TV': Tv,
  'Ensuite Bathrooms': Bath,
  'Home Garden': Trees,
  'Motorbike Parking': Bike,
  'Outdoor Shower': ShowerHead,
  'Scooter Parking': Bike,
};

export default function AmenityIcon({ name, className = 'w-[var(--icon-md)] h-[var(--icon-md)]' }) {
  const Icon = ICONS[name] || Waves;
  return <Icon className={className} strokeWidth={1.6} aria-hidden="true" />;
}
