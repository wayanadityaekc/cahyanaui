'use client';

import { useEffect, useState } from 'react';
import { Button, PlanList, SectionHeading } from '@cahyana/ui';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { API_BASE } from '@/lib/constants';
import { CHARTER_CARD, CHARTER_PLANS } from '@/content/charter';

// CUE's charter price per tier, in the guest's currency; null until the API answers, so no price is ever guessed.
function useCharterPrices(currency = 'USD') {
  const [prices, setPrices] = useState(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const response = await fetch(`${API_BASE}/pricing/catalog?currency=${encodeURIComponent(currency)}`);
        if (!response.ok) return;
        const data = await response.json();
        if (!alive || !data || !Array.isArray(data.charters) || data.currency !== currency) return;
        const byTier = {};
        data.charters.forEach((row) => { byTier[row.duration] = row.display; });
        setPrices(byTier);
      } catch (e) {
        // API down: prices stay "-" and the card still links to CUE.
      }
    }
    setPrices(null);
    load();
    return () => { alive = false; };
  }, [currency]);

  return prices;
}

// G8: CUE's charter plans with live prices, linking out to book on CUE. "compact" is the My Booking card version.
export default function CharterCard({ compact = false }) {
  const { currency, formatAmount } = useCurrency();
  const prices = useCharterPrices(currency);
  const plans = CHARTER_PLANS.map(({ dur, name, badge, sub }) => {
    const amount = prices && typeof prices[dur] === 'number' ? prices[dur] : null;
    return { id: dur, name, badge, sub, price: amount == null ? null : formatAmount(amount) };
  });

  return (
    <div data-charter-card>
      {compact ? (
        <>
          <h2 className="text-h3 font-semibold text-gold">{CHARTER_CARD.title}</h2>
          <p className="mt-1 mb-4 text-body text-muted">{CHARTER_CARD.bookingNote}</p>
        </>
      ) : (
        <SectionHeading eyebrow={CHARTER_CARD.eyebrow} title={CHARTER_CARD.title} lede={CHARTER_CARD.lede} className="mb-6" />
      )}
      <PlanList plans={plans} label="Charter plans" />
      <div className="mt-5">
        <Button as="a" href={CHARTER_CARD.href} target="_blank" rel="noopener" data-charter-cta>
          {CHARTER_CARD.cta}
        </Button>
      </div>
    </div>
  );
}
