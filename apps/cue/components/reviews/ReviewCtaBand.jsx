'use client';

import { BTN_PILL } from '@/components/ui/btnClasses';
import ReviewGate from './ReviewGate';

export default function ReviewCtaBand() {
  return (
    <div className="review-cta max-w-[1200px] mx-auto py-8 px-6 text-center">
      <ReviewGate className={BTN_PILL}>Write review</ReviewGate>
    </div>
  );
}
