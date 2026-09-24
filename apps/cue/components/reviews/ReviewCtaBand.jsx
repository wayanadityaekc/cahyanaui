'use client';

import { BTN_PILL } from '@/components/ui/btnClasses';
import ReviewGate from './ReviewGate';

// Ported from initReviewCta: shown on any bookable page. Opens the review popup
// right there (ReviewGate) - signed-in guests with a reviewable booking get the
// checklist, others get a sign-in prompt or a short "not yet" message (Sep 2026,
// was a redirect to My Trips before ReviewGate existed). "review-cta" kept as an
// inert marker className (no styling left on it) - it's the check-detail.js
// CI-gate marker ("Leave a review band"); layout is Tailwind utilities (TW-A5, #326).
export default function ReviewCtaBand() {
  return (
    <div className="review-cta max-w-[1200px] mx-auto py-8 px-6 text-center">
      <ReviewGate className={BTN_PILL}>Write review</ReviewGate>
    </div>
  );
}
