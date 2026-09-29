import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import localFont from 'next/font/local';
import './globals.css';
import Providers from '@/state/Providers';
import { API_BASE, DISPLAY_GUESTS } from '@/lib/constants';
import Navbar from '@/components/layout/Navbar';
import IosZoomFix from '@/components/layout/IosZoomFix';
import PwaRegister from '@/components/layout/PwaRegister';
import AppBottomNav from '@/components/layout/AppBottomNav';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/ui/LoadingScreen';
import BookConfirmModal from '@/components/booking/BookConfirmModal';
import BookingGate from '@/components/booking/BookingGate';

const inter = localFont({
  src: '../public/assets/fonts/inter-latin.woff2',
  weight: '300 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
});

// Content hash for files in public/ (style.css, favicons) so the URL changes exactly when the file does.
function assetV(...rel) {
  return createHash('sha1')
    .update(readFileSync(join(process.cwd(), 'public', ...rel)))
    .digest('hex')
    .slice(0, 8);
}

const STYLE_V = assetV('style.css');
const ICON_SVG_V = assetV('assets', 'icons', 'favicon.svg');
const ICON_ICO_V = assetV('assets', 'icons', 'favicon.ico');
const ICON_APPLE_V = assetV('assets', 'icons', 'apple-touch-icon.png');

export const metadata = {
  metadataBase: new URL('https://cahyanaubudexperience.com'),
};

// Live USD catalog, fetched once per build with a timeout, so first paint shows today's API price.
let buildCatalog = null;
function catalogForBuild() {
  if (!buildCatalog) {
    const qs = new URLSearchParams({ currency: 'USD', guests: String(DISPLAY_GUESTS), stay: '' });
    buildCatalog = (async () => {
      try {
        const res = await fetch(`${API_BASE}/pricing/catalog?${qs}`, { signal: AbortSignal.timeout(10000) });
        const d = res.ok ? await res.json() : null;
        return d && Array.isArray(d.items) ? d : null;
      } catch (e) {
        return null;
      }
    })();
  }
  return buildCatalog;
}

export default async function RootLayout({ children }) {
  const initialCatalog = await catalogForBuild();
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" type="image/svg+xml" href={`/assets/icons/favicon.svg?v=${ICON_SVG_V}`} />
        <link rel="icon" href={`/assets/icons/favicon.ico?v=${ICON_ICO_V}`} sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href={`/assets/icons/apple-touch-icon.png?v=${ICON_APPLE_V}`} />
        <link rel="stylesheet" href={`/style.css?v=${STYLE_V}`} />

        {/* PWA manifest; icon-192/512 are opaque full-bleed tiles, which is why both are declared maskable. */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        {/* iOS app-mode meta: the standard tag plus the apple- prefixed one older iPhones still read. */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cahyana" />
      </head>
      {/* Sticky-bar body padding; stickybar and bookbar rules must stay mutually exclusive. max-[993px] = up to 992. */}
      {/* App bottom bar padding; it only renders on pages with no sticky bar, so it cannot overlap the rules above. */}
      {/* Fixed .footerbar padding: 49px under 561px, 60px above, plus the same safe-area inset as the footer. */}
      <body className="max-md:not-has-[.bookbar]:has-[.stickybar]:pb-[60px] max-[993px]:has-[.bookbar]:pb-[72px] standalone:max-[993px]:not-has-[.bookbar]:pb-[56px] max-[560px]:has-[.footerbar]:pb-[calc(49px+env(safe-area-inset-bottom))] min-[561px]:has-[.footerbar]:pb-[calc(60px+env(safe-area-inset-bottom))]">
        <LoadingScreen />
        <Providers initialCatalog={initialCatalog}>
          <IosZoomFix />
          <PwaRegister />
          <Navbar />
          {children}
          <Footer />
          <BookConfirmModal />
          <BookingGate />
          <AppBottomNav />
        </Providers>
      </body>
    </html>
  );
}
