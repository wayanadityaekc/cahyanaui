import ExperienceCard from '@/components/cards/ExperienceCard';
import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { GRID_RELATED } from '@/components/ui/gridClasses';
import { CATSEC } from '@/components/ui/listingClasses';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import BookingForm from '@/components/booking/BookingForm';

const CARDS = [
  { href: '/ubud-tour.html', name: 'Ubud Tour', img: 'tegallalang-girl.jpg', alt: 'Ubud Tour - private tour from Ubud, Bali', meta: '5–7 hours', priceName: 'Ubud Tour', priceFallback: '$40', zone: 'ubud' },
  { href: '/ubud-culture-day.html', name: 'Ubud Culture Day', img: 'ubud-culture-day-card.jpg', alt: 'Ubud Culture Day', meta: '6–8 hours', priceName: 'Ubud Culture Day', priceFallback: '$49', zone: 'ubud' },
  { href: '/lempuyang-tirta-gangga.html', name: 'Lempuyang & Tirta Gangga', img: 'east-bali-tour-card.jpg', alt: 'Lempuyang and Tirta Gangga', meta: '6–8 hours', priceName: 'Lempuyang & Tirta Gangga', priceFallback: '$49', zone: 'east' },
  { href: '/besakih-taman-ujung.html', name: 'Besakih & Taman Ujung', img: 'besakih-temple.webp', alt: 'Besakih and Taman Ujung', meta: '7–9 hours', priceName: 'Besakih & Taman Ujung', priceFallback: '$54', zone: 'east' },
];

export const metadata = { title: 'UI kit', robots: { index: false, follow: false } };

export default function Kit() {
  return (
    <div className="tourprog pb-20">
      <section className="bg-white py-[var(--section-gap)] px-6">
        <div className={CATSEC}>
          <h2 className={SECTION_TITLE}>Buttons</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Button variant="primary">Book Now</Button>
            <Button variant="primary" size="lg">Make Payment</Button>
            <Button variant="ghost">View all</Button>
            <Button as="a" href="#" variant="ghost">Link button</Button>
            <Button variant="plain">Read more</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>

          <h2 className={SECTION_TITLE}>Card grid</h2>
          <div className={GRID_RELATED}>
            {CARDS.map((c) => <ExperienceCard key={c.href} {...c} />)}
          </div>
          <h2 className={SECTION_TITLE}>Slider</h2>
          <Slider>{CARDS.map((c) => <ExperienceCard key={'s' + c.href} {...c} />)}</Slider>
        </div>
      </section>
      <BookingForm />
    </div>
  );
}
