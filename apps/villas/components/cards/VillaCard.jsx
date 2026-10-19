'use client';

import Link from 'next/link';
import { ArrowRight, BedDouble, Heart, Users, Waves } from 'lucide-react';
import { VillaCard as VillaCardBlock } from '@cahyana/ui';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { useSavedVillas } from '@/components/providers/SavedVillasProvider';

export default function VillaCard({ villa }) {
  const { format } = useCurrency();
  const { isSaved, toggleSave } = useSavedVillas();

  return (
    <VillaCardBlock
      villa={villa}
      className="[&>img]:scale-100!"
      linkAs={Link}
      place="Ubud, Bali"
      price={format(villa.nightlyRateIdr)}
      ctaIcon={<ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />}
      facts={[
        { icon: <Users strokeWidth={1.7} aria-hidden="true" />, label: `Up to ${villa.guests} guests`, lines: ['Up to', `${villa.guests} guests`], short: `${villa.guests} guests` },
        { icon: <BedDouble strokeWidth={1.7} aria-hidden="true" />, label: `${villa.bedrooms} bedrooms`, lines: [String(villa.bedrooms), 'bedrooms'], short: `${villa.bedrooms} beds` },
        { icon: <Waves strokeWidth={1.7} aria-hidden="true" />, label: 'Private pool', lines: ['Private', 'pool'], short: 'Private pool' },
      ]}
      saveIcon={<Heart className="w-[var(--icon-sm)] h-[var(--icon-sm)]" strokeWidth={1.8} aria-hidden="true" />}
      saved={isSaved(villa.slug)}
      onSave={() => toggleSave(villa.slug)}
    />
  );
}
