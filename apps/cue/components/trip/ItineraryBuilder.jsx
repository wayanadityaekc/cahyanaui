'use client';

import { useEffect, useMemo, useState } from 'react';
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
    (state.charters || []).forEach((c) => out.push({ type: 'charter', service: 'Charter', date: c.date || '', guests: displayGuests, area: c.area || 'Ubud', duration: c.dur || c.duration, extra: c.extra || 0 }));
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
    <div className="itn2">
      <aside className="itn2__side">
        <div className="itn-suggest" id="suggested">
          <p className="itn-suggest__t">Don&apos;t know where to start?</p>
          <p className="itn-suggest__s">Pick a length and group size - we&apos;ll build a suggested plan you can tweak, then book.</p>
          <div className="itn-suggest__row">
            <div className="itn-suggest__f">
              <span>Days</span>
              <Select
                id="sg-days"
                label="Days"
                value={sgDays}
                onChange={(v) => setSgDays(+v)}
                options={DAY_OPTIONS.map((n) => ({ value: String(n), label: String(n) }))}
              />
            </div>
            <div className="itn-suggest__f">
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
              className="btn-book itn-suggest__btn"
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
              Build my itinerary
            </button>
          </div>
        </div>

        <div className="itn-trip" id="itn-trip">
          <p className="itn-trip__t">Trip details</p>
          <p className="itn-trip__s">Fill once - every day follows automatically.</p>
          <div className="itn-day__fields itn-trip__fields">
            <div className="field">
              <label>Start date</label>
              <DateField id="trip-start" label="Start date" value={dateFrom} onChange={setStart} />
            </div>
            <div className="field field--full">
              <label>Hotel / villa (pick-up &amp; drop-off)</label>
              <input type="text" id="trip-hotel" placeholder="Hotel / villa / area" value={hotel} onChange={(e) => setHotel(e.target.value)} />
            </div>
          </div>
          <p className="itn-trip__guests">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="9" cy="8" r="3.2" />
              <path d="M3.5 19c.6-3 2.9-4.6 5.5-4.6s4.9 1.6 5.5 4.6" />
              <circle cx="16.5" cy="9" r="2.4" />
              <path d="M15.5 14.7c2.3.2 4.2 1.6 4.9 4.3" />
            </svg>
            Guests: <b id="trip-guests-n">{guests || '-'}</b>&nbsp;- follows the navbar picker
          </p>
        </div>

        {clashDates(state, isFullDay).length > 0 && (
          <p className="text-small text-err text-center mt-[0.7rem] mx-auto mb-0 max-w-[46ch]">
            Two full-day programmes share the same date. Change one before booking.
          </p>
        )}

        <section className="summary">
          <span className="summary__label">Trip total</span>
          <div className="summary__amt"><span className="amount" id="itn-total"><span className="price-cur">{withSymbol(totalText)}</span></span></div>
          <span className="summary__sub" id="itn-total-label">{dayCount} day{dayCount === 1 ? '' : 's'}</span>
          <button className="btn-book" id="itn-book" disabled={!rows.length || rows.some((r) => !r.date) || clashDates(state, isFullDay).length > 0} onClick={book}>Book This Itinerary</button>
        </section>

        <button className="itn2__add" id="itn-add" type="button" onClick={addDay}>+ Add more day</button>
      </aside>

      <div className="itn2__main">
        <div className="itn2__panel">
          <div className="itn__panel-head">
            <h3 className="itn__subtitle">Your Days</h3>
            <button className="itn__ghostbtn" id="itn-clear" type="button" onClick={clearAll}>Clear all</button>
          </div>
          <div id="itn-days">
            {days.map((d, i) => (
              <div className="itn-day" key={i}>
                <p className="itn-day__title">Day {i + 1} · {fmtDay(d.date)}</p>
                <div className="itn-day__fields">
                  <div className="field">
                    <label>Date</label>
                    <input
                      type="date"
                      value={d.date || ''}
                      onChange={(e) => save(cascadeFrom(state, i, e.target.value))}
                    />
                  </div>
                </div>
                {(d.items || []).length === 0 ? (
                  <p className="itn-day__empty">Nothing added yet.</p>
                ) : (
                  <ul>
                    {(d.items || []).map((it, k) => (
                      <li key={k}>
                        {it}
                        {isFullDay(it) && (
                          <span className="tour-type tour-type--card">
                            <span className="tour-type__toggle" role="tablist" aria-label="Tour type">
                              <button
                                type="button"
                                className={`tour-type__btn${((d.itemModes || [])[k] || 'standard') === 'standard' ? ' is-active' : ''}`}
                                role="tab"
                                onClick={() => save(setItemMode(state, i, k, 'standard'))}
                              >
                                Standard
                              </button>
                              <button
                                type="button"
                                className={`tour-type__btn${(d.itemModes || [])[k] === 'exclusive' ? ' is-active' : ''}`}
                                role="tab"
                                onClick={() => save(setItemMode(state, i, k, 'exclusive'))}
                              >
                                Exclusive
                              </button>
                            </span>
                          </span>
                        )}
                        <button type="button" className="itn__ghostbtn" aria-label={`Remove ${it}`} onClick={() => save(removeItem(state, i, k))}>&times;</button>
                      </li>
                    ))}
                  </ul>
                )}
                <button type="button" className="itn__ghostbtn" onClick={() => setPickFor(i)}>+ Add to this day</button>
                <button type="button" className="itn__ghostbtn" onClick={() => save(removeDay(state, i))}>Remove day</button>
              </div>
            ))}
          </div>
        </div>
        <div className="itn2__panel">
          <h3 className="itn__subtitle">Transfers &amp; Charter</h3>
          <div id="itn-transfers-list">
            {(state.transfers || []).map((t, i) => <p key={'t' + i}>{t.route} · {fmtDay(t.date)}</p>)}
            {(state.charters || []).map((c, i) => <p key={'c' + i}>Charter · {fmtDay(c.date)}</p>)}
          </div>
        </div>
      </div>

      <AddItemPicker
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
