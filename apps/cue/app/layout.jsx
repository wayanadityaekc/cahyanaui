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
const STYLE_V = createHash('sha1')
  .update(readFileSync(join(process.cwd(), 'public', 'style.css')))
  .digest('hex')
  .slice(0, 8);

export const metadata = {
  metadataBase: new URL('https://cahyanaubudexperience.com'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/icons/favicon.svg" />
        <link rel="icon" href="/assets/icons/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png" />
        <link rel="stylesheet" href={`/style.css?v=${STYLE_V}`} />
      </head>
      <body>
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
