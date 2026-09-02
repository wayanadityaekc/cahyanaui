import LegalPage from '@/components/sections/LegalPage';
import { LEGAL } from '@/content/shared/legal';

export const metadata = {
  title: 'Terms &amp; Conditions | Cahyana Ubud Experience',
  description:
    'The terms and conditions for booking tours, transfers, and experiences with Cahyana Ubud Experience in Ubud, Bali - booking, payment, changes, and your responsibilities.',
  alternates: { canonical: '/terms-conditions.html' },
};

export default function Page() {
  return <LegalPage data={LEGAL['terms-conditions']} />;
}
