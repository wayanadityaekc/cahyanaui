'use client';

export default function ReviewCta({ label = 'Leave a review' }) {
  return (
    <button
      type="button"
      className="btn-pill"
      onClick={() => {
        window.location.href = '/my-trips.html';
      }}
    >
      {label}
    </button>
  );
}
