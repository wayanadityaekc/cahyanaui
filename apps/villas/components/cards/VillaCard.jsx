'use client';

import Link from 'next/link';
import { ArrowRight, BedDouble, Heart, Users, Waves } from 'lucide-react';
import { VillaCard as VillaCardBlock } from '@cahyana/ui';
import { useCurrency } from '@/components/providers/CurrencyProvider';

// The block lives in @cahyana/ui (blocks/VillaCard.jsx). This file supplies the
// three things the library must not hold: the formatted price (which comes from
// this app's currency provider), the facts (which are editorial), and the icons.
//
// Lucide, per CUE's rule that new icons come from the set and are never drawn by
// hand again. The block sizes them itself, so the row can shrink them on a
// phone without this file knowing about breakpoints.
export default function VillaCard({ villa }) {
  const { format } = useCurrency();

  return (
    <VillaCardBlock
      villa={villa}
      linkAs={Link}
      place="Ubud, Bali"
      price={format(villa.nightlyRate)}
      ctaIcon={<ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />}
      /* Three shapes of one fact, each for a measured reason: `lines` (two
         lines) is what makes them fit beside the price on desktop, `short` is
         the one-line phone version - "3 beds", not "3 bedrooms", because the
         full words came to 239px inside a 248px row at 320 - and `label` is
         the plain fallback and the React key. */
      facts={[
        { icon: <Users strokeWidth={1.7} aria-hidden="true" />, label: `Up to ${villa.guests} guests`, lines: ['Up to', `${villa.guests} guests`], short: `${villa.guests} guests` },
        { icon: <BedDouble strokeWidth={1.7} aria-hidden="true" />, label: `${villa.bedrooms} bedrooms`, lines: [String(villa.bedrooms), 'bedrooms'], short: `${villa.bedrooms} beds` },
        { icon: <Waves strokeWidth={1.7} aria-hidden="true" />, label: 'Private pool', lines: ['Private', 'pool'], short: 'Private pool' },
      ]}
      /* THE HEART IS IN THE MOCK AND IT IS NOT WIRED TO ANYTHING YET. It is
         drawn because Wayan drew it; tapping it does nothing until there is
         somewhere for a saved villa to live. Say the word and it becomes real
         (localStorage now, the guest's account once villa bookings reach the
         API) - or drop this prop and the control is not drawn at all. */
      saveIcon={<Heart className="w-[var(--icon-sm)] h-[var(--icon-sm)]" strokeWidth={1.8} aria-hidden="true" />}
    />
  );
}
