'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useBooking } from '@/state/BookingProvider';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useReferral } from '@/state/ReferralProvider';
import { useAccount } from '@/state/AccountProvider';
import { usePricing } from '@/state/PricingProvider';
import { quote, submitInquiry } from '@/lib/api';
import { bookingSchema } from '@/lib/schemas';
import { validateWith } from '@/lib/validate';
import { readLocal, writeLocal } from '@/lib/storage';
import { KEY, WHATSAPP_NUMBER } from '@/lib/constants';
import PayChips from './PayChips';
import Select from '@/components/ui/Select';
import DateTimeField from '@/components/ui/DateTimeField';
import { timeOptions, AIRPORT_ROUTE } from '@/content/shared/timeSlots';
import { withSymbol } from '@/components/Price';
import { SHELL, BOX, CLOSE, LOGO, TITLE, GROUP, LABEL, INPUT, BTN, BTN_WA, STACK, FIELD_ERR, SUCCESS_ICON, SUCCESS_TEXT } from '@/components/ui/modalClasses';
import PaymentStep from './PaymentStep';
import { readPayFlag, PAY_DEFAULT } from '@/lib/payFlag';
import { baseTotal, PAY_COPY } from '@/lib/payment';
import PayPalCheckout from './PayPalCheckout';
import ModalPresence from '@/components/ui/ModalPresence';
import useBodyLock from '@/components/ui/useBodyLock';

const EMPTY = { name: '', phone: '', email: '', pickup: '', dropoff: '', referral: '', time: '', flightNumber: '', flightDatetime: '' };

