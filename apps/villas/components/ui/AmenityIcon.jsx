import { Bath, Bike, CookingPot, ShowerHead, Trees, Tv, Waves } from 'lucide-react';

// Only amenities lib/villas.js really lists; always size icons, Lucide defaults to 24px.
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
