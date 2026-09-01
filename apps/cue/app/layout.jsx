import localFont from 'next/font/local';
import './globals.css';
import Providers from '@/state/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookConfirmModal from '@/components/booking/BookConfirmModal';

const inter = localFont({
  src: '../public/assets/fonts/inter-latin.woff2',
  weight: '300 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata = {
  metadataBase: new URL('https://cahyanaubudexperience.com'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
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
