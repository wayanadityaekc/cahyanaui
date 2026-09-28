const SOURCE_LOGO = {
  cahyana: { src: '/assets/images/logo.webp', alt: 'Cahyana Ubud Experience' },
};

// Tailwind-native (migrasi): utilities dipetakan 1:1 dari .rev di style.css.
// Shadow green-tint & padding asimetris pakai arbitrary value (bukan token
// neutral) karena itu nilai khusus yang disengaja. Bintang rating dikecilin di
// <=992px persis seperti override .rev__stars di media query lama.
//
// FIXED HEIGHT + CLAMPED TEXT (Sep 2026, Wayan: "create a fix box per review").
// `h-[248px]` + `overflow-hidden` + `line-clamp-5` on the message: every card
// is the same height regardless of how long the review is, whether it sits in
// the homepage slider or the plain grid on /all-reviews and the service pages
// - one box, everywhere ReviewCard is used. `onClick` makes the whole card
// open the full text in a popup (ReviewDetailModal, wired from ReviewsStrip);
// no hover lift was added (CLAUDE.md, Sep 2026: "Kartu juga NOL hover baru" -
// Wayan turned that down when cards got their shadow back) - the pointer
// cursor + a plain focus ring is the only affordance a click is possible.
const CLS = {
  // NO `overflow-hidden` here: `line-clamp-*` already sets its own
  // `overflow:hidden` on the <p>, ending on a clean "..." at the Nth line.
  // Clipping the CARD as well cut the text mid-word at whatever raw pixel
  // height ran out first, before the clamp got a chance to finish its own
  // line - caught by actually looking at the screenshot, not just the count
  // of rendered cards.
  card: 'relative flex flex-col gap-2 w-full h-[248px] bg-white border border-line rounded-lg px-[1.3rem] pt-[1.4rem] pb-[2.3rem] text-left font-body cursor-pointer focus:outline-none focus:[box-shadow:var(--focus-ring)]',
  head: 'flex items-center gap-2',
  name: 'font-semibold text-small text-green',
  country: 'text-label text-muted',
  service: 'text-label text-muted',
  stars: 'text-amber tracking-[2px] max-[992px]:text-[0.85rem]',
  text: 'm-0 text-body text-green line-clamp-3',
  more: 'mt-auto text-label text-gold-d font-medium',
  logo: 'absolute right-[1.3rem] bottom-[1.1rem] h-[18px] w-auto object-contain',
};

export default function ReviewCard({ name, country, rating, message, service, source = 'cahyana', onClick }) {
  const n = Math.max(1, Math.min(5, parseInt(rating, 10) || 0));
  const stars = '★'.repeat(n) + '☆'.repeat(5 - n);
  const logo = SOURCE_LOGO[source] || SOURCE_LOGO.cahyana;

  return (
    <button type="button" className={CLS.card} onClick={onClick}>
      <div className={CLS.head}>
        <span className={CLS.name}>{name}</span>
        {country && <span className={CLS.country}>&middot; {country}</span>}
      </div>
      {service && <div className={CLS.service}>{service}</div>}
      <div className={CLS.stars} aria-label={`${n} out of 5`}>{stars}</div>
      <p className={CLS.text}>{message}</p>
      <span className={CLS.more}>Read more &rsaquo;</span>
      <img className={CLS.logo} src={logo.src} alt={logo.alt} loading="lazy" />
    </button>
  );
}
