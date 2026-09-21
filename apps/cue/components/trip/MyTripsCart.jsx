'use client';
import { BTN_SM } from '@/components/ui/btnClasses';

import { useMemo, useState } from 'react';
import { CalendarCheck, Car, ChevronDown, Clock, History, MapPin, ShoppingBag } from 'lucide-react';
import { PRICE } from '@/components/ui/priceClasses';
import { useItinerary } from '@/state/ItineraryProvider';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useAccount } from '@/state/AccountProvider';
import { useReferral } from '@/state/ReferralProvider';
import { useBooking } from '@/state/BookingProvider';
import useQuote from '@/hooks/useQuote';
import useMoney from '@/hooks/useMoney';
import ReviewModal from '@/components/reviews/ReviewModal';
import AddItemPicker from './AddItemPicker';
import { BTN } from '@/components/ui/modalClasses';
import DatePopup from '@/components/booking/DatePopup';
import { cascadeFrom } from '@/lib/cart';
import { readLocal } from '@/lib/storage';
import { KEY, WHATSAPP_NUMBER } from '@/lib/constants';
import { imageForProgram } from '@/lib/programImages';
import { withSymbol } from '@/components/Price';
import { BTN_PILL } from '@/components/ui/btnClasses';
import RailLayout from '@/components/ui/RailLayout';

