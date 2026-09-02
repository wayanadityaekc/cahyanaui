'use client';

import { useEffect, useMemo, useState } from 'react';
import { useItinerary } from '@/state/ItineraryProvider';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useAccount } from '@/state/AccountProvider';
import { useReferral } from '@/state/ReferralProvider';
import { useBooking } from '@/state/BookingProvider';
import { quote } from '@/lib/api';
import { readLocal } from '@/lib/storage';
import { KEY, API_BASE } from '@/lib/constants';

function fmtDay(ds) {
  if (!ds) return 'date TBD';
  const [y, m, d] = ds.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function MyTripsCart() {
  const { state, save, hydrated } = useItinerary();
  const { displayGuests, currency, stay } = useTripPrefs();
  const { account } = useAccount();
  const { referral } = useReferral();
  const { openBooking } = useBooking();

  const [priced, setPriced] = useState(null);
  const [trips, setTrips] = useState(null);

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

  useEffect(() => {
    if (!hydrated || !rows.length) { setPriced(null); return; }
    let cancelled = false;
    quote({ lines: rows, currency, stay, referral: (referral && referral.code) || '' })
      .then((d) => { if (!cancelled && d && d.lines) setPriced(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [rows, currency, stay, referral, hydrated]);

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
  const symbol = (priced && priced.symbol) || '$';
  const totalText = priced ? symbol + priced.total.display.toLocaleString(currency === 'IDR' ? 'id-ID' : 'en-US') : '-';

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

  return (
    <div data-mytrips-cart>
      {rows.length === 0 ? (
        <div className="mtc-empty">
          <p className="mtc-empty__lead">Your trip is empty.</p>
          <p className="mtc-empty__sub">Add a tour, transfer, or experience to get started.</p>
        </div>
      ) : (
        <>
          <div className="mtc-list">
            {rows.map((r, i) => {
              const line = priced && priced.lines[i];
              return (
                <div className="mtc-item" key={i}>
                  <div className="mtc-item__body">
                    <p className="mtc-item__title">{r.service}</p>
                    <p className="mtc-item__desc">
                      {r.day_no ? `Day ${r.day_no} · ` : ''}{fmtDay(r.date)}
                      {r.mode === 'exclusive' ? ' · Exclusive' : ''}
                      {r.return ? ' · return' : ''}
                    </p>
                  </div>
                  <span className="mtc-item__price">
                    <span className="price-cur">
                      {line ? symbol + line.display.toLocaleString(currency === 'IDR' ? 'id-ID' : 'en-US') : '-'}
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

          <p className="mtc-note mtc-policy">
            By clicking <strong>Make Payment</strong>, you agree to our{' '}
            <a href="/terms-conditions.html">Terms</a> and <a href="/cancellation-policy.html">Cancellation Policy</a>.
          </p>
          <button type="button" className="modal__btn mtc-pay" disabled={undated} onClick={checkout}>Make Payment</button>
          <p className="mtc-note">
            You&apos;ll add your name &amp; contact details at payment - that also creates your account so you can log in later with the same email.
          </p>
        </>
      )}

      {trips && (trips.upcoming.length > 0 || trips.history.length > 0) && (
        <div className="mtc-panel">
          <h2 className="section__title">Your bookings</h2>
          {[...trips.upcoming, ...trips.history].map((t) => (
            <div className="mtc-item mtc-item--booked" key={t.ref}>
              <div className="mtc-item__body">
                <p className="mtc-item__title">{t.name}</p>
                <p className="mtc-item__desc">{t.ref} · {t.start_date || 'date TBD'} · {t.upcoming ? 'Upcoming' : 'Past'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
