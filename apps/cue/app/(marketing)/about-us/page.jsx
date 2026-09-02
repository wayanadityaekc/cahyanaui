import AboutPage from '@/components/sections/AboutPage';
import JsonLd from '@/components/JsonLd';
import Trust from '@/components/sections/home/Trust';

export const metadata = {
  title: 'About Us | One Local Family in Ubud, Prices Upfront - Cahyana',
  description:
    'Meet the family behind Cahyana Ubud Experience - one local team in Ubud for your tours, driver, activities, and villa. Every price upfront, no hidden fees.',
  alternates: { canonical: '/about-us.html' },
};

export default function Page() {
  return (
    <>
      <JsonLd page="about-us" />
      <AboutPage />
      <Trust showStat={false} showSocials />
    </>
  );
}
