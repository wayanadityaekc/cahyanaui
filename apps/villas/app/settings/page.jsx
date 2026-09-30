import SettingsPage from '@/components/account/SettingsPage';

// noindex: the page shows one signed-in guest's own details, so a crawler only sees the sign-in prompt.
export const metadata = {
  title: 'Account Settings | Ubud Private Villas',
  robots: { index: false, follow: true },
};

export default function Page() {
  return <SettingsPage />;
}
