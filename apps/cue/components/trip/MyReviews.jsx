'use client';

import { useEffect } from 'react';
import { useAccount } from '@/state/AccountProvider';

// The guest's own reviews on the Settings page (WO3, Sep 2026: "Show the
// guest's own reviews on this page"). A private management list, not the
// public marketing feed - so plain rows rather than ReviewCard's fixed-box
// slider styling, and a status note the public never sees.
function fmtDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function MyReviews() {
  const { myReviews, refreshMyReviews } = useAccount();

  useEffect(() => {
    refreshMyReviews();
  }, [refreshMyReviews]);

  if (myReviews === null) return null; // still loading - say nothing rather than flash an empty state
  if (myReviews.length === 0) {
    return <p className="text-body text-muted m-0">You haven&apos;t written a review yet.</p>;
  }

  return (
    <ul className="list-none m-0 p-0" data-my-reviews>
      {myReviews.map((r) => {
        const n = Math.max(1, Math.min(5, parseInt(r.rating, 10) || 0));
        const stars = '★'.repeat(n) + '☆'.repeat(5 - n);
        return (
          <li key={r.id} className="py-3 [border-bottom:1px_solid_var(--line)] last:[border-bottom:none]">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="font-semibold text-small text-green">{r.service}</span>
              <span className="text-label text-muted">{fmtDate(r.created_at)}</span>
            </div>
            <div className="text-amber tracking-[2px] my-1" aria-label={`${n} out of 5`}>{stars}</div>
            <p className="m-0 text-body text-green leading-[var(--lh-body)]">{r.message}</p>
            {r.status !== 'approved' && (
              <span className="inline-block mt-1 text-label text-muted italic">Not currently shown on the site</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