// Tailwind-native (migrasi Fase 2): sub-family kecil my-trips cart -> utilities.
// `mtc-empty` DIPERTAHANKAN sbg marker: anchor `.mtc-empty .btn-pill` (reset
// full-width [data-mytrips-cart] .btn-pill). `.mtc-total__val .price-cur` DIHAPUS
// (redundant - .price-cur udah amber default), jadi mtc-total__val full convert.
const MTC_EMPTY = 'text-center pt-2 px-0 pb-0';
const MTC_EMPTY_LEAD = 'font-head font-medium tracking-[-0.01em] text-[1rem] text-green m-0 mb-[0.4rem]';
// Hint/explanation text: needs the site's body-text size explicitly (text-body) -
// without it a bare <p> falls back to the browser default (16px), which reads
// noticeably bigger/inconsistent next to every other page's 0.8rem body copy.
const MTC_EMPTY_SUB = 'text-body text-muted max-w-[44ch] mx-auto mt-0 mb-[1.8rem]';
const MTC_TOTAL = 'flex justify-between items-center bg-cream rounded-lg py-4 px-[1.2rem] mt-[1.4rem]';
const MTC_TOTAL_LABEL = 'font-medium text-small tracking-[0.14em] uppercase text-green';
const MTC_TOTAL_VAL = 'text-[1.4rem] font-semibold text-amber-d';
// Leaf kartu item -> utilities. Container `.mtc-item` (+ `--booked`, + context
// `.mtc-book .mtc-item`) TETEP CSS (punya varian read-only, anchor). `.mtc-item__datebtn`
// juga TETEP CSS (bagian dari base rule field shared, Bucket A). Foto & ikon-svg =
// string terpisah (bukan di-layer) biar w/h 40 vs 56 gak konflik urutan utility.
const MTC_ITEM_ICON = 'flex-[0_0_auto] w-10 h-10 grid place-items-center rounded-md bg-cream text-gold-d [&_svg]:w-[var(--icon-md)] [&_svg]:h-[var(--icon-md)]';
const MTC_ITEM_ICON_PHOTO = 'flex-[0_0_auto] w-[56px] h-[56px] grid place-items-center rounded-md bg-cream bg-cover bg-center text-gold-d';
const MTC_ITEM_BODY = 'flex-[1_1_auto] min-w-0';
const MTC_ITEM_TITLE = 'font-semibold text-green m-0';
const MTC_ITEM_DESC = 'text-small text-muted mt-[0.15rem] mx-0 mb-0';
const MTC_ITEM_PRICE = 'flex-[0_0_auto] text-right whitespace-nowrap font-semibold text-amber-d';
const MTC_ITEM_DEL = 'flex-[0_0_auto] border-none bg-transparent text-muted text-[1.35rem] leading-none cursor-pointer py-0 px-[0.15rem] hover:text-err';
const MTC_ITEM_DATE = 'text-label font-medium tracking-[0.14em] uppercase text-muted mt-[0.3rem] mx-0 mb-0';
// Rincian booked-trip (.mtc-det*) -> utilities. Kontainer .mtc-det (+ context
// .mtc-book .mtc-det) TETEP CSS. Chev muter pas toggle aria-expanded=true (arbitrary
// variant), transisi ke `transform` biar animasinya sama.
const MTC_DET_TOGGLE = 'flex items-center gap-[0.35rem] border-none bg-transparent py-[0.35rem] px-0 font-body text-small font-medium text-muted cursor-pointer hover:text-gold';
const MTC_DET_CHEV = 'w-[15px] h-[15px] [transition:transform_var(--dur-fast)_ease] [[aria-expanded=true]_&]:[transform:rotate(180deg)]';
const MTC_DET_LIST = 'list-none mt-[0.2rem] mx-0 mb-0 p-0 [border-top:1px_solid_var(--line)]';
const MTC_DET_LINE = 'flex items-baseline justify-between gap-[0.75rem] py-2 px-0 text-small [&+&]:[border-top:1px_solid_var(--line)]';
const MTC_DET_NAME = 'flex flex-col gap-[0.15rem] min-w-0 text-green';
const MTC_DET_META = 'text-label text-muted';
const MTC_DET_AMT = 'flex-[0_0_auto] whitespace-nowrap font-semibold text-amber-d';
// Notes/policy -> utilities. Varian --warn = string penuh (bukan di-layer) biar
// text-muted vs text-err gak konflik urutan. `.mtc-policy a` -> utility di tiap <a>.
const MTC_NOTE = 'text-small text-muted text-center mt-[0.7rem] mx-auto mb-0 max-w-[46ch]';
const MTC_NOTE_WARN = 'text-small text-err text-center mt-[0.7rem] mx-auto mb-0 max-w-[46ch]';
const MTC_POLICY_LINK = 'text-gold-d underline';
// Container/variant classes (migrasi #324): were the last `.mtc*` rules in
// style.css. Cart-list item (standalone) vs booked-card item (inside .mtc-book,
// read-only). `.mtc-book` card + its context overrides -> flat utilities. Booked/
// past cards only render with server data (not reachable in the static export
// harness) so those are exact 1:1 CSS maps, flagged in the PR.
const MTC_ITEM = 'flex items-center gap-[0.85rem] bg-white border border-line rounded-md py-[0.8rem] px-[0.95rem] mb-[0.6rem]';
const MTC_ITEM_BOOKED = 'flex items-center gap-[0.85rem] py-[0.8rem] px-[0.95rem] bg-transparent border-0 rounded-none mb-0 cursor-default';
const MTC_BOOK = 'bg-white border border-line rounded-lg mb-[0.9rem] overflow-hidden';
const MTC_DET_BOX = 'm-0 pt-0 px-[0.95rem] pb-[0.55rem]';
// Leave a Review (Wayan, Sep 2026): rombak dari 1 tombol PER kartu past-trip jadi
// SATU tombol global di bawah tab Past Trip, yang ngumpulin item review-able dari
// SEMUA past booking - user centang mana aja yang mau di-review dalam satu form
// (lihat ReviewModal.jsx). Constant di bawah dipake buat box/tombol global itu.
const MTC_REVIEW_BOX = 'flex justify-center mt-[1.4rem]';
const MTC_REVIEW_BTN = 'w-full';
// Cancellation contact (Wayan, Sep 2026): a bottom action on each BOOKED (upcoming)
// trip card - ghost/gold outline (secondary action, CLAUDE.md: primary CTA stays
// green, "look at more / secondary" stays gold) vs the green primary review CTA.
const MTC_CANCEL_BOX = 'flex justify-end m-0 py-[0.7rem] px-[0.95rem] border-t border-line bg-cream';
const MTC_CANCEL_BTN = `inline-flex w-auto ${BTN_SM} [border:1px_solid_var(--color-gold)] bg-white text-gold-d font-body font-semibold text-small no-underline [transition:background-color_var(--dur)_ease,color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-gold hover:text-white max-[600px]:w-full max-[600px]:justify-center`;
// Cart action buttons: shared .btn-pill was forced full-width via
// `[data-mytrips-cart] .btn-pill` (removed); set per-button now.
const MTC_ADD_FULL = `${BTN_PILL} w-full mt-4`;
// datebtn: base field look (shared rule) + button specifics + calendar ::before
// (mask, %20-encoded so it survives as a Tailwind arbitrary value).
const CAL_MASK = "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='black'%20stroke-width='1.8'%20stroke-linecap='round'%20stroke-linejoin='round'%3E%3Crect%20x='3'%20y='5'%20width='18'%20height='16'%20rx='2'/%3E%3Cpath%20d='M8%203v4M16%203v4M3%2010h18'/%3E%3C/svg%3E\")";
const MTC_DATEBTN = `inline-flex items-center gap-[0.4rem] mt-[0.35rem] py-[0.3rem] px-[0.6rem] bg-white text-left cursor-pointer border border-line rounded-md font-body text-[length:var(--fs-field)] text-green before:content-[''] before:flex-none before:w-[14px] before:h-[14px] before:bg-current before:opacity-70 before:[-webkit-mask-image:${CAL_MASK}] before:[mask-image:${CAL_MASK}] before:[-webkit-mask-repeat:no-repeat] before:[mask-repeat:no-repeat] before:[-webkit-mask-position:center] before:[mask-position:center] before:[-webkit-mask-size:contain] before:[mask-size:contain]`;

