import OurCompany from '@/components/sections/OurCompany';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Our Company | Ubud Private Villas',
  description: 'The Ubud family behind Cahyana House and Cahyana Tibuah - who we are, how to reach us, answers to common questions, and how we handle your data.',
  path: '/our-company/',
});

export default function OurCompanyPage() {
  return <OurCompany />;
}
