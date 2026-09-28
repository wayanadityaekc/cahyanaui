import AccountSettings from '@/components/trip/AccountSettings';
import JsonLd from '@/components/JsonLd';
import { RAIL_PAGE } from '@/components/ui/railClasses';

export const metadata = {
  title: 'Account Settings | Cahyana Ubud Experience',
  robots: { index: false, follow: false },
};

// Same rail shell as My Trips + Our Company now (Sep 2026, "make it like
// shadcn's sidebar-08" applied to all three account pages) - the title,
// description and the rest of the chrome moved into AccountSettings itself
// (SettingsShell), the same way My Trips' own h1 lives in its component
// rather than its page.jsx.
export default function Page() {
  return (
    <div className="tourprog pb-20">
      <JsonLd page="settings" />
      <div className={RAIL_PAGE}>
        <AccountSettings />
      </div>
    </div>
  );
}
