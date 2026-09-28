import MyTripsCart from '@/components/trip/MyTripsCart';
import JsonLd from '@/components/JsonLd';
import { RAIL_PAGE } from '@/components/ui/railClasses';

export const metadata = {
  title: 'My Trips | Cahyana Ubud Experience',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    // No pb-20 here (unlike other .tourprog pages): RailLayout's scrollContent
    // mode caps the frame to fit the viewport and the fixed footer already
    // reserves its own space via body's has-[.footerbar] padding - a second
    // 80px on top of both is what pushed the page 80px past 100dvh and let
    // the whole page scroll instead of just the frame's content.
    <div className="tourprog">
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
