'use client';
import { FIELD_LABEL } from '@/components/ui/formClasses';

import { useEffect, useState } from 'react';
import { BTN_BOOK } from '@/components/ui/btnBookClasses';
import { PRICE } from '@/components/ui/priceClasses';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useItinerary } from '@/state/ItineraryProvider';
import { AIRPORT } from '@/content/shared/airport';
import { AIRPORT_ROUTE } from '@/content/shared/timeSlots';
import Select from '@/components/ui/Select';
import DateTimeField from '@/components/ui/DateTimeField';
import { FIELD_INPUT } from '@/components/ui/formClasses';
import { withSymbol } from '@/components/Price';

const GUESTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const ROUTE = AIRPORT_ROUTE;
const DIRECTIONS = [
  { value: 'pickup', label: 'Airport pickup (arrival) → your stay' },
  { value: 'dropoff', label: 'Your stay → airport drop-off (departure)' },
];

export default function AirportTransferForm() {
  // Guests bound straight to TripPrefs so the homepage choice shows here pre-filled.
  const { currency, setGuests, displayGuests } = useTripPrefs();
  const pricing = usePricing();
  const { state, save } = useItinerary();

  const [direction, setDirection] = useState('pickup');

  // ?dir from the /transfer Airport card sets direction; read in an effect, not initial state (static export).
  useEffect(() => {
    const dir = new URLSearchParams(window.location.search).get('dir');
    if (dir === 'pickup' || dir === 'dropoff') setDirection(dir);
  }, []);
  const [address, setAddress] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [flightTime, setFlightTime] = useState('');

  const catalog = pricing && pricing.catalog;
  const entry = catalog ? catalog.transfers.find((t) => t.route === ROUTE) : null;
  const symbol = (catalog && catalog.symbol) || '$';
  const cars = displayGuests > 5 ? 2 : 1;
  const total = entry ? entry.display * cars : null;
  const totalText = total == null ? '-' : symbol + total.toLocaleString(currency === 'IDR' ? 'id-ID' : 'en-US');

  // One date on this form: the transfer date is read off the flight date and time.
  const date = flightTime.slice(0, 10);
  const ready = !!(date && address && flightNumber);

  // Adds a transfers row (with flight details) to the cart and goes to My Trips, like every booking flow.
  function book() {
    if (!ready) return;
    save({
      ...state,
      transfers: [...(state.transfers || []), {
        route: ROUTE,
        guests: displayGuests,
        return: false,
        date,
        direction,
        pickup: direction === 'pickup' ? 'Ngurah Rai Airport (DPS)' : address,
        dropoff: direction === 'pickup' ? address : 'Ngurah Rai Airport (DPS)',
        flight_number: flightNumber,
        flight_datetime: flightTime,
      }],
    });
    window.location.href = '/my-trips.html';
  }

  // Fields use the shared formClasses strings (FIELD_LABEL / FIELD_INPUT) plus Select and DateTimeField.
  return (
    <div className="bg-white rounded-xl pt-6 px-[1.4rem] pb-[1.6rem] text-left" id={AIRPORT.boxId}>
      <h2 className="font-head text-[1.15rem] text-green text-center mt-0 mb-[1.1rem]">{AIRPORT.boxTitle}</h2>

      <div className="mb-[1.3rem]">
        <label className={FIELD_LABEL} htmlFor="at-direction">Direction</label>
        <Select id="at-direction" label="Direction" value={direction} onChange={setDirection} options={DIRECTIONS} />
      </div>

      <div className="mb-[1.3rem]">
        <label className={FIELD_LABEL} htmlFor="at-guests">Guests</label>
        <Select
          id="at-guests"
          label="Guests"
          value={displayGuests}
          onChange={setGuests}
          options={GUESTS.map((n) => ({ value: String(n), label: String(n) }))}
        />
      </div>

      <div className="mb-[1.3rem]">
        <label className={FIELD_LABEL} id="at-address-label" htmlFor="at-address">
          {direction === 'pickup' ? 'Hotel / villa drop-off address' : 'Hotel / villa pick-up address'}
        </label>
        <input type="text" className={FIELD_INPUT} id="at-address" placeholder="Hotel / villa name and area" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div className="mb-[1.3rem]">
        <label className={FIELD_LABEL} htmlFor="at-flight-number">Flight number</label>
        <input type="text" className={FIELD_INPUT} id="at-flight-number" placeholder="e.g. QZ7501" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} />
      </div>

      <div className="mb-[1.3rem]">
        <label className={FIELD_LABEL} htmlFor="at-flight-time">Flight date &amp; time</label>
        <DateTimeField id="at-flight-time" label="Flight date & time" value={flightTime} onChange={setFlightTime} />
      </div>

      {/* Explains the transfer takes the flight's date and why the flight number is required. */}
      <p className="mt-[0.4rem] text-small text-muted">
        Your transfer is booked for this flight's date. The flight number lets your driver track delays and time
        the pickup right - both are required to book.
      </p>

      {/* Total is larger and soft black (text-gold), not amber; the colour must sit on the PRICE span itself. */}
      <div className="flex items-baseline justify-between border-t border-line pt-4 mt-5 mb-4 font-semibold">
        <span className="text-strong">Total</span>
        <span id="at-total"><span className={`${PRICE} !text-gold text-[1.35rem]`}>{withSymbol(totalText)}</span></span>
      </div>

      <button className={BTN_BOOK} id="at-book" disabled={!ready} onClick={book}>Book transfer</button>
    </div>
  );
}
