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

export default function GuestGallery() {
  return (
    <section className="guest-gallery" id="guest-gallery" aria-label="Photos with our guests">
      <p className="guest-gallery__label">Our Guests</p>
      <h2 className="section__title">Moments With Our Guests</h2>
      <div className="guest-marquee">
        <div className="guest-track">
          {TRACK.map((g, i) => (
            <figure key={i}>
              <img src={`/assets/images/${g.img}`} alt={g.alt} width={300} height={300} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
