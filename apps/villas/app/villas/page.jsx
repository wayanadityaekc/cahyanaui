import VillaCard from '@/components/cards/VillaCard';
import { GRID_PAIR } from '@/components/ui/gridClasses';
import CheckAvailabilityButton from '@/components/booking/CheckAvailabilityButton';
import { VILLA_LIST } from '@/lib/villas';
import { WHATSAPP_LINK } from '@/lib/constants';
import { Button, CAPS, Container, EYEBROW_LINE, Section } from '@cahyana/ui';

export const metadata = {
  title: 'Our Villas in Ubud | Ubud Private Villas by Cahyana Ubud',
  description: 'Compare Cahyana House (3 bedrooms, sleeps 6) and Cahyana Tibuah (2 bedrooms, sleeps 4) — private pool villas in north Ubud, both rated 4.96 on Airbnb.',
};

export default function VillasPage() {
  return (
    <>
      <section className="pt-14 pb-10 border-b border-line bg-cream">
        <Container>
          <p className={EYEBROW_LINE}>Our Villas</p>
          <h1 className="text-display font-bold text-gold">
            Two unique villas, one unforgettable stay
          </h1>
          <p className="mt-3 max-w-xl text-body text-muted">
            Choose between two beautifully designed villas, each with a private pool, lush garden and everything you need for a relaxing stay in Ubud.
          </p>
        </Container>
      </section>

      <Section>
        <div className={GRID_PAIR}>
          {VILLA_LIST.map((villa) => (
            <VillaCard key={villa.slug} villa={villa} />
          ))}
        </div>
</Section>

      <Section tone="cream">
        <p className={EYEBROW_LINE}>Side by Side</p>
        <h2 className="text-h2 font-semibold mb-6 text-gold">Which villa suits you</h2>
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-small">
            <thead>
              <tr className="bg-cream">
                <th className="text-left p-4"></th>
                {VILLA_LIST.map((v) => (
                  <th key={v.slug} className="text-left p-4 text-h3 font-semibold text-gold">{v.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const [h, t] = VILLA_LIST;
                return [
                  ['Best for', 'Families and groups', 'Couples and small families'],
                  ['Guests', `Up to ${h.guests}`, `Up to ${t.guests}`],
                  ['Bedrooms', `${h.beds}, all ensuite`, `${t.beds}, both ensuite`],
                  ['Bathrooms', String(h.bathrooms), String(t.bathrooms)],
                  ['Setting', 'Family compound, garden', 'Rice fields, 3 min walk in'],
                  ['Pool', 'Private', 'Private, outdoor shower'],
                  ['Check-in', 'Welcomed by the family', 'Self check-in'],
                  ['Rating', `★ ${h.rating} · ${h.reviews} reviews`, `★ ${t.rating} · ${t.reviews} reviews`],
                ];
              })().map((row) => (
                <tr key={row[0]} className="border-t border-line">
                  <td className={`${CAPS} p-4 text-muted`}>{row[0]}</td>
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
</Section>

      <Section tone="dark" className="text-center">
        <h2 className="text-h2 font-semibold text-white">Still deciding?</h2>
        <p className="mt-2 text-small text-white/75">
          Tell us who&apos;s coming and when - we&apos;ll say which villa suits you, even if it&apos;s the smaller one.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Button as="a" href={WHATSAPP_LINK} target="_blank" rel="noopener">Ask us on WhatsApp</Button>
          <CheckAvailabilityButton variant="light" />
        </div>
</Section>
    </>
  );
}
