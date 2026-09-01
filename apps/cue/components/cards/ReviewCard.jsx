function Stars({ rating }) {
  return (
    <div className="review-card__stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? 'active' : undefined}>&#9733;</span>
      ))}
    </div>
  );
}

export default function ReviewCard({ name, country, rating, message, service }) {
  return (
    <article className="review-card">
      <div className="review-card__head">
        <span className="review-card__avatar" aria-hidden="true">{(name || 'G').charAt(0).toUpperCase()}</span>
        <div>
          <p className="review-card__name">{name}</p>
          {country && <p className="review-card__country">{country}</p>}
        </div>
      </div>
      <Stars rating={rating} />
      <p className="review-card__text">{message}</p>
      {service && <p className="review-card__service">{service}</p>}
    </article>
  );
}
