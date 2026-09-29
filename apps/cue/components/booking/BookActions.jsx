import PayChips from './PayChips';
import { BTN, BTN_WA, STACK } from '@/components/ui/modalClasses';
import { PAY_CHIPS } from './bookingModalClasses';

// Payment logos, error line, Book Now and the WhatsApp fallback (check step when payment is off, and the payment step).
export default function BookActions({ error, busy, submit, openWhatsApp }) {
  return (
    <>
      <PayChips {...PAY_CHIPS} />

      {error && <small className="block mt-[0.4rem] text-small text-err">{error}</small>}

      <button className={BTN} onClick={submit} disabled={busy}>{busy ? 'Sending...' : 'Book Now'}</button>
      <button
        className={`${BTN_WA} ${STACK}`}
        onClick={openWhatsApp}
      >
        Discuss via WhatsApp
      </button>
    </>
  );
}
