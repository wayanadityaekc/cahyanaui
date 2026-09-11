import AllPrograms from '@/components/sections/AllPrograms';

export const metadata = {
  title: 'All Bali Programs from Ubud | Tours, Charter & Transfers',
  description:
    'Compare every Cahyana program in one place - private Bali tours, experiences, car charter, airport transfers, and single destinations. Fixed prices, your own local driver.',
  alternates: { canonical: '/programs.html' },
  // Not ready to publish yet - keep it off search and unlinked from the UI.
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AllPrograms />;
}
