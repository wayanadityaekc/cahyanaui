import OurCompany from '@/components/sections/OurCompany';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Our Company | About, Contact, FAQ & Policies - Cahyana Ubud',
  description:
    'Everything about Cahyana Ubud Experience in one place - who we are, how to reach our local Ubud team, FAQ, and our booking, privacy, and cancellation policies.',
  alternates: { canonical: '/our-company.html' },
};

export default function Page() {
  return (
    <>
      <JsonLd page="our-company" />
      <OurCompany />
    </>
  );
}
