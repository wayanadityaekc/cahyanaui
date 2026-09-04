'use client';

import { useEffect, useMemo, useState } from 'react';
import { useItinerary } from '@/state/ItineraryProvider';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useAccount } from '@/state/AccountProvider';
import { useReferral } from '@/state/ReferralProvider';
import { useBooking } from '@/state/BookingProvider';
import useQuote from '@/hooks/useQuote';
import useMoney from '@/hooks/useMoney';
import ReviewModal from '@/components/reviews/ReviewModal';
import AddItemPicker from './AddItemPicker';
import DatePopup from '@/components/booking/DatePopup';
import { cascadeFrom } from '@/lib/cart';
import { readLocal } from '@/lib/storage';
import { KEY, API_BASE } from '@/lib/constants';
import { imageForProgram } from '@/lib/programImages';

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
        className="mtc-item__icon mtc-item__icon--photo"
        style={{ backgroundImage: `url(/assets/images/${img})` }}
        aria-hidden="true"
      />
    );
  }
  let glyph;
  if (row.kind === 'transfer') {
    glyph = (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
        <circle cx="7.5" cy="15.5" r="1" />
        <circle cx="16.5" cy="15.5" r="1" />
      </svg>
    );
  } else if (row.kind === 'charter') {
    glyph = (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  } else {
    glyph = (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }
  return <span className="mtc-item__icon" aria-hidden="true">{glyph}</span>;
}

export default function MyTripsCart() {
  const { state, save, hydrated } = useItinerary();
  const { displayGuests, currency, stay } = useTripPrefs();
  const { account } = useAccount();
  const { referral } = useReferral();
  const { openBooking } = useBooking();

  const [trips, setTrips] = useState(null);
  const [review, setReview] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editDate, setEditDate] = useState(null);
  const [tab, setTab] = useState('custom');
  const [openRef, setOpenRef] = useState(null);

  const rows = useMemo(() => {
    const days = (state.days || []).filter((d) => d.items && d.items.length);
    const out = [];
    days.forEach((d, i) => {
      (d.items || []).forEach((name, k) => {
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
    (state.transfers || []).forEach((t) => out.push({
      kind: 'transfer', type: 'transfer', service: t.route, date: t.date || '',
      guests: parseInt(t.guests, 10) || displayGuests, return: !!t.return,
    }));
    (state.charters || []).forEach((c) => out.push({
      kind: 'charter', type: 'charter', service: 'Charter', date: c.date || '',
      guests: parseInt(c.guests, 10) || displayGuests, area: c.area || 'Ubud',
      duration: c.dur || c.duration, extra: c.extra || 0,
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

  useEffect(() => {
    const token = readLocal(KEY.token, '');
    if (!token) return;
    let cancelled = false;
    fetch(`${API_BASE}/bookings/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled && d && Array.isArray(d.upcoming)) setTrips(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [account]);

  if (!hydrated) return <div data-mytrips-cart />;

  const undated = rows.some((r) => !r.date);
  const totalText = priced ? format(priced.total.display) : '-';

  const remove = (row, idx) => {
    const next = JSON.parse(JSON.stringify(state));
    if (row.kind === 'transfer') next.transfers.splice(idx, 1);
    else if (row.kind === 'charter') next.charters.splice(idx, 1);
    else {
      const d = next.days[row.day_no - 1];
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
      <div className="mtc-book" key={t.ref}>
        <div className="mtc-item mtc-item--booked">
          {img ? (
            <span
              className="mtc-item__icon mtc-item__icon--photo"
              style={{ backgroundImage: 'url(/assets/images/' + img + ')' }}
              aria-hidden="true"
            />
          ) : (
            <ItemIcon row={{ kind: 'tour' }} />
          )}
          <div className="mtc-item__body">
            <p className="mtc-item__title">{t.name}</p>
            <p className="mtc-item__desc">{status} · {t.guests || '-'} guests</p>
            <p className="mtc-item__date">
              {fmtRange(t.start_date, t.end_date)}{t.ref ? ' · ' + t.ref : ''}
            </p>
          </div>
          <span className="mtc-item__price">
            <span className="price-cur">{bookedMoney(t.price_usd, t.price_idr)}</span>
          </span>
        </div>

        {items.length > 0 && (
          <div className="mtc-det">
            <button
              type="button"
              className="mtc-det__toggle"
              aria-expanded={open ? 'true' : 'false'}
              onClick={() => setOpenRef(open ? null : t.ref)}
            >
              {open
                ? 'Hide details'
                : 'View details (' + items.length + (items.length > 1 ? ' items)' : ' item)')}
              <svg className="mtc-det__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {open && (
              <ul className="mtc-det__list">
                {items.map((l, i) => (
                  <li className="mtc-det__line" key={i}>
                    <span className="mtc-det__name">
                      {l.day_no ? 'Day ' + l.day_no + ' · ' : ''}{l.service}
                      <span className="mtc-det__meta">
                        {fmtDay(l.date)}
                        {l.guests ? ' · ' + l.guests + ' pax' : ''}
                        {l.pickup_time ? ' · ' + l.pickup_time : ''}
                      </span>
                    </span>
                    <span className="mtc-det__amt">{bookedMoney(l.price_usd, l.price_idr)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {isPast && t.review_items && t.review_items.length > 0 && (
          <div className="mtc-review">
            <button
              type="button"
              className="modal__btn mtc-review__btn"
              onClick={() => setReview({ ref: t.ref, name: (account && account.name) || '', items: t.review_items })}
            >
              Leave a Review
            </button>
          </div>
        )}
      </div>
    );
  };

  const bookingPanel = (isPast) => {
    if (!readLocal(KEY.token, '')) {
      return (
        <div className="mtc-empty">
          <p className="mtc-empty__lead">Sign in to see your trips.</p>
          <p className="mtc-empty__sub">
            Open the account menu and sign in with your email - your booked and past trips show up here.
          </p>
        </div>
      );
    }
    if (!trips) {
      return (
        <div className="mtc-empty">
          <p className="mtc-empty__sub">Loading your trips…</p>
        </div>
      );
    }
    const arr = (isPast ? trips.history : trips.upcoming) || [];
    if (!arr.length) {
      return (
        <div className="mtc-empty">
          <p className="mtc-empty__lead">{isPast ? 'No past trips yet.' : 'No booked trips yet.'}</p>
          <p className="mtc-empty__sub">
            {isPast
              ? 'Trips you have already taken will appear here.'
              : 'Once you make a payment, your booked trip shows up here.'}
          </p>
        </div>
      );
    }
    return <div className="mtc-list">{arr.map((t) => bookingCard(t, isPast))}</div>;
  };

  const TABS = [
    { id: 'custom', label: 'My Trip' },
    { id: 'booked', label: 'Booked Trip' },
    { id: 'past', label: 'Past Trip' },
  ];

  return (
    <div data-mytrips-cart>
      <div className="mtc-tabs" role="tablist">
        {TABS.map((tb) => (
          <button
            type="button"
            key={tb.id}
            className={'mtc-tab' + (tab === tb.id ? ' is-on' : '')}
            role="tab"
            aria-selected={tab === tb.id ? 'true' : 'false'}
            onClick={() => setTab(tb.id)}
          >
            {tb.label}
          </button>
        ))}
      </div>
      {tab === 'custom' && (rows.length === 0 ? (
        <div className="mtc-empty">
          <p className="mtc-empty__lead">Your trip is empty.</p>
          <p className="mtc-empty__sub">Add a tour, transfer, or experience to get started.</p>
          <button type="button" className="btn-pill" onClick={() => setAdding(true)}>+ Add a program</button>
        </div>
      ) : (
        <>
          <div className="mtc-list">
            {rows.map((r, i) => {
              const line = priced && priced.lines[i];
              return (
                <div className="mtc-item" key={i}>
                  <ItemIcon row={r} />
                  <div className="mtc-item__body">
                    <p className="mtc-item__title">{r.service}</p>
                    <p className="mtc-item__desc">
                      {r.day_no ? `Day ${r.day_no} · ` : ''}
                      <button
                        type="button"
                        className="mtc-item__datebtn"
                        onClick={() => setEditDate({ row: r, index: i })}
                      >
                        {fmtDay(r.date)}
                      </button>
                      {r.mode === 'exclusive' ? ' · Exclusive' : ''}
                      {r.return ? ' · return' : ''}
                    </p>
                  </div>
                  <span className="mtc-item__price">
                    <span className="price-cur">
                      {line ? format(line.display) : '-'}
                    </span>
                  </span>
                  <button type="button" className="mtc-item__del" aria-label={`Remove ${r.service}`} onClick={() => remove(r, i)}>&times;</button>
                </div>
              );
            })}
          </div>

          <div className="mtc-total">
            <span className="mtc-total__label">Total</span>
            <span className="mtc-total__val"><span className="price-cur">{totalText}</span></span>
          </div>

          <button type="button" className="btn-pill" onClick={() => setAdding(true)}>+ Add another program</button>

          {undated && (
            <p className="mtc-note mtc-note--warn">Every item needs a date before you can pay. Tap a date to set it.</p>
          )}

          <p className="mtc-note mtc-policy">
            By clicking <strong>Make Payment</strong>, you agree to our{' '}
            <a href="/terms-conditions.html">Terms</a> and <a href="/cancellation-policy.html">Cancellation Policy</a>.
          </p>
          <button type="button" className="modal__btn mtc-pay" disabled={undated} onClick={checkout}>Make Payment</button>
          <p className="mtc-note">
            You&apos;ll add your name &amp; contact details at payment - that also creates your account so you can log in later with the same email.
          </p>
        </>
      ))}

      {tab === 'booked' && <div className="mtc-panel">{bookingPanel(false)}</div>}
      {tab === 'past' && <div className="mtc-panel">{bookingPanel(true)}</div>}

      <ReviewModal open={!!review} prefill={review} onClose={() => setReview(null)} />

      <AddItemPicker
        open={adding}
        onClose={() => setAdding(false)}
        onPick={(name) =>
          save({ ...state, days: [...(state.days || []), { items: [name], itemModes: ['standard'], date: '', guests: '' }] })
        }
      />

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
