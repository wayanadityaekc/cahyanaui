import ServiceDetail from '@/components/sections/ServiceDetail';

export const metadata = {
  title: 'In-Villa Spa & Massage in Ubud | Ubud Private Villas by Cahyana Ubud',
  description: 'Balinese massage, aromatherapy, couples treatments and flower baths, delivered to your private villa in Ubud. Prices upfront.',
};

export default function SpaPage() {
  return (
    <ServiceDetail
      kicker="At Your Villa"
      title="Spa & Massage"
      subtitle="Local therapists, your own villa, no taxi afterwards."
      heroImg="https://picsum.photos/seed/spa9/1800/900"
      heroAlt="Massage table set up beside the villa pool"
      glance={[
        { label: 'Where', value: 'Poolside or bedroom' },
        { label: 'Book', value: 'Same day, with notice' },
        { label: 'Therapists', value: 'From the village' },
        { label: 'Price', value: 'Ask us' },
      ]}
      sections={[
        {
          heading: 'How it works',
          body: [
            "Our therapists are from the village, not an agency. They bring the table, the oils, the towels and the music, set up wherever you want, and take it all away after. You don't leave the villa and you don't get dressed for it.",
          ],
        },
        {
          heading: 'Treatments',
          list: [
            { title: 'Balinese massage', desc: 'The traditional one - firm, oil-based, 60 or 90 minutes.' },
            { title: 'Aromatherapy massage', desc: 'Lighter pressure, essential oils.' },
            { title: 'Couples massage', desc: 'Two therapists, side by side at the pool.' },
            { title: 'Foot reflexology', desc: 'Good after a long day of temples and stairs.' },
            { title: 'Body scrub & flower bath', desc: 'Scrub, rinse, then a bath full of frangipani.' },
          ],
          note: 'Message us for current prices and to book a time - treatments are arranged for staying guests.',
        },
      ]}
      gallery={[
        { src: 'https://picsum.photos/seed/sp1c/700/500', alt: 'Massage table set up beside the pool' },
        { src: 'https://picsum.photos/seed/sp2c/700/500', alt: 'Flower bath with frangipani petals' },
        { src: 'https://picsum.photos/seed/sp3c/700/500', alt: 'Aromatherapy oils and folded towels' },
      ]}
      aside={{
        title: 'Spa at your villa',
        facts: ['Therapist comes to you', 'Poolside or indoors', 'Book on the day, with notice', 'For staying guests'],
        ctaLabel: 'Book a treatment',
        otherServices: [
          { href: '/services/breakfast', label: 'Breakfast' },
          { href: '/services/live-dinner', label: 'Live Dinner' },
        ],
      }}
      bottomHeading="Book the villa, then the massage"
      bottomText="Treatments are for staying guests. Start with the dates."
    />
  );
}
