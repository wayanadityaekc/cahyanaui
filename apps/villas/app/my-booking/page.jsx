import MyBookingCart from '@/components/trip/MyBookingCart';

// noindex: this page only ever shows one guest's own in-progress booking, read
// out of their browser. There is nothing here for a search engine to index, and
// a crawler would only ever see the empty state.
export const metadata = {
  title: 'My Booking | Ubud Private Villas',
  robots: { index: false, follow: true },
};

export default function MyBookingPage() {
  return <MyBookingCart />;
}
