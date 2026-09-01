import ContactForm from './ContactForm';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export const metadata = {
  title: 'Contact Cahyana Ubud Experience - Talk to a Local in Ubud, Bali',
  description:
    'Questions, custom requests, or group bookings? Message our local Ubud team on WhatsApp or by email - we usually reply within a few hours.',
  alternates: { canonical: '/contact.html' },
};

export default function Contact() {
  return (
    <>
      <section className="contact">
        <div className="contact__container">
          <div className="contact__info">
            <h1 className="contact__heading">Talk to a Local</h1>
            <p className="contact__lead">
              Have a question, a custom request, or a group booking? Reach out on WhatsApp or send us a message - our
              local team usually replies within a few hours.
            </p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="contact__wa" target="_blank" rel="noopener">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 21l1.6-4.5A8 8 0 1 1 12 20a8 8 0 0 1-4-1L3 21z" />
              </svg>
              Chat on WhatsApp
            </a>
            <ul className="contact__list">
              <li className="contact__item">
                <span>Email</span>
                <strong><a href="mailto:cahyanabaliexperience@gmail.com">cahyanabaliexperience@gmail.com</a></strong>
              </li>
              <li className="contact__item">
                <span>Location</span>
                <strong>Ubud, Gianyar, Bali, Indonesia</strong>
              </li>
              <li className="contact__item">
                <span>Hours</span>
                <strong>Every day · 7:00 AM – 9:00 PM (WITA)</strong>
              </li>
            </ul>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
      <iframe
        className="map"
        src="https://www.google.com/maps?q=Ubud,Bali&output=embed"
        loading="lazy"
        title="Cahyana Ubud Experience location"
      />
    </>
  );
}
