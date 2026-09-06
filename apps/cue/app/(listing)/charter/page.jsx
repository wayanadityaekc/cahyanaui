import CharterSection from '@/components/sections/CharterSection';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Private Car Charter Bali | Half & Full Day',
  description:
    'Charter a private car with driver in Bali from Ubud - half day (5 hours) or full day (10 hours), extend by the hour, petrol included. Pick-up from anywhere on the island.',
  alternates: { canonical: '/charter.html' },
};

export default function Page() {
  return (
    <>
      <JsonLd page="charter" />
      <CharterSection />
    </>
  );
}
