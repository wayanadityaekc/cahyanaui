const SOURCE_LOGO = {
  cahyana: { src: '/assets/images/logo.webp', alt: 'Cahyana Ubud Experience' },
};

// Tailwind-native (migrasi): utilities dipetakan 1:1 dari .rev di style.css.
// Shadow green-tint & padding asimetris pakai arbitrary value (bukan token
// neutral) karena itu nilai khusus yang disengaja. Bintang rating dikecilin di
// <=992px persis seperti override .rev__stars di media query lama.
const CLS = {
  card: 'relative flex flex-col gap-2 bg-white border border-line rounded-lg shadow-[0_6px_20px_rgba(31,61,43,0.06)] px-[1.3rem] pt-[1.4rem] pb-[2.3rem]',
  head: 'flex items-center gap-2',
  name: 'font-semibold text-small text-green',
  flag: 'w-[18px] h-[13px] object-cover rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]',
  service: 'text-label text-muted',
  stars: 'text-amber tracking-[2px] max-[992px]:text-[0.85rem]',
  text: 'm-0 text-body text-green',
  logo: 'absolute right-[1.3rem] bottom-[1.1rem] h-[18px] w-auto object-contain',
};

export default function ReviewCard({ name, country, countryCode, rating, message, service, source = 'cahyana' }) {
  const n = Math.max(1, Math.min(5, parseInt(rating, 10) || 0));
  const stars = '★'.repeat(n) + '☆'.repeat(5 - n);
  const logo = SOURCE_LOGO[source] || SOURCE_LOGO.cahyana;

  return (
    <article className={CLS.card}>
      <div className={CLS.head}>
        <span className={CLS.name}>{name}</span>
        {countryCode && (
          <img className={CLS.flag} src={`/assets/flags/${countryCode}.svg`} alt={country || ''} loading="lazy" />
        )}
      </div>
      {service && <div className={CLS.service}>{service}</div>}
      <div className={CLS.stars} aria-label={`${n} out of 5`}>{stars}</div>
      <p className={CLS.text}>{message}</p>
      <img className={CLS.logo} src={logo.src} alt={logo.alt} loading="lazy" />
    </article>
  );
}
