import Link from 'next/link';
import { CONTACT_EMAIL, CUE_LINK, WHATSAPP_LINK } from '@/lib/constants';

export const metadata = {
  title: 'About Us & Contact | Ubud Private Villas by Cahyana Ubud',
  description: 'The Ubud family behind Cahyana House and Cahyana Tibuah — who we are, how we host, and how to reach us.',
};

export default function AboutPage() {
  return (
    <>
      <section className="pt-14 pb-10 border-b border-line bg-cream">
        <div className="wrap">
          <p className="eyebrow">About Us</p>
          <h1 className="text-display font-bold text-gold">One family, two villas</h1>
          <p className="mt-3 max-w-xl text-body text-muted">
            We&apos;re not a management company with a portfolio. We&apos;re a family in Ubud with two houses we look after ourselves.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
          <div className="prose-copy">
            <h2 className="text-h2 font-semibold mb-3 text-gold">Who we are</h2>
            <p>
              Cahyana Ubud is a family operation in north Ubud. Made and his wife opened Cahyana House first - three bedrooms around a private pool, inside the family compound. Wayan, born and raised here, followed with Cahyana Tibuah out in the rice fields.
            </p>
            <p>
              Between them the two villas have collected over 300 reviews and a 4.96 average, and both carry Airbnb&apos;s Superhost and Guest Favourite badges. We still answer the messages ourselves.
            </p>

            <h2 className="text-h2 font-semibold mt-9 mb-3 text-gold">How we host</h2>
            <p>
              There&apos;s no reception and no uniform. At Cahyana House you&apos;re welcomed through the family compound; at Tibuah you let yourself in. Either way you get a phone number that answers, usually within the hour.
            </p>
            <p>
              Breakfast is cooked in your kitchen. Massage comes to your pool. Housekeeping, fresh linens, airport pickup, a scooter if you need one - ask and we&apos;ll sort it. If you want a driver for the day, that&apos;s us as well: the same team runs Cahyana Ubud Experience.
            </p>

            <h2 className="text-h2 font-semibold mt-9 mb-3 text-gold">Where we&apos;re going</h2>
            <p>
              Two villas today. The plan is to look after other people&apos;s villas the same way - owners in Ubud who want their place hosted properly rather than listed and forgotten. If that&apos;s you, get in touch.
            </p>
          </div>

          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/wayanhost/700/900"
              alt="Host welcoming guests at the villa entrance"
              width={700}
              height={900}
              loading="lazy"
              className="w-full rounded-xl object-cover aspect-[4/5]"
            />
            <p className="mt-3 text-label text-muted">Wayan · host at Cahyana Tibuah, and the person who answers the phone</p>
          </div>
        </div>
      </section>

      <section id="contact" className="section scroll-mt-24 bg-cream">
        <div className="wrap">
          <p className="eyebrow">Contact</p>
          <h2 className="text-h2 font-semibold mb-6 text-gold">Get in touch</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <div className="card p-6">
              <h3 className="text-h3 font-semibold text-gold">WhatsApp</h3>
              <p className="text-small text-muted my-3">Fastest way to reach us. Dates, questions, or a photo of the road if you&apos;re lost.</p>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener" className="btn btn-cta">Message us</a>
            </div>
            <div className="card p-6">
              <h3 className="text-h3 font-semibold text-gold">Email</h3>
              <p className="text-small text-muted my-3">Longer questions, long stays, or if you own a villa and want it managed.</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-outline">{CONTACT_EMAIL}</a>
            </div>
            <div className="card p-6">
              <h3 className="text-h3 font-semibold text-gold">Where we are</h3>
              <p className="text-small text-muted my-3">North Ubud, Gianyar, Bali. Ten minutes from Ubud Palace, Monkey Forest and Tegallalang.</p>
              <a href={CUE_LINK} target="_blank" rel="noopener" className="btn btn-outline">Arrange a transfer</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section text-center bg-gold">
        <div className="wrap">
          <h2 className="text-h2 font-semibold text-white">Come stay with us</h2>
          <p className="mt-2 text-small text-white/75">The villas are easier to understand once you&apos;re standing in one.</p>
          <div className="flex justify-center mt-6">
            <Link href="/villas" className="btn btn-cta">See both villas</Link>
          </div>
        </div>
      </section>
    </>
  );
}
