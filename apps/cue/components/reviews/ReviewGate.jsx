'use client';

import { useState } from 'react';
import { useAccount } from '@/state/AccountProvider';
import AuthModal from '@/components/account/AuthModal';
import ReviewModal from '@/components/reviews/ReviewModal';
import Modal from '@/components/ui/Modal';
import { BTN } from '@/components/ui/modalClasses';

// Shared "Leave a review" trigger for every bookable page (tour/attraction detail,
// reviews list) plus My Trips - opens the review popup right where it's clicked
// instead of sending the guest to My Trips first (Wayan, Sep 2026). Gates on the
// same two conditions the server does: signed in, and at least one completed
// booking still open for review (booking_ref + service pair not yet reviewed).
export default function ReviewGate({ className, children = 'Write review' }) {
  const { account, hydrated, reviewableItems } = useAccount();
  const [authOpen, setAuthOpen] = useState(false);
  const [blockedOpen, setBlockedOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const onClick = () => {
    if (!hydrated) return;
    if (!account) { setAuthOpen(true); return; }
    if (!reviewableItems.length) { setBlockedOpen(true); return; }
    setReviewOpen(true);
  };

  return (
    <>
      <button type="button" className={className} onClick={onClick}>
        {children}
      </button>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <Modal open={blockedOpen} onClose={() => setBlockedOpen(false)} title="Leave a Review">
        <p className="m-0 text-muted text-small leading-[1.5]">
          You&apos;ll be able to leave a review once you&apos;ve completed a booking with us.
        </p>
        <button type="button" className={`${BTN} mt-4`} onClick={() => setBlockedOpen(false)}>
          Got it
        </button>
      </Modal>

      <ReviewModal
        open={reviewOpen}
        prefill={{ name: (account && account.name) || '', items: reviewableItems }}
        onClose={() => setReviewOpen(false)}
      />
    </>
  );
}
