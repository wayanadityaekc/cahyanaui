'use client';
import { BTN_SM } from '@/components/ui/btnClasses';

import { useEffect, useMemo, useState } from 'react';
import { UsersRound } from 'lucide-react';
import { ITN_SUBTITLE } from '@/components/ui/itnClasses';
import { BTN_BOOK } from '@/components/ui/btnBookClasses';
import { PRICE } from '@/components/ui/priceClasses';
import { useItinerary } from '@/state/ItineraryProvider';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useReferral } from '@/state/ReferralProvider';
import { useBooking } from '@/state/BookingProvider';
import { quote } from '@/lib/api';
import { cascadeFrom, clashDates, setItemMode, removeItem, removeDay, suggestState } from '@/lib/cart';
import { SUGGEST, PKG_AIRPORT, PKG_AIRPORT_PLACE } from '@/content/shared/suggest';
import AddItemPicker from './AddItemPicker';
import { usePricing } from '@/state/PricingProvider';
import { withSymbol } from '@/components/Price';
import Select from '@/components/ui/Select';
import DateField from '@/components/ui/DateField';

const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7];
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Presentational `.itn-*` classes -> utilities (B-FINAL). The itn2 layout engine,
// #itn-days slider, field/day/trip families are ALL utilities now; the old CSS is
// removed from style.css. Only `.itn-badge` (rendered in Navbar) lives elsewhere.
// The itn2 order-reflow is done with [order:N] + [display:contents] utilities on the
// elements directly (no anchor classes needed); `.itn-day` is kept ONLY as a marker so
// the desktop day-slider child selector `[&>.itn-day]` in ITN_DAYS can target the cards.
// text-[length:...] so a var font-size isn't parsed as a color.
// bg image via inline style (not bg-[url(...)]) so the bundler doesn't hash/move
// the asset to /_next/static/media - keeps the exact /assets/images path the old
// CSS used (background-position/size stay as utilities).
const ITN_SUGGEST = 'relative overflow-hidden py-[1.25rem] px-[1.35rem] rounded-lg bg-cover bg-center before:content-[""] before:absolute before:inset-0 before:[background:linear-gradient(180deg,rgba(18,32,22,0.68),rgba(18,32,22,0.8))] [&>*]:relative [order:1]';
const ITN_SUGGEST_BG = { backgroundImage: 'url(/assets/images/ubud-tour-card.jpg)' };
const ITN_SUGGEST_T = 'font-body text-[length:var(--fs-h3)] font-semibold text-white min-[993px]:text-[length:var(--fs-body)] min-[993px]:pb-[0.55rem] min-[993px]:mb-[0.6rem] min-[993px]:border-b min-[993px]:border-b-[rgba(247,243,234,0.35)]';
const ITN_SUGGEST_S = 'mt-[0.25rem] mb-4 text-[length:var(--fs-body)] text-[rgba(247,243,234,0.85)] min-[993px]:text-[length:var(--fs-small)]';
const ITN_SUGGEST_ROW = 'flex flex-wrap items-end gap-[0.7rem] min-[993px]:grid min-[993px]:grid-cols-[1fr_1fr] min-[993px]:[align-items:end]';
const ITN_SUGGEST_F = 'flex flex-col gap-[0.25rem] text-[length:var(--fs-label)] font-semibold tracking-[0.14em] uppercase text-[rgba(247,243,234,0.85)] [&_select]:min-w-[120px] [&_select]:h-[var(--field-h)] [&_select]:px-[0.6rem] [&_select]:py-[0.4rem] min-[993px]:[&_select]:w-full min-[993px]:[&_select]:min-w-0';
const ITN_SUGGEST_BTN = `${BTN_BOOK} h-[var(--field-h)] px-[1.3rem] text-[1rem] min-[993px]:[grid-column:1/-1]`;
const ITN_TRIP = 'pt-4 px-[1.1rem] pb-[1.2rem] [border:1.5px_solid_transparent] rounded-md [background:linear-gradient(var(--color-cream),var(--color-cream))_padding-box,var(--gold-edge)_border-box] [order:2]';
const ITN_TRIP_T = 'mt-0 mb-[0.15rem] text-[length:var(--fs-body)] font-semibold text-green min-[993px]:pb-[0.55rem] min-[993px]:mb-[0.6rem] min-[993px]:border-b min-[993px]:border-b-[rgba(34,32,28,0.4)]';
const ITN_TRIP_S = 'mt-0 mb-[0.8rem] text-[length:var(--fs-label)] text-muted';
const ITN_TRIP_GUESTS = 'flex items-center gap-[0.4rem] mt-[0.7rem] mb-0 text-[length:var(--fs-label)] text-muted [&_svg]:w-[var(--icon-sm)] [&_svg]:h-[var(--icon-sm)] [&_svg]:text-gold [&_svg]:flex-none [&_b]:text-green';
const ITN_PANEL_HEAD = 'flex items-center justify-between flex-wrap gap-2 mb-4';
const ITN_GHOSTBTN = `inline-flex ${BTN_SM} border border-[#d8d2c4] bg-white font-body text-[length:var(--fs-small)] font-semibold text-green cursor-pointer [transition:background-color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-[#efe9db]`;
const ITN_DAY = 'itn-day relative p-[1.1rem] mb-4 border border-[#e6dfce] rounded-md bg-white last:mb-0';
const ITN_DAY_TITLE = 'font-body text-[1rem] font-semibold text-green';
const ITN_DAY_EMPTY = 'flex items-center gap-[0.6rem] py-2 px-[0.2rem] mb-4 text-[length:var(--fs-small)] text-[#9a9382]';
const ITN_SUMMARY = 'py-6 px-6 pb-[1.4rem] rounded-md text-center text-cream bg-green max-[992px]:p-[1.25rem] [order:5]';
const ITN_SUMMARY_LABEL = 'text-[length:var(--fs-small)] font-medium text-gold-l normal-case tracking-normal min-[993px]:block min-[993px]:pb-[0.55rem] min-[993px]:mb-[0.6rem] min-[993px]:border-b min-[993px]:border-b-[rgba(247,243,234,0.25)]';
const ITN_SUMMARY_AMT = 'mt-[0.15rem] mb-[0.1rem] text-[2rem] leading-[1.15] min-[993px]:text-[1.6rem]';
const ITN_SUMMARY_SUB = 'text-[length:var(--fs-small)] text-[rgba(247,243,234,0.72)]';

