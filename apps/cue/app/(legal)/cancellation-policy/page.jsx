import LegalPage from '@/components/sections/LegalPage';
import JsonLd from '@/components/JsonLd';
import { LEGAL } from '@/content/shared/legal';

export const metadata = {
  title: 'Cancellation Policy | Cahyana Ubud Experience',
  description:
    'How to cancel or reschedule a booking with Cahyana Ubud Experience - free-cancellation window, deposits, refunds, no-shows, and bad-weather options.',
  alternates: { canonical: '/cancellation-policy.html' },
};

export default function Page() {
  return (
    <>
      <JsonLd page="cancellation-policy" />
      <LegalPage data={LEGAL['cancellation-policy']} />
    </>
  );
}
