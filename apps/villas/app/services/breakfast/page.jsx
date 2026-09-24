import ServiceDetail from '@/components/sections/ServiceDetail';

export const metadata = {
  title: 'Breakfast at Your Villa in Ubud | Ubud Private Villas by Cahyana Ubud',
  description: 'Breakfast cooked fresh at your Ubud villa each morning — Balinese and western options, plus floating breakfast in your private pool.',
};

export default function BreakfastPage() {
  return (
    <ServiceDetail
      serviceId="breakfast"
      kicker="At Your Villa"
      title="Breakfast"
      subtitle="Cooked fresh in your own villa kitchen each morning."
      heroImg="https://picsum.photos/seed/bfast9/1800/900"
      heroAlt="Balinese breakfast served at the villa"
      glance={[
        { label: 'Order', value: 'Night before' },
        { label: 'Where', value: 'Terrace, poolside or in bed' },
        { label: 'Kitchen', value: 'Fully equipped' },
        { label: 'Price', value: 'Ask us' },
      ]}
      sections={[
        {
          heading: 'How it works',
          body: [
            'Tell us the night before what you want and roughly when. Someone arrives in the morning, cooks it in your villa kitchen, sets the table, and leaves you to it. No buffet queue, no dining room, no set hour.',
          ],
        },
        {
          heading: 'The menu',
          list: [
            { title: 'Balinese', desc: 'Nasi goreng, mie goreng, bubur injin, or nasi campur with sambal matah.' },
            { title: 'Western', desc: 'Eggs any way, banana pancakes, French toast, fruit and yoghurt.' },
            { title: 'Always on the table', desc: 'Seasonal fruit platter, fresh juice, Bali coffee or herbal tea.' },
            { title: 'Dietary', desc: 'Vegetarian, vegan and gluten-free versions of everything - just say so.' },
          ],
        },
        {
          heading: 'Floating breakfast',
          body: [
            "The tray version, floated on your own pool. It's a photo, yes, but the food is the same food and it's genuinely nice to eat in the water at eight in the morning. Order it the night before.",
          ],
        },
      ]}
      gallery={[
        { src: 'https://picsum.photos/seed/bf1c/700/500', alt: 'Floating breakfast tray in the villa pool' },
        { src: 'https://picsum.photos/seed/bf2c/700/500', alt: 'Nasi goreng plated for breakfast' },
        { src: 'https://picsum.photos/seed/bf3c/700/500', alt: 'Fruit platter and Bali coffee' },
      ]}
      aside={{
        title: 'Breakfast at your villa',
        facts: ['Balinese or western', 'Your time, your table', 'Floating tray on request', 'Vegetarian & vegan versions'],
        ctaLabel: 'Ask about the menu',
        otherServices: [
          { href: '/services/spa', label: 'Spa & Massage' },
          { href: '/services/live-dinner', label: 'Live Dinner' },
        ],
      }}
      bottomHeading="Wake up, eat well"
      bottomText="Pick your villa first, then tell us what you like in the morning."
    />
  );
}
