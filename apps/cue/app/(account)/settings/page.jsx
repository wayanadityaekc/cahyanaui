import AccountSettings from '@/components/trip/AccountSettings';
import JsonLd from '@/components/JsonLd';
import { RAIL_PAGE_SCROLL } from '@/components/ui/railClasses';

export const metadata = {
  title: 'Account Settings | Cahyana Ubud Experience',
  robots: { index: false, follow: false },
};

// Rail shell like My Trips and Our Company; the title and chrome live in AccountSettings, not here.
export default function Page() {
  return (
    // No pb-20: the scroll frame calc and the footer's body padding already give bottom clearance.
    <div className="tourprog">
      <JsonLd page="settings" />
      <div className={RAIL_PAGE_SCROLL}>
        <AccountSettings />
      </div>
    </div>
  );
}
