import ServiceReviews from '@/components/reviews/ServiceReviews';
import TransferSection from '@/components/sections/TransferSection';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Bali Private Car Transfers | Ubud to Canggu, Kuta, Amed',
  description:
    'Fixed price private car transfers between Ubud and Canggu, Seminyak, Kuta, Kintamani, Amed and more. Per car, not per person, with a local driver.',
  alternates: { canonical: '/transfer.html' },
};

export default function Page() {
  return (
    <>
      <JsonLd page="transfer" />
      <TransferSection />
      <ServiceReviews
        group="transfers"
        title="What guests say about our transfers"
        emptyText="No transfer reviews yet - be the first to tell other travellers how your ride went."
      />
    </>
  );
}
