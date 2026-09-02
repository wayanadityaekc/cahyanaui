import MyTripsCart from '@/components/trip/MyTripsCart';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'My Trips | Cahyana Ubud Experience',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="tourprog">
      <JsonLd page="my-trips" />
    <section className="mytrips">
      <div className="mytrips__container">
        <h1 className="mytrips__title">My Trips</h1>
        <MyTripsCart />
      </div>
    </section>
    </div>
  );
}
