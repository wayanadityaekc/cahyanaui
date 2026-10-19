import OurCompany from '@/components/sections/OurCompany';
import { JsonLd } from '@cahyana/ui';
import { buildPageMeta } from '@/lib/seo';
import { COMPANY_CRUMBS, buildBreadcrumbList } from '@/lib/schema';

export const metadata = buildPageMeta({
  title: 'Our Company | Ubud Private Villas',
  description:
    'The Ubud family behind Cahyana House and Cahyana Tibuah - who we are, how to reach us, answers to common questions, and how we handle your data.',
  path: '/our-company/',
});

export default function OurCompanyPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbList(COMPANY_CRUMBS)} />
      <OurCompany />
    </>
  );
}
