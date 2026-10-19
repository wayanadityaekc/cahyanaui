import { Bath, Bike, CookingPot, ShowerHead, Trees, Tv, Waves } from 'lucide-react';

const ICON_STROKE_WIDTH_THIN = 1.6;

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
  return <Icon className={className} strokeWidth={ICON_STROKE_WIDTH_THIN} aria-hidden="true" />;
}
