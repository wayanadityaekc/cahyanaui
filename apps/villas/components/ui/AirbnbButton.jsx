'use client';

import { AIRBNB_LINKS } from '@/lib/airbnb';
import { useVillaSelection } from '@/components/providers/VillaSelectionProvider';

// "Book Now" / "Check availability" control that follows whichever villa is
// currently selected (the homepage hero dropdown) — mirrors the original
// site's data-book buttons that read the shared #bookVilla value on click.
export default function AirbnbButton({ className, children }) {
  const { villa } = useVillaSelection();

  return (
    <a
      href={AIRBNB_LINKS[villa]}
      target="_blank"
      rel="noopener"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        window.open(AIRBNB_LINKS[villa], '_blank');
      }}
    >
      {children}
    </a>
  );
}
