import MyBookingCart from '@/components/trip/MyBookingCart';

// noindex: the page shows one guest's own booking from their browser, so a crawler only sees the empty state.
export const metadata = {
  title: 'My Booking | Ubud Private Villas',
  robots: { index: false, follow: true },
};

export default function MyBookingPage() {
  return <MyBookingCart />;
}
