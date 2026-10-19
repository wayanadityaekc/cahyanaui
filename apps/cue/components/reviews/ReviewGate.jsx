'use client';

import { useState } from 'react';
import { useAccount } from '@/state/AccountProvider';
import AuthModal from '@/components/account/AuthModal';
import ReviewModal from '@/components/reviews/ReviewModal';
import Modal from '@/components/ui/Modal';
import { BTN } from '@/components/ui/modalClasses';

export default function ReviewGate({ className, children = 'Write review' }) {
  const { account, hydrated, reviewableItems } = useAccount();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBlockedOpen, setIsBlockedOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  function onClick() {
    if (!hydrated) return;
    if (!account) {
      setIsAuthOpen(true);
      return;
    }
    if (!reviewableItems.length) {
      setIsBlockedOpen(true);
      return;
    }
    setIsReviewOpen(true);
  }

  return (
    <>
      <button type="button" className={className} onClick={onClick}>
        {children}
      </button>

      <AuthModal open={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <Modal open={isBlockedOpen} onClose={() => setIsBlockedOpen(false)} title="Leave a Review">
        <p className="m-0 text-muted text-small leading-[1.5]">
          You&apos;ll be able to leave a review once you&apos;ve completed a booking with us.
        </p>
        <button type="button" className={`${BTN} mt-4`} onClick={() => setIsBlockedOpen(false)}>
          Got it
        </button>
      </Modal>

      <ReviewModal
        open={isReviewOpen}
        prefill={{ name: (account && account.name) || '', items: reviewableItems }}
        onClose={() => setIsReviewOpen(false)}
      />
    </>
  );
}
