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
      <div className="info__container !max-w-[640px]">
        <h1 className="font-head font-medium tracking-[-0.01em] text-display leading-[var(--lh-heading)] text-green m-0 mb-[0.3rem]">Account Settings</h1>
        <p className="text-muted text-body m-0 mb-[1.6rem]">Update your details and saved trip preferences.</p>
        <AccountSettings />
      </div>
    </section>
  </>
  );
}
