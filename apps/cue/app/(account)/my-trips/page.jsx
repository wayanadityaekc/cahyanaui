import MyTripsCart from '@/components/trip/MyTripsCart';
import JsonLd from '@/components/JsonLd';
import { RAIL_PAGE_SCROLL } from '@/components/ui/railClasses';

export const metadata = {
  title: 'My Trips | Cahyana Ubud Experience',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    // No pb-20 here: RailLayout scrollContent sizes the frame to the viewport and body already pads for the footer.
    <div className="tourprog">
      <JsonLd page="my-trips" />
    {/* Same rail shell as Our Company; no page-level h1 (the rail's "My trips" label is the title). */}
    <div className={RAIL_PAGE_SCROLL}>
      <MyTripsCart />
    </div>
    </div>
  );
}
