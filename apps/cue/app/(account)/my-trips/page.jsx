import MyTripsCart from '@/components/trip/MyTripsCart';
import JsonLd from '@/components/JsonLd';
import { RAIL_PAGE_SCROLL } from '@/components/ui/railClasses';

export const metadata = {
  title: 'My Trips | Cahyana Ubud Experience',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="tourprog">
      <JsonLd page="my-trips" />
    <div className={RAIL_PAGE_SCROLL}>
      <MyTripsCart />
    </div>
    </div>
  );
}
