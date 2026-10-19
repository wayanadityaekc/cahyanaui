import ServiceDetail from '@/components/sections/ServiceDetail';
import { JsonLd } from '@cahyana/ui';
import { buildPageMeta } from '@/lib/seo';
import { buildBreadcrumbList, serviceCrumbs } from '@/lib/schema';

export const metadata = buildPageMeta({
  title: 'Scooter Rental in Ubud',
  description:
    'Scooter rental for guests at Cahyana House and Cahyana Tibuah in Ubud. Details are being confirmed; message us with your dates and we will tell you what is available.',
  path: '/services/scooter-rental/',
});

export default function ScooterRentalPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbList(serviceCrumbs('Scooter Rental', 'scooter-rental'))} />
      <ServiceDetail
        serviceId="scooter-rental"
        kicker="At Your Villa"
        title="Scooter Rental"
        subtitle="A scooter for getting around Ubud at your own pace. Details are being confirmed."
        glance={[{ label: 'Availability', value: 'Ask us' }]}
        sections={[
          {
            heading: 'Details coming soon',
            body: [
              "We're confirming the scooters, rates and rental terms. Message us with your dates and we'll tell you what's available.",
            ],
          },
        ]}
        aside={{
          title: 'Scooter rental',
          facts: ['Ask us for availability'],
          ctaLabel: 'Ask us',
          otherServices: [
            { href: '/services/breakfast', label: 'Breakfast' },
            { href: '/services/spa', label: 'Spa & Massage' },
            { href: '/services/live-dinner', label: 'Live Dinner' },
          ],
        }}
        bottomHeading="Want a scooter for your stay?"
        bottomText="Message us with your dates and we'll confirm availability and the current rate."
      />
    </>
  );
}
