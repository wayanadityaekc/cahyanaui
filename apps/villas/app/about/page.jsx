import { CONTACT_EMAIL, CUE_LINK, WHATSAPP_LINK } from '@/lib/airbnb';
import Link from 'next/link';

export const metadata = {
  title: 'About Us & Contact | Ubud Private Villas by Cahyana Ubud',
  description: 'The Ubud family behind Cahyana House and Cahyana Tibuah — who we are, how we host, and how to reach us.',
};

export default function AboutPage() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <p className="eyebrow">About Us</p>
          <h1>One family, two villas</h1>
          <p className="page-sub">
            We&apos;re not a management company with a portfolio. We&apos;re a family in Ubud with two houses we look after ourselves.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div className="about-copy">
            <h2 className="section-title">Who we are</h2>
            <p>
              Cahyana Ubud is a family operation in north Ubud. Made and his wife opened Cahyana House first - three bedrooms around a private pool, inside the family compound. Wayan, born and raised here, followed with Cahyana Tibuah out in the rice fields.
            </p>
            <p>
              Between them the two villas have collected over 300 reviews and a 4.96 average, and both carry Airbnb&apos;s Superhost and Guest Favourite badges. We still answer the messages ourselves.
            </p>

            <h2 className="section-title">How we host</h2>
            <p>
              There&apos;s no reception and no uniform. At Cahyana House you&apos;re welcomed through the family compound; at Tibuah you let yourself in. Either way you get a phone number that answers, usually within the hour.
            </p>
            <p>
              Breakfast is cooked in your kitchen. Massage comes to your pool. Housekeeping, fresh linens, airport pickup, a scooter if you need one - ask and we&apos;ll sort it. If you want a driver for the day, that&apos;s us as well: the same team runs Cahyana Ubud Experience.
            </p>

            <h2 className="section-title">Where we&apos;re going</h2>
            <p>
              Two villas today. The plan is to look after other people&apos;s villas the same way - owners in Ubud who want their place hosted properly rather than listed and forgotten. If that&apos;s you, get in touch.
            </p>
          </div>

          <div className="about-media">
            <img
              src="https://picsum.photos/seed/wayanhost/700/900"
              alt="Host welcoming guests at the villa entrance"
              width={700}
              height={900}
              loading="lazy"
            />
            <p className="about-caption">Wayan · host at Cahyana Tibuah, and the person who answers the phone</p>
          </div>
        </div>
      </section>

      <section className="section band-light">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h2 className="section-title">Get in touch</h2>
          <div className="contact-row">
            <div className="contact-card">
              <h3>WhatsApp</h3>
              <p>Fastest way to reach us. Dates, questions, or a photo of the road if you&apos;re lost.</p>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener" className="btn btn-gold">Message us</a>
            </div>
            <div className="contact-card">
              <h3>Email</h3>
              <p>Longer questions, long stays, or if you own a villa and want it managed.</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-outline">{CONTACT_EMAIL}</a>
            </div>
            <div className="contact-card">
              <h3>Where we are</h3>
              <p>North Ubud, Gianyar, Bali. Ten minutes from Ubud Palace, Monkey Forest and Tegallalang.</p>
              <a href={CUE_LINK} target="_blank" rel="noopener" className="btn btn-outline">Arrange a transfer</a>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-strip">
        <div className="container">
          <h2>Come stay with us</h2>
          <p>The villas are easier to understand once you&apos;re standing in one.</p>
          <div className="btn-row">
            <Link href="/villas" className="btn btn-gold">See both villas</Link>
          </div>
        </div>
      </section>
    </>
  );
}