// .tour-type* Standard/Exclusive toggle (B-FINAL). Only consumer is this builder.
// Dead in old CSS (not reproduced): .tour-type__toggle--static + :disabled (no static
// toggle rendered). `.tourprog .tour-type--card{display:none}` kept as [.tourprog_&]:hidden.
// Active state = full string swap (not base+is-active) so no font-weight/color/bg order clash.
const TT_CARD = 'flex flex-wrap items-center gap-[0.4rem_0.7rem] mt-3 [.tourprog_&]:hidden';
const TT_TOGGLE = 'inline-flex p-[3px] border border-[rgba(34,32,28,0.5)] rounded-[var(--r-pill)] bg-[rgba(34,32,28,0.08)]';
const TT_BTN = 'py-[0.3rem] px-[0.85rem] [border:none] rounded-[var(--r-pill)] font-body text-[length:var(--fs-label)] font-medium text-green bg-transparent cursor-pointer [transition:background-color_var(--dur)_ease,color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)]';
const TT_BTN_ON = 'py-[0.3rem] px-[0.85rem] [border:none] rounded-[var(--r-pill)] font-body text-[length:var(--fs-label)] font-semibold text-white bg-gold cursor-pointer [transition:background-color_var(--dur)_ease,color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)]';

// .itn2* itinerary layout engine (B-FINAL). Mobile: single flex column, order reflow
// (side becomes display:contents so its children reorder among the itn2 flex items:
// suggest 1, trip 2, days/main 3, add 4, total 5). Desktop (>=993): grid 380 + 1fr, side
// = a card column. The order values are KEPT at every breakpoint (no desktop reset) to
// match HEAD exactly: the old `.itn2__side > *{order:0}` desktop reset was defeated by
// specificity (`.itn2__side > .itn-trip` at 0,2,0 beats `> *` at 0,1,0), so add(4) sits
// above total(5) in the side column on desktop too. #itn-days is the desktop day slider.
const ITN2 = 'max-w-[760px] mx-auto flex flex-col gap-6 min-[993px]:max-w-[1320px] min-[993px]:grid min-[993px]:grid-cols-[380px_minmax(0,1fr)] min-[993px]:[align-items:start]';
const ITN2_SIDE = '[display:contents] min-[993px]:flex min-[993px]:flex-col min-[993px]:gap-5';
const ITN2_MAIN = '[order:3] flex flex-col gap-6 min-w-0';
const ITN2_PANEL = 'p-0 bg-transparent';
const ITN2_ADD = 'block w-full mt-[1.25rem] p-[0.95rem] [border:1.5px_dashed_var(--color-green)] rounded-md bg-white font-body text-[1rem] font-semibold text-green cursor-pointer [transition:background-color_var(--dur)_ease,color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-green hover:text-white [order:4] min-[993px]:mt-0';
// #itn-days desktop slider (mobile: days stack normally).
const ITN_DAYS = 'min-[993px]:flex min-[993px]:gap-4 min-[993px]:overflow-x-auto min-[993px]:overflow-y-hidden min-[993px]:[scroll-snap-type:x_mandatory] min-[993px]:[touch-action:pan-x_pan-y] min-[993px]:pb-3 min-[993px]:[scrollbar-width:none] min-[993px]:[&::-webkit-scrollbar]:hidden min-[993px]:[&>.itn-day]:flex-[0_0_300px] min-[993px]:[&>.itn-day]:[scroll-snap-align:start] min-[993px]:[&>.itn-day]:mb-0';
// .itn-day__fields grid + .field wrapper (in-itn context: mb-0, min-w-0) + label + the
// raw input/select styling (.itn-day__fields .field input/select). .itn-ovr is dead.
// Trip fields: 2-col mobile, 1-col desktop in the side (.itn2__side .itn-trip__fields).
const ITN_DAY_FIELDS = 'grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[0.8rem] mb-[0.9rem]';
const ITN_TRIP_FIELDS = 'grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[0.8rem] mb-0 min-[993px]:grid-cols-[1fr]';
const ITN_FIELD = 'mb-0 min-w-0 [&_label]:block [&_label]:mb-[0.4rem] [&_label]:text-[length:var(--fs-small)] [&_label]:font-medium [&_label]:font-body [&_label]:tracking-normal [&_label]:normal-case';
const ITN_FIELD_FULL = `${ITN_FIELD} [grid-column:1/-1]`;
// Effective style of a field control inside `.itn-day__fields .field` (the trip-fields
// wrapper had BOTH itn-day__fields+itn-trip__fields, so both text + date inputs hit it):
// base (border/radius/font/color) + .itn-day__fields .field input (w/min-w/height/pad
// 0.55rem 0.65rem/bg). Date input additionally hits .field input[type="date"]
// (line-height 1.4 + appearance:none) - same padding wins by source order.
const ITN_FIELD_INPUT = 'w-full min-w-0 h-[var(--field-h)] py-[0.55rem] px-[0.65rem] [border:1px_solid_var(--line)] rounded-md bg-white font-body text-[length:var(--fs-field)] text-green';
const ITN_FIELD_DATE = `${ITN_FIELD_INPUT} leading-[1.4] appearance-none`;

