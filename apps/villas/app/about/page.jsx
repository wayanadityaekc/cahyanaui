import Link from 'next/link';
import { Button, Container } from '@cahyana/ui';

// Old /about URL kept as a meta-refresh shim (no 301 in a static export); delete once traffic stops.
const TARGET = '/our-company#about';

export const metadata = {
  title: 'About Us | Ubud Private Villas',
  alternates: { canonical: '/our-company' },
  robots: { index: false, follow: true },
  other: { refresh: `0; url=${TARGET}` },
};

export default function AboutRedirect() {
  return (
    <Container className="py-20 text-center">
      <h1 className="text-h2 font-semibold text-gold">This page has moved</h1>
      <p className="mt-3 text-body text-muted">
        About Us now lives on our company page.
      </p>
      <Button as={Link} href={TARGET} className="mt-6">Go to About Us</Button>
    </Container>
  );
}
