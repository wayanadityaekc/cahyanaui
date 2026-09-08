'use client';

// Ported from initReviewCta: shown on any bookable page, sends the guest to
// My Trips, where reviewing is gated on a real booking under their account.
export default function ReviewCtaBand() {
  return (
    <div className="review-cta">
      <button type="button" className="btn-pill" onClick={() => { window.location.href = '/my-trips.html'; }}>
        Leave a review
      </button>
    </div>
  );
}
