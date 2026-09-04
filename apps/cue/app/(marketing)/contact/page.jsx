import ContactSection from '@/components/sections/ContactSection';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Contact Cahyana Ubud Experience - Talk to a Local in Ubud, Bali',
  description:
    'Questions, custom requests, or group bookings? Message our local Ubud team on WhatsApp or by email - we usually reply within a few hours.',
  alternates: { canonical: '/contact.html' },
};

export default function Contact() {
  return (
    <>
      <JsonLd page="contact" />
      <ContactSection />
    </>
  );
}
