import TransferSection from '@/components/sections/TransferSection';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Bali Airport Transfer to Ubud | Private Car, Fixed Prices',
  description:
    'Private car transfers between Ubud and Bali\'s airport, beaches, and regions. Fixed prices per car, local drivers, door-to-door comfort.',
  alternates: { canonical: '/transfer.html' },
};

export default function Page() {
  return (
    <>
      <JsonLd page="transfer" />
      <TransferSection />
    </>
  );
}
