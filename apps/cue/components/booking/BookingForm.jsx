'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useBooking } from '@/state/BookingProvider';
import Select from '@/components/ui/Select';
import DateField from '@/components/ui/DateField';
import InfoPopover from '@/components/ui/InfoPopover';

const SERVICE_TYPES = [
  { value: 'tour', label: 'Tour Program' },
  { value: 'experience', label: 'Experience' },
  { value: 'performance', label: 'Performance' },
  { value: 'transfer', label: 'Route Transfer' },
];

const CATEGORY_OF = { tour: ['tour', 'combo'], experience: ['experience'], performance: ['performance'], transfer: ['transfer'] };

export default function BookingForm({ presetItem = '', presetType = '' }) {
  const { stay, setStay, displayGuests, currency } = useTripPrefs();
  const pricing = usePricing();
  const { openBooking } = useBooking();

  const [type, setType] = useState(presetType || '');
  const [item, setItem] = useState(presetItem || '');
  const [date, setDate] = useState('');
  const [mode, setMode] = useState('standard');

  const catalog = pricing && pricing.catalog;

  const stayOptions = useMemo(() => {
    const base = [{ value: 'ubud', label: 'Ubud & nearby' }];
    if (!catalog) return base;
    return base.concat(catalog.transfers.map((t) => ({ value: t.route, label: t.route })));
  }, [catalog]);

  const itemOptions = useMemo(() => {
    if (!catalog || !type) return [];
    if (type === 'transfer') return catalog.transfers.map((t) => ({ value: t.route, label: t.route }));
    const cats = CATEGORY_OF[type] || [];
    return catalog.items.filter((i) => cats.includes(i.category) && i.active).map((i) => ({ value: i.name, label: i.name }));
  }, [catalog, type]);

  useEffect(() => {
    if (item && !itemOptions.some((o) => o.value === item)) setItem('');
  }, [itemOptions, item]);

  const entry = catalog && item ? catalog.items.find((i) => i.name === item) : null;
  const transferEntry = catalog && item ? catalog.transfers.find((t) => t.route === item) : null;
  const hasExclusive = !!(entry && entry.hasExclusive);

  const band = entry ? (mode === 'exclusive' && entry.exclusive ? entry.exclusive : entry.standard) : null;
  const display = band ? band.display : transferEntry ? transferEntry.display : null;
  const symbol = (catalog && catalog.symbol) || '$';
  const priceText = display == null ? '-' : symbol + display.toLocaleString(symbol === 'Rp' ? 'id-ID' : 'en-US');

  const surcharge = entry && entry.surcharge && entry.surcharge.display ? entry.surcharge.display : 0;

  const line = () => ({
    type: type === 'transfer' ? 'transfer' : type || 'tour',
    service: item,
    date,
    guests: displayGuests,
    mode: hasExclusive ? mode : 'standard',
    return: false,
  });

  const book = () => {
    if (!item || !date) return;
    openBooking({
      type: type === 'transfer' ? 'transfer' : 'tour',
      service: item,
      guests: String(displayGuests),
      date,
      pickupOptional: false,
      dropoffRequired: type === 'transfer',
      lines: [line()],
    });
  };

  return (
    <section className="booking" id="booking">
      <div className="booking__card">
        <h2 className="booking__title">Build Your Trip</h2>
        <div className="booking__fields">
          <div className="booking__group bk-enh">
            <label htmlFor="stay-area">Pickup Area</label>
            <Select id="stay-area" label="Pickup area" value={stay || 'ubud'} onChange={setStay} options={stayOptions} />
          </div>

          <div className="booking__group bk-enh">
            <label htmlFor="date">Date</label>
            <DateField id="date" label="Date" value={date} onChange={setDate} />
          </div>

          <div className="booking__group bk-enh">
            <label htmlFor="service">Service</label>
            <Select id="service" label="Service" value={type} onChange={setType} options={SERVICE_TYPES} placeholder="Service" />
          </div>

          <div className="booking__group bk-enh">
            <label htmlFor="service-item">Select Service</label>
            <Select id="service-item" label="Select service" value={item} onChange={setItem} options={itemOptions} placeholder="Choose" />
          </div>

          <div className="booking__group booking__group--price">
            <label htmlFor="price">
              Price
              <InfoPopover>
                <p className="binfo__lead">
                  Set your pickup area and date, pick a service, choose a price type, then tap Book Now.
                </p>
                <div className="binfo__row">
                  <span className="binfo__tag">Standard</span>
                  <p>You pay entrance tickets at each place, only for the spots you actually enter.</p>
                </div>
                <div className="binfo__row">
                  <span className="binfo__tag binfo__tag--gold">Exclusive</span>
                  <p>All entrance tickets are prepaid, so the whole day is sorted upfront with no cash needed.</p>
                </div>
              </InfoPopover>
            </label>

            {hasExclusive && (
              <div className="booking__type" id="booking-type">
                <button type="button" className={`booking__type-btn${mode === 'standard' ? ' is-active' : ''}`} onClick={() => setMode('standard')}>Standard</button>
                <button type="button" className={`booking__type-btn${mode === 'exclusive' ? ' is-active' : ''}`} onClick={() => setMode('exclusive')}>Exclusive</button>
              </div>
            )}

            <div className="booking__price" id="price">{priceText}</div>
            <small className="booking__note" id="price-note">
              {hasExclusive
                ? mode === 'exclusive'
                  ? `Includes entrance tickets · price for ${displayGuests} pax`
                  : 'Driver only · entrance tickets not included'
                : ''}
            </small>
            {surcharge > 0 && (
              <small className="booking__surcharge">Pickup surcharge applied</small>
            )}
          </div>

          <div className="booking__actions">
            <button className="booking__btn" id="book-now" onClick={book} disabled={!item || !date}>Book Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
