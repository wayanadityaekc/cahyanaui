'use client';
import { BTN_SM } from '@/components/ui/btnClasses';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useBooking } from '@/state/BookingProvider';
import Select from '@/components/ui/Select';
import DateField from '@/components/ui/DateField';
import { priceUnit } from '@/lib/priceUnit';
import { withSymbol } from '@/components/Price';

const SERVICE_TYPES = [
  { value: 'tour', label: 'Tour Program' },
  { value: 'experience', label: 'Experience' },
  { value: 'performance', label: 'Performance' },
  { value: 'transfer', label: 'Route Transfer' },
];

// Picker categories; 'place' belongs under tour, or destination presets get cleared and Book Now dies.
const CATEGORY_OF = { tour: ['tour', 'combo', 'place'], experience: ['experience'], performance: ['performance'], transfer: ['transfer'] };

const MODE_INFO = {
  standard: { label: 'Standard', desc: 'Private car, driver & fuel. Entrance tickets paid as you go.' },
  exclusive: { label: 'Exclusive', desc: 'Everything in Standard, plus all entrance tickets prepaid.' },
};

// Activities/performances have no ticket-less tier: Exclusive is the only option, Standard shows locked.
const ACTIVITY_MODE_INFO = {
  exclusive: { label: 'Exclusive', desc: 'Entrance ticket and return transport are already included in this price.' },
};

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CAL_ICON = <Calendar strokeWidth={1.6} />;
const PEOPLE_ICON = <UserRound strokeWidth={1.6} />;
const SPARK_ICON = <Sparkles strokeWidth={1.5} />;
const SHIELD_ICON = <ShieldCheck strokeWidth={1.6} />;

