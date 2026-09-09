'use client';

import { useState } from 'react';
import { BTN_BOOK } from '@/components/ui/btnBookClasses';
import { PRICE } from '@/components/ui/priceClasses';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useBooking } from '@/state/BookingProvider';
import { AIRPORT } from '@/content/shared/airport';
import Select from '@/components/ui/Select';
import DateField from '@/components/ui/DateField';
import DateTimeField from '@/components/ui/DateTimeField';
import { FIELD_INPUT } from '@/components/ui/formClasses';
import { withSymbol } from '@/components/Price';

const GUESTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const ROUTE = 'Airport – Ubud';
const DIRECTIONS = [
  { value: 'pickup', label: 'Airport pickup (arrival) → your stay' },
  { value: 'dropoff', label: 'Your stay → airport drop-off (departure)' },
];

export default function AirportTransferForm() {
  const { currency, setGuests } = useTripPrefs();
  const pricing = usePricing();
  const { openBooking } = useBooking();

  const [direction, setDirection] = useState('pickup');
  const [date, setDate] = useState('');
  const [guests, setLocalGuests] = useState('');
  const [address, setAddress] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [flightTime, setFlightTime] = useState('');

  const catalog = pricing && pricing.catalog;
  const entry = catalog ? catalog.transfers.find((t) => t.route === ROUTE) : null;
  const symbol = (catalog && catalog.symbol) || '$';
  const cars = (parseInt(guests, 10) || 0) > 5 ? 2 : 1;
  const total = entry ? entry.display * cars : null;
  const totalText = total == null ? '-' : symbol + total.toLocaleString(currency === 'IDR' ? 'id-ID' : 'en-US');

  const ready = !!(date && guests && address && flightNumber && flightTime);

  const book = () => {
    if (!ready) return;
    openBooking({
      type: 'transfer',
      service: ROUTE,
      guests: String(guests),
      date,
      pickupOptional: true,
      dropoffRequired: false,
      lines: [{
        type: 'transfer',
        service: ROUTE,
        guests,
        date,
        pickup: direction === 'pickup' ? 'Ngurah Rai Airport (DPS)' : address,
        dropoff: direction === 'pickup' ? address : 'Ngurah Rai Airport (DPS)',
        flight_number: flightNumber,
        flight_datetime: flightTime,
      }],
    });
  };

  // Tailwind-native (full-portable): field pakai FIELD_INPUT shared (formClasses.js).
  // Kept sbg shared primitive: Select/DateField/DateTimeField, .price-cur, .btn-book.
  const LABEL = 'block mb-2 text-small font-medium text-green font-body tracking-normal';
  const FIELD_LABEL = 'block mb-[0.4rem] text-small font-medium text-green font-body tracking-normal';
  return (
    <div className="bg-white rounded-xl shadow-xl pt-6 px-[1.4rem] pb-[1.6rem] text-left" id={AIRPORT.boxId}>
      <h2 className="font-head text-[1.15rem] text-green text-center mt-0 mb-[1.1rem]">{AIRPORT.boxTitle}</h2>

      <div className="mb-[1.3rem]">
        <label className={LABEL} htmlFor="at-direction">1. Direction</label>
        <Select id="at-direction" label="Direction" value={direction} onChange={setDirection} options={DIRECTIONS} />
      </div>

      <div className="mb-[1.3rem] grid grid-cols-[1fr_1fr] gap-4">
        <div>
          <label className={FIELD_LABEL} htmlFor="at-date">Date</label>
          <DateField id="at-date" label="Date" value={date} onChange={setDate} />
        </div>
        <div>
          <label className={FIELD_LABEL} htmlFor="at-guests">Guests</label>
          <Select
            id="at-guests"
            label="Guests"
            value={guests}
            onChange={(v) => { setLocalGuests(v); setGuests(v); }}
            options={GUESTS.map((n) => ({ value: String(n), label: String(n) }))}
            placeholder="Guests"
          />
        </div>
      </div>

      <div className="mb-[1.3rem]">
        <label className={LABEL} id="at-address-label" htmlFor="at-address">
          {direction === 'pickup' ? 'Hotel / villa drop-off address' : 'Hotel / villa pick-up address'}
        </label>
        <input type="text" className={FIELD_INPUT} id="at-address" placeholder="Hotel / villa name and area" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div className="mb-[1.3rem]">
        <label className={LABEL} htmlFor="at-flight-number">Flight number</label>
        <input type="text" className={FIELD_INPUT} id="at-flight-number" placeholder="e.g. QZ7501" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} />
      </div>

      <div className="mb-[1.3rem]">
        <label className={LABEL} htmlFor="at-flight-time">Flight date &amp; time</label>
        <DateTimeField id="at-flight-time" label="Flight date & time" value={flightTime} onChange={setFlightTime} />
      </div>

      <p className="mt-[0.4rem] text-small text-muted">
        Flight details let your driver track delays and time the pickup right - required to book.
      </p>

      <div className="flex items-baseline justify-between border-t border-line pt-4 mt-5 mb-4 text-strong font-semibold">
        <span>Total</span>
        <span id="at-total"><span className={PRICE}>{withSymbol(totalText)}</span></span>
      </div>

      <button className={BTN_BOOK} id="at-book" disabled={!ready} onClick={book}>Book This Transfer</button>
    </div>
  );
}
