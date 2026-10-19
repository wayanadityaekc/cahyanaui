import { TITLE, SUCCESS_TEXT } from '@/components/ui/modalClasses';
import { pickRail } from '@/lib/rails';
import { PAY_COPY } from '@/lib/payment';
import PayPalCheckout from './PayPalCheckout';
import DokuCheckout from './DokuCheckout';
import PayWaiting from './PayWaiting';

export default function PaymentScreen({
  paid,
  bookingRef,
  closeBooking,
  signinNote,
  payRail,
  payOption,
  currency,
  onPaid,
}) {
  function renderPaymentCheckout() {
    if (bookingRef && pickRail(payRail) === 'doku') return <DokuCheckout bookingRef={bookingRef} option={payOption} />;
    if (bookingRef)
      return (
        <PayPalCheckout
          bookingRef={bookingRef}
          option={payOption}
          copy={PAY_COPY}
          currency={currency}
          onPaid={onPaid}
        />
      );
    return <p className="text-small text-err">We could not read your booking reference. Please contact us.</p>;
  }

  return (
    <div>
      {paid ? (
        <PayWaiting bookingRef={bookingRef} onClose={closeBooking} />
      ) : (
        <>
          <h3 className={TITLE}>Almost there - just the payment</h3>
          <p className={SUCCESS_TEXT}>
            Your booking is saved{bookingRef ? ` (${bookingRef})` : ''}. It is confirmed once this payment goes through.
            Nothing is lost if you close this - you can pay later.
          </p>
          {signinNote}
          {renderPaymentCheckout()}
        </>
      )}
    </div>
  );
}
