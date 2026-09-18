import VillaCard from '@/components/cards/VillaCard';
import { GRID_PAIR } from '@/components/ui/gridClasses';
import CheckAvailabilityButton from '@/components/booking/CheckAvailabilityButton';
import { VILLA_LIST } from '@/lib/villas';
import { WHATSAPP_LINK } from '@/lib/constants';

export const metadata = {
  title: 'Our Villas in Ubud | Ubud Private Villas by Cahyana Ubud',
  description: 'Compare Cahyana House (3 bedrooms, sleeps 6) and Cahyana Tibuah (2 bedrooms, sleeps 4) — private pool villas in north Ubud, both rated 4.96 on Airbnb.',
};

export default function VillasPage() {
  return (
    <>
      <section className="pt-14 pb-10 border-b border-line bg-cream">
        <div className="wrap">
          <p className="eyebrow">Our Villas</p>
          <h1 className="text-display font-bold text-gold">
            Two unique villas, one unforgettable stay
          </h1>
          <p className="mt-3 max-w-xl text-body text-muted">
            Choose between two beautifully designed villas, each with a private pool, lush garden and everything you need for a relaxing stay in Ubud.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className={GRID_PAIR}>
            {VILLA_LIST.map((villa) => (
              <VillaCard key={villa.slug} villa={villa} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="wrap">
          <p className="eyebrow">Side by Side</p>
          <h2 className="text-h2 font-semibold mb-6 text-gold">Which villa suits you</h2>
          <div className="overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full text-small">
              <thead>
                <tr className="bg-cream">
                  <th className="text-left p-4"></th>
                  <th className="text-left p-4 text-h3 font-semibold text-gold">Cahyana House</th>
                  <th className="text-left p-4 text-h3 font-semibold text-gold">Cahyana Tibuah</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Best for', 'Families and groups', 'Couples and small families'],
                  ['Guests', 'Up to 6', 'Up to 4'],
                  ['Bedrooms', '3 king, all ensuite', '2 king, both ensuite'],
                  ['Bathrooms', '4.5', '2'],
                  ['Setting', 'Family compound, garden', 'Rice fields, 3 min walk in'],
                  ['Pool', 'Private', 'Private, outdoor shower'],
                  ['Check-in', 'Welcomed by the family', 'Self check-in'],
                  ['Rating', '★ 4.96 · 221 reviews', '★ 4.96 · 85 reviews'],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-line">
                    <td className="p-4 text-label uppercase tracking-wide text-muted">{row[0]}</td>
                    <td className="p-4 text-gold">{row[1]}</td>
                    <td className="p-4 text-gold">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-small text-muted">
            Nightly rates shown are starting rates - message us for an exact quote on your dates.
          </p>
        </div>
      </section>

      <section className="section text-center bg-gold">
        <div className="wrap">
          <h2 className="text-h2 font-semibold text-white">Still deciding?</h2>
          <p className="mt-2 text-small text-white/75">
            Tell us who&apos;s coming and when - we&apos;ll say which villa suits you, even if it&apos;s the smaller one.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener" className="btn btn-cta">Ask us on WhatsApp</a>
            <CheckAvailabilityButton className="btn btn-outline-light" />
          </div>
        </div>
      </section>
    </>
  );
}
