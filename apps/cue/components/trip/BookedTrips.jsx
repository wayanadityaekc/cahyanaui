import { ChevronDown } from 'lucide-react';
import { PRICE } from '@/components/ui/priceClasses';
import { useAccount } from '@/state/AccountProvider';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { readLocal } from '@/lib/storage';
import { KEY, WHATSAPP_NUMBER } from '@/lib/constants';
import { imageForProgram } from '@/lib/programImages';
import { withSymbol } from '@/components/Price';
import { BTN_PILL } from '@/components/ui/btnClasses';
import SignInPrompt from '@/components/account/SignInPrompt';
import ItemIcon from './ItemIcon';
import { fmtDay, fmtRange } from './tripDates';
import {
  MTC_EMPTY, MTC_EMPTY_LEAD, MTC_EMPTY_SUB, MTC_ITEM_ICON_PHOTO, MTC_ITEM_BODY, MTC_ITEM_TITLE, MTC_ITEM_DESC,
  MTC_ITEM_PRICE, MTC_ITEM_DATE, MTC_DET_TOGGLE, MTC_DET_CHEV, MTC_DET_LIST, MTC_DET_LINE, MTC_DET_NAME,
  MTC_DET_META, MTC_DET_AMT, MTC_ITEM_BOOKED, MTC_BOOK, MTC_DET_BOX, MTC_REVIEW_BOX, MTC_REVIEW_BTN,
  MTC_CANCEL_BOX, MTC_CANCEL_BTN,
} from './myTripsClasses';

// Booked / Past tab: sign-in prompt, loading and empty states, trip cards, one Leave-a-review button.
export default function BookedTrips({ isPast, openRef, setOpenRef, setReview }) {
  const { account, trips, reviewableItems } = useAccount();
  const { currency } = useTripPrefs();

  // Booked trips show the stored charged amount, not a live conversion.
  function bookedMoney(usd, idr) {
    return currency === 'IDR'
        ? `Rp${Number(idr || 0).toLocaleString('id-ID')}`
        : `$${Number(usd || 0).toLocaleString('en-US')}`;
  }

  function bookingCard(t, isPast) {
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
              style={{ backgroundImage: `url(/assets/images/${img})` }}
              aria-hidden="true"
            />
          ) : (
            <ItemIcon row={{ kind: 'tour' }} />
          )}
          <div className={MTC_ITEM_BODY}>
            <p className={MTC_ITEM_TITLE}>{t.name}</p>
            <p className={MTC_ITEM_DESC}>{status} · {t.guests || '-'} guests</p>
            <p className={MTC_ITEM_DATE}>
              {fmtRange(t.start_date, t.end_date)}{t.ref ? ` · ${t.ref}` : ''}
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
                : `View details (${items.length}${items.length > 1 ? ' items)' : ' item)'}`}
              <ChevronDown className={MTC_DET_CHEV} strokeWidth={1.6} aria-hidden="true" />
            </button>
            {open && (
              <ul className={MTC_DET_LIST}>
                {items.map((l, i) => (
                  <li className={MTC_DET_LINE} key={i}>
                    <span className={MTC_DET_NAME}>
                      {l.day_no ? `Day ${l.day_no} · ` : ''}{l.service}
                      <span className={MTC_DET_META}>
                        {fmtDay(l.date)}
                        {l.guests ? ` · ${l.guests} pax` : ''}
                        {l.pickup_time ? ` · ${l.pickup_time}` : ''}
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
                `Hi, I'd like to ask about cancelling or changing my booking${t.ref ? ` (${t.ref})` : ''} - ${t.name || 'my trip'}${t.start_date ? ` on ${fmtRange(t.start_date, t.end_date)}` : ''}.`,
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
}
