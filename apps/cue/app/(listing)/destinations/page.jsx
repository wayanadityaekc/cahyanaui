import ListingPage from '@/components/sections/ListingPage';
import JsonLd from '@/components/JsonLd';
import { LISTINGS } from '@/content/shared/listings';
import { withAttractionCards } from '@/lib/tourIndex';
import { ATTRACTION_CONTENT } from '@/content/attractions';

export const metadata = {
  title: 'Bali Attractions & Destinations from Ubud',
  description:
    'Explore Bali\'s temples, waterfalls, rice terraces, and beaches - the individual destinations behind our private day tours, each visitable from Ubud.',
  alternates: { canonical: '/destinations.html' },
};

export default function Page() {
  return (
    <>
      <JsonLd page="destinations" />
      <ListingPage data={withAttractionCards(LISTINGS.destinations, ATTRACTION_CONTENT)} />
    </>
  );
}
