import OurCompany from '@/components/sections/OurCompany';

export const metadata = {
  title: 'Our Company | About, Contact & Policies - Cahyana Ubud',
  description:
    'Everything about Cahyana Ubud Experience in one place - who we are, how to reach our local Ubud team, and our booking, privacy, and cancellation policies.',
  alternates: { canonical: '/our-company.html' },
};

export default function Page() {
  return <OurCompany />;
}
