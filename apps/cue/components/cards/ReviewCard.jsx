const SOURCE_LOGO = {
  cahyana: { src: '/assets/images/logo.webp', alt: 'Cahyana Ubud Experience' },
};

export default function ReviewCard({ name, country, countryCode, rating, message, service, source = 'cahyana' }) {
  const n = Math.max(1, Math.min(5, parseInt(rating, 10) || 0));
  const stars = '★'.repeat(n) + '☆'.repeat(5 - n);
  const logo = SOURCE_LOGO[source] || SOURCE_LOGO.cahyana;

  return (
    <article className="rev">
      <div className="rev__head">
        <span className="rev__name">{name}</span>
        {countryCode && (
          <img className="rev__flag" src={`/assets/flags/${countryCode}.svg`} alt={country || ''} loading="lazy" />
        )}
      </div>
      {service && <div className="rev__service">{service}</div>}
      <div className="rev__stars" aria-label={`${n} out of 5`}>{stars}</div>
      <p className="rev__text">{message}</p>
      <img className="rev__logo" src={logo.src} alt={logo.alt} loading="lazy" />
    </article>
  );
}
