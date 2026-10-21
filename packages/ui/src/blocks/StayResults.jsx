import { Check } from 'lucide-react';
import { cn } from '../lib/cn.js';
import Button from '../primitives/Button.jsx';
import { CAPS } from '../primitives/Eyebrow.jsx';

const STATUS_LINE = {
  checking: 'Checking the calendar...',
  taken: 'Not free on these dates',
  unknown: "We can't confirm online right now",
};

function StatusTag({ status }) {
  if (status === 'free') {
    return (
      <span className={cn(CAPS, 'inline-flex items-center gap-1 text-gold')}>
        <Check className="w-3.5 h-3.5" aria-hidden="true" />
        Available
      </span>
    );
  }
  if (status === 'taken') return <span className={cn(CAPS, 'text-muted')}>Booked</span>;
  if (status === 'small') return <span className={cn(CAPS, 'text-muted')}>Too small</span>;
  return null;
}

export default function StayResults({ items = [], linkAs = 'a', className }) {
  if (!items.length) {
    return <p className="text-small text-muted">Sorry, we could not load this information. Please try again.</p>;
  }
  return (
    <ul className={cn('grid gap-5 sm:grid-cols-2', className)}>
      {items.map(
        ({ key, image, alt = '', name, meta, status, price, priceNote, note, detailsHref, onReserve, help }) => {
          const isDimmed = status === 'taken' || status === 'small';
          const line = status === 'small' ? note : STATUS_LINE[status];
          return (
            <li key={key} className="flex flex-col" data-stay={key} data-status={status}>
              <img
                src={image}
                alt={alt}
                className={cn('w-full aspect-[16/10] object-cover', isDimmed && 'opacity-55')}
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <h3 className={cn('text-h3 font-semibold text-gold', isDimmed && 'text-muted')}>{name}</h3>
                <StatusTag status={status} />
              </div>
              <p className="text-small text-muted">{meta}</p>
              <p className="text-small mt-1 mb-3" aria-live="polite">
                {status === 'free' ? (
                  <>
                    <span className="text-gold font-semibold">{price}</span>
                    <span className="text-muted"> · {priceNote}</span>
                  </>
                ) : (
                  <span className="text-muted">{line}</span>
                )}
              </p>
              <div className="mt-auto flex gap-2 [&>*]:flex-1">
                <Button as={linkAs} variant="ghost" href={detailsHref}>
                  Details
                </Button>
                {status === 'free' ? <Button onClick={onReserve}>Reserve</Button> : null}
                {status === 'unknown' && help ? help : null}
              </div>
            </li>
          );
        },
      )}
    </ul>
  );
}
