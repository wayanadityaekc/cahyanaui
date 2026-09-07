import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { VillaSelectionProvider } from '@/components/providers/VillaSelectionProvider';

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
        <VillaSelectionProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </VillaSelectionProvider>
      </body>
    </html>
  );
}
