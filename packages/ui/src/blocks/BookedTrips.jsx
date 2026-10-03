import { CalendarCheck, ChevronDown } from 'lucide-react';
import {
  TRIP_EMPTY, TRIP_EMPTY_LEAD, TRIP_EMPTY_SUB, TRIP_CARD, TRIP_HEAD, TRIP_ICON, TRIP_BODY, TRIP_TITLE, TRIP_DESC,
  TRIP_DATE, TRIP_PRICE, TRIP_DET_BOX, TRIP_DET_TOGGLE, TRIP_DET_CHEV, TRIP_DET_LIST, TRIP_DET_LINE, TRIP_DET_NAME,
  TRIP_DET_META, TRIP_DET_AMT, TRIP_CANCEL_BOX, TRIP_CANCEL_BTN,
} from './tripClasses.js';

const STATUS = { new: 'New', paid: 'Paid', pending: 'Pending', confirmed: 'Confirmed', mismatch: 'Mismatch' };

const COPY = {
  completed: 'Completed',
  booked: 'Booked',
  guests: (count) => `${count} guests`,
  hide: 'Hide details',
  view: (count) => `View details (${count} ${count === 1 ? 'item' : 'items'})`,
  pax: (count) => `${count} pax`,
  contact: 'Contact us to cancel or change',
  loading: 'Loading your trips…',
  emptyBookedLead: 'No booked trips yet.',
  emptyBookedSub: 'Once you make a payment, your booked trip shows up here.',
  emptyPastLead: 'No past trips yet.',
  emptyPastSub: 'Trips you have already taken will appear here.',
};

/**
 * CUE's Booked / Past tab body. Presentational: the site passes the trips and
 * the helpers that know its money, dates and photos.
 *
 *   trips       the array for this tab (null while loading)
 *   signedIn    false shows `signIn` instead of the list
 *   signIn      node for the logged-out state
 *   money       (usd, idr) => string, the stored charged amount
 *   range       (start, end) => string
 *   lineDate    (date) => string, optional, for a detail line
 *   imageFor    (trip) => url | null, the card photo
 *   cancelHref  (trip) => url, the "contact us" link on upcoming cards
 *   copy        overrides for any string in COPY
 */
export default function BookedTrips({
  trips = null,
  past = false,
  signedIn = true,
  signIn = null,
  openRef = null,
  onToggle = () => {},
  money = () => '',
  range = () => '',
  lineDate = (date) => date || '',
  imageFor = () => null,
  cancelHref = () => '#',
  copy = {},
}) {
  const t = { ...COPY, ...copy };
  if (!signedIn) return signIn;
  if (!trips) {
    return <div className={TRIP_EMPTY}><p className={TRIP_EMPTY_SUB}>{t.loading}</p></div>;
  }
  if (!trips.length) {
    return (
      <div className={TRIP_EMPTY}>
        <p className={TRIP_EMPTY_LEAD}>{past ? t.emptyPastLead : t.emptyBookedLead}</p>
        <p className={TRIP_EMPTY_SUB}>{past ? t.emptyPastSub : t.emptyBookedSub}</p>
      </div>
    );
  }
  return (
    <div>
      {trips.map((trip) => {
        const image = imageFor(trip);
        const lines = trip.lines || [];
        const open = openRef === trip.ref;
        const status = past ? t.completed : trip.status ? (STATUS[trip.status] || trip.status.charAt(0).toUpperCase() + trip.status.slice(1)) : t.booked;
        return (
          <div className={TRIP_CARD} key={trip.ref}>
            <div className={TRIP_HEAD}>
              <span className={TRIP_ICON} style={image ? { backgroundImage: `url(${image})` } : undefined} aria-hidden="true">
                {!image && <CalendarCheck strokeWidth={1.7} />}
              </span>
              <div className={TRIP_BODY}>
                <p className={TRIP_TITLE}>{trip.name}</p>
                <p className={TRIP_DESC}>{status} · {t.guests(trip.guests || '-')}</p>
                <p className={TRIP_DATE}>{range(trip.start_date, trip.end_date)}{trip.ref ? ` · ${trip.ref}` : ''}</p>
              </div>
              <span className={TRIP_PRICE}>{money(trip.price_usd, trip.price_idr)}</span>
            </div>

            {lines.length > 0 && (
              <div className={TRIP_DET_BOX}>
                <button type="button" className={TRIP_DET_TOGGLE} aria-expanded={open ? 'true' : 'false'} onClick={() => onToggle(open ? null : trip.ref)}>
                  {open ? t.hide : t.view(lines.length)}
                  <ChevronDown className={TRIP_DET_CHEV} strokeWidth={1.6} aria-hidden="true" />
                </button>
                {open && (
                  <ul className={TRIP_DET_LIST}>
                    {lines.map((line, index) => (
                      <li className={TRIP_DET_LINE} key={index}>
                        <span className={TRIP_DET_NAME}>
                          {line.service}
                          <span className={TRIP_DET_META}>
                            {lineDate(line.date)}
                            {line.guests ? ` · ${t.pax(line.guests)}` : ''}
                            {line.pickup_time ? ` · ${line.pickup_time}` : ''}
                          </span>
                        </span>
                        <span className={TRIP_DET_AMT}>{money(line.price_usd, line.price_idr)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {!past && (
              <div className={TRIP_CANCEL_BOX}>
                <a className={TRIP_CANCEL_BTN} href={cancelHref(trip)} target="_blank" rel="noopener">{t.contact}</a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
