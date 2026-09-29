import ServiceReviews from '@/components/reviews/ServiceReviews';
import { CHARTER_SERVICE } from '@/lib/constants';
import CharterSection from '@/components/sections/CharterSection';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Private Car Charter Bali | Half & Full Day',
  description:
    'Charter a private car with driver in Bali from Ubud - half day (5 hours) or full day (10 hours), extend by the hour, petrol included. Pick-up from anywhere on the island.',
  alternates: { canonical: '/charter.html' },
};

export default function Page() {
  return (
    <>
      <JsonLd page="charter" />
      <CharterSection />
      {/* Every charter booking stores the same service key (CHARTER_SERVICE), so one query covers the page. */}
      <ServiceReviews
        service={CHARTER_SERVICE}
        title="What guests say about our charters"
        emptyText="No charter reviews yet - be the first to tell other travellers how your day went."
      />
    </>
  );
}
