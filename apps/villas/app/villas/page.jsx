import Link from 'next/link';
import AirbnbLink from '@/components/ui/AirbnbLink';
import { WHATSAPP_LINK } from '@/lib/airbnb';

export const metadata = {
  title: 'Our Villas in Ubud | Ubud Private Villas by Cahyana Ubud',
  description: 'Compare Cahyana House (3 bedrooms, sleeps 6) and Cahyana Tibuah (2 bedrooms, sleeps 4) — private pool villas in north Ubud, both rated 4.96 on Airbnb.',
};

export default function VillasPage() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <p className="eyebrow">Our Villas</p>
          <h1>Pick the one that fits</h1>
          <p className="page-sub">
            Both are entire private villas with their own pool, both sit north of Ubud, both are ten minutes from the Palace, Monkey Forest and Tegallalang. The difference is size and what surrounds you.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="v-row">
            <div className="v-row-media">
              <img
                src="https://picsum.photos/seed/house-hero/900/620"
                alt="Cahyana House pool and garden"
                width={900}
                height={620}
                loading="lazy"
              />
              <span className="tag">Sleeps 6</span>
            </div>
            <div className="v-row-body">
              <p className="eyebrow">Cahyana House · ★ 4.96 (221)</p>
              <h2 className="section-title">Room for everyone</h2>
              <p>
                Three spacious bedrooms, each with a king bed, an ensuite bathroom, and a direct view of the pool. Full kitchen, dining area, living room with smart TV, private pool and garden. Airbnb flags it as extra spacious, and guests keep saying the same.
              </p>
              <p>
                Check-in is through a Balinese family compound - a warm welcome on the way in, complete privacy once you&apos;re inside.
              </p>
              <ul className="spec-list">
                <li><span>Bedrooms</span>3, all ensuite</li>
                <li><span>Beds</span>3 king</li>
                <li><span>Bathrooms</span>4.5</li>
                <li><span>Guests</span>Up to 6</li>
              </ul>
              <div className="btn-row">
                <Link href="/villas/cahyana-house" className="btn btn-outline">See the villa</Link>
                <AirbnbLink villa="house" className="btn btn-gold">Check dates &amp; price</AirbnbLink>
              </div>
            </div>
          </article>

          <article className="v-row reverse">
            <div className="v-row-media">
              <img
                src="https://picsum.photos/seed/tibuah-hero/900/620"
                alt="Cahyana Tibuah pool with rice field view"
                width={900}
                height={620}
                loading="lazy"
              />
              <span className="tag">Sleeps 4</span>
            </div>
            <div className="v-row-body">
              <p className="eyebrow">Cahyana Tibuah · ★ 4.96 (85)</p>
              <h2 className="section-title">Quiet, and close to it</h2>
              <p>
                Two king bedrooms with ensuites, both looking onto the pool. Open-plan living area, fully equipped kitchen, private pool with an outdoor shower. The villa sits a three-minute walk down a path into the rice fields, and each room comes with its own key.
              </p>
              <p>Self check-in, housekeeping included, fresh linens and towels changed every two days.</p>
              <ul className="spec-list">
                <li><span>Bedrooms</span>2, both ensuite</li>
                <li><span>Beds</span>2 king</li>
                <li><span>Bathrooms</span>2</li>
                <li><span>Guests</span>Up to 4</li>
              </ul>
              <div className="btn-row">
                <Link href="/villas/cahyana-tibuah" className="btn btn-outline">See the villa</Link>
                <AirbnbLink villa="tibuah" className="btn btn-gold">Check dates &amp; price</AirbnbLink>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section band-light">
        <div className="container">
          <p className="eyebrow">Side by Side</p>
          <h2 className="section-title">Which villa suits you</h2>
          <div className="compare-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th></th>
                  <th>Cahyana House</th>
                  <th>Cahyana Tibuah</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Best for</td><td>Families and groups</td><td>Couples and small families</td></tr>
                <tr><td>Guests</td><td>Up to 6</td><td>Up to 4</td></tr>
                <tr><td>Bedrooms</td><td>3 king, all ensuite</td><td>2 king, both ensuite</td></tr>
                <tr><td>Bathrooms</td><td>4.5</td><td>2</td></tr>
                <tr><td>Setting</td><td>Family compound, garden</td><td>Rice fields, 3 min walk in</td></tr>
                <tr><td>Kitchen</td><td>Fully equipped</td><td>Fully equipped</td></tr>
                <tr><td>Pool</td><td>Private</td><td>Private, outdoor shower</td></tr>
                <tr><td>Check-in</td><td>Welcomed by the family</td><td>Self check-in</td></tr>
                <tr><td>Rating</td><td>★ 4.96 · 221 reviews</td><td>★ 4.96 · 85 reviews</td></tr>
              </tbody>
            </table>
          </div>
          <p className="rate-fine">
            Nightly rates change with the season - open the Airbnb calendar for the live price on your dates, or message us and we&apos;ll quote you direct.
          </p>
        </div>
      </section>

      <section className="cta-strip">
        <div className="container">
          <h2>Still deciding?</h2>
          <p>Tell us who&apos;s coming and when - we&apos;ll say which villa suits you, even if it&apos;s the smaller one.</p>
          <div className="btn-row">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener" className="btn btn-gold">Ask us on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
