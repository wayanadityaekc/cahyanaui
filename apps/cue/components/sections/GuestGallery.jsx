import { SECTION_TITLE } from '@/components/ui/sectionTitle';
const GUESTS = [
  { img: 'guest-monkey-forest.jpg', alt: 'A guest at the Sacred Monkey Forest, Ubud' },
  { img: 'guest-jungle-swing.jpg', alt: 'A guest on a jungle swing near Ubud' },
  { img: 'guest-rice-field.jpg', alt: 'Guests at a Bali rice terrace' },
  { img: 'guest-tirta-empul.jpg', alt: 'A guest at Tirta Empul water temple' },
  { img: 'guest-lempuyang.jpg', alt: 'A guest at the Lempuyang temple gates' },
  { img: 'guest-goa-gajah.jpg', alt: 'A guest at Goa Gajah, the Elephant Cave' },
  { img: 'guest-tegalalang.jpg', alt: 'A guest at Tegalalang rice terrace' },
  { img: 'guest-hot-spring.jpg', alt: 'Guests at a Bali hot spring' },
  { img: 'guest-snorkeling.jpg', alt: 'Guests snorkelling in east Bali' },
];

// Track duplicated so translateX(-50%) loops seamlessly (matches vanilla partials/guest-gallery.html).
const TRACK = [...GUESTS, ...GUESTS];

// Tailwind-native (migrasi Fase 2): .guest-gallery*/.guest-marquee/.guest-track ->
// utilities. Keyframe guestScroll tetep di style.css (dipakai animate-[...]).
// .section__title dibiarin (primitif shared) + override padding/margin lewat utilities.
export default function GuestGallery() {
  return (
    <section className="pt-12 pb-[3.2rem] bg-white" id="guest-gallery" aria-label="Photos with our guests">
      <p className="uppercase tracking-[0.14em] text-label font-medium text-gold text-center px-6">Our Guests</p>
      <h2 className={`${SECTION_TITLE} px-6 !mb-6`}>Moments With Our Guests</h2>
      <div className="overflow-hidden [-webkit-mask-image:linear-gradient(90deg,transparent,#000_2%,#000_98%,transparent)] [mask-image:linear-gradient(90deg,transparent,#000_2%,#000_98%,transparent)] motion-reduce:overflow-x-auto">
        <div className="grid grid-flow-col grid-rows-[repeat(2,128px)] auto-cols-[128px] gap-[6px] w-max animate-[guestScroll_35s_linear_infinite] motion-reduce:animate-none">
          {TRACK.map((g, i) => (
            <figure className="m-0 rounded-md overflow-hidden border-2 border-gold" key={i}>
              <img className="w-[128px] h-full object-cover block" src={`/assets/images/${g.img}`} alt={g.alt} width={300} height={300} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