function addDays(ds, n) {
  if (!ds) return '';
  const [y, m, d] = ds.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function fmtDay(ds) {
  if (!ds) return 'date TBD';
  const [y, m, d] = ds.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function ItineraryBuilder() {
  const { state, save, hydrated } = useItinerary();
  const { displayGuests, guests, setGuests, currency, stay, dateFrom, setDateRange } = useTripPrefs();
  const { referral } = useReferral();
  const { openBooking } = useBooking();
  const pricing = usePricing();

  const isFullDay = (name) => {
    const cat = pricing && pricing.catalog && pricing.catalog.items.find((i) => i.name === name);
    return !!cat && (cat.category === 'tour' || cat.category === 'combo');
  };

  const [sgDays, setSgDays] = useState(3);
  const [sgGuests, setSgGuests] = useState(2);
  const [hotel, setHotel] = useState('');
  const [priced, setPriced] = useState(null);
  const [pickFor, setPickFor] = useState(null);

  const days = state.days || [];

  const rows = useMemo(() => {
    const out = [];
    days.forEach((d, i) => {
      (d.items || []).forEach((name, k) => {
        out.push({
          type: 'tour', service: name, date: d.date || '',
          guests: parseInt(d.guests, 10) || displayGuests,
          mode: (d.itemModes && d.itemModes[k]) || 'standard', day_no: i + 1,
        });
      });
    });
    (state.transfers || []).forEach((t) => out.push({ type: 'transfer', service: t.route, date: t.date || '', guests: displayGuests, return: !!t.return }));
    (state.charters || []).forEach((c) => out.push({ type: 'charter', service: 'Charter', date: c.date || '', guests: displayGuests, area: c.area || 'Ubud', duration: c.dur || c.duration, extra: c.extra || 0, ...(c.time ? { time: c.time } : null) }));
    return out;
  }, [state, days, displayGuests]);

  useEffect(() => {
    if (!hydrated || !rows.length) { setPriced(null); return; }
    let cancelled = false;
    quote({ lines: rows, currency, stay, referral: (referral && referral.code) || '' })
      .then((d) => { if (!cancelled && d && d.lines) setPriced(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [rows, currency, stay, referral, hydrated]);

  const symbol = (priced && priced.symbol) || '$';
  const totalText = priced ? symbol + priced.total.display.toLocaleString(currency === 'IDR' ? 'id-ID' : 'en-US') : '$0';
  const dayCount = days.filter((d) => d.items && d.items.length).length;

  const addDay = () => save({ ...state, days: [...days, { items: [], itemModes: [], date: '' }] });
  const clearAll = () => save({ days: [], transfers: [], charters: [] });

  const setStart = (v) => {
    setDateRange(v, dateFrom ? '' : '');
    const next = days.map((d, i) => ({ ...d, date: v ? addDays(v, i) : '' }));
    save({ ...state, days: next });
  };

  const book = () => {
    if (!rows.length || rows.some((r) => !r.date)) return;
    openBooking({
      type: 'itinerary',
      service: `My Trip (${dayCount} day${dayCount > 1 ? 's' : ''})`,
      guests: String(displayGuests),
      date: '',
      pickupOptional: true,
      dropoffRequired: false,
      detailsTitle: 'Trip details',
      detailLines: rows.map((r) => `${r.day_no ? 'Day ' + r.day_no + ' · ' : ''}${fmtDay(r.date)} · ${r.service}`),
      lines: rows.map((r) => ({ ...r, pickup: hotel, dropoff: hotel })),
      onSuccess: () => clearAll(),
    });
  };

  return (
    <div className={ITN2}>
      <aside className={ITN2_SIDE}>
        <div className={ITN_SUGGEST} style={ITN_SUGGEST_BG} id="suggested">
          <p className={ITN_SUGGEST_T}>Don&apos;t know where to start?</p>
          <p className={ITN_SUGGEST_S}>Pick a length and group size - we&apos;ll build a suggested plan you can tweak, then book.</p>
          <div className={ITN_SUGGEST_ROW}>
            <div className={ITN_SUGGEST_F}>
              <span>Days</span>
              <Select
                id="sg-days"
                label="Days"
                value={sgDays}
                onChange={(v) => setSgDays(+v)}
                options={DAY_OPTIONS.map((n) => ({ value: String(n), label: String(n) }))}
              />
            </div>
            <div className={ITN_SUGGEST_F}>
              <span>Guests</span>
              <Select
                id="sg-guests"
                label="Guests"
                value={sgGuests}
                onChange={(v) => { setSgGuests(+v); setGuests(v); }}
                options={GUEST_OPTIONS.map((n) => ({ value: String(n), label: String(n) }))}
              />
            </div>
            <button
              className={ITN_SUGGEST_BTN}
              id="sg-build"
              type="button"
              onClick={() => {
                const next = suggestState({
                  nDays: sgDays,
                  guests: sgGuests,
                  suggest: SUGGEST,
                  airportRoute: PKG_AIRPORT,
                  airportPlace: PKG_AIRPORT_PLACE,
                  isActive: (name) => {
                    const c = pricing && pricing.catalog && pricing.catalog.items.find((i) => i.name === name);
                    return !c || c.active !== false;
                  },
                });
                save(dateFrom ? cascadeFrom(next, 0, dateFrom) : next);
              }}
            >
              Build itinerary
            </button>
          </div>
        </div>

        <div className={ITN_TRIP} id="itn-trip">
          <p className={ITN_TRIP_T}>Trip details</p>
          <p className={ITN_TRIP_S}>Fill once - every day follows automatically.</p>
          <div className={ITN_TRIP_FIELDS}>
            <div className={ITN_FIELD}>
              <label>Start date</label>
              <DateField id="trip-start" label="Start date" value={dateFrom} onChange={setStart} />
            </div>
            <div className={ITN_FIELD_FULL}>
              <label>Hotel / villa (pick-up &amp; drop-off)</label>
              <input className={ITN_FIELD_INPUT} type="text" id="trip-hotel" placeholder="Hotel / villa / area" value={hotel} onChange={(e) => setHotel(e.target.value)} />
            </div>
          </div>
          <p className={ITN_TRIP_GUESTS}>
            <UsersRound strokeWidth={1.8} aria-hidden="true" />
            Guests: <b id="trip-guests-n">{guests || '-'}</b>&nbsp;- follows the navbar picker
          </p>
        </div>

        {clashDates(state, isFullDay).length > 0 && (
          <p className="text-small text-err text-center mt-[0.7rem] mx-auto mb-0 max-w-[46ch]">
            Two full-day programmes share the same date. Change one before booking.
          </p>
        )}

        <section className={ITN_SUMMARY}>
          <span className={ITN_SUMMARY_LABEL}>Trip total</span>
          <div className={ITN_SUMMARY_AMT}><span className="amount" id="itn-total"><span className={PRICE}>{withSymbol(totalText)}</span></span></div>
          <span className={ITN_SUMMARY_SUB} id="itn-total-label">{dayCount} day{dayCount === 1 ? '' : 's'}</span>
          <button className={BTN_BOOK} id="itn-book" disabled={!rows.length || rows.some((r) => !r.date) || clashDates(state, isFullDay).length > 0} onClick={book}>Book itinerary</button>
        </section>

        {/* "Add more day" - order:4 + desktop mt:0 baked into ITN2_ADD utilities. */}
        <button className={ITN2_ADD} id="itn-add" type="button" onClick={addDay}>Add day</button>
      </aside>

      <div className={ITN2_MAIN}>
        <div className={ITN2_PANEL}>
          <div className={ITN_PANEL_HEAD}>
            <h3 className={ITN_SUBTITLE}>Your Days</h3>
            <button className={ITN_GHOSTBTN} id="itn-clear" type="button" onClick={clearAll}>Clear all</button>
          </div>
          <div id="itn-days" className={ITN_DAYS}>
            {days.map((d, i) => (
              <div className={ITN_DAY} key={i}>
                <p className={ITN_DAY_TITLE}>Day {i + 1} · {fmtDay(d.date)}</p>
                <div className={ITN_DAY_FIELDS}>
                  <div className={ITN_FIELD}>
                    <label>Date</label>
                    <input
                      className={ITN_FIELD_DATE}
                      type="date"
                      value={d.date || ''}
                      onChange={(e) => save(cascadeFrom(state, i, e.target.value))}
                    />
                  </div>
                </div>
                {(d.items || []).length === 0 ? (
                  <p className={ITN_DAY_EMPTY}>Nothing added yet.</p>
                ) : (
                  <ul>
                    {(d.items || []).map((it, k) => (
                      <li key={k}>
                        {it}
                        {isFullDay(it) && (
                          <span className={TT_CARD}>
                            <span className={TT_TOGGLE} role="tablist" aria-label="Tour type">
                              <button
                                type="button"
                                className={((d.itemModes || [])[k] || 'standard') === 'standard' ? TT_BTN_ON : TT_BTN}
                                role="tab"
                                onClick={() => save(setItemMode(state, i, k, 'standard'))}
                              >
                                Standard
                              </button>
                              <button
                                type="button"
                                className={(d.itemModes || [])[k] === 'exclusive' ? TT_BTN_ON : TT_BTN}
                                role="tab"
                                onClick={() => save(setItemMode(state, i, k, 'exclusive'))}
                              >
                                Exclusive
                              </button>
                            </span>
                          </span>
                        )}
                        <button type="button" className={ITN_GHOSTBTN} aria-label={`Remove ${it}`} onClick={() => save(removeItem(state, i, k))}>&times;</button>
                      </li>
                    ))}
                  </ul>
                )}
                <button type="button" className={ITN_GHOSTBTN} onClick={() => setPickFor(i)}>+ Add to this day</button>
                <button type="button" className={ITN_GHOSTBTN} onClick={() => save(removeDay(state, i))}>Remove day</button>
              </div>
            ))}
          </div>
        </div>
        <div className={ITN2_PANEL}>
          <h3 className={`${ITN_SUBTITLE} mb-4`}>Transfers &amp; Charter</h3>
          <div id="itn-transfers-list">
            {(state.transfers || []).map((t, i) => <p key={'t' + i}>{t.route} · {fmtDay(t.date)}</p>)}
            {(state.charters || []).map((c, i) => <p key={'c' + i}>Charter · {fmtDay(c.date)}</p>)}
          </div>
        </div>
      </div>

      <AddItemPicker
        mode="pick"
        open={pickFor !== null}
        onClose={() => setPickFor(null)}
        onPick={(name) => {
          const days = (state.days || []).map((d, i) =>
            i === pickFor
              ? { ...d, items: [...(d.items || []), name], itemModes: [...(d.itemModes || []), 'standard'] }
              : d,
          );
          save({ ...state, days });
        }}
      />
    </div>
  );
}
