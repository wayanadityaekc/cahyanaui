'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useBooking } from '@/state/BookingProvider';
import Select from '@/components/ui/Select';
import DateField from '@/components/ui/DateField';
import { withSymbol } from '@/components/Price';

const SERVICE_TYPES = [
  { value: 'tour', label: 'Tour Program' },
  { value: 'experience', label: 'Experience' },
  { value: 'performance', label: 'Performance' },
  { value: 'transfer', label: 'Route Transfer' },
];

const CATEGORY_OF = { tour: ['tour', 'combo'], experience: ['experience'], performance: ['performance'], transfer: ['transfer'] };

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CAL_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);
const PEOPLE_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.2" /><path d="M5 20c0-3.4 3.1-5.2 7-5.2s7 1.8 7 5.2" />
  </svg>
);
const SPARK_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.8 4.9L18.5 9l-4.7 1.1L12 15l-1.8-4.9L5.5 9l4.7-1.1z" /><path d="M18 15l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" />
  </svg>
);
const SHIELD_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" />
  </svg>
);

export default function BookingForm({ presetItem = '', presetType = '', perPerson = false, onBook }) {
  const { setGuests, displayGuests } = useTripPrefs();
  const pricing = usePricing();
  const { openBooking } = useBooking();

  const [type, setType] = useState(presetType || '');
  const [item, setItem] = useState(presetItem || '');
  const [date, setDate] = useState('');
  const [mode, setMode] = useState('standard');

  const catalog = pricing && pricing.catalog;
  // Detail pages preset the item -> the service pickers are redundant, hide them
  // for the clean price-first card. Generic use (ui-kit) keeps them.
  const locked = !!presetItem;

  const itemOptions = useMemo(() => {
    if (!catalog || !type) return [];
    if (type === 'transfer') return catalog.transfers.map((t) => ({ value: t.route, label: t.route }));
    const cats = CATEGORY_OF[type] || [];
    return catalog.items.filter((i) => cats.includes(i.category) && i.active).map((i) => ({ value: i.name, label: i.name }));
  }, [catalog, type]);

  useEffect(() => {
    if (itemOptions.length && item && !itemOptions.some((o) => o.value === item)) setItem('');
  }, [itemOptions, item]);

  const entry = catalog && item ? catalog.items.find((i) => i.name === item) : null;
  const transferEntry = catalog && item ? catalog.transfers.find((t) => t.route === item) : null;
  const hasExclusive = !!(entry && entry.hasExclusive);

  const symbol = (catalog && catalog.symbol) || '$';
  const fmt = (n) => (n == null ? '-' : symbol + n.toLocaleString(symbol === 'Rp' ? 'id-ID' : 'en-US'));

  const band = entry ? (mode === 'exclusive' && entry.exclusive ? entry.exclusive : entry.standard) : null;
  const display = band ? band.display : transferEntry ? transferEntry.display : null;
  const priceText = fmt(display);

  const stdDisplay = entry ? entry.standard.display : null;
  const exlDisplay = entry && entry.exclusive ? entry.exclusive.display : null;
  const upsellDelta = exlDisplay != null && stdDisplay != null ? exlDisplay - stdDisplay : null;
  const upsellSub =
    upsellDelta != null && upsellDelta > 0
      ? `+${fmt(upsellDelta)} · all entrance tickets prepaid`
      : `${fmt(exlDisplay)} · all entrance tickets prepaid`;
  const surcharge = entry && entry.surcharge && entry.surcharge.display ? entry.surcharge.display : 0;

  const unit = perPerson ? 'per person' : 'per car';
  const guestWord = displayGuests === 1 ? 'guest' : 'guests';

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
    <section className="booking bookcard" id="booking">
      <div className="booking__card bookcard__card">
        <div className="bookcard__head">
          <p className="bookcard__kicker">Transparent pricing</p>
          <h2 className="bookcard__title">Your Total Price</h2>
          <p className="bookcard__sub">No hidden fees. No surprises.</p>
        </div>

        {!locked && (
          <div className="bookcard__pick">
            <Select label="Service" value={type} onChange={setType} options={SERVICE_TYPES} placeholder="Service" />
            <Select label="Select service" value={item} onChange={setItem} options={itemOptions} placeholder="Choose" />
          </div>
        )}

        <div className="bookcard__price">
          <span className="bookcard__amount">{withSymbol(priceText)}</span>
          <span className="bookcard__unit">{unit} · {displayGuests} {guestWord}</span>
        </div>

        {hasExclusive && (
          <div className="booking__type bookcard__toggle" id="booking-type">
            <button type="button" className={`booking__type-btn${mode === 'standard' ? ' is-active' : ''}`} onClick={() => setMode('standard')}>Standard</button>
            <button type="button" className={`booking__type-btn${mode === 'exclusive' ? ' is-active' : ''}`} onClick={() => setMode('exclusive')}>Exclusive</button>
          </div>
        )}

        {hasExclusive && mode === 'standard' && exlDisplay != null && (
          <button type="button" className="bookcard__upsell" onClick={() => setMode('exclusive')}>
            <span className="bookcard__upsell-ic" aria-hidden="true">{SPARK_ICON}</span>
            <span className="bookcard__upsell-txt">
              <b>Exclusive</b>
              <span>{upsellSub}</span>
            </span>
            <span className="bookcard__upsell-arr" aria-hidden="true">&rsaquo;</span>
          </button>
        )}

        <div className="bookcard__fields">
          <DateField label="Date" hint="Date" icon={CAL_ICON} value={date} onChange={setDate} placeholder="Select date" />
          <Select
            label="Guests"
            hint="Guests"
            icon={PEOPLE_ICON}
            value={String(displayGuests)}
            onChange={setGuests}
            options={GUEST_OPTIONS.map((n) => ({ value: String(n), label: `${n} ${n === 1 ? 'guest' : 'guests'}` }))}
          />
        </div>

        <button
          className="booking__btn bookcard__cta"
          id="book-now"
          onClick={() => (onBook ? onBook(item, date, hasExclusive ? mode : 'standard') : book())}
          disabled={!item}
        >
          Book Now <span className="bookcard__cta-arr" aria-hidden="true">&rarr;</span>
        </button>


        {surcharge > 0 && <small className="bookcard__surcharge">Pickup surcharge applied</small>}

        <p className="bookcard__reassure">
          <span className="bookcard__reassure-ic" aria-hidden="true">{SHIELD_ICON}</span>
          <span>Price updates automatically based on your selection.</span>
        </p>
      </div>
    </section>
  );
}
