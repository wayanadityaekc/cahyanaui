import MyTripsCart from '@/components/trip/MyTripsCart';
import JsonLd from '@/components/JsonLd';
import { RAIL_PAGE } from '@/components/ui/railClasses';

export const metadata = {
  title: 'My Trips | Cahyana Ubud Experience',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="tourprog pb-20">
      <JsonLd page="my-trips" />
    {/* Same shell as Our Company (rail + content). Wayan, Sep 2026: "my trips
        punya dua judul numpuk, hapus yang gede, sisain yang kecil" - the big
        page h1 that used to sit here duplicated the rail's own "My trips"
        label right below it. Dropped; Our Company (same shell) has never had
        a page-level h1 either - each section carries its own heading. */}
    <div className={RAIL_PAGE}>
      <MyTripsCart />
    </div>
    </div>
  );
}
