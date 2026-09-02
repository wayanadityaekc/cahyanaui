import MyTripsCart from '@/components/trip/MyTripsCart';

export const metadata = {
  title: 'My Trips | Cahyana Ubud Experience',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="tourprog">
    <section className="mytrips">
      <div className="mytrips__container">
        <h1 className="mytrips__title">My Trips</h1>
        <MyTripsCart />
      </div>
    </section>
    </div>
  );
}
