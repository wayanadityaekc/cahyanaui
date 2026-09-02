import LegalPage from '@/components/sections/LegalPage';
import { LEGAL } from '@/content/shared/legal';

export const metadata = {
  title: 'Privacy Policy | Cahyana Ubud Experience',
  description:
    'How Cahyana Ubud Experience collects, uses, and protects your information when you book a tour, transfer, or experience in Ubud, Bali.',
  alternates: { canonical: '/privacy-policy.html' },
};

export default function Page() {
  return <LegalPage data={LEGAL['privacy-policy']} />;
}
