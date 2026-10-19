import { ChevronDown } from 'lucide-react';
import { PRICE } from '@/components/ui/priceClasses';
import { useAccount } from '@/state/AccountProvider';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { readLocal } from '@/lib/storage';
import { KEY, WHATSAPP_NUMBER } from '@/lib/constants';
import { findImageForProgram } from '@/lib/programImages';
import { withSymbol } from '@/components/Price';
import { BTN_PILL } from '@/components/ui/btnClasses';
import SignInPrompt from '@/components/account/SignInPrompt';
import ItemIcon from './ItemIcon';
import { formatDay, formatRange } from './tripDates';
import {
  MTC_EMPTY,
  MTC_EMPTY_LEAD,
  MTC_EMPTY_SUB,
  MTC_ITEM_ICON_PHOTO,
  MTC_ITEM_BODY,
  MTC_ITEM_TITLE,
  MTC_ITEM_DESC,
  MTC_ITEM_PRICE,
  MTC_ITEM_DATE,
  MTC_DET_TOGGLE,
  MTC_DET_CHEV,
  MTC_DET_LIST,
  MTC_DET_LINE,
  MTC_DET_NAME,
  MTC_DET_META,
  MTC_DET_AMT,
  MTC_ITEM_BOOKED,
  MTC_BOOK,
  MTC_DET_BOX,
  MTC_REVIEW_BOX,
  MTC_REVIEW_BTN,
  MTC_CANCEL_BOX,
  MTC_CANCEL_BTN,
} from './myTripsClasses';

const ICON_STROKE_WIDTH_LIGHT = 1.6;

export default function BookedTrips({ isPast, openRef, setOpenRef, setReview }) {
  const { account, trips, reviewableItems } = useAccount();
  const { currency } = useTripPrefs();

  function formatBookedMoney(usd, idr) {
    return currency === 'IDR'
      ? `Rp${Number(idr || 0).toLocaleString('id-ID')}`
      : `$${Number(usd || 0).toLocaleString('en-US')}`;
  }

  function renderBookingCard(trip, isPast) {
    const image =
      findImageForProgram(trip.name) ||
      findImageForProgram((trip.lines && trip.lines[0] && trip.lines[0].service) || '');
    function pickStatusLabel() {
      if (isPast) return 'Completed';
      if (trip.status) return trip.status.charAt(0).toUpperCase() + trip.status.slice(1);
      return 'Booked';
    }

    const status = pickStatusLabel();
    const isOpen = openRef === trip.ref;
    const items = trip.lines || [];
    return (
      <div className={MTC_BOOK} key={trip.ref}>
        <div className={MTC_ITEM_BOOKED}>
          {image ? (
            <span
              className={MTC_ITEM_ICON_PHOTO}
              style={{ backgroundImage: `url(/assets/images/${image})` }}
              aria-hidden="true"
            />
          ) : (
            <ItemIcon row={{ kind: 'tour' }} />
          )}
          <div className={MTC_ITEM_BODY}>
            <p className={MTC_ITEM_TITLE}>{trip.name}</p>
            <p className={MTC_ITEM_DESC}>
              {status} · {trip.guests || '-'} guests
            </p>
            <p className={MTC_ITEM_DATE}>
              {formatRange(trip.start_date, trip.end_date)}
              {trip.ref ? ` · ${trip.ref}` : ''}
            </p>
          </div>
          <span className={MTC_ITEM_PRICE}>
            <span className={PRICE}>{withSymbol(formatBookedMoney(trip.price_usd, trip.price_idr))}</span>
          </span>
        </div>

        {items.length > 0 && (
          <div className={MTC_DET_BOX}>
            <button
              type="button"
              className={MTC_DET_TOGGLE}
              aria-expanded={isOpen ? 'true' : 'false'}
              onClick={() => setOpenRef(isOpen ? null : trip.ref)}
            >
              {isOpen ? 'Hide details' : `View details (${items.length}${items.length > 1 ? ' items)' : ' item)'}`}
              <ChevronDown className={MTC_DET_CHEV} strokeWidth={ICON_STROKE_WIDTH_LIGHT} aria-hidden="true" />
            </button>
            {isOpen && (
              <ul className={MTC_DET_LIST}>
                {items.map((item, index) => (
                  <li className={MTC_DET_LINE} key={index}>
                    <span className={MTC_DET_NAME}>
                      {item.day_no ? `Day ${item.day_no} · ` : ''}
                      {item.service}
                      <span className={MTC_DET_META}>
                        {formatDay(item.date)}
                        {item.guests ? ` · ${item.guests} pax` : ''}
                        {item.pickup_time ? ` · ${item.pickup_time}` : ''}
                      </span>
                    </span>
                    <span className={MTC_DET_AMT}>{withSymbol(formatBookedMoney(item.price_usd, item.price_idr))}</span>
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
                `Hi, I'd like to ask about cancelling or changing my booking${trip.ref ? ` (${trip.ref})` : ''} - ${trip.name || 'my trip'}${trip.start_date ? ` on ${formatRange(trip.start_date, trip.end_date)}` : ''}.`,
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
  }

  if (!readLocal(KEY.token, '')) {
    return (
      <SignInPrompt
        lead="Sign in to see your trips."
        sub="Your booked and past trips show up here once you're signed in with your email."
      />
    );
  }
  if (!trips) {
    return (
      <div className={MTC_EMPTY}>
        <p className={MTC_EMPTY_SUB}>Loading your trips…</p>
      </div>
    );
  }
  const tripList = (isPast ? trips.history : trips.upcoming) || [];
  if (!tripList.length) {
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
      {tripList.map((trip) => renderBookingCard(trip, isPast))}
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
}
