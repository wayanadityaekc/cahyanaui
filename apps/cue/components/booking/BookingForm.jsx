'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
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

const MODE_INFO = {
  standard: { label: 'Standard', desc: 'Private car, driver & fuel. Entrance tickets paid as you go.' },
  exclusive: { label: 'Exclusive', desc: 'Everything in Standard, plus all entrance tickets prepaid.' },
};

// Single activities & performances (ATV, Kecak Dance, etc.) have no "pay tickets
// separately" tier - the price is always ticket + transport, so Exclusive is the
// only real option. Standard still shows (visual consistency with tour pages) but
// is locked - see `isActivity` below.
const ACTIVITY_MODE_INFO = {
  exclusive: { label: 'Exclusive', desc: 'Entrance ticket and return transport are already included in this price.' },
};

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CAL_ICON = <Calendar strokeWidth={1.6} />;
const PEOPLE_ICON = <UserRound strokeWidth={1.6} />;
const SPARK_ICON = <Sparkles strokeWidth={1.5} />;
const SHIELD_ICON = <ShieldCheck strokeWidth={1.6} />;

export default function BookingForm({ presetItem = '', presetType = '', perPerson = false, onBook, variant = 'standalone' }) {
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
  // Single activities/performances: no Standard-without-ticket tier exists, so the
  // toggle is shown locked on Exclusive rather than hidden - keeps the booking card
  // visually consistent with tour pages instead of silently dropping a section.
  const isActivity = !!(entry && (entry.category === 'experience' || entry.category === 'performance'));
  const showToggle = hasExclusive || isActivity;
  const effectiveMode = isActivity ? 'exclusive' : mode;
  const modeInfo = isActivity ? ACTIVITY_MODE_INFO : MODE_INFO;

  const symbol = (catalog && catalog.symbol) || '$';
  const fmt = (n) => (n == null ? '-' : symbol + n.toLocaleString(symbol === 'Rp' ? 'id-ID' : 'en-US'));

  const band = entry ? (effectiveMode === 'exclusive' && entry.exclusive ? entry.exclusive : entry.standard) : null;
  const display = band ? band.display : transferEntry ? transferEntry.display : null;
  const priceText = fmt(display);

  const surcharge = entry && entry.surcharge && entry.surcharge.display ? entry.surcharge.display : 0;

  const unit = perPerson ? 'per person' : 'per car';
  const guestWord = displayGuests === 1 ? 'guest' : 'guests';

  const line = () => ({
    type: type === 'transfer' ? 'transfer' : type || 'tour',
    service: item,
    date,
    guests: displayGuests,
    mode: showToggle ? effectiveMode : 'standard',
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

  // Tailwind-native (migrasi #322): SELURUH family `.booking*`/`.bookcard*` -> utilities,
  // CSS-nya dihapus. `variant` gantiin context-selector CSS lama (`.booksidebar .booking*`
  // vs base standalone) yang gak bisa direach dari dalam komponen:
  //   - 'sidebar'   = dipakai BookSidebar (halaman detail) = konteks produksi/acceptance.
  //   - 'standalone'= base (ui-kit/demo): card putih + shadow + max-width.
  // Marker check-detail `bookcard__cta` DIPERTAHANKAN sbg class (hook, no CSS lagi).
  // Toggle Standard/Exclusive full utility (isolated). Active = HIJAU (--color-cta).
  const isSidebar = variant === 'sidebar';
  const sectionCls = isSidebar
    ? 'relative z-10 p-0 m-0 bg-transparent min-h-0'
    : 'relative z-10 py-12 px-6';
  const cardCls = isSidebar
    ? 'max-w-none m-0 py-6 px-[1.4rem] rounded-none bg-white border-none text-left'
    : 'max-w-[900px] min-[993px]:max-w-[1100px] mx-auto p-8 rounded-md bg-white shadow-md text-left';
  const typeBtn = (on, disabled) =>
    `flex-1 py-2 px-2 border-none rounded-pill font-body text-small font-semibold transition-[background-color,color,scale] duration-[var(--dur)] ease-[ease] ${disabled ? 'text-muted bg-transparent cursor-not-allowed opacity-60' : on ? 'text-white bg-cta cursor-pointer' : 'text-green bg-transparent cursor-pointer'}`;
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
          <span className="block mt-[0.45rem] text-small text-muted">{unit} · {displayGuests} {guestWord}</span>
        </div>

        {showToggle && (
          <div className="flex p-[3px] mb-[0.4rem] [border:1px_solid_rgba(34,32,28,0.5)] rounded-pill bg-[rgba(34,32,28,0.08)]" id="booking-type">
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
          className="bookcard__cta flex flex-none w-full max-w-none items-center justify-center h-[2.9rem] px-[0.85rem] border-none border-cta rounded-pill font-body text-[1rem] font-semibold text-center no-underline text-white bg-cta cursor-pointer transition-[background-color,color,scale] duration-[var(--dur)] ease-[ease] hover:bg-cta-d"
          id="book-now"
          onClick={() => (onBook ? onBook(item, date, showToggle ? effectiveMode : 'standard') : book())}
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
