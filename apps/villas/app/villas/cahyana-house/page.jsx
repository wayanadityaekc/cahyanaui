import VillaDetail from '@/components/sections/VillaDetail';
import { VILLAS } from '@/lib/villas';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Cahyana House: 3-Bedroom Private Pool Villa in Ubud',
  description: 'Cahyana House is a 3-bedroom private house in north Ubud sleeping 6, with ensuite bathrooms, a private pool and full kitchen. Rated 4.96 from 221 Airbnb reviews.',
  path: '/villas/cahyana-house/',
  image: '/images/cahyana-house-pool-aerial-garden.jpg',
});

export default function CahyanaHousePage() {
  return <VillaDetail villa={VILLAS['cahyana-house']} />;
}
