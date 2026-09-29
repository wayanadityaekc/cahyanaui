import { fmtTime, fmtDate } from '@/content/shared/timeSlots';
import { withSymbol } from '@/components/Price';
import { BTN, STACK } from '@/components/ui/modalClasses';
import BookActions from './BookActions';
import {
  ROW, GROUP_LABEL, ROWSET, PBAR, PBAR_L, PBAR_V, BACK_LINK, DETAILS_LI_ROW, DETAILS_TOGGLE, DETAILS_LI,
} from './bookingModalClasses';

// Step 2: read-back of the trip and the guest, the total, then Continue (payment on) or Book Now (payment off).
export default function CheckStep({
  view, singleLine, dateOf, timeOf, isAirportRoute, flightNumberDisplay, displayGuests, priced,
  detailsOpen, setDetailsOpen, f, price, payOn, onContinue, error, busy, submit, openWhatsApp, onEdit,
}) {
  return (
    <>
      <p className={GROUP_LABEL}>Your trip</p>
      <div className={ROWSET}>
        <div className={ROW}><span>Service</span><span>{view.service}</span></div>
        {singleLine ? (
          <>
            <div className={ROW}><span>Date</span><span>{fmtDate(dateOf(singleLine, 0)) || '-'}</span></div>
            {isAirportRoute ? (
              <div className={ROW}><span>Flight</span><span>{flightNumberDisplay || '-'}{timeOf(singleLine, 0) ? ` · ${fmtTime(timeOf(singleLine, 0))}` : ''}</span></div>
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
          {/* Item list is open by default; above 4 rows it folds behind a toggle to avoid scrolling on small phones. */}
          {view.detailLines.length > 4 ? (
            <div className="mb-4">
              <button type="button" className={DETAILS_TOGGLE} onClick={() => setDetailsOpen((v) => !v)}>
                <span>{view.detailLines.length} items</span>
                <span className={`text-[1.4rem] text-gold transition-transform duration-[var(--dur-slow)] ease-[ease] ${detailsOpen ? '[transform:rotate(90deg)]' : ''}`}>&rsaquo;</span>
              </button>
              <ul className={`list-none overflow-hidden transition-[max-height] duration-[var(--dur-slow)] ease-[ease] ${detailsOpen ? 'max-h-[320px]' : 'max-h-0'}`}>
                {view.detailLines.map((d, i) => <li className={DETAILS_LI} key={i}>{d}</li>)}
              </ul>
            </div>
          ) : (
            <ul className={`${ROWSET} list-none`}>
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
        <span className={PBAR_V} id="sum-price">{withSymbol(price)}</span>
      </div>

      {payOn && (
        <button className={`${BTN} ${STACK}`} onClick={onContinue}>Continue</button>
      )}

      {!payOn && (
        <BookActions error={error} busy={busy} submit={submit} openWhatsApp={openWhatsApp} />
      )}
      {/* Edit details goes last as a text link, so Book Now stays the one primary action. */}
      <button type="button" className={BACK_LINK} onClick={onEdit}>&lsaquo; Edit details</button>
    </>
  );
}
