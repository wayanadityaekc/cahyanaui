'use client';

import { useState } from 'react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useBooking } from '@/state/BookingProvider';
import { AIRPORT } from '@/content/shared/airport';

const GUESTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const ROUTE = 'Airport – Ubud';

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

  return (
    <div className="charter__box" id={AIRPORT.boxId}>
      <h2 className="charter__box-title">{AIRPORT.boxTitle}</h2>

      <div className="charter__step">
        <label className="charter__label" htmlFor="at-direction">1. Direction</label>
        <select className="charter__select" id="at-direction" value={direction} onChange={(e) => setDirection(e.target.value)}>
          <option value="pickup">Airport pickup (arrival) &rarr; your stay</option>
          <option value="dropoff">Your stay &rarr; airport drop-off (departure)</option>
        </select>
      </div>

      <div className="charter__step charter__fields">
        <div className="field">
          <label className="charter__label" htmlFor="at-date">Date</label>
          <input type="date" className="charter__select" id="at-date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label className="charter__label" htmlFor="at-guests">Guests</label>
          <select
            className="charter__select"
            id="at-guests"
            value={guests}
            onChange={(e) => { setLocalGuests(e.target.value); setGuests(e.target.value); }}
          >
            <option value="" disabled>Guests</option>
            {GUESTS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="charter__step">
        <label className="charter__label" id="at-address-label" htmlFor="at-address">
          {direction === 'pickup' ? 'Hotel / villa drop-off address' : 'Hotel / villa pick-up address'}
        </label>
        <input type="text" className="charter__select" id="at-address" placeholder="Hotel / villa name and area" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div className="charter__step">
        <label className="charter__label" htmlFor="at-flight-number">Flight number</label>
        <input type="text" className="charter__select" id="at-flight-number" placeholder="e.g. QZ7501" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} />
      </div>

      <div className="charter__step">
        <label className="charter__label" htmlFor="at-flight-time">Flight date &amp; time</label>
        <input type="datetime-local" className="charter__select" id="at-flight-time" value={flightTime} onChange={(e) => setFlightTime(e.target.value)} />
      </div>

      <p className="charter__hint">
        Flight details let your driver track delays and time the pickup right - required to book.
      </p>

      <div className="charter__total">
        <span>Total</span>
        <span className="amount" id="at-total"><span className="price-cur">{totalText}</span></span>
      </div>

      <button className="btn-book" id="at-book" disabled={!ready} onClick={book}>Book This Transfer</button>
    </div>
  );
}
