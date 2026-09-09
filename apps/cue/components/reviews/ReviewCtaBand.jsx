'use client';

// Ported from initReviewCta: shown on any bookable page, sends the guest to
// My Trips, where reviewing is gated on a real booking under their account.
// "review-cta" kept as an inert marker className (no styling left on it) -
// it's the check-detail.js CI-gate marker ("Leave a review band"); layout is
// Tailwind utilities (TW-A5, #326).
export default function ReviewCtaBand() {
  return (
    <div className="review-cta max-w-[1200px] mx-auto py-8 px-6 text-center">
      <button type="button" className="btn-pill" onClick={() => { window.location.href = '/my-trips.html'; }}>
        Leave a review
      </button>
    </div>
  );
}
