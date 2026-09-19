import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import localFont from 'next/font/local';
import './globals.css';
import Providers from '@/state/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/ui/LoadingScreen';
import BookConfirmModal from '@/components/booking/BookConfirmModal';

const inter = localFont({
  src: '../public/assets/fonts/inter-latin.woff2',
  weight: '300 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
});

// style.css is served with a week-long cache and was linked without a version,
// so a browser that cached a bad copy kept it for a week and no CSS fix could
// reach it. The hash changes whenever the file does, which retires the manual
// ?v= bump the old site needed.
// Same problem, same fix for the FAVICONS (Sep 2026, new logo): files under
// public/ are served at a stable path with no content hash, and browsers cache a
// tab icon harder than almost anything else - swapping the file alone can leave
// the old mark on screen for days. Hash each one the way style.css is hashed, so
// the link changes exactly when the file does and nobody has to bump anything.
const assetV = (...rel) => createHash('sha1')
  .update(readFileSync(join(process.cwd(), 'public', ...rel)))
  .digest('hex')
  .slice(0, 8);

const STYLE_V = assetV('style.css');
const ICON_SVG_V = assetV('assets', 'icons', 'favicon.svg');
const ICON_ICO_V = assetV('assets', 'icons', 'favicon.ico');
const ICON_APPLE_V = assetV('assets', 'icons', 'apple-touch-icon.png');

export const metadata = {
  metadataBase: new URL('https://cahyanaubudexperience.com'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" type="image/svg+xml" href={`/assets/icons/favicon.svg?v=${ICON_SVG_V}`} />
        <link rel="icon" href={`/assets/icons/favicon.ico?v=${ICON_ICO_V}`} sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href={`/assets/icons/apple-touch-icon.png?v=${ICON_APPLE_V}`} />
        <link rel="stylesheet" href={`/style.css?v=${STYLE_V}`} />
      </head>
      {/* Space reserved for whichever sticky bar is on screen. The two rules are
          kept MUTUALLY EXCLUSIVE on purpose (see CLAUDE.md): stacked, they would
          have identical specificity and the winner would be decided by Tailwind's
          class order rather than by intent. The bookbar rule tracks the bar's own
          breakpoint - and a Tailwind v4 `max-[N]` is width < N, so 993 here means
          "up to and including 992". SectionSwitcher still stops at 767. */}
      <body className="max-md:not-has-[.bookbar]:has-[.stickybar]:pb-[60px] max-[993px]:has-[.bookbar]:pb-[86px]">
        <LoadingScreen />
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <BookConfirmModal />
        </Providers>
      </body>
    </html>
  );
}
