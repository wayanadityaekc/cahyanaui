'use client';
import { formatTime } from '@/content/shared/timeSlots';
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
import { buildCartRows } from '@/lib/cartRows';
import { usePricing } from '@/state/PricingProvider';
import RailLayout from '@/components/ui/RailLayout';
import { buildCrumbs } from '@/lib/crumbs';
import CartPanel from './CartPanel';
import BookedTrips from './BookedTrips';
import { usePaymentReturn, useReviewLink } from './useMyTripsLinks';
import { formatDay } from './tripDates';

export default function MyTripsCart() {
  const { state, save, hydrated } = useItinerary();
  const { displayGuests, currency, stay } = useTripPrefs();
  const { account, trips, reviewableItems } = useAccount();
  const { referral } = useReferral();
  const { openBooking } = useBooking();
  const checkoutRef = useRef(null);
  const pricing = usePricing();

  const { returnRef, clearReturn } = usePaymentReturn();

  const [review, setReview] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editDate, setEditDate] = useState(null);
  const [tab, setTab] = useState('custom');
  const [isReading, setIsReading] = useState(true);
  const [openRef, setOpenRef] = useState(null);

  useReviewLink({ trips, reviewableItems, account, setTab, setReading: setIsReading, setReview });

  const rows = useMemo(() => buildCartRows(state, displayGuests), [state, displayGuests]);

  function findRowCategory({ kind, service }) {
    if (kind !== 'day') return kind;
    const catalogItem = pricing && pricing.catalog && pricing.catalog.items.find((item) => item.name === service);
    return catalogItem ? catalogItem.category : null;
  }

  const priced = useQuote({
    lines: rows,
    currency,
    stay,
    referral: (referral && referral.code) || '',
    enabled: hydrated,
  });
  const { format } = useMoney();

  useResumeBooking(
    hydrated && rows.length > 0 && rows.every((row) => row.date),
    () => checkoutRef.current && checkoutRef.current(),
  );

  if (!hydrated) return <div data-mytrips-cart />;

  const hasUndatedRow = rows.some((row) => !row.date);
  const totalText = priced ? format(priced.total.display) : '-';

  function remove(row) {
    save(removeRow(state, row));
  }

  function handleCheckout() {
    if (!rows.length || hasUndatedRow) return;
    const parts = [];
    const dayCount = new Set(rows.filter((row) => row.kind === 'day').map((row) => row.day_no)).size;
    const transferCount = rows.filter((row) => row.kind === 'transfer').length;
    const charterCount = rows.filter((row) => row.kind === 'charter').length;
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
      detailLines: rows.map(
        (row) =>
          `${row.day_no ? `Day ${row.day_no} · ` : ''}${formatDay(row.date)}${row.time ? ` · ${formatTime(row.time)}` : ''} · ${row.service}`,
      ),
      lines: rows,
      onSuccess: () => save({ days: [], transfers: [], charters: [] }),
    });
  }
  checkoutRef.current = handleCheckout;

  const TABS = [
    { id: 'custom', label: 'My Trip', Icon: ShoppingBag },
    { id: 'booked', label: 'Booked Trip', Icon: CalendarCheck },
    { id: 'past', label: 'Past Trip', Icon: History },
  ];

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
          onSelect={(id) => {
            setTab(id);
            setIsReading(true);
          }}
          reading={isReading}
          onBack={() => setIsReading(false)}
          collapsible
          breadcrumb={buildCrumbs('my-trips')}
          scrollContent
        >
          {tab === 'custom' && (
            <CartPanel
              rows={rows}
              priced={priced}
              format={format}
              totalText={totalText}
              undated={hasUndatedRow}
              setAdding={setIsAdding}
              setEditDate={setEditDate}
              remove={remove}
              checkout={handleCheckout}
            />
          )}

          {tab === 'booked' && (
            <div>
              <BookedTrips isPast={false} openRef={openRef} setOpenRef={setOpenRef} setReview={setReview} />
            </div>
          )}
          {tab === 'past' && (
            <div>
              <BookedTrips isPast openRef={openRef} setOpenRef={setOpenRef} setReview={setReview} />
            </div>
          )}
        </RailLayout>

        <ReviewModal open={!!review} prefill={review} onClose={() => setReview(null)} />

        <AddItemPicker open={isAdding} onClose={() => setIsAdding(false)} />

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
          category={editDate ? findRowCategory(editDate.row) : null}
          itemName={editDate ? editDate.row.service : null}
        />
      </div>
    </>
  );
}
