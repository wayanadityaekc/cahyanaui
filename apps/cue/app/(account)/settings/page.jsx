import AccountSettings from '@/components/trip/AccountSettings';
import JsonLd from '@/components/JsonLd';
import { RAIL_PAGE_SCROLL } from '@/components/ui/railClasses';

export const metadata = {
  title: 'Account Settings | Cahyana Ubud Experience',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="tourprog">
      <JsonLd page="settings" />
      <div className={RAIL_PAGE_SCROLL}>
        <AccountSettings />
      </div>
    </div>
  );
}
