import VillaDetail from '@/components/sections/VillaDetail';
import { VILLAS } from '@/lib/villas';
import { JsonLd } from '@cahyana/ui';
import { buildPageMeta } from '@/lib/seo';
import { buildBreadcrumbList, villaCrumbs, buildVillaSchema } from '@/lib/schema';

export const metadata = buildPageMeta({
  title: 'Cahyana House: 3-Bedroom Private Pool Villa in Ubud',
  description:
    'Cahyana House is a 3-bedroom private house in north Ubud sleeping 6, with ensuite bathrooms, a private pool and full kitchen. Rated 4.96 from 221 Airbnb reviews.',
  path: '/villas/cahyana-house/',
  image: '/images/cahyana-house-pool-aerial-garden.jpg',
});

export default function CahyanaHousePage() {
  const villa = VILLAS['cahyana-house'];
  return (
    <>
      <JsonLd data={[buildVillaSchema(villa), buildBreadcrumbList(villaCrumbs(villa))]} />
      <VillaDetail villa={villa} />
    </>
  );
}
