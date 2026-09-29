import { fmtTime } from '@/content/shared/timeSlots';
import { PRICE } from '@/components/ui/priceClasses';
import { BTN } from '@/components/ui/modalClasses';
import { BTN_PILL } from '@/components/ui/btnClasses';
import { withSymbol } from '@/components/Price';
import ItemIcon from './ItemIcon';
import { fmtDay } from './tripDates';
import {
  MTC_EMPTY, MTC_EMPTY_LEAD, MTC_EMPTY_SUB, MTC_TOTAL, MTC_TOTAL_LABEL, MTC_TOTAL_VAL, MTC_ITEM_BODY,
  MTC_ITEM_TITLE, MTC_ITEM_DESC, MTC_ITEM_PRICE, MTC_ITEM_DEL, MTC_NOTE, MTC_NOTE_WARN, MTC_POLICY_LINK,
  MTC_ITEM, MTC_ADD_FULL, MTC_DATEBTN,
} from './myTripsClasses';

// My Trip tab: cart rows with date buttons, total, add button, notes and Pay now.
export default function CartPanel({
  rows, priced, format, totalText, undated, setAdding, setEditDate, remove, checkout,
}) {
  return rows.length === 0 ? (
    <div className={MTC_EMPTY}>
      <p className={MTC_EMPTY_LEAD}>Your trip is empty.</p>
      <p className={MTC_EMPTY_SUB}>Add a tour, transfer, or experience to get started.</p>
      <button type="button" className={BTN_PILL} onClick={() => setAdding(true)}>Add program</button>
    </div>
  ) : (
    <>
      <div>
        {rows.map((r, i) => {
          const line = priced && priced.lines[i];
          return (
            <div className={MTC_ITEM} key={i}>
              <ItemIcon row={r} />
              <div className={MTC_ITEM_BODY}>
                <p className={MTC_ITEM_TITLE}>{r.service}</p>
                <p className={MTC_ITEM_DESC}>
                  {r.day_no ? `Day ${r.day_no} · ` : ''}
                  <button
                    type="button"
                    className={MTC_DATEBTN}
                    onClick={() => setEditDate({ row: r, index: i })}
                  >
                    {fmtDay(r.date)}{r.time ? ` · ${fmtTime(r.time)}` : ''}
                  </button>
                  {r.mode === 'exclusive' ? ' · Exclusive' : ''}
                  {r.return ? ' · return' : ''}
                </p>
              </div>
              <span className={MTC_ITEM_PRICE}>
                <span className={PRICE}>
                  {line ? withSymbol(format(line.display)) : '-'}
                </span>
              </span>
              <button type="button" className={MTC_ITEM_DEL} aria-label={`Remove ${r.service}`} onClick={() => remove(r)}>&times;</button>
            </div>
          );
        })}
      </div>

      <div className={MTC_TOTAL}>
        <span className={MTC_TOTAL_LABEL}>Total</span>
        <span className={MTC_TOTAL_VAL}><span className={PRICE}>{withSymbol(totalText)}</span></span>
      </div>

      <button type="button" className={MTC_ADD_FULL} onClick={() => setAdding(true)}>+ Add another program</button>

      {undated && (
        <p className={MTC_NOTE_WARN}>Every item needs a date before you can pay. Tap a date to set it.</p>
      )}

      <p className={MTC_NOTE}>
        By clicking <strong>Pay now</strong>, you agree to our{' '}
        <a className={MTC_POLICY_LINK} href="/our-company.html#terms">Terms</a> and <a className={MTC_POLICY_LINK} href="/our-company.html#cancellation">Cancellation & Refund Policy</a>.
      </p>
      <button type="button" className={`${BTN} mt-[1.2rem] disabled:opacity-45 disabled:cursor-not-allowed`} disabled={undated} onClick={checkout}>Pay now</button>
      <p className={MTC_NOTE}>
        You&apos;ll add your name &amp; contact details at payment - that also creates your account so you can log in later with the same email.
      </p>
    </>
  );
}
