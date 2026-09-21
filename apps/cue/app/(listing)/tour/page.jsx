import ListingPage from '@/components/sections/ListingPage';
import JsonLd from '@/components/JsonLd';
import { LISTINGS } from '@/content/shared/listings';

export const metadata = {
  title: 'Bali Tour Programs from Ubud | Private Day Tours',
  description:
    'Private, customizable Bali day tours from Ubud - rice terraces, temples, waterfalls, and beaches with local drivers. Only a $10 deposit to book.',
  alternates: { canonical: '/tour.html' },
};

export default function Page() {
  return (
    <>
      <JsonLd page="tour" />
      <ListingPage data={LISTINGS.tour} />
    </>
  );
}
