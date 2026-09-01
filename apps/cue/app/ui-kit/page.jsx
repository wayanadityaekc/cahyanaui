import ExperienceCard from '@/components/cards/ExperienceCard';
import Slider from '@/components/ui/Slider';
import BookingForm from '@/components/booking/BookingForm';

const CARDS = [
  { href: '/ubud-tour.html', name: 'Ubud Tour', img: 'tegallalang-girl.jpg', alt: 'Ubud Tour - private tour from Ubud, Bali', meta: '5–7 hours', priceName: 'Ubud Tour', priceFallback: '$45', zone: 'ubud' },
  { href: '/ubud-culture-day.html', name: 'Ubud Culture Day', img: 'ubud-culture-day-card.jpg', alt: 'Ubud Culture Day', meta: '6–8 hours', priceName: 'Ubud Culture Day', priceFallback: '$55', zone: 'ubud' },
  { href: '/lempuyang-tirta-gangga.html', name: 'Lempuyang & Tirta Gangga', img: 'east-bali-tour-card.jpg', alt: 'Lempuyang and Tirta Gangga', meta: '6–8 hours', priceName: 'Lempuyang & Tirta Gangga', priceFallback: '$55', zone: 'east' },
  { href: '/besakih-taman-ujung.html', name: 'Besakih & Taman Ujung', img: 'besakih-temple.webp', alt: 'Besakih and Taman Ujung', meta: '7–9 hours', priceName: 'Besakih & Taman Ujung', priceFallback: '$60', zone: 'east' },
];

export const metadata = { title: 'UI kit', robots: { index: false, follow: false } };

export default function Kit() {
  return (
    <div className="tourprog">
      <section className="experience">
        <div className="catsec">
          <h2 className="section__title">Card grid</h2>
          <div className="experience__grid experience__grid--home4">
            {CARDS.map((c) => <ExperienceCard key={c.href} {...c} />)}
          </div>
          <h2 className="section__title">Slider</h2>
          <Slider>{CARDS.map((c) => <ExperienceCard key={'s' + c.href} {...c} />)}</Slider>
        </div>
      </section>
      <BookingForm />
    </div>
  );
}
