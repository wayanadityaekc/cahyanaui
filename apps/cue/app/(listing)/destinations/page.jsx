import ListingPage from '@/components/sections/ListingPage';
import { LISTINGS } from '@/content/shared/listings';

export const metadata = {
  title: 'Bali Attractions & Destinations from Ubud',
  description:
    'Explore Bali\'s temples, waterfalls, rice terraces, and beaches - the individual destinations behind our private day tours, each visitable from Ubud.',
  alternates: { canonical: '/destinations.html' },
};

export default function Page() {
  return <ListingPage data={LISTINGS.destinations} />;
}
