import Link from 'next/link';
import { Button, Container } from '@cahyana/ui';

export const metadata = {
  title: 'Page not found | Ubud Private Villas',
  robots: { index: false, follow: true },
};

// The site's own 404: says what happened and offers the pages people usually want.
export default function NotFound() {
  return (
    <Container className="py-16 text-center">
      <h1 className="text-h2 font-semibold text-gold">Page not found</h1>
      <p className="mt-3 text-body text-muted">That page does not exist or has moved.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button as={Link} href="/">Home</Button>
        <Button as={Link} variant="ghost" href="/guide/">Ubud guide</Button>
      </div>
    </Container>
  );
}