export default function BookingForm({ presetItem = '', presetType = '', perPerson = false, onBook, variant = 'standalone', belowPrice }) {
  const { setGuests, displayGuests } = useTripPrefs();
  const pricing = usePricing();
  const { openBooking } = useBooking();

  const [type, setType] = useState(presetType || '');
  const [item, setItem] = useState(presetItem || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mode, setMode] = useState('standard');

  const catalog = pricing && pricing.catalog;
  // A preset item (detail pages) hides the service pickers; generic use (ui-kit) keeps them.
  const locked = !!presetItem;

  const itemOptions = useMemo(() => {
    if (!catalog || !type) return [];
    if (type === 'transfer') return catalog.transfers.map((t) => ({ value: t.route, label: t.route }));
    const cats = CATEGORY_OF[type] || [];
    return catalog.items.filter((i) => cats.includes(i.category) && i.active).map((i) => ({ value: i.name, label: i.name }));
  }, [catalog, type]);

  // Only the generic picker clears an item missing from the list; never clear a preset item.
  useEffect(() => {
    if (locked) return;
    if (itemOptions.length && item && !itemOptions.some((o) => o.value === item)) setItem('');
  }, [locked, itemOptions, item]);

  const entry = catalog && item ? catalog.items.find((i) => i.name === item) : null;
  const transferEntry = catalog && item ? catalog.transfers.find((t) => t.route === item) : null;
  const hasExclusive = !!(entry && entry.hasExclusive);
  // Activities show the toggle locked on Exclusive rather than hiding it, to match tour pages.
  const isActivity = !!(entry && (entry.category === 'experience' || entry.category === 'performance'));
  const showToggle = hasExclusive || isActivity;
  const effectiveMode = isActivity ? 'exclusive' : mode;
  const modeInfo = isActivity ? ACTIVITY_MODE_INFO : MODE_INFO;

  const symbol = (catalog && catalog.symbol) || '$';
  function fmt(n) { return (n == null ? '-' : symbol + n.toLocaleString(symbol === 'Rp' ? 'id-ID' : 'en-US')); }

  const band = entry ? (effectiveMode === 'exclusive' && entry.exclusive ? entry.exclusive : entry.standard) : null;
  const display = band ? band.display : transferEntry ? transferEntry.display : null;
  const priceText = fmt(display);

  const surcharge = entry && entry.surcharge && entry.surcharge.display ? entry.surcharge.display : 0;

  // Time-slot category comes from the catalog entry, never from `type` (detail pages preset 'tour' for all).
  const timeCategory = entry ? entry.category : type === 'transfer' ? 'transfer' : null;

  // Price unit: 'per car' for tours; for experiences the figure is already the total for N guests.
  const unit = priceUnit(perPerson, displayGuests);
  const guestWord = displayGuests === 1 ? 'guest' : 'guests';
  const unitLine = perPerson ? unit : `${unit} · ${displayGuests} ${guestWord}`;

  function line() {
    return ({
      type: type === 'transfer' ? 'transfer' : type || 'tour',
      service: item,
      date,
      time,
      guests: displayGuests,
      mode: showToggle ? effectiveMode : 'standard',
      return: false,
    });
  }

  function book() {
    if (!item || !date) return;
    openBooking({
      type: type === 'transfer' ? 'transfer' : 'tour',
      service: item,
      guests: String(displayGuests),
      date,
      time,
      pickupOptional: false,
      dropoffRequired: type === 'transfer',
      lines: [line()],
    });
  }

  // variant 'sidebar' (BookSidebar) vs standalone card; keep the bookcard__cta class, check-detail needs it.
  const isSidebar = variant === 'sidebar';
  const sectionCls = isSidebar
    ? 'relative z-10 p-0 m-0 bg-transparent min-h-0'
    : 'relative z-10 py-12 px-6';
  const cardCls = isSidebar
    ? 'max-w-none m-0 py-6 px-[1.4rem] rounded-none bg-white border-none text-left'
    : 'max-w-[900px] min-[993px]:max-w-[1100px] mx-auto p-8 rounded-md bg-white text-left';
  function typeBtn(active, disabled) { return `flex-1 py-2 px-2 border-none rounded-sm font-body text-small font-semibold transition-[background-color,color,scale] duration-[var(--dur)] ease-[ease] ${disabled ? 'text-muted bg-transparent cursor-not-allowed opacity-60' : active ? 'text-white bg-cta cursor-pointer' : 'text-green bg-transparent cursor-pointer'}`; }
  return (
    <section className={sectionCls} id="booking">
      <div className={cardCls}>
        <div className="mb-[1.1rem]">
          <p className="mb-2 text-label font-medium tracking-[0.14em] uppercase text-amber">Transparent pricing</p>
          <h2 className="m-0 font-head text-h2 font-bold tracking-[-0.01em] text-gold">Your Total Price</h2>
          <p className="mt-[0.3rem] text-small text-muted">No hidden fees. No surprises.</p>
        </div>

        {!locked && (
          <div className="grid gap-[0.6rem] mb-[1.2rem]">
            <Select label="Service" value={type} onChange={setType} options={SERVICE_TYPES} placeholder="Service" />
            <Select label="Select service" value={item} onChange={setItem} options={itemOptions} placeholder="Choose" />
          </div>
        )}

        <div className="mb-[1.1rem]">
          <span className="block font-head text-[clamp(2.4rem,8vw,3.1rem)] font-bold leading-none tracking-[-0.02em] text-gold [&_.price__sym]:text-[0.55em] [&_.price__sym]:font-semibold [&_.price__sym]:[vertical-align:0.26em] [&_.price__sym]:mr-[0.04em]">{withSymbol(priceText)}</span>
          <span className="block mt-[0.45rem] text-small text-muted">{unitLine}</span>
        </div>

        {/* Slot under the price; attraction pages put the tour comparison here. */}
        {belowPrice}

        {showToggle && (
          <div className="flex p-[3px] mb-[0.4rem] [border:1px_solid_rgba(34,32,28,0.5)] rounded-md bg-[rgba(34,32,28,0.08)]" id="booking-type">
            <button
              type="button"
              className={typeBtn(effectiveMode === 'standard', isActivity)}
              onClick={() => !isActivity && setMode('standard')}
              disabled={isActivity}
              title={isActivity ? 'This activity always includes the entrance ticket - Standard is not available.' : undefined}
            >
              Standard
            </button>
            <button type="button" className={typeBtn(effectiveMode === 'exclusive', false)} onClick={() => setMode('exclusive')}>Exclusive</button>
          </div>
        )}

        {showToggle && (
          <div className="flex items-start gap-[0.6rem] mb-[0.9rem] py-[0.7rem] px-[0.85rem] [border:1px_solid_var(--line)] [border-left:3px_solid_var(--color-cta)] rounded-md bg-cream animate-[bookcardNoteIn_var(--dur)_var(--ease)]" key={effectiveMode}>
            <span className="flex-none inline-flex w-5 h-5 mt-px text-amber [&>svg]:w-full [&>svg]:h-full" aria-hidden="true">{SPARK_ICON}</span>
            <span className="flex-1 min-w-0">
              <b className="block text-strong font-semibold text-gold">{modeInfo[effectiveMode].label}</b>
              <span className="block mt-[0.1rem] text-small leading-[1.4] text-muted">{modeInfo[effectiveMode].desc}</span>
            </span>
          </div>
        )}

        <div className="grid gap-[0.6rem] mb-[1.1rem]">
          <DateField
            label="Date and start time"
            hint="Date & time"
            icon={CAL_ICON}
            value={date}
            onChange={setDate}
            placeholder="Select date"
            withTime
            time={time}
            onTimeChange={setTime}
            category={timeCategory}
            itemName={item}
          />
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
          className={`bookcard__cta flex flex-none w-full max-w-none ${BTN_SM} border-none border-cta font-body no-underline text-white bg-cta cursor-pointer transition-[background-color,color,scale] duration-[var(--dur)] ease-[ease] hover:bg-cta-d`}
          id="book-now"
          onClick={() => (onBook ? onBook(item, date, showToggle ? effectiveMode : 'standard', time) : book())}
          disabled={!item}
        >
          Book Now
        </button>


        {surcharge > 0 && <small className="block mt-[0.6rem] text-center text-small text-muted">Pickup surcharge applied</small>}

        <p className="flex items-center justify-center gap-[0.45rem] mt-4 text-small text-muted">
          <span className="inline-flex w-[15px] h-[15px] text-cta [&>svg]:w-full [&>svg]:h-full" aria-hidden="true">{SHIELD_ICON}</span>
          <span><b className="font-semibold text-green">Free cancellation</b> up to 24h · Pay after your trip</span>
        </p>
      </div>
    </section>
  );
}
