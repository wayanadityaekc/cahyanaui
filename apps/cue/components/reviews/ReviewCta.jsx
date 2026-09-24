'use client';

import { BTN_PILL } from '@/components/ui/btnClasses';
import ReviewGate from './ReviewGate';

export default function ReviewCta({ label = 'Write review' }) {
  return <ReviewGate className={BTN_PILL}>{label}</ReviewGate>;
}
