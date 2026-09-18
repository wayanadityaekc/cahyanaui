import TransferSection from '@/components/sections/TransferSection';
import JsonLd from '@/components/JsonLd';

// SEO: this page and /airport-transfer both used to open on "Bali Airport
// Transfer", so they competed for one query and Google picked between them -
// and the one holding every internal link (this one, via the navbar) was also
// the thinner of the two. Sep 2026, Wayan picked the split: /airport-transfer
// owns "bali airport transfer", this page owns every OTHER route. So the title
// and H1 here name routes, not the airport. The airport route card stays in the
// list below (a guest scanning routes expects to see its price) with a line
// pointing at the page that takes a flight number.
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
    </>
  );
}
