import ListingPage from '@/components/sections/ListingPage';
import JsonLd from '@/components/JsonLd';
import { LISTINGS } from '@/content/shared/listings';
import { withInclLabels } from '@/lib/tourIndex';

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
      <ListingPage data={withInclLabels(LISTINGS.destinations)} />
    </>
  );
}
