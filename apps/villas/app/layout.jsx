import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { CurrencyProvider } from '@/components/providers/CurrencyProvider';
import { BookingProvider } from '@/components/providers/BookingProvider';
import BookingSheet from '@/components/booking/BookingSheet';

const inter = localFont({
  src: '../public/fonts/inter-latin.woff2',
  weight: '300 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata = {
  metadataBase: new URL('https://ubudprivatevillas.com'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <LoadingScreen />
        <CurrencyProvider>
          <BookingProvider>
            <Navbar />
            {/* The header is FIXED (CUE's), so the page reserves its height here.
                --header-h-max is the ceiling the navbar publishes — it only ever
                grows, so the document cannot jump under the reader if the bar's
                contents shrink. The literal is the measured full height, used for
                the first paint before the observer has run. */}
            <main className="pt-[var(--header-h-max,53px)]">{children}</main>
            <Footer />
            <BookingSheet />
          </BookingProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
