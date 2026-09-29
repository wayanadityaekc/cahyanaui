'use client';
import { fmtTime } from '@/content/shared/timeSlots';
import PayWaiting from '@/components/booking/PayWaiting';

import { useMemo, useState, useRef } from 'react';
import { CalendarCheck, History, ShoppingBag } from 'lucide-react';
import { useItinerary } from '@/state/ItineraryProvider';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useAccount } from '@/state/AccountProvider';
import { useReferral } from '@/state/ReferralProvider';
import { useBooking, useResumeBooking } from '@/state/BookingProvider';
import useQuote from '@/hooks/useQuote';
import useMoney from '@/hooks/useMoney';
import ReviewModal from '@/components/reviews/ReviewModal';
import AddItemPicker from './AddItemPicker';
import DatePopup from '@/components/booking/DatePopup';
import { removeRow, setRowDate } from '@/lib/cart';
import { cartRows } from '@/lib/cartRows';
import { usePricing } from '@/state/PricingProvider';
import RailLayout from '@/components/ui/RailLayout';
import { crumbsFor } from '@/lib/crumbs';
import CartPanel from './CartPanel';
import BookedTrips from './BookedTrips';
import { usePaymentReturn, useReviewLink } from './useMyTripsLinks';
import { fmtDay } from './tripDates';

export default function MyTripsCart() {
  const { state, save, hydrated } = useItinerary();
  const { displayGuests, currency, stay } = useTripPrefs();
  const { account, trips, reviewableItems } = useAccount();
  const { referral } = useReferral();
  const { openBooking } = useBooking();
  const checkoutRef = useRef(null);
  const pricing = usePricing();

  // Return from the hosted payment page: show PayWaiting, which asks the server; never trust the URL.
  const { returnRef, clearReturn } = usePaymentReturn();

  const [review, setReview] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editDate, setEditDate] = useState(null);
  const [tab, setTab] = useState('custom');
  // Phone opens straight on the cart, not the section list; Back still reaches the list.
  const [reading, setReading] = useState(true);
  // Which booked card is expanded; kept here so it survives switching between Booked and Past.
  const [openRef, setOpenRef] = useState(null);

  useReviewLink({ trips, reviewableItems, account, setTab, setReading, setReview });

  const rows = useMemo(() => cartRows(state, displayGuests), [state, displayGuests]);

  // Row category from the catalog for time slots; transfer/charter rows are unrestricted.
  function categoryOfRow({ kind, service }) {
    if (kind !== 'day') return kind;
    const c = pricing && pricing.catalog && pricing.catalog.items.find((i) => i.name === service);
    return c ? c.category : null;
  }

  const priced = useQuote({
    lines: rows,
    currency,
    stay,
    referral: (referral && referral.code) || '',
    enabled: hydrated,
  });
  const { format } = useMoney();

  // Resume a booking after sign-in; must run above the early return (hooks order), checkout via a ref.
  useResumeBooking(hydrated && rows.length > 0 && rows.every((r) => r.date), () => checkoutRef.current && checkoutRef.current());

  if (!hydrated) return <div data-mytrips-cart />;

  const undated = rows.some((r) => !r.date);
  const totalText = priced ? format(priced.total.display) : '-';

  function remove(row) {
    save(removeRow(state, row));
  }

  function checkout() {
    if (!rows.length || undated) return;
    const parts = [];
    const dayCount = new Set(rows.filter((r) => r.kind === 'day').map((r) => r.day_no)).size;
    const transferCount = rows.filter((r) => r.kind === 'transfer').length;
    const charterCount = rows.filter((r) => r.kind === 'charter').length;
    if (dayCount) parts.push(`${dayCount} day${dayCount > 1 ? 's' : ''}`);
    if (transferCount) parts.push(`${transferCount} transfer${transferCount > 1 ? 's' : ''}`);
    if (charterCount) parts.push(`${charterCount} charter`);
    openBooking({
      type: 'itinerary',
      service: `My Trip (${parts.join(' + ')})`,
      guests: String(displayGuests),
      date: '',
      pickupOptional: true,
      dropoffRequired: false,
      detailsTitle: 'Trip details',
      detailLines: rows.map((r) => `${r.day_no ? `Day ${r.day_no} · ` : ''}${fmtDay(r.date)}${r.time ? ` · ${fmtTime(r.time)}` : ''} · ${r.service}`),
      lines: rows,
      onSuccess: () => save({ days: [], transfers: [], charters: [] }),
    });
  }
  checkoutRef.current = checkout;

  const TABS = [
    { id: 'custom', label: 'My Trip', Icon: ShoppingBag },
    { id: 'booked', label: 'Booked Trip', Icon: CalendarCheck },
    { id: 'past', label: 'Past Trip', Icon: History },
  ];

  // Payment-return waiting screen, a full-screen portal shown above the cart.
  const payReturn = returnRef ? (
    <PayWaiting
      bookingRef={returnRef}
      onClose={clearReturn}
      onConfirmed={() => save({ days: [], transfers: [], charters: [] })}
    />
  ) : null;

  return (
    <>
      {payReturn}
    <div data-mytrips-cart>
      <RailLayout
        label="My trips"
        items={TABS}
        active={tab}
        onSelect={(id) => { setTab(id); setReading(true); }}
        reading={reading}
        onBack={() => setReading(false)}
        collapsible
        breadcrumb={crumbsFor('my-trips')}
        scrollContent
      >
      {tab === 'custom' && (
        <CartPanel
          rows={rows}
          priced={priced}
          format={format}
          totalText={totalText}
          undated={undated}
          setAdding={setAdding}
          setEditDate={setEditDate}
          remove={remove}
          checkout={checkout}
        />
      )}

      {tab === 'booked' && <div><BookedTrips isPast={false} openRef={openRef} setOpenRef={setOpenRef} setReview={setReview} /></div>}
      {tab === 'past' && <div><BookedTrips isPast openRef={openRef} setOpenRef={setOpenRef} setReview={setReview} /></div>}
      </RailLayout>

      <ReviewModal open={!!review} prefill={review} onClose={() => setReview(null)} />

      <AddItemPicker open={adding} onClose={() => setAdding(false)} />

      <DatePopup
        open={!!editDate}
        title={editDate ? editDate.row.service : ''}
        initial={editDate ? editDate.row.date : ''}
        onPick={(date, time) => {
          if (!editDate) return;
          const next = setRowDate(state, editDate.row, date, time);
          if (next) save(next);
        }}
        onClose={() => setEditDate(null)}
        withTime
        initialTime={editDate ? editDate.row.time || '' : ''}
        category={editDate ? categoryOfRow(editDate.row) : null}
        itemName={editDate ? editDate.row.service : null}
      />
    </div>
    </>
  );
}
