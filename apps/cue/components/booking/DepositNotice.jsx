'use client';

import { ShieldCheck } from 'lucide-react';
import { withSymbol } from '@/components/Price';
import { DEPOSIT_COPY, depositFallbackDisplay, depositZone } from '@/lib/deposit';

// The deposit block in the booking summary: what the guest pays now, what they
// pay the driver, and what happens if they cancel.
//
// CHECKPOINT 1 - display only. No DOKU call, no session, no payment state. The
// amount comes from the flat zone tiers in lib/deposit.js.
//
// `display` is the amount already formatted in the guest's own currency. Until
// the server sends one it falls back to the USD tier, the same pattern <Price>
// uses while the catalog loads - rather than converting here, which would mean a
// second, client-side copy of currency logic the server already owns.
const ROW = 'flex justify-between items-baseline gap-4 py-[0.35rem] text-body';
const AMOUNT = 'font-semibold text-amber text-[1rem] whitespace-nowrap';
const MUTED = 'text-muted text-small text-right';
const NOTE = 'flex items-start gap-2 mt-[0.6rem] text-small text-muted leading-[var(--lh-body)]';

export default function DepositNotice({ stay, transferRoute, display }) {
  const zone = depositZone({ stay, transferRoute });
  const amount = display || depositFallbackDisplay({ stay, transferRoute });

  return (
    <div className="my-5 p-4 rounded-md bg-cream [border:1px_solid_var(--line)]">
      <div className={ROW}>
        <span className="font-semibold text-green">{DEPOSIT_COPY.label}</span>
        <span className={AMOUNT}>{withSymbol(amount)}</span>
      </div>
      <div className={ROW}>
        <span className="text-muted">{DEPOSIT_COPY.restLabel}</span>
        <span className={MUTED}>{DEPOSIT_COPY.restValue}</span>
      </div>

      {/* Why this guest's tier is what it is. Stated plainly so an outside-Ubud
          guest seeing the higher number knows it is about distance, not an
          upsell. */}
      <p className="mt-[0.5rem] text-small text-muted leading-[var(--lh-body)]">
        {zone === 'ubud'
          ? 'Flat deposit for pickups in Ubud and nearby.'
          : 'Flat deposit for pickups outside Ubud - it covers your driver getting to you.'}
      </p>

      <p className="mt-[0.6rem] text-small text-green leading-[var(--lh-body)]">
        {DEPOSIT_COPY.cancel}{' '}
        <span className="text-muted">{DEPOSIT_COPY.late}</span>{' '}
        <a className="text-gold-d underline underline-offset-2" href="/our-company.html#cancellation">
          Cancellation policy
        </a>
      </p>

      <p className={NOTE}>
        <ShieldCheck className="w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 mt-[0.1rem] text-cta" strokeWidth={1.7} aria-hidden="true" />
        <span>{DEPOSIT_COPY.secure}</span>
      </p>
    </div>
  );
}