function fmtDay(ds) {
  if (!ds) return 'date TBD';
  const [y, m, d] = ds.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function ItemIcon({ row }) {
  const img = row.kind === 'day' ? imageForProgram(row.service) : null;
  if (img) {
    return (
      <span
        className={MTC_ITEM_ICON_PHOTO}
        style={{ backgroundImage: `url(/assets/images/${img})` }}
        aria-hidden="true"
      />
    );
  }
  let glyph;
  if (row.kind === 'transfer') glyph = <Car strokeWidth={1.7} />;
  else if (row.kind === 'charter') glyph = <Clock strokeWidth={1.7} />;
  else glyph = <MapPin strokeWidth={1.7} />;
  return <span className={MTC_ITEM_ICON} aria-hidden="true">{glyph}</span>;
}

export default function MyTripsCart() {
  const { state, save, hydrated } = useItinerary();
  const { displayGuests, currency, stay } = useTripPrefs();
  const { account, trips, reviewableItems } = useAccount();
  const { referral } = useReferral();
  const { openBooking } = useBooking();

  const [review, setReview] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editDate, setEditDate] = useState(null);
  const [tab, setTab] = useState('custom');
  // Phone: which of the shell's two screens is showing. This page opens straight
  // on the cart rather than on the section list - unlike Our Company it has an
  // obvious default, and a guest who came here to pay should not have to tap
  // through a menu first. Back still reaches the list.
  const [reading, setReading] = useState(true);
  const [openRef, setOpenRef] = useState(null);

  const rows = useMemo(() => {
    const out = [];
    // Bug fix (Sep 2026, Wayan - proof screenshot, X still stuck on a single day
    // item): day_no used to be the position in the FILTERED list (skipping empty
    // days), but remove()/date-edit index into the RAW state.days array with it.
    // An empty day slot anywhere before this one (e.g. left behind by "+ Add Day"
    // on /itinerary, which shares this same localStorage state) shifts the two
    // out of sync - remove() then hits the wrong day (often empty) and silently
    // no-ops. Iterate the RAW array and skip empties inline so day_no always
    // matches its real state.days index.
    (state.days || []).forEach((d, i) => {
      if (!d.items || !d.items.length) return;
      d.items.forEach((name, k) => {
        out.push({
          kind: 'day',
          type: 'tour',
          service: name,
          date: d.date || '',
          guests: parseInt(d.guests, 10) || displayGuests,
          mode: (d.itemModes && d.itemModes[k]) || 'standard',
          day_no: i + 1,
        });
      });
    });
    (state.transfers || []).forEach((t, ti) => out.push({
      kind: 'transfer', type: 'transfer', service: t.route, date: t.date || '',
      guests: parseInt(t.guests, 10) || displayGuests, return: !!t.return, localIndex: ti,
      // Airport-transfer extras (AirportTransferForm) - carried through so they
      // survive into `lines` at checkout; BookConfirmModal.payload() already
      // forwards pickup/dropoff/flight_number/flight_datetime per line.
      ...(t.direction ? { direction: t.direction } : null),
      ...(t.pickup ? { pickup: t.pickup } : null),
      ...(t.dropoff ? { dropoff: t.dropoff } : null),
      ...(t.flight_number ? { flight_number: t.flight_number } : null),
      ...(t.flight_datetime ? { flight_datetime: t.flight_datetime } : null),
    }));
    (state.charters || []).forEach((c, ci) => out.push({
      kind: 'charter', type: 'charter', service: 'Charter', date: c.date || '',
      guests: parseInt(c.guests, 10) || displayGuests, area: c.area || 'Ubud',
      duration: c.dur || c.duration, extra: c.extra || 0, localIndex: ci,
      // The pick-up time the guest chose in the builder. Carried like the
      // transfer fields above it: shown in the cart and forwarded at checkout,
      // ignored by the pricing call, which prices a charter off area/duration/extra.
      ...(c.time ? { time: c.time } : null),
    }));
    return out;
  }, [state, displayGuests]);

  const priced = useQuote({
    lines: rows,
    currency,
    stay,
    referral: (referral && referral.code) || '',
    enabled: hydrated,
  });
  const { format } = useMoney();

  if (!hydrated) return <div data-mytrips-cart />;

  const undated = rows.some((r) => !r.date);
  const totalText = priced ? format(priced.total.display) : '-';

  // Bug fix (Sep 2026, Wayan: "X gak berfungsi"): dulu di-splice pakai index GLOBAL
  // di `rows` (gabungan days+transfers+charters) - begitu ada day item sebelum
  // transfer/charter, index itu udah gak match posisi asli di state.transfers/
  // .charters, jadi splice-nya no-op alias silently gagal. Row day-item TETEP
  // di-cari via indexOf(service) di hari-nya, itu udah bener dari dulu.
  const remove = (row) => {
    const next = JSON.parse(JSON.stringify(state));
    if (row.kind === 'transfer') next.transfers.splice(row.localIndex, 1);
    else if (row.kind === 'charter') next.charters.splice(row.localIndex, 1);
    else {
      let d = next.days[row.day_no - 1];
      // Defensive fallback: if the expected day doesn't actually hold this item
      // (an index mismatch we've been bitten by twice now), search every day
      // instead of no-op'ing - a delete tap should never just do nothing.
      if (!d || !(d.items || []).includes(row.service)) {
        d = (next.days || []).find((dd) => (dd.items || []).includes(row.service));
      }
      if (d) {
        const k = d.items.indexOf(row.service);
        if (k >= 0) {
          d.items.splice(k, 1);
          if (d.itemModes) d.itemModes.splice(k, 1);
        }
      }
    }
    save(next);
  };

  const checkout = () => {
    if (!rows.length || undated) return;
    const parts = [];
    const nD = new Set(rows.filter((r) => r.kind === 'day').map((r) => r.day_no)).size;
    const nT = rows.filter((r) => r.kind === 'transfer').length;
    const nC = rows.filter((r) => r.kind === 'charter').length;
    if (nD) parts.push(nD + ' day' + (nD > 1 ? 's' : ''));
    if (nT) parts.push(nT + ' transfer' + (nT > 1 ? 's' : ''));
    if (nC) parts.push(nC + ' charter');
    openBooking({
      type: 'itinerary',
      service: 'My Trip (' + parts.join(' + ') + ')',
      guests: String(displayGuests),
      date: '',
      pickupOptional: true,
      dropoffRequired: false,
      detailsTitle: 'Trip details',
      detailLines: rows.map((r) => `${r.day_no ? 'Day ' + r.day_no + ' · ' : ''}${fmtDay(r.date)} · ${r.service}`),
      lines: rows,
      onSuccess: () => save({ days: [], transfers: [], charters: [] }),
    });
  };

  // Bookings are a record of what was charged, so they show the amount stored
  // against them rather than a live conversion.
  const bookedMoney = (usd, idr) =>
    currency === 'IDR'
      ? 'Rp' + Number(idr || 0).toLocaleString('id-ID')
      : '$' + Number(usd || 0).toLocaleString('en-US');

  const fmtRange = (from, to) => {
    if (!from) return 'Date TBD';
    if (to && to !== from) return fmtDay(from) + ' - ' + fmtDay(to);
    return fmtDay(from);
  };

  const bookingCard = (t, isPast) => {
    const img =
      imageForProgram(t.name) ||
      imageForProgram((t.lines && t.lines[0] && t.lines[0].service) || '');
    const status = isPast
      ? 'Completed'
      : t.status
        ? t.status.charAt(0).toUpperCase() + t.status.slice(1)
        : 'Booked';
    const open = openRef === t.ref;
    const items = t.lines || [];
    return (
      <div className={MTC_BOOK} key={t.ref}>
        <div className={MTC_ITEM_BOOKED}>
          {img ? (
            <span
              className={MTC_ITEM_ICON_PHOTO}
              style={{ backgroundImage: 'url(/assets/images/' + img + ')' }}
              aria-hidden="true"
            />
          ) : (
            <ItemIcon row={{ kind: 'tour' }} />
          )}
          <div className={MTC_ITEM_BODY}>
            <p className={MTC_ITEM_TITLE}>{t.name}</p>
            <p className={MTC_ITEM_DESC}>{status} · {t.guests || '-'} guests</p>
            <p className={MTC_ITEM_DATE}>
              {fmtRange(t.start_date, t.end_date)}{t.ref ? ' · ' + t.ref : ''}
            </p>
          </div>
          <span className={MTC_ITEM_PRICE}>
            <span className={PRICE}>{withSymbol(bookedMoney(t.price_usd, t.price_idr))}</span>
          </span>
        </div>

        {items.length > 0 && (
          <div className={MTC_DET_BOX}>
            <button
              type="button"
              className={MTC_DET_TOGGLE}
              aria-expanded={open ? 'true' : 'false'}
              onClick={() => setOpenRef(open ? null : t.ref)}
            >
              {open
                ? 'Hide details'
                : 'View details (' + items.length + (items.length > 1 ? ' items)' : ' item)')}
              <ChevronDown className={MTC_DET_CHEV} strokeWidth={1.6} aria-hidden="true" />
            </button>
            {open && (
              <ul className={MTC_DET_LIST}>
                {items.map((l, i) => (
                  <li className={MTC_DET_LINE} key={i}>
                    <span className={MTC_DET_NAME}>
                      {l.day_no ? 'Day ' + l.day_no + ' · ' : ''}{l.service}
                      <span className={MTC_DET_META}>
                        {fmtDay(l.date)}
                        {l.guests ? ' · ' + l.guests + ' pax' : ''}
                        {l.pickup_time ? ' · ' + l.pickup_time : ''}
                      </span>
                    </span>
                    <span className={MTC_DET_AMT}>{withSymbol(bookedMoney(l.price_usd, l.price_idr))}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {!isPast && (
          <div className={MTC_CANCEL_BOX}>
            <a
              className={MTC_CANCEL_BTN}
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hi, I'd like to ask about cancelling or changing my booking${t.ref ? ' (' + t.ref + ')' : ''} - ${t.name || 'my trip'}${t.start_date ? ' on ' + fmtRange(t.start_date, t.end_date) : ''}.`,
              )}`}
              target="_blank"
              rel="noopener"
            >
              Contact us to cancel or change
            </a>
          </div>
        )}
      </div>
    );
  };

  const bookingPanel = (isPast) => {
    if (!readLocal(KEY.token, '')) {
      return (
        <div className={MTC_EMPTY}>
          <p className={MTC_EMPTY_LEAD}>Sign in to see your trips.</p>
          <p className={MTC_EMPTY_SUB}>
            Open the account menu and sign in with your email - your booked and past trips show up here.
          </p>
        </div>
      );
    }
    if (!trips) {
      return (
        <div className={MTC_EMPTY}>
          <p className={MTC_EMPTY_SUB}>Loading your trips…</p>
        </div>
      );
    }
    const arr = (isPast ? trips.history : trips.upcoming) || [];
    if (!arr.length) {
      return (
        <div className={MTC_EMPTY}>
          <p className={MTC_EMPTY_LEAD}>{isPast ? 'No past trips yet.' : 'No booked trips yet.'}</p>
          <p className={MTC_EMPTY_SUB}>
            {isPast
              ? 'Trips you have already taken will appear here.'
              : 'Once you make a payment, your booked trip shows up here.'}
          </p>
        </div>
      );
    }
    return (
      <div>
        {arr.map((t) => bookingCard(t, isPast))}
        {isPast && reviewableItems.length > 0 && (
          <div className={MTC_REVIEW_BOX}>
            <button
              type="button"
              className={`${BTN_PILL} ${MTC_REVIEW_BTN}`}
              onClick={() => setReview({ name: (account && account.name) || '', items: reviewableItems })}
            >
              Leave a Review
            </button>
          </div>
        )}
      </div>
    );
  };

  const TABS = [
    { id: 'custom', label: 'My Trip', Icon: ShoppingBag },
    { id: 'booked', label: 'Booked Trip', Icon: CalendarCheck },
    { id: 'past', label: 'Past Trip', Icon: History },
  ];

  return (
    <div data-mytrips-cart>
      <RailLayout
        label="My trips"
        items={TABS}
        active={tab}
        onSelect={(id) => { setTab(id); setReading(true); }}
        reading={reading}
        onBack={() => setReading(false)}
      >
      {tab === 'custom' && (rows.length === 0 ? (
        <div className={MTC_EMPTY}>
          <p className={MTC_EMPTY_LEAD}>Your trip is empty.</p>
          <p className={MTC_EMPTY_SUB}>Add a tour, transfer, or experience to get started.</p>
          <button type="button" className={BTN_PILL} onClick={() => setAdding(true)}>Add program</button>
        </div>
      ) : (
        <>
          <div>
            {rows.map((r, i) => {
              const line = priced && priced.lines[i];
              return (
                <div className={MTC_ITEM} key={i}>
                  <ItemIcon row={r} />
                  <div className={MTC_ITEM_BODY}>
                    <p className={MTC_ITEM_TITLE}>{r.service}</p>
                    <p className={MTC_ITEM_DESC}>
                      {r.day_no ? `Day ${r.day_no} · ` : ''}
                      <button
                        type="button"
                        className={MTC_DATEBTN}
                        onClick={() => setEditDate({ row: r, index: i })}
                      >
                        {fmtDay(r.date)}
                      </button>
                      {r.time ? ` · ${r.time}` : ''}
                      {r.mode === 'exclusive' ? ' · Exclusive' : ''}
                      {r.return ? ' · return' : ''}
                    </p>
                  </div>
                  <span className={MTC_ITEM_PRICE}>
                    <span className={PRICE}>
                      {line ? withSymbol(format(line.display)) : '-'}
                    </span>
                  </span>
                  <button type="button" className={MTC_ITEM_DEL} aria-label={`Remove ${r.service}`} onClick={() => remove(r)}>&times;</button>
                </div>
              );
            })}
          </div>

          <div className={MTC_TOTAL}>
            <span className={MTC_TOTAL_LABEL}>Total</span>
            <span className={MTC_TOTAL_VAL}><span className={PRICE}>{withSymbol(totalText)}</span></span>
          </div>

          <button type="button" className={MTC_ADD_FULL} onClick={() => setAdding(true)}>+ Add another program</button>

          {undated && (
            <p className={MTC_NOTE_WARN}>Every item needs a date before you can pay. Tap a date to set it.</p>
          )}

          <p className={MTC_NOTE}>
            By clicking <strong>Pay now</strong>, you agree to our{' '}
            <a className={MTC_POLICY_LINK} href="/our-company.html#terms">Terms</a> and <a className={MTC_POLICY_LINK} href="/our-company.html#cancellation">Cancellation & Refund Policy</a>.
          </p>
          <button type="button" className={`${BTN} mt-[1.2rem] disabled:opacity-45 disabled:cursor-not-allowed`} disabled={undated} onClick={checkout}>Pay now</button>
          <p className={MTC_NOTE}>
            You&apos;ll add your name &amp; contact details at payment - that also creates your account so you can log in later with the same email.
          </p>
        </>
      ))}

      {tab === 'booked' && <div>{bookingPanel(false)}</div>}
      {tab === 'past' && <div>{bookingPanel(true)}</div>}
      </RailLayout>

      <ReviewModal open={!!review} prefill={review} onClose={() => setReview(null)} />

      <AddItemPicker open={adding} onClose={() => setAdding(false)} />

      <DatePopup
        open={!!editDate}
        title={editDate ? editDate.row.service : ''}
        initial={editDate ? editDate.row.date : ''}
        onPick={(date) => {
          if (!editDate) return;
          const r = editDate.row;
          if (r.kind === 'day' && r.day_no) {
            save(cascadeFrom(state, r.day_no - 1, date));
          } else {
            const next = JSON.parse(JSON.stringify(state));
            const list = r.kind === 'transfer' ? next.transfers : next.charters;
            const idx = r.kind === 'transfer'
              ? (state.transfers || []).findIndex((t) => t.route === r.service && t.date === r.date)
              : (state.charters || []).findIndex((c) => c.date === r.date);
            if (idx >= 0) { list[idx].date = date; save(next); }
          }
        }}
        onClose={() => setEditDate(null)}
      />
    </div>
  );
}
