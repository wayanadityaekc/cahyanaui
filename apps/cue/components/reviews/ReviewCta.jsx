'use client';

import { BTN_PILL } from '@/components/ui/btnClasses';
import ReviewGate from './ReviewGate';

export default function ReviewCta({ label = 'Leave a review' }) {
  return <ReviewGate className={BTN_PILL}>{label}</ReviewGate>;
}
