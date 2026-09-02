import GuideHub from '@/components/sections/GuideHub';

export const metadata = {
  title: 'Bali Travel Guide | The Island, People, Nature & Tips',
  description:
    'Your Bali travel guide from a local Ubud team - the island\'s regions, culture and customs, nature, what to do, and practical tips for a smooth trip.',
  alternates: { canonical: '/bali-guide.html' },
};

export default function Page() {
  return <GuideHub />;
}
