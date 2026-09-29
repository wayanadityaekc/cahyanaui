'use client';

import { BTN_PILL } from '@/components/ui/btnClasses';
import ReviewGate from './ReviewGate';

// Write-review band that opens ReviewGate in place; keep the 'review-cta' class, the check-detail gate needs it.
export default function ReviewCtaBand() {
  return (
    <div className="review-cta max-w-[1200px] mx-auto py-8 px-6 text-center">
      <ReviewGate className={BTN_PILL}>Write review</ReviewGate>
    </div>
  );
}
