import Link from 'next/link';
import { Button, Container } from '@cahyana/ui';

// /about is LIVE TODAY and its content moved into the Our Company page's About
// tab. Deleting the route outright would have turned a working public URL into
// a 404 for every bookmark and inbound link pointing at it.
//
// A static export cannot emit a real 301 — there is no server to send one — so
// this is the static-host answer: a meta refresh, a canonical pointing at the
// destination so search engines consolidate rather than index a duplicate, and
// noindex so this shim never competes in results. The visible link is the
// fallback for anyone whose browser blocks the refresh.
//
// Delete this once the old URL has stopped getting traffic.
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
