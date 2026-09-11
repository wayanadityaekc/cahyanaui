import MyTripsCart from '@/components/trip/MyTripsCart';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'My Trips | Cahyana Ubud Experience',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="tourprog pb-20">
      <JsonLd page="my-trips" />
    {/* .mytrips/.mytrips__container/.mytrips__title -> utilities (migrasi Fase 2) */}
    <section className="pt-[calc(var(--nav-h,57.6px)_+_2.2rem)] px-0 pb-14">
      <div className="w-[min(680px,92%)] mx-auto">
        <h1 className="font-head font-medium tracking-[-0.01em] text-display leading-[var(--lh-heading)] text-green m-0 mb-[1.2rem]">My Trips</h1>
        <MyTripsCart />
      </div>
    </section>
    </div>
  );
}
