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
import DateTimeField from '@/components/ui/DateTimeField';
import DateField from '@/components/ui/DateField';
import { AIRPORT_ROUTE, fmtTime } from '@/content/shared/timeSlots';
import { withSymbol } from '@/components/Price';
import { SHELL_WIDE, BOX_WIDE, CLOSE, LOGO, TITLE, GROUP, LABEL, INPUT, BTN, BTN_WA, STACK, FIELD_ERR, SUCCESS_ICON, SUCCESS_TEXT } from '@/components/ui/modalClasses';
import PaymentStep from './PaymentStep';
import { readPayFlag, PAY_DEFAULT } from '@/lib/payFlag';
import { baseTotal, PAY_COPY } from '@/lib/payment';
import PayPalCheckout from './PayPalCheckout';
import PayWaiting from './PayWaiting';
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
  // Two screens, not one (Sep 2026, Wayan: "kalo misalnya ada input dan summary
  // mending bikin 2 step"). Step 1 asks, step 2 reads it back for checking - the
  // same values on one screen read as printed twice.
  const [step, setStep] = useState(1);
  // Date AND time for every line, seeded from what the guest already picked and
  // editable here (Wayan: "date dan time harus ada di semua popup ... kalo user
  // udah pilih berarti auto fill dan bisa di set ulang"). Held PER LINE because a
  // start time is per item: one control could only ever be right for the first
  // row of a cart. This also retires the standalone "Pickup Time" select, which
  // only existed to patch the one case that arrived without a time.
  const [lineDT, setLineDT] = useState([]);
  const [dtErr, setDtErr] = useState({});
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
      setStep(1);
      setLineDT([]);
      setDtErr({});
      setErrors({});
      setError('');
      setRefMsg(null);
      return;
    }
    const only = ctx.lines && ctx.lines.length === 1 ? ctx.lines[0] : null;
    setF((v) => ({
      ...v,
      referral: (referral && referral.code) || '',
      // Autofill, both of them: the airport form already asked for these.
      flightNumber: (only && only.flight_number) || '',
      flightDatetime: (only && only.flight_datetime) || '',
    }));
    setLineDT((ctx.lines || []).map((l) => ({ date: l.date || '', time: l.time || '' })));
    setStep(1);
    setDtErr({});
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

  // Pickup time is now chosen AT THE DATE (Sep 2026, Wayan: "kalo user milih date di
  // booking form udah langsung milih jam"), so every line arrives carrying its own
  // `time` and this popup asks for nothing. The field below is the fallback for the
  // one case that still has no time: a single line whose category is free all day
  // (transfer / charter), where TimeChoice deliberately starts empty rather than
  // inventing a pick-up hour. A multi-line checkout is never asked - one field here
  // could only ever be right for one of its rows; each row has its own editor in
  // My Trips.
  const catalog = pricing && pricing.catalog;
  const lines = view.lines || [];
  const singleLine = lines.length === 1 ? lines[0] : null;
  // The category drives which start times an item may use. `line.type` alone is
  // not reliable - BookSidebar hardcodes `type:'tour'` for every detail-page item
  // (tour / experience / performance alike), so the REAL category comes from the
  // pricing catalog.
  const categoryOfLine = (l) => {
    const c = catalog && catalog.items.find((i) => i.name === l.service);
    return c ? c.category : l.type || null;
  };
  const isAirportLine = (l) => l.service === AIRPORT_ROUTE;
  const isAirportRoute = !!singleLine && isAirportLine(singleLine);
  // The airport leg is the one case that does NOT get a second date control: its
  // flight date & time IS the pick-up date and time (same rule as the airport
  // page, where asking twice was the bug Wayan had fixed). It also keeps real
  // minutes - a plane lands at 2:35 PM, not on a half-hour grid.
  const needsFlight = isAirportRoute;
  const dt = (i) => lineDT[i] || { date: '', time: '' };
  const setDT = (i, k, v) => {
    setLineDT((prev) => {
      const next = prev.length ? [...prev] : lines.map((l) => ({ date: l.date || '', time: l.time || '' }));
      next[i] = { ...next[i], [k]: v };
      return next;
    });
    setDtErr((prev) => (prev[i] ? { ...prev, [i]: undefined } : prev));
  };
  // What each line ends up carrying: the airport leg reads its date and time off
  // the flight field, everything else off its own date control.
  const dateOf = (l, i) => (isAirportLine(l) && i === 0 && needsFlight ? (f.flightDatetime || '').slice(0, 10) : dt(i).date);
  const timeOf = (l, i) => (isAirportLine(l) && i === 0 && needsFlight ? (f.flightDatetime || '').slice(11, 16) : dt(i).time);
  const flightNumberDisplay = needsFlight ? f.flightNumber || singleLine.flight_number || '' : '';

  // Which fields are required depends on the booking being confirmed, so the schema
  // is built per render from the same flags the fields themselves are shown by.
  // Both the Book Now button and the WhatsApp button run this - they must agree.
  const validate = () => {
    const { ok, errors: fieldErrors } = validateWith(
      bookingSchema({
        pickupOptional: !!ctx.pickupOptional,
        dropoffRequired: !!ctx.dropoffRequired,
        // The time is no longer a field of its own, so the schema never asks for
        // one - it is validated per line below, where it actually lives.
        needsTime: false,
        needsFlight,
      }),
      f,
    );
    setErrors(fieldErrors);
    // Per-line date & time. The old schema could only check ONE time field, which
    // is why a cart never used to be asked at all; each row is checked here.
    const de = {};
    (ctx.lines || []).forEach((l, i) => {
      if (isAirportLine(l) && i === 0 && needsFlight) return; // covered by the flight field
      if (!dateOf(l, i)) de[i] = 'Please pick a date.';
      else if (!timeOf(l, i)) de[i] = 'Please pick a start time.';
    });
    setDtErr(de);
    return ok && Object.keys(de).length === 0;
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
      // Each line sends the date and time from its OWN control, falling back to
      // whatever it arrived with. The flight fields still only apply to a single
      // airport line - that is the only row this popup asks a flight number for.
      const isTarget = !!singleLine && i === 0;
      return {
        type: l.type,
        service: l.service,
        date: dateOf(l, i) || l.date || '',
        time: timeOf(l, i) || l.time || '',
        guests: String(l.guests || displayGuests),
        pickup: l.pickup || f.pickup,
        dropoff: l.dropoff || f.dropoff,
        day_no: l.day_no != null ? l.day_no : null,
        flight_number: (isTarget && needsFlight ? f.flightNumber || l.flight_number : l.flight_number) || '',
        flight_datetime: (isTarget && needsFlight ? f.flightDatetime || l.flight_datetime : l.flight_datetime) || '',
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
      // Only when nothing is being collected online - otherwise it waits for
      // the webhook (see onConfirmed on PayWaiting below).
      if (!payOn && typeof ctx.onSuccess === 'function') ctx.onSuccess();
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
    const rowText = ctx.lines
      .map((l, i) => {
        const d = dateOf(l, i) || l.date || 'TBD';
        const t = timeOf(l, i);
        return `- ${l.day_no ? 'Day ' + l.day_no + ' · ' : ''}${d}${t ? ' · ' + fmtTime(t) : ''} · ${l.service} · ${l.guests || displayGuests} pax`;
      })
      .join('\n');
    const flightLine = flightNumberDisplay ? `\nFlight: ${flightNumberDisplay} (${f.flightDatetime || singleLine.flight_datetime || 'TBD'})` : '';
    return `Hello, I'd like to book:\nService: ${ctx.service}\nName: ${f.name}\nPhone: ${f.phone}\nEmail: ${f.email}\n${rowText}\nPick-up: ${f.pickup || '-'}\nDrop-off: ${f.dropoff || '-'}${flightLine}\nPrice: ${priceText()}`;
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
  // Two-step chrome. Isolated to this modal, same as ROW below.
  const STEPS = 'flex gap-[6px] mb-2';
  const stepBar = (on) => 'flex-1 h-[3px] rounded-[2px] ' + (on ? 'bg-cta' : 'bg-line');
  const STEP_LABEL = 'mb-[0.9rem] text-center text-label font-medium tracking-[0.1em] uppercase text-muted';
  const GROUP_LABEL = 'mb-[0.4rem] text-label font-medium tracking-[0.12em] uppercase text-muted';
  const ROWSET = 'mb-4 [border-top:1px_solid_#eee]';
  // The total sits in its own bar, not in the row list: on the checking screen it
  // is the one number the guest is agreeing to.
  const PBAR = 'flex items-center justify-between gap-[10px] py-[10px] px-3 rounded-md bg-cream [border:1px_solid_var(--line)]';
  const PBAR_L = 'text-body font-medium text-green';
  const PBAR_V = 'text-[1.15rem] font-semibold text-amber';
  const BACK_LINK = 'block w-full pt-[10px] text-center text-body font-medium text-green bg-transparent border-none cursor-pointer';
  const HINT = 'block mt-[0.35rem] text-small text-muted';
  const DETAILS_LI_ROW = "relative py-[0.5rem] pr-0 pl-[1.1rem] [border-bottom:1px_solid_#eee] text-body leading-[var(--lh-body)] text-muted [&::before]:content-['•'] [&::before]:absolute [&::before]:left-[0.15rem] [&::before]:text-gold last:[border-bottom:none]";
  const DETAILS_TOGGLE = 'flex items-center justify-between w-full py-[0.85rem] px-0 font-body text-[1rem] font-semibold text-green bg-transparent border-none cursor-pointer';
  const DETAILS_LI = "relative pt-[0.4rem] pr-0 pb-[0.4rem] pl-5 text-body leading-[var(--lh-body)] text-muted [&::before]:content-['•'] [&::before]:absolute [&::before]:left-[0.25rem] [&::before]:text-gold";
  return createPortal(
    <ModalPresence open={!!ctx} onClose={paid ? () => {} : closeBooking} box={BOX_WIDE} shellClass={SHELL_WIDE}>
        {!paid && <button className={CLOSE} aria-label="Close" onClick={closeBooking}>&times;</button>}
        <img className={LOGO} src="/assets/images/logo.webp" alt="The Cahyana Logo" width="1005" height="324" />

        {!done ? (
          <div id="modal-form">
            <h3 className={TITLE}>Booking Confirmation</h3>
            <div className={STEPS} aria-hidden="true">
              <span className={stepBar(true)} />
              <span className={stepBar(step === 2)} />
            </div>
            <p className={STEP_LABEL}>
              Step {step} of 2 &middot; {step === 1 ? 'Your details' : 'Check & book'}
            </p>

            {step === 1 ? (
              <>
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
                {needsFlight && (
                  <div className={GROUP}>
                    <label className={LABEL} htmlFor="flight-number">Flight Number</label>
                    <input className={INPUT} type="text" id="flight-number" placeholder="e.g. QZ7501" value={f.flightNumber} onChange={set('flightNumber')} aria-invalid={!!errors.flightNumber} />
                    {errors.flightNumber && <small className={FIELD_ERR}>{errors.flightNumber}</small>}
                  </div>
                )}

                {lines.map((l, i) =>
                  isAirportLine(l) && i === 0 && needsFlight ? (
                    /* The airport leg: ONE control, and it keeps real minutes.
                       A second "Date & time" here would ask the same question
                       twice - the bug already fixed on the airport page. */
                    <div className={GROUP} key={'dt' + i}>
                      <label className={LABEL} htmlFor="flight-datetime">Flight date &amp; time</label>
                      <DateTimeField id="flight-datetime" label="Flight date & time" value={f.flightDatetime} onChange={setValue('flightDatetime')} />
                      <small className={HINT}>We use this as your pick-up time, so you are collected for this flight.</small>
                      {errors.flightDatetime && <small className={FIELD_ERR}>{errors.flightDatetime}</small>}
                    </div>
                  ) : (
                    <div className={GROUP} key={'dt' + i}>
                      <label className={LABEL} htmlFor={'bk-dt-' + i}>
                        {lines.length > 1 ? (l.day_no ? 'Day ' + l.day_no + ' · ' : '') + l.service : 'Date & time'}
                      </label>
                      <DateField
                        id={'bk-dt-' + i}
                        label="Date & time"
                        value={dt(i).date}
                        onChange={(v) => setDT(i, 'date', v)}
                        placeholder="Select date"
                        withTime
                        time={dt(i).time}
                        onTimeChange={(v) => setDT(i, 'time', v)}
                        category={categoryOfLine(l)}
                        itemName={l.service}
                      />
                      {dtErr[i] && <small className={FIELD_ERR}>{dtErr[i]}</small>}
                    </div>
                  ),
                )}

                <button className={BTN} onClick={() => { if (validate()) { setError(''); setStep(2); } }}>Continue</button>
              </>
            ) : (
              <>
                <p className={GROUP_LABEL}>Your trip</p>
                <div className={ROWSET}>
                  <div className={ROW}><span>Service</span><span>{view.service}</span></div>
                  {singleLine ? (
                    <>
                      <div className={ROW}><span>Date</span><span>{dateOf(singleLine, 0) || '-'}</span></div>
                      {isAirportRoute ? (
                        <div className={ROW}><span>Flight</span><span>{flightNumberDisplay || '-'}{timeOf(singleLine, 0) ? ' · ' + fmtTime(timeOf(singleLine, 0)) : ''}</span></div>
                      ) : (
                        <div className={ROW}><span>Time</span><span>{timeOf(singleLine, 0) ? fmtTime(timeOf(singleLine, 0)) : '-'}</span></div>
                      )}
                    </>
                  ) : null}
                  <div className={ROW}><span>Guests</span><span>{view.guests || displayGuests}</span></div>
                  {priced && priced.referral && (
                    <div className={ROW}><span>Referral</span><span>{priced.referral.code} ({priced.referral.pct}%)</span></div>
                  )}
                </div>

                {view.detailLines && view.detailLines.length > 0 && (
                  <>
                    <p className={GROUP_LABEL}>{view.detailsTitle || "What's included"}</p>
                    {/* Open by default - at checkout the list of what is being
                        booked should not be hidden behind a tap. Past 4 rows it
                        folds, because that is measured to be where the screen
                        runs out (5 rows needed 45px of scroll at 320px). */}
                    {view.detailLines.length > 4 ? (
                      <div className="mb-4">
                        <button type="button" className={DETAILS_TOGGLE} onClick={() => setDetailsOpen((v) => !v)}>
                          <span>{view.detailLines.length} items</span>
                          <span className={"text-[1.4rem] text-gold transition-transform duration-[var(--dur-slow)] ease-[ease] " + (detailsOpen ? '[transform:rotate(90deg)]' : '')}>&rsaquo;</span>
                        </button>
                        <ul className={'list-none overflow-hidden transition-[max-height] duration-[var(--dur-slow)] ease-[ease] ' + (detailsOpen ? 'max-h-[320px]' : 'max-h-0')}>
                          {view.detailLines.map((d, i) => <li className={DETAILS_LI} key={i}>{d}</li>)}
                        </ul>
                      </div>
                    ) : (
                      <ul className={ROWSET + ' list-none'}>
                        {view.detailLines.map((d, i) => <li className={DETAILS_LI_ROW} key={i}>{d}</li>)}
                      </ul>
                    )}
                  </>
                )}

                <p className={GROUP_LABEL}>You</p>
                <div className={ROWSET}>
                  <div className={ROW}><span>Name</span><span>{f.name}</span></div>
                  <div className={ROW}><span>Phone</span><span>{f.phone}</span></div>
                  <div className={ROW}><span>Email</span><span>{f.email}</span></div>
                  {f.pickup && <div className={ROW}><span>Pick-up</span><span>{f.pickup}</span></div>}
                  {f.dropoff && <div className={ROW}><span>Drop-off</span><span>{f.dropoff}</span></div>}
                </div>

                <div className={PBAR}>
                  <span className={PBAR_L}>Total</span>
                  <span className={PBAR_V} id="sum-price">{withSymbol(priceText())}</span>
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

                <PayChips
                  className="mt-[1.1rem] mb-[1.35rem] text-center"
                  logosClass="flex flex-wrap items-center justify-center gap-2"
                  chipClass="inline-flex items-center justify-center h-[30px] min-w-[46px] px-[0.55rem] bg-white [border:1px_solid_#e2ddd0] rounded-sm transition-transform duration-[var(--dur)] ease-[var(--ease-out)] hover:[transform:translateY(-2px)]"
                  svgClass="block h-[var(--icon-sm)] w-auto"
                />

                {error && <small className="block mt-[0.4rem] text-small text-err">{error}</small>}

                <button className={BTN} onClick={submit} disabled={busy}>{busy ? 'Sending...' : 'Book Now'}</button>
                <button
                  className={BTN_WA + ' ' + STACK}
                  onClick={() => {
                    if (!validate()) { setError(''); setStep(1); return; }
                    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(waText()), '_blank');
                  }}
                >
                  Discuss via WhatsApp
                </button>
                {/* Last, and a text link rather than a third button: three stacked
                    buttons read as three equal choices when Book Now is the one. */}
                <button type="button" className={BACK_LINK} onClick={() => setStep(1)}>&lsaquo; Edit details</button>
              </>
            )}
          </div>
        ) : !payOn ? (
          <div className="text-center">
            <div className={SUCCESS_ICON}>&#10003;</div>
            <h3 className={TITLE}>Booking Received!</h3>
            <p className={SUCCESS_TEXT}>Thank you. We will email you shortly to confirm your booking.</p>
            <button className={BTN} onClick={closeBooking}>Done</button>
          </div>
        ) : (
          <div>
            {paid ? (
              // The card went through, but a booking is only confirmed when the
              // webhook says the money cleared (confirmPayment in cahyana-api).
              // This screen locks and asks the server until it knows, instead of
              // claiming "confirmed" on the strength of the capture alone.
              <PayWaiting
                bookingRef={bookingRef}
                onClose={closeBooking}
                onConfirmed={() => { if (view.onSuccess) view.onSuccess(); }}
              />
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
