const MAX_RATING_STARS = 5;
const RADIX_DECIMAL = 10;

const SOURCE_LOGO = {
  cahyana: { src: '/assets/images/logo.webp', alt: 'Cahyana Ubud Experience' },
};

const CLS = {
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
  const starCount = Math.max(1, Math.min(MAX_RATING_STARS, parseInt(rating, RADIX_DECIMAL) || 0));
  const stars = '★'.repeat(starCount) + '☆'.repeat(MAX_RATING_STARS - starCount);
  const logo = SOURCE_LOGO[source] || SOURCE_LOGO.cahyana;

  return (
    <button type="button" className={CLS.card} onClick={onClick}>
      <div className={CLS.head}>
        <span className={CLS.name}>{name}</span>
        {country && <span className={CLS.country}>&middot; {country}</span>}
      </div>
      {service && <div className={CLS.service}>{service}</div>}
      <div className={CLS.stars} aria-label={`${starCount} out of 5`}>
        {stars}
      </div>
      <p className={CLS.text}>{message}</p>
      <span className={CLS.more}>Read more &rsaquo;</span>
      <img className={CLS.logo} src={logo.src} alt={logo.alt} loading="lazy" />
    </button>
  );
}