export default function BookConfirmModal() {
  const { ctx, closeBooking } = useBooking();
  const { currency, stay, displayGuests } = useTripPrefs();
  const { referral, apply } = useReferral();
  const { setAccount } = useAccount();
  const pricing = usePricing();

  const [f, setF] = useState(EMPTY);
  const [priced, setPriced] = useState(null);
  const [refMsg, setRefMsg] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!ctx) {
      setF(EMPTY);
      setPriced(null);
      setDone(false);
      setErrors({});
      setError('');
      setRefMsg(null);
      return;
    }
    setF((v) => ({ ...v, referral: (referral && referral.code) || '' }));
    let cancelled = false;
    quote({ lines: ctx.lines, currency, stay, referral: (referral && referral.code) || '' })
      .then((d) => !cancelled && d && d.lines && setPriced(d))
      .catch(() => {});
    return () => { cancelled = true; };
  }, [ctx, currency, stay, referral]);

  // Checkpoint 1: the guest's payment choice is held here so the step can be
  // driven and screenshotted. Nothing acts on it yet.
  const [payOption, setPayOption] = useState('deposit');
  // Set once the booking is saved as pending; switches the modal to the payment
  // step. The booking exists from this point whether or not payment succeeds.
  const [bookingRef, setBookingRef] = useState('');
  const [paid, setPaid] = useState(false);
  // Is this visitor being offered online payment at all? Off for everyone until
  // the chain is proven live - see lib/payFlag.js. Read in an effect, never in
  // initial state: this is a static export and the first paint has to match the
  // pre-rendered HTML.
  const [payOn, setPayOn] = useState(PAY_DEFAULT);
  useEffect(() => { setPayOn(readPayFlag()); }, []);
  const lastCtx = useRef(null);
  useBodyLock(!!ctx);

  // While closing, ctx is already null but the card is still on screen for the
  // length of its exit animation, so the markup reads from the last ctx we saw.
  // Everything that ACTS - validate, submit, the WhatsApp text - still reads the
  // live ctx, unchanged.
  if (ctx) lastCtx.current = ctx;
  const view = ctx || lastCtx.current;
  if (!mounted || !view) return null;

  const set = (k) => (e) => {
    const { value } = e.target;
    setF((v) => ({ ...v, [k]: value }));
    setErrors((v) => (v[k] ? { ...v, [k]: undefined } : v));
  };
  // Custom controls (Select / DateTimeField) hand back a value, not an event.
  const setValue = (k) => (value) => {
    setF((v) => ({ ...v, [k]: value }));
    setErrors((v) => (v[k] ? { ...v, [k]: undefined } : v));
  };

  // Pickup-time field (Sep 2026, #TIME-1): only shown when the booking is a
  // single line - a multi-day itinerary/cart checkout has one time PER DAY, which
  // needs its own row-level editor in MyTripsCart/ItineraryBuilder (not built yet,
  // flagged separately - out of scope here so this popup doesn't show one time
  // field that would only apply to one of several lines).
  const catalog = pricing && pricing.catalog;
  const singleLine = view.lines && view.lines.length === 1 ? view.lines[0] : null;
  const catalogItem = catalog && singleLine ? catalog.items.find((i) => i.name === singleLine.service) : null;
  // category drives which times are restrictable. `line.type` alone isn't reliable -
  // BookSidebar hardcodes `type:'tour'` for every detail-page item (tour/experience/
  // performance alike), so the REAL category comes from the pricing catalog lookup.
  const category = catalogItem ? catalogItem.category : singleLine ? singleLine.type : null;
  const isAirportRoute = !!singleLine && singleLine.service === AIRPORT_ROUTE;
  const hasFlightAlready = !!(singleLine && singleLine.flight_number); // pre-filled via AirportTransferForm
  const needsFlight = isAirportRoute && !hasFlightAlready;
  const needsTime = !!singleLine && !isAirportRoute; // airport's flight date&time already IS the pickup time
  const timeOpts = needsTime ? timeOptions(category, singleLine && singleLine.service) : [];
  // Flight number shown in the summary whenever there IS one to show - collected
  // in this popup (needsFlight) OR already pre-filled upstream by AirportTransferForm
  // (hasFlightAlready). Without the `hasFlightAlready` branch the guest had no way
  // to see their flight number was actually carried into this booking (found via
  // headless verification, not guessed).
  const flightNumberDisplay = needsFlight ? f.flightNumber : hasFlightAlready ? singleLine.flight_number : '';

  // Which fields are required depends on the booking being confirmed, so the schema
  // is built per render from the same flags the fields themselves are shown by.
  // Both the Book Now button and the WhatsApp button run this - they must agree.
  const validate = () => {
    const { ok, errors: fieldErrors } = validateWith(
      bookingSchema({
        pickupOptional: !!ctx.pickupOptional,
        dropoffRequired: !!ctx.dropoffRequired,
        needsTime,
        needsFlight,
      }),
      f,
    );
    setErrors(fieldErrors);
    return ok;
  };

  // The quote already fetched above is what the guest sees, so send it with the
  // booking. Without it the server stores nothing and the confirmation email
  // reads "$0 / Rp0" - which is what happened to CUE-007.
  const payload = () => ({
    type: ctx.type,
    service: ctx.service,
    name: f.name,
    phone: f.phone,
    email: f.email,
    referral: (referral && referral.code) || '',
    // Which of the two options the guest picked. The server does NOT trust an
    // amount from here - it recomputes what is owed from its own prices. This is
    // the choice only, so the invoice matches the row the guest actually tapped.
    pay_option: payOn ? payOption : '',
    // The currency the guest was quoted in. Without it the server can only
    // record USD/IDR, and an invoice sent in the wrong currency is a different
    // number from the one they agreed to.
    currency: currency || 'USD',
    stay: stay || '',
    lines: ctx.lines.map((l, i) => {
      const p = priced && priced.lines && priced.lines[i] && priced.lines[i].ok ? priced.lines[i] : null;
      // Time/flight fields collected in this popup only apply to the single
      // line they were shown for (see needsTime/needsFlight above) - other
      // lines fall back to whatever they already carried (e.g. from a caller
      // that pre-filled it, like AirportTransferForm).
      const isTarget = !!singleLine && i === 0;
      return {
        type: l.type,
        service: l.service,
        date: l.date || '',
        time: (isTarget && needsTime ? f.time : l.time) || '',
        guests: String(l.guests || displayGuests),
        pickup: l.pickup || f.pickup,
        dropoff: l.dropoff || f.dropoff,
        day_no: l.day_no != null ? l.day_no : null,
        flight_number: (isTarget && needsFlight ? f.flightNumber : l.flight_number) || '',
        flight_datetime: (isTarget && needsFlight ? f.flightDatetime : l.flight_datetime) || '',
        mode: l.mode || 'standard',
        area: l.area || '',
        duration: l.duration || '',
        extra: l.extra != null ? l.extra : 0,
        return: !!l.return,
        price_usd: p ? p.price_usd : null,
        price_idr: p ? p.price_idr : null,
      };
    }),
  });

  const submit = async () => {
    if (!validate()) { setError(''); return; }
    setError('');
    setBusy(true);
    try {
      const d = await submitInquiry(payload());
      if (!d || d.status !== 'saved') throw new Error((d && d.detail) || '');
      if (d.token && !readLocal(KEY.token, '')) {
        writeLocal(KEY.token, d.token);
        if (d.account) setAccount(d.account);
      }
      if (typeof ctx.onSuccess === 'function') ctx.onSuccess();
      // The booking is saved as 'pending'. It is NOT confirmed yet - that only
      // happens when PayPal's webhook says the money cleared - so the modal moves
      // to the payment step rather than showing a success screen.
      setBookingRef(d.ref || '');
      setDone(true);
    } catch (e) {
      setError(e.message || 'Sorry, we could not send your booking. Please try again, or reach us on WhatsApp.');
    } finally {
      setBusy(false);
    }
  };

  const waText = () => {
    const lines = ctx.lines
      .map((l) => `- ${l.day_no ? 'Day ' + l.day_no + ' · ' : ''}${l.date || 'TBD'} · ${l.service} · ${l.guests || displayGuests} pax`)
      .join('\n');
    const timeLine = needsTime && f.time ? `\nPickup time: ${timeLabel(f.time)}` : '';
    const flightLine = flightNumberDisplay ? `\nFlight: ${flightNumberDisplay} (${(needsFlight ? f.flightDatetime : singleLine.flight_datetime) || 'TBD'})` : '';
    return `Hello, I'd like to book:\nService: ${ctx.service}\nName: ${f.name}\nPhone: ${f.phone}\nEmail: ${f.email}\n${lines}\nPick-up: ${f.pickup || '-'}\nDrop-off: ${f.dropoff || '-'}${timeLine}${flightLine}\nPrice: ${priceText()}`;
  };

  const timeLabel = (t) => {
    const opt = timeOpts.find((o) => o.value === t);
    return opt ? opt.label : t;
  };

  const priceText = () => {
    if (!priced) return '-';
    const s = priced.symbol || '$';
    return s + priced.total.display.toLocaleString(s === 'Rp' ? 'id-ID' : 'en-US');
  };

  const applyRef = async () => {
    const pct = await apply(f.referral);
    setRefMsg(pct ? { ok: true, text: PAY_COPY.referralOk } : { ok: false, text: PAY_COPY.referralBad });
  };

  // Tailwind-native (migrasi Fase 2, opsi B): shell/box/close/logo/title/group/input/
  // btn(+wa)/success pakai konstanta shared (modalClasses.js). Yang ISOLATED ke modal
  // ini (summary/row, details accordion) di-inline utility + CSS-nya DIHAPUS. Referral
  // input-group + msg pindah ke modalClasses juga, karena PaymentStep ikut pakai.
  const ROW = 'flex justify-between gap-4 py-[0.65rem] [border-bottom:1px_solid_#eee] text-body [&>span:first-child]:font-semibold [&>span:last-child]:text-right [&>span:last-child]:text-gold [&>span:last-child]:font-semibold last:[border-bottom:none]';
  const DETAILS_TOGGLE = 'flex items-center justify-between w-full py-[0.85rem] px-0 font-body text-[1rem] font-semibold text-green bg-transparent border-none cursor-pointer';
  const DETAILS_LI = "relative pt-[0.4rem] pr-0 pb-[0.4rem] pl-5 text-body leading-[var(--lh-body)] text-muted [&::before]:content-['•'] [&::before]:absolute [&::before]:left-[0.25rem] [&::before]:text-gold";
  return createPortal(
    <ModalPresence open={!!ctx} onClose={closeBooking} box={BOX}>
        <button className={CLOSE} aria-label="Close" onClick={closeBooking}>&times;</button>
        <img className={LOGO} src="/assets/images/logo.webp" alt="The Cahyana Logo" width="1005" height="324" />

        {!done ? (
          <div id="modal-form">
            <h3 className={TITLE}>Confirm Your Booking</h3>

            <div className={GROUP}>
              <label className={LABEL} htmlFor="booker-name">Your Name</label>
              <input className={INPUT} type="text" id="booker-name" placeholder="Enter your name" value={f.name} onChange={set('name')} aria-invalid={!!errors.name} />
              {errors.name && <small className={FIELD_ERR}>{errors.name}</small>}
            </div>
            <div className={GROUP}>
              <label className={LABEL} htmlFor="booker-phone">Phone Number</label>
              <input className={INPUT} type="tel" id="booker-phone" placeholder="e.g. +61 412 345 678" value={f.phone} onChange={set('phone')} aria-invalid={!!errors.phone} />
              {errors.phone && <small className={FIELD_ERR}>{errors.phone}</small>}
            </div>
            <div className={GROUP}>
              <label className={LABEL} htmlFor="booker-email">Email</label>
              <input className={INPUT} type="email" id="booker-email" placeholder="you@email.com" value={f.email} onChange={set('email')} aria-invalid={!!errors.email} />
              {errors.email && <small className={FIELD_ERR}>{errors.email}</small>}
            </div>
            <div className={GROUP}>
              <label className={LABEL} htmlFor="pickup">Pick-up Location</label>
              <input className={INPUT} type="text" id="pickup" placeholder="Hotel / villa name or area" value={f.pickup} onChange={set('pickup')} aria-invalid={!!errors.pickup} />
              {errors.pickup && <small className={FIELD_ERR}>{errors.pickup}</small>}
            </div>
            {view.dropoffRequired !== false && (
              <div className={GROUP}>
                <label className={LABEL} htmlFor="dropoff">Drop-off Location</label>
                <input className={INPUT} type="text" id="dropoff" placeholder="Where should we drop you off?" value={f.dropoff} onChange={set('dropoff')} aria-invalid={!!errors.dropoff} />
                {errors.dropoff && <small className={FIELD_ERR}>{errors.dropoff}</small>}
              </div>
            )}
            {needsTime && (
              <div className={GROUP}>
                <label className={LABEL} htmlFor="pickup-time">Pickup Time</label>
                <Select
                  id="pickup-time"
                  label="Pickup Time"
                  value={f.time}
                  onChange={setValue('time')}
                  options={timeOpts}
                  placeholder="Select a time"
                />
                {errors.time && <small className={FIELD_ERR}>{errors.time}</small>}
              </div>
            )}
            {needsFlight && (
              <>
                <div className={GROUP}>
                  <label className={LABEL} htmlFor="flight-number">Flight Number</label>
                  <input className={INPUT} type="text" id="flight-number" placeholder="e.g. QZ7501" value={f.flightNumber} onChange={set('flightNumber')} aria-invalid={!!errors.flightNumber} />
                  {errors.flightNumber && <small className={FIELD_ERR}>{errors.flightNumber}</small>}
                </div>
                <div className={GROUP}>
                  <label className={LABEL} htmlFor="flight-datetime">Flight Date &amp; Time</label>
                  <DateTimeField id="flight-datetime" label="Flight date & time" value={f.flightDatetime} onChange={setValue('flightDatetime')} />
                  {errors.flightDatetime && <small className={FIELD_ERR}>{errors.flightDatetime}</small>}
                </div>
              </>
            )}

            <div className="my-5 [border-top:1px_solid_#eee]">
              <div className={ROW}><span>Guests</span><span>{view.guests || displayGuests}</span></div>
              <div className={ROW}><span>Service</span><span>{view.service}</span></div>
              <div className={ROW}><span>Date</span><span>{view.date || '-'}</span></div>
              {needsTime && (
                <div className={ROW}><span>Time</span><span>{f.time ? timeLabel(f.time) : '-'}</span></div>
              )}
              {isAirportRoute && (
                <div className={ROW}><span>Flight</span><span>{flightNumberDisplay || '-'}</span></div>
              )}
              {priced && priced.referral && (
                <div className={ROW}><span>Referral</span><span>{priced.referral.code} ({priced.referral.pct}%)</span></div>
              )}
              <div className={ROW}><span>Price</span><span id="sum-price">{withSymbol(priceText())}</span></div>
            </div>

            {payOn && <PaymentStep
              option={payOption}
              onOption={setPayOption}
              /* baseTotal, not priced.total: the quote already subtracts the
                 code's own percentage, and here the code is its own option -
                 counting it in both places would discount twice. */
              total={baseTotal(priced)}
              symbol={(priced && priced.symbol) || '$'}
              currency={currency || 'USD'}
              stay={stay || ''}
              hasReferral={!!(priced && priced.referral)}
              referral={f.referral}
              onReferral={(v) => setF((x) => ({ ...x, referral: v }))}
              onApplyReferral={applyRef}
              refMsg={refMsg}
            />}

            {view.detailLines && view.detailLines.length > 0 && (
              <div className="mb-5 [border-top:1px_solid_#eee]">
                <button type="button" className={DETAILS_TOGGLE} onClick={() => setDetailsOpen((v) => !v)}>
                  <span>{view.detailsTitle || "What's included"}</span>
                  <span className={`text-[1.4rem] text-gold transition-transform duration-[var(--dur-slow)] ease-[ease] ${detailsOpen ? '[transform:rotate(90deg)]' : ''}`}>&rsaquo;</span>
                </button>
                <ul className={`list-none overflow-hidden transition-[max-height] duration-[var(--dur-slow)] ease-[ease] ${detailsOpen ? 'max-h-[320px]' : 'max-h-0'}`}>
                  {view.detailLines.map((d, i) => <li className={DETAILS_LI} key={i}>{d}</li>)}
                </ul>
              </div>
            )}

            <PayChips
              className="mt-[1.1rem] mb-[1.35rem] text-center"
              logosClass="flex flex-wrap items-center justify-center gap-2"
              chipClass="inline-flex items-center justify-center h-[30px] min-w-[46px] px-[0.55rem] bg-white [border:1px_solid_#e2ddd0] rounded-sm transition-transform duration-[var(--dur)] ease-[var(--ease-out)] hover:[transform:translateY(-2px)]"
              svgClass="block h-[var(--icon-sm)] w-auto"
            />

            {error && <small className="block mt-[0.4rem] text-small text-err">{error}</small>}

            <button className={BTN} onClick={submit} disabled={busy}>{busy ? 'Sending...' : 'Book Now'}</button>
            <button
              className={`${BTN_WA} ${STACK}`}
              onClick={() => {
                if (!validate()) { setError(''); return; }
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText())}`, '_blank');
              }}
            >
              Discuss via WhatsApp
            </button>
          </div>
        ) : !payOn ? (
          <div className="text-center">
            <div className={SUCCESS_ICON}>&#10003;</div>
            <h3 className={TITLE}>Booking Received!</h3>
            <p className={SUCCESS_TEXT}>Thank you. We will email you shortly to confirm your booking.</p>
            <button className={BTN} onClick={closeBooking}>Done</button>
          </div>
        ) : (
          <div className={paid ? 'text-center' : ''}>
            {paid ? (
              <>
                <div className={SUCCESS_ICON}>&#10003;</div>
                <h3 className={TITLE}>Payment received</h3>
                <p className={SUCCESS_TEXT}>
                  Thank you. Your confirmation email is on its way - it is sent once the payment clears.
                </p>
                <button className={BTN} onClick={closeBooking}>Done</button>
              </>
            ) : (
              <>
                <h3 className={TITLE}>Almost there - just the payment</h3>
                <p className={SUCCESS_TEXT}>
                  Your booking is saved{bookingRef ? ` (${bookingRef})` : ''}. It is confirmed once this payment
                  goes through. Nothing is lost if you close this - you can pay later.
                </p>
                {bookingRef ? (
                  <PayPalCheckout
                    bookingRef={bookingRef}
                    option={payOption}
                    copy={PAY_COPY}
                    currency={currency}
                    onPaid={() => setPaid(true)}
                  />
                ) : (
                  <p className="text-small text-err">We could not read your booking reference. Please contact us.</p>
                )}
              </>
            )}
          </div>
        )}
    </ModalPresence>,
    document.body,
  );
}
