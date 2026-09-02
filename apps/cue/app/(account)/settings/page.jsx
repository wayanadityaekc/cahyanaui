import AccountSettings from '@/components/trip/AccountSettings';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Account Settings | Cahyana Ubud Experience',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <JsonLd page="settings" />
      <section className="info account-settings">
      <div className="info__container account-page">
        <h1 className="account-page__title">Account Settings</h1>
        <p className="account-page__lead">Update your details and saved trip preferences.</p>
        <AccountSettings />
      </div>
    </section>
  </>
  );
}
