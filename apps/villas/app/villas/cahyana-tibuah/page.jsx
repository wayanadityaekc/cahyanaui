import VillaDetail from '@/components/sections/VillaDetail';
import { VILLAS } from '@/lib/villas';
import { JsonLd } from '@cahyana/ui';
import { pageMeta } from '@/lib/seo';
import { breadcrumbList, villaCrumbs, villaSchema } from '@/lib/schema';

export const metadata = pageMeta({
  title: 'Cahyana Tibuah: 2-Bedroom Ricefield Pool Villa in Ubud',
  description: 'Cahyana Tibuah is a 2-bedroom villa in the rice fields of north Ubud sleeping 4, with a private pool and ensuite bathrooms. Rated 4.96 from 85 Airbnb reviews.',
  path: '/villas/cahyana-tibuah/',
  image: '/images/cahyana-tibuah-pool-day-garden-view-1.jpg',
});

export default function CahyanaTibuahPage() {
  const villa = VILLAS['cahyana-tibuah'];
  return (
    <>
      <JsonLd data={[villaSchema(villa), breadcrumbList(villaCrumbs(villa))]} />
      <VillaDetail villa={villa} />
    </>
  );
}
