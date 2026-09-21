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
    {/* Same shell as Our Company (rail + content). The h1 sits ABOVE the frame
        rather than inside the content column: it names the whole page and all
        three sections sit under it - in the column it would read as one
        section's title. */}
    <div className={RAIL_PAGE}>
      <h1 className="font-head font-medium tracking-[-0.01em] text-display leading-[var(--lh-heading)] text-green m-0 mb-[1.2rem]">My Trips</h1>
      <MyTripsCart />
    </div>
    </div>
  );
}
