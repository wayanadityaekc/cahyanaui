'use client';

import { AIRBNB_LINKS, VILLA_LABELS } from '@/lib/airbnb';
import { useVillaSelection } from '@/components/providers/VillaSelectionProvider';

// Hero "Check availability" form. Dates are cosmetic (there's no in-house
// booking backend) — picking a villa and clicking through opens the live
// Airbnb calendar for that listing, exactly like the original site's
// #checkAvailability button.
export default function AvailabilityBar() {
  const { villa, setVilla } = useVillaSelection();

  const openAirbnb = () => {
    window.open(AIRBNB_LINKS[villa], '_blank');
  };

  return (
    <>
      <div className="avail-bar">
        <div className="avail-field">
          <label htmlFor="bookVilla">Villa</label>
          <select id="bookVilla" value={villa} onChange={(e) => setVilla(e.target.value)}>
            {Object.entries(VILLA_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div className="avail-field">
          <label htmlFor="checkIn">Check in</label>
          <input type="date" id="checkIn" />
        </div>
        <div className="avail-field">
          <label htmlFor="checkOut">Check out</label>
          <input type="date" id="checkOut" />
        </div>
        <button type="button" className="btn btn-gold" onClick={openAirbnb}>
          Check availability
        </button>
      </div>
      <p className="avail-note">Opens the live Airbnb calendar for the villa you picked</p>
    </>
  );
}
