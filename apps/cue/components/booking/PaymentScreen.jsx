import { TITLE, SUCCESS_TEXT } from '@/components/ui/modalClasses';
import { railFor } from '@/lib/rails';
import { PAY_COPY } from '@/lib/payment';
import PayPalCheckout from './PayPalCheckout';
import DokuCheckout from './DokuCheckout';
import PayWaiting from './PayWaiting';

export default function PaymentScreen({ paid, bookingRef, closeBooking, signinNote, payRail, payOption, currency, onPaid }) {
  return (
    <div>
      {paid ? (
        <PayWaiting
          bookingRef={bookingRef}
          onClose={closeBooking}
        />
      ) : (
        <>
          <h3 className={TITLE}>Almost there - just the payment</h3>
          <p className={SUCCESS_TEXT}>
            Your booking is saved{bookingRef ? ` (${bookingRef})` : ''}. It is confirmed once this payment
            goes through. Nothing is lost if you close this - you can pay later.
          </p>
          {signinNote}
          {bookingRef && railFor(payRail) === 'doku' ? (
            <DokuCheckout
              bookingRef={bookingRef}
              option={payOption}
            />
          ) : bookingRef ? (
            <PayPalCheckout
              bookingRef={bookingRef}
              option={payOption}
              copy={PAY_COPY}
              currency={currency}
              onPaid={onPaid}
            />
          ) : (
            <p className="text-small text-err">We could not read your booking reference. Please contact us.</p>
          )}
        </>
      )}
    </div>
  );
}
