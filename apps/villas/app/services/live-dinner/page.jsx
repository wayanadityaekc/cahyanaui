import ServiceDetail from '@/components/sections/ServiceDetail';

export const metadata = {
  title: 'Private Chef Live Dinner in Ubud | Ubud Private Villas by Cahyana Ubud',
  description: 'A private chef cooks dinner in your Ubud villa — romantic tables for two, Balinese megibung feasts and BBQ nights. Prices upfront.',
};

export default function LiveDinnerPage() {
  return (
    <ServiceDetail
      serviceId="live-dinner"
      kicker="At Your Villa"
      title="Live Dinner"
      subtitle="A chef in your kitchen, a table under the stars, no booking a restaurant."
      heroImg="https://picsum.photos/seed/dinner9/1800/900"
      heroAlt="Private chef preparing dinner at the villa"
      glance={[
        { label: 'Where', value: 'Your villa kitchen' },
        { label: 'Book', value: 'A day ahead' },
        { label: 'Serves', value: '2 to 6 guests' },
        { label: 'Price', value: 'Ask us' },
      ]}
      sections={[
        {
          heading: 'How it works',
          body: [
            "The chef shops that afternoon, arrives around five, and cooks in your villa kitchen while you're still in the pool. You eat when it's ready, at your own table, and the kitchen is clean before anyone leaves.",
          ],
        },
        {
          heading: 'Menus',
          list: [
            { title: 'Romantic dinner for two', desc: 'Multi-course, candles, flowers on the table.' },
            { title: 'Balinese feast', desc: 'Megibung style - shared platters for the whole group.' },
            { title: 'BBQ night', desc: 'Grilled beside the pool.' },
            { title: 'Everyday dinner', desc: 'Home cooking, no occasion needed.' },
            { title: 'Vegetarian & vegan', desc: 'Any menu, just tell us when you book.' },
          ],
          note: 'Ingredients, cooking, service and clean-up are all handled. Message us for current prices and to pick a night.',
        },
        {
          heading: 'Cooking class version',
          body: [
            "Same chef, but you're at the counter. A couple of hours through a market basket of Balinese dishes, then you eat what you made. Ask us when you book.",
          ],
        },
      ]}
      gallery={[
        { src: 'https://picsum.photos/seed/dn1c/700/500', alt: 'Candle-lit dinner table beside the villa pool' },
        { src: 'https://picsum.photos/seed/dn2c/700/500', alt: 'Chef cooking in the villa kitchen' },
        { src: 'https://picsum.photos/seed/dn3c/700/500', alt: 'Balinese dishes served on shared platters' },
      ]}
      aside={{
        title: 'Dinner at your villa',
        facts: ['Chef cooks in your kitchen', 'Book a day ahead', 'Ingredients & clean-up included', 'Cooking class available'],
        ctaLabel: 'Plan a dinner',
        otherServices: [
          { href: '/services/breakfast', label: 'Breakfast' },
          { href: '/services/spa', label: 'Spa & Massage' },
        ],
      }}
      bottomHeading="The best table in Ubud is yours"
      bottomText="Book the villa, then tell us the night."
    />
  );
}
