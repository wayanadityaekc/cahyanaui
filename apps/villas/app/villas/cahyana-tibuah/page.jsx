import VillaDetail from '@/components/sections/VillaDetail';
import { VILLAS } from '@/lib/villas';

export const metadata = {
  title: "Cahyana Tibuah · 2 Bedroom Ricefield Villa with Private Pool in Ubud",
  description: 'Cahyana Tibuah is a 2-bedroom villa in the rice fields of north Ubud sleeping 4, with a private pool, ensuite bathrooms and self check-in. Rated 4.96 from 85 Airbnb reviews.',
};

export default function CahyanaTibuahPage() {
  return <VillaDetail villa={VILLAS['cahyana-tibuah']} />;
}
