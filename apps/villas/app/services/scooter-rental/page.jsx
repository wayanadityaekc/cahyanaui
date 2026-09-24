import ServiceDetail from '@/components/sections/ServiceDetail';

// Scooter Rental is a genuinely new offering with no real content yet.
// Every specific (scooter types, daily rate, deposit/requirements) below is
// a clearly-flagged placeholder — CEK WAYAN — matching the sister CUE
// codebase's convention for provisional prices. Nothing here should read as
// an authoritative, bookable rate until Wayan confirms it.
export const metadata = {
  title: 'Scooter Rental in Ubud | Ubud Private Villas by Cahyana Ubud',
  description: 'Rent a scooter for your stay at Cahyana House or Cahyana Tibuah — delivered to your villa. Rates and terms to be confirmed.',
};

export default function ScooterRentalPage() {
  return (
    <ServiceDetail
      serviceId="scooter-rental"
      kicker="At Your Villa"
      title="Scooter Rental"
      subtitle="A scooter delivered to your villa, so you can explore Ubud at your own pace."
      heroImg="https://picsum.photos/seed/scooter9/1800/900"
      heroAlt="Scooter parked outside a villa in Ubud"
      glance={[
        // CEK WAYAN — placeholder facts, confirm real details before this goes live
        { label: 'Delivery', value: 'To your villa' },
        { label: 'Rental', value: 'Daily or per stay' },
        { label: 'Daily rate', value: 'TBC — ask us' },
        { label: 'Deposit', value: 'TBC — ask us' },
      ]}
      sections={[
        {
          heading: 'How it works',
          body: [
            "Tell us you'd like a scooter when you book, or any time during your stay. One is dropped off at the villa with a helmet, and picked up again when you check out.",
          ],
          note: 'CEK WAYAN — placeholder description. Confirm: which scooter models are actually available, whether an International Driving Permit or Indonesian licence is required, minimum age, and how the deposit works before this copy goes live.',
        },
        {
          heading: 'Scooter types',
          list: [
            // CEK WAYAN — placeholder line-up, confirm real models/rates
            { title: 'Automatic scooter (110-125cc)', desc: 'Rate to be confirmed — ask us for the current daily price.' },
            { title: 'Larger automatic (150cc+)', desc: 'Rate to be confirmed — ask us for the current daily price.' },
          ],
        },
        {
          heading: 'Good to know',
          body: [
            'CEK WAYAN — this section needs real, confirmed requirements (licence, helmet law, insurance/liability, fuel policy, what happens if the scooter is damaged) before publishing. Placeholder text only, do not treat as final terms.',
          ],
        },
      ]}
      aside={{
        title: 'Scooter rental — rates TBC',
        facts: ['Delivered to your villa', 'Helmet included', 'Daily rate: ask us', 'Deposit: ask us'],
        ctaLabel: 'Ask about scooter rental',
        otherServices: [
          { href: '/services/breakfast', label: 'Breakfast' },
          { href: '/services/spa', label: 'Spa & Massage' },
          { href: '/services/live-dinner', label: 'Live Dinner' },
        ],
      }}
      bottomHeading="Want a scooter for your stay?"
      bottomText="Message us with your dates and we'll confirm availability and the current rate."
    />
  );
}
