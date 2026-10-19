import MyBookingCart from '@/components/trip/MyBookingCart';

export const metadata = {
  title: 'My Booking | Ubud Private Villas',
  robots: { index: false, follow: true },
};

export default function MyBookingPage() {
  return <MyBookingCart />;
}
