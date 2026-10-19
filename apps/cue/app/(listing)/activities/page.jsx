import ListingPage from '@/components/sections/ListingPage';
import JsonLd from '@/components/JsonLd';
import { LISTINGS } from '@/content/shared/listings';
import { addAttractionCards } from '@/lib/tourIndex';
import { ATTRACTION_CONTENT } from '@/content/attractions';

export const metadata = {
  title: 'Bali Activities & Performances in Ubud | ATV, Rafting, Kecak',
  description:
    'Authentic Bali activities from Ubud - ATV rides, Ayung rafting, jungle swings, Mount Batur sunrise, Kecak and Barong dance. Transparent prices.',
  alternates: { canonical: '/activities.html' },
};

export default function Page() {
  return (
    <>
      <JsonLd page="activities" />
      <ListingPage data={addAttractionCards(LISTINGS.activities, ATTRACTION_CONTENT)} page="activities" />
    </>
  );
}
